const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { pool } = require("../db/pool");
const { env } = require("../config/env");
const { buildCartSummary } = require("../services/cartService");
const { processPaymentByMethod } = require("../services/paymentService");

const router = express.Router();

const allowedOrderStatuses = new Set([
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
]);

const allowedPaymentStatuses = new Set([
  "pending",
  "paid",
  "failed",
  "refunded",
]);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;
const passwordStrengthRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function sanitizeUser(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
  };
}

function createAuthToken(userRow) {
  return jwt.sign(
    {
      sub: String(userRow.id),
      email: userRow.email,
      fullName: userRow.full_name,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
      issuer: "flipkart-clone-api",
      audience: "flipkart-clone-client",
    },
  );
}

function getBearerToken(req) {
  const header = String(req.headers.authorization || "").trim();
  if (!header.toLowerCase().startsWith("bearer ")) {
    return "";
  }

  return header.slice(7).trim();
}

function requireAuth(req, res, next) {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret, {
      issuer: "flipkart-clone-api",
      audience: "flipkart-clone-client",
    });

    const userId = Number(decoded.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.authUser = {
      id: userId,
      email: decoded.email,
      fullName: decoded.fullName,
    };

    return next();
  } catch {
    return res
      .status(401)
      .json({ message: "Session expired. Please login again" });
  }
}

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPasswordHash) {
  if (!storedPasswordHash || !storedPasswordHash.includes(":")) {
    return false;
  }

  const [salt, hashHex] = storedPasswordHash.split(":");

  if (!salt || !hashHex) {
    return false;
  }

  const derived = crypto.scryptSync(String(password), salt, 64);
  const stored = Buffer.from(hashHex, "hex");

  if (stored.length !== derived.length) {
    return false;
  }

  return crypto.timingSafeEqual(stored, derived);
}

function toSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeImageKeys(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => String(item || "").trim())
    .filter((item) => item.length > 0);
}

function normalizeMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }

  return Math.round(amount * 100) / 100;
}

function toTitleCase(value) {
  return String(value || "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

async function fetchExternalProduct(productId) {
  const response = await fetch(
    `${env.externalProductsApi}/products/${productId}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to fetch product from external catalog");
  }

  return response.json();
}

async function setProductsSequence() {
  await pool.query(
    `SELECT setval(
      pg_get_serial_sequence('products', 'id'),
      COALESCE((SELECT MAX(id) FROM products), 1),
      (SELECT EXISTS (SELECT 1 FROM products))
    )`,
  );
}

async function ensureProductExists(productId) {
  const externalProduct = await fetchExternalProduct(productId);

  if (!externalProduct) {
    const { rows: existingRows } = await pool.query(
      "SELECT id FROM products WHERE id = $1",
      [productId],
    );
    return existingRows.length > 0;
  }

  const category = await ensureCategory(pool, {
    categoryName: toTitleCase(externalProduct.category),
    categorySlug: externalProduct.category,
  });

  const salePrice = normalizeMoney(externalProduct.price);
  const discount = Number(externalProduct.discountPercentage || 0);
  const mrpPrice =
    discount > 0 ? normalizeMoney(salePrice / (1 - discount / 100)) : salePrice;

  const ratingCount = Array.isArray(externalProduct.reviews)
    ? externalProduct.reviews.length
    : 0;

  await pool.query(
    `INSERT INTO products
      (id, category_id, brand, name, description, specifications, mrp_price, sale_price, stock, rating, rating_count, badge, badge_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     ON CONFLICT (id)
     DO UPDATE SET
      category_id = EXCLUDED.category_id,
      brand = EXCLUDED.brand,
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      specifications = EXCLUDED.specifications,
      mrp_price = EXCLUDED.mrp_price,
      sale_price = EXCLUDED.sale_price,
      stock = EXCLUDED.stock,
      rating = EXCLUDED.rating,
      rating_count = EXCLUDED.rating_count,
      badge = EXCLUDED.badge,
      badge_type = EXCLUDED.badge_type`,
    [
      Number(externalProduct.id),
      category.id,
      externalProduct.brand || "Generic",
      externalProduct.title || "Untitled product",
      externalProduct.description || "",
      JSON.stringify({
        category: externalProduct.category || "",
        sku: externalProduct.sku || "",
        warrantyInformation: externalProduct.warrantyInformation || "",
        shippingInformation: externalProduct.shippingInformation || "",
        availabilityStatus: externalProduct.availabilityStatus || "",
        weight: externalProduct.weight || null,
        dimensions: externalProduct.dimensions || null,
      }),
      mrpPrice,
      salePrice,
      Number(externalProduct.stock || 0),
      Number(externalProduct.rating || 0),
      ratingCount,
      discount > 0 ? `${Math.round(discount)}% off` : null,
      discount > 0 ? "new" : null,
    ],
  );

  const images = normalizeImageKeys([
    ...(Array.isArray(externalProduct.images) ? externalProduct.images : []),
    externalProduct.thumbnail,
  ]);

  await pool.query("DELETE FROM product_images WHERE product_id = $1", [
    productId,
  ]);

  for (let i = 0; i < images.length; i += 1) {
    await pool.query(
      "INSERT INTO product_images (product_id, image_key, position) VALUES ($1, $2, $3)",
      [productId, images[i], i],
    );
  }

  await setProductsSequence();
  return true;
}

async function syncUserCartProducts(userId) {
  const { rows } = await pool.query(
    "SELECT DISTINCT product_id FROM cart_items WHERE user_id = $1",
    [userId],
  );

  for (const row of rows) {
    const productId = Number(row.product_id);
    if (Number.isInteger(productId) && productId > 0) {
      await ensureProductExists(productId);
    }
  }
}

async function ensureCategory(client, { categoryName, categorySlug }) {
  const normalizedSlug = toSlug(categorySlug || categoryName);
  const normalizedName = String(categoryName || "").trim();

  if (!normalizedSlug || !normalizedName) {
    throw new Error("categoryName and categorySlug are required");
  }

  const { rows } = await client.query(
    `INSERT INTO categories (name, slug)
     VALUES ($1, $2)
     ON CONFLICT (slug)
     DO UPDATE SET name = EXCLUDED.name
     RETURNING id, name, slug`,
    [normalizedName, normalizedSlug],
  );

  return rows[0];
}

function toProductPayload(row) {
  return {
    id: row.id,
    category: row.category_name,
    categorySlug: row.category_slug,
    brand: row.brand,
    name: row.name,
    description: row.description,
    mrpPrice: Number(row.mrp_price),
    salePrice: Number(row.sale_price),
    stock: Number(row.stock),
    rating: Number(row.rating),
    ratingCount: Number(row.rating_count),
    badge: row.badge,
    badgeType: row.badge_type,
    imageKey: row.image_key,
  };
}

async function fetchCartRows(userId, client = pool) {
  const { rows } = await client.query(
    `SELECT
      ci.id,
      ci.product_id,
      ci.quantity,
      p.name,
      p.brand,
      p.mrp_price,
      p.sale_price,
      p.rating,
      p.rating_count,
      (SELECT pi.image_key FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.position ASC LIMIT 1) AS image_key
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = $1
     ORDER BY ci.id DESC`,
    [userId],
  );

  return rows.map((row) => ({
    id: row.id,
    productId: row.product_id,
    quantity: Number(row.quantity),
    name: row.name,
    brand: row.brand,
    mrpPrice: Number(row.mrp_price),
    salePrice: Number(row.sale_price),
    rating: Number(row.rating),
    ratingCount: Number(row.rating_count),
    imageKey: row.image_key,
    lineTotal: Number(row.sale_price) * Number(row.quantity),
  }));
}

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "flipkart-clone-api" });
});

router.post("/auth/register", async (req, res, next) => {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const phone = String(req.body.phone || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({
        message: "fullName, phone, email and password are required",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Phone must be a valid 10-digit Indian mobile number",
      });
    }

    if (!passwordStrengthRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 chars and include uppercase, lowercase, number, and special character",
      });
    }

    const { rows: existingRows } = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1",
      [email],
    );

    if (existingRows.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = createPasswordHash(password);

    const { rows } = await pool.query(
      `INSERT INTO users (full_name, phone, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, phone, email`,
      [fullName, phone, email, passwordHash],
    );

    res.status(201).json({
      message: "Registration successful",
      user: sanitizeUser(rows[0]),
      token: createAuthToken(rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const { rows } = await pool.query(
      `SELECT id, full_name, phone, email, password_hash
       FROM users
       WHERE LOWER(email) = $1
       LIMIT 1`,
      [email],
    );

    if (!rows.length || !verifyPassword(password, rows[0].password_hash)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: sanitizeUser(rows[0]),
      token: createAuthToken(rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/logout", requireAuth, (req, res) => {
  res.json({ message: "Logout successful" });
});

router.get("/categories", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, slug FROM categories ORDER BY name ASC",
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/products", async (req, res, next) => {
  try {
    const search = (req.query.search || "").trim();
    const category = (req.query.category || "").trim();
    const limit = Math.min(Math.max(Number(req.query.limit || 24), 1), 60);
    const page = Math.max(Number(req.query.page || 1), 1);
    const offset = (page - 1) * limit;

    const values = [];
    const where = [];

    if (search) {
      values.push(`%${search}%`);
      where.push(
        `(p.name ILIKE $${values.length} OR p.brand ILIKE $${values.length})`,
      );
    }

    if (category) {
      values.push(category.toLowerCase());
      where.push(`c.slug = $${values.length}`);
    }

    values.push(limit);
    values.push(offset);

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const query = `SELECT
        p.id,
        c.name AS category_name,
        c.slug AS category_slug,
        p.brand,
        p.name,
        p.description,
        p.mrp_price,
        p.sale_price,
        p.stock,
        p.rating,
        p.rating_count,
        p.badge,
        p.badge_type,
        (SELECT pi.image_key FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.position ASC LIMIT 1) AS image_key
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ${whereSql}
      ORDER BY p.id ASC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}`;

    const { rows } = await pool.query(query, values);

    const totalValues = values.slice(0, values.length - 2);
    const totalWhereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const { rows: totalRows } = await pool.query(
      `SELECT COUNT(*)::INT AS count
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${totalWhereSql}`,
      totalValues,
    );

    res.json({
      items: rows.map(toProductPayload),
      pagination: {
        page,
        limit,
        total: totalRows[0].count,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/products/:id", async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const { rows } = await pool.query(
      `SELECT
          p.id,
          c.name AS category_name,
          c.slug AS category_slug,
          p.brand,
          p.name,
          p.description,
          p.specifications,
          p.mrp_price,
          p.sale_price,
          p.stock,
          p.rating,
          p.rating_count,
          p.badge,
          p.badge_type
        FROM products p
        JOIN categories c ON c.id = p.category_id
        WHERE p.id = $1`,
      [productId],
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { rows: imageRows } = await pool.query(
      "SELECT image_key FROM product_images WHERE product_id = $1 ORDER BY position ASC",
      [productId],
    );

    const product = {
      ...toProductPayload({
        ...rows[0],
        image_key: imageRows[0]?.image_key || null,
      }),
      specifications: rows[0].specifications || {},
      imageKeys: imageRows.map((row) => row.image_key),
    };

    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.get("/cart", requireAuth, async (req, res, next) => {
  try {
    await syncUserCartProducts(req.authUser.id);
    const items = await fetchCartRows(req.authUser.id);
    const summary = buildCartSummary(items);
    res.json({ items, summary });
  } catch (error) {
    next(error);
  }
});

router.post("/cart/items", requireAuth, async (req, res, next) => {
  try {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity || 1);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const exists = await ensureProductExists(productId);

    if (!exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { rows: productRows } = await pool.query(
      "SELECT id, stock FROM products WHERE id = $1",
      [productId],
    );

    if (!productRows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > Number(productRows[0].stock)) {
      return res
        .status(400)
        .json({ message: "Requested quantity exceeds stock" });
    }

    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = LEAST((cart_items.quantity + EXCLUDED.quantity), $4)`,
      [req.authUser.id, productId, quantity, Number(productRows[0].stock)],
    );

    const items = await fetchCartRows(req.authUser.id);
    const summary = buildCartSummary(items);

    res.status(201).json({ items, summary });
  } catch (error) {
    next(error);
  }
});

router.patch("/cart/items/:itemId", requireAuth, async (req, res, next) => {
  try {
    const itemId = Number(req.params.itemId);
    const quantity = Number(req.body.quantity);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const { rows } = await pool.query(
      `SELECT ci.id, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.id = $1 AND ci.user_id = $2`,
      [itemId, req.authUser.id],
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity > Number(rows[0].stock)) {
      return res
        .status(400)
        .json({ message: "Requested quantity exceeds stock" });
    }

    await pool.query("UPDATE cart_items SET quantity = $1 WHERE id = $2", [
      quantity,
      itemId,
    ]);

    const items = await fetchCartRows(req.authUser.id);
    const summary = buildCartSummary(items);

    res.json({ items, summary });
  } catch (error) {
    next(error);
  }
});

router.delete("/cart/items/:itemId", requireAuth, async (req, res, next) => {
  try {
    const itemId = Number(req.params.itemId);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    await pool.query("DELETE FROM cart_items WHERE id = $1 AND user_id = $2", [
      itemId,
      req.authUser.id,
    ]);

    const items = await fetchCartRows(req.authUser.id);
    const summary = buildCartSummary(items);

    res.json({ items, summary });
  } catch (error) {
    next(error);
  }
});

router.get("/checkout/summary", requireAuth, async (req, res, next) => {
  try {
    await syncUserCartProducts(req.authUser.id);
    const items = await fetchCartRows(req.authUser.id);
    const summary = buildCartSummary(items);

    res.json({
      shippingAddress: {
        fullName: "Sheersh Saxena",
        phone: "7458902737",
        pincode: "441108",
        addressLine: "IIT NAGPUR, Near IIITN Main Gate",
        city: "Nagpur",
        state: "Maharashtra",
        label: "HOME",
      },
      items,
      summary,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/orders", requireAuth, async (req, res, next) => {
  const client = await pool.connect();

  try {
    const shippingAddress = req.body.shippingAddress;
    const paymentMethod = String(req.body.paymentMethod || "").trim();

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.pincode
    ) {
      return res
        .status(400)
        .json({ message: "Complete shipping address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "paymentMethod is required" });
    }

    await client.query("BEGIN");

    const items = await fetchCartRows(req.authUser.id, client);

    if (!items.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    const summary = buildCartSummary(items);

    const { rows: orderRows } = await client.query(
      `INSERT INTO orders
        (user_id, status, payment_method, payment_status, subtotal, discount, platform_fee, total, shipping_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, created_at`,
      [
        req.authUser.id,
        "pending",
        paymentMethod,
        "pending",
        summary.subtotal,
        summary.discount,
        summary.platformFee,
        summary.total,
        shippingAddress,
      ],
    );

    const orderId = orderRows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name_snapshot, price_snapshot, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.productId, item.name, item.salePrice, item.quantity],
      );
    }

    await client.query("DELETE FROM cart_items WHERE user_id = $1", [
      req.authUser.id,
    ]);

    await client.query("COMMIT");

    return res.status(201).json({
      orderId,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      summary,
      createdAt: orderRows[0].created_at,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

router.post("/payments", requireAuth, async (req, res, next) => {
  try {
    const orderId = Number(req.body.orderId);
    const method = String(req.body.method || "").trim();

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ message: "Invalid orderId" });
    }

    if (!method) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    const { rows: orderRows } = await pool.query(
      `SELECT id, total, payment_status, status
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [orderId, req.authUser.id],
    );

    if (!orderRows.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRows[0];

    if (order.payment_status === "paid") {
      return res.json({
        orderId: order.id,
        status: order.status,
        paymentStatus: order.payment_status,
        paymentMethod: method,
        message: "Payment already completed",
      });
    }

    const paymentResult = await processPaymentByMethod({
      orderId,
      method,
      amount: Number(order.total),
      currency: env.paymentCurrency,
    });

    const nextPaymentStatus = paymentResult.paymentStatus || "paid";
    const nextOrderStatus = paymentResult.orderStatus || "confirmed";

    const { rows } = await pool.query(
      `UPDATE orders
       SET payment_method = $1,
           payment_status = $2,
           status = $3
       WHERE id = $4 AND user_id = $5
       RETURNING id, status, payment_status, payment_method`,
      [method, nextPaymentStatus, nextOrderStatus, orderId, req.authUser.id],
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      orderId: rows[0].id,
      status: rows[0].status,
      paymentStatus: rows[0].payment_status,
      paymentMethod: rows[0].payment_method,
      gateway: paymentResult.gateway,
      gatewayReference: paymentResult.reference,
      gatewayData: paymentResult.gatewayData || null,
      message: paymentResult.message || "Payment successful",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/orders", requireAuth, async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const page = Math.max(Number(req.query.page || 1), 1);
    const offset = (page - 1) * limit;

    const { rows } = await pool.query(
      `SELECT
        o.id,
        o.status,
        o.payment_status,
        o.payment_method,
        o.total,
        o.created_at,
        COUNT(oi.id)::INT AS item_count
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT $2
       OFFSET $3`,
      [req.authUser.id, limit, offset],
    );

    const { rows: totalRows } = await pool.query(
      `SELECT COUNT(*)::INT AS count
       FROM orders
       WHERE user_id = $1`,
      [req.authUser.id],
    );

    res.json({
      items: rows.map((order) => ({
        id: order.id,
        status: order.status,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        total: Number(order.total),
        itemCount: Number(order.item_count),
        createdAt: order.created_at,
      })),
      pagination: {
        page,
        limit,
        total: totalRows[0].count,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/orders/:id", requireAuth, async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const { rows: orderRows } = await pool.query(
      `SELECT id, status, payment_status, payment_method, subtotal, discount, platform_fee, total, shipping_address, created_at
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [orderId, req.authUser.id],
    );

    if (!orderRows.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { rows: itemRows } = await pool.query(
      `SELECT oi.id, oi.product_id, oi.name_snapshot, oi.price_snapshot, oi.quantity,
              (SELECT pi.image_key FROM product_images pi WHERE pi.product_id = oi.product_id ORDER BY pi.position ASC LIMIT 1) AS image_key
       FROM order_items oi
       WHERE oi.order_id = $1
       ORDER BY oi.id ASC`,
      [orderId],
    );

    const order = orderRows[0];

    res.json({
      id: order.id,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      createdAt: order.created_at,
      shippingAddress: order.shipping_address,
      summary: {
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        platformFee: Number(order.platform_fee),
        total: Number(order.total),
      },
      items: itemRows.map((item) => ({
        id: item.id,
        productId: item.product_id,
        name: item.name_snapshot,
        price: Number(item.price_snapshot),
        quantity: Number(item.quantity),
        imageKey: item.image_key,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/admin/products", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "")
      .trim()
      .toLowerCase();
    const limit = Math.min(Math.max(Number(req.query.limit || 100), 1), 200);
    const page = Math.max(Number(req.query.page || 1), 1);
    const offset = (page - 1) * limit;

    const values = [];
    const where = [];

    if (search) {
      values.push(`%${search}%`);
      where.push(
        `(p.name ILIKE $${values.length} OR p.brand ILIKE $${values.length})`,
      );
    }

    if (category) {
      values.push(category);
      where.push(`c.slug = $${values.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    values.push(limit);
    values.push(offset);

    const { rows } = await pool.query(
      `SELECT
        p.id,
        p.brand,
        p.name,
        p.description,
        p.specifications,
        p.mrp_price,
        p.sale_price,
        p.stock,
        p.rating,
        p.rating_count,
        p.badge,
        p.badge_type,
        p.created_at,
        c.id AS category_id,
        c.name AS category_name,
        c.slug AS category_slug,
        COALESCE(
          (
            SELECT json_agg(pi.image_key ORDER BY pi.position)
            FROM product_images pi
            WHERE pi.product_id = p.id
          ),
          '[]'::json
        ) AS image_keys
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ${whereSql}
      ORDER BY p.id DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}`,
      values,
    );

    const totalValues = values.slice(0, values.length - 2);
    const { rows: totalRows } = await pool.query(
      `SELECT COUNT(*)::INT AS count
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${whereSql}`,
      totalValues,
    );

    res.json({
      items: rows.map((row) => ({
        id: row.id,
        brand: row.brand,
        name: row.name,
        description: row.description,
        specifications: row.specifications || {},
        mrpPrice: Number(row.mrp_price),
        salePrice: Number(row.sale_price),
        stock: Number(row.stock),
        rating: Number(row.rating),
        ratingCount: Number(row.rating_count),
        badge: row.badge,
        badgeType: row.badge_type,
        categoryId: row.category_id,
        categoryName: row.category_name,
        categorySlug: row.category_slug,
        imageKeys: row.image_keys || [],
        createdAt: row.created_at,
      })),
      pagination: {
        page,
        limit,
        total: totalRows[0].count,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/admin/products", async (req, res, next) => {
  const client = await pool.connect();

  try {
    const payload = req.body || {};
    const brand = String(payload.brand || "").trim();
    const name = String(payload.name || "").trim();
    const description = String(payload.description || "").trim();
    const mrpPrice = Number(payload.mrpPrice);
    const salePrice = Number(payload.salePrice);
    const stock = Number(payload.stock);
    const rating = Number(payload.rating || 0);
    const ratingCount = Number(payload.ratingCount || 0);
    const badge = payload.badge ? String(payload.badge).trim() : null;
    const badgeType = payload.badgeType
      ? String(payload.badgeType).trim()
      : null;
    const imageKeys = normalizeImageKeys(payload.imageKeys);

    if (!brand || !name || !description) {
      return res
        .status(400)
        .json({ message: "brand, name and description are required" });
    }

    if (
      !Number.isFinite(mrpPrice) ||
      !Number.isFinite(salePrice) ||
      !Number.isFinite(stock)
    ) {
      return res.status(400).json({
        message: "mrpPrice, salePrice and stock must be valid numbers",
      });
    }

    if (salePrice > mrpPrice) {
      return res
        .status(400)
        .json({ message: "salePrice cannot be greater than mrpPrice" });
    }

    if (imageKeys.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image key is required" });
    }

    await client.query("BEGIN");

    const category = await ensureCategory(client, {
      categoryName: payload.categoryName,
      categorySlug: payload.categorySlug,
    });

    const { rows } = await client.query(
      `INSERT INTO products
        (category_id, brand, name, description, specifications, mrp_price, sale_price, stock, rating, rating_count, badge, badge_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        category.id,
        brand,
        name,
        description,
        payload.specifications || {},
        mrpPrice,
        salePrice,
        Math.max(Math.floor(stock), 0),
        Math.max(rating, 0),
        Math.max(Math.floor(ratingCount), 0),
        badge,
        badgeType,
      ],
    );

    const productId = rows[0].id;

    for (let i = 0; i < imageKeys.length; i += 1) {
      await client.query(
        "INSERT INTO product_images (product_id, image_key, position) VALUES ($1, $2, $3)",
        [productId, imageKeys[i], i],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({ message: "Product created", productId });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

router.put("/admin/products/:id", async (req, res, next) => {
  const client = await pool.connect();

  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const payload = req.body || {};
    const brand = String(payload.brand || "").trim();
    const name = String(payload.name || "").trim();
    const description = String(payload.description || "").trim();
    const mrpPrice = Number(payload.mrpPrice);
    const salePrice = Number(payload.salePrice);
    const stock = Number(payload.stock);
    const rating = Number(payload.rating || 0);
    const ratingCount = Number(payload.ratingCount || 0);
    const badge = payload.badge ? String(payload.badge).trim() : null;
    const badgeType = payload.badgeType
      ? String(payload.badgeType).trim()
      : null;
    const imageKeys = normalizeImageKeys(payload.imageKeys);

    if (!brand || !name || !description) {
      return res
        .status(400)
        .json({ message: "brand, name and description are required" });
    }

    if (
      !Number.isFinite(mrpPrice) ||
      !Number.isFinite(salePrice) ||
      !Number.isFinite(stock)
    ) {
      return res.status(400).json({
        message: "mrpPrice, salePrice and stock must be valid numbers",
      });
    }

    if (salePrice > mrpPrice) {
      return res
        .status(400)
        .json({ message: "salePrice cannot be greater than mrpPrice" });
    }

    if (imageKeys.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image key is required" });
    }

    await client.query("BEGIN");

    const category = await ensureCategory(client, {
      categoryName: payload.categoryName,
      categorySlug: payload.categorySlug,
    });

    const { rows } = await client.query(
      `UPDATE products
       SET category_id = $1,
           brand = $2,
           name = $3,
           description = $4,
           specifications = $5,
           mrp_price = $6,
           sale_price = $7,
           stock = $8,
           rating = $9,
           rating_count = $10,
           badge = $11,
           badge_type = $12
       WHERE id = $13
       RETURNING id`,
      [
        category.id,
        brand,
        name,
        description,
        payload.specifications || {},
        mrpPrice,
        salePrice,
        Math.max(Math.floor(stock), 0),
        Math.max(rating, 0),
        Math.max(Math.floor(ratingCount), 0),
        badge,
        badgeType,
        productId,
      ],
    );

    if (!rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found" });
    }

    await client.query("DELETE FROM product_images WHERE product_id = $1", [
      productId,
    ]);

    for (let i = 0; i < imageKeys.length; i += 1) {
      await client.query(
        "INSERT INTO product_images (product_id, image_key, position) VALUES ($1, $2, $3)",
        [productId, imageKeys[i], i],
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Product updated", productId });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

router.delete("/admin/products/:id", async (req, res, next) => {
  const client = await pool.connect();

  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    await client.query("BEGIN");

    const { rows: orderRows } = await client.query(
      "SELECT 1 FROM order_items WHERE product_id = $1 LIMIT 1",
      [productId],
    );

    if (orderRows.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message:
          "Product has order history and cannot be deleted. Update stock to 0 instead.",
      });
    }

    await client.query("DELETE FROM cart_items WHERE product_id = $1", [
      productId,
    ]);
    await client.query("DELETE FROM product_images WHERE product_id = $1", [
      productId,
    ]);

    const { rowCount } = await client.query(
      "DELETE FROM products WHERE id = $1",
      [productId],
    );

    if (!rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found" });
    }

    await client.query("COMMIT");
    res.json({ message: "Product deleted", productId });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

router.get("/admin/orders", async (req, res, next) => {
  try {
    const status = String(req.query.status || "")
      .trim()
      .toLowerCase();
    const paymentMethod = String(req.query.paymentMethod || "")
      .trim()
      .toLowerCase();
    const limit = Math.min(Math.max(Number(req.query.limit || 100), 1), 200);
    const page = Math.max(Number(req.query.page || 1), 1);
    const offset = (page - 1) * limit;

    const values = [];
    const where = [];

    if (status) {
      values.push(status);
      where.push(`o.status = $${values.length}`);
    }

    if (paymentMethod) {
      values.push(paymentMethod);
      where.push(`o.payment_method = $${values.length}`);
    }

    values.push(limit);
    values.push(offset);

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows } = await pool.query(
      `SELECT
        o.id,
        o.status,
        o.payment_method,
        o.payment_status,
        o.total,
        o.subtotal,
        o.discount,
        o.platform_fee,
        o.shipping_address,
        o.created_at,
        u.id AS user_id,
        u.full_name,
        u.phone,
        u.email,
        COUNT(oi.id)::INT AS item_count,
        COALESCE(SUM(oi.quantity), 0)::INT AS total_units
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      ${whereSql}
      GROUP BY o.id, u.id
      ORDER BY o.created_at DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}`,
      values,
    );

    const totalValues = values.slice(0, values.length - 2);
    const { rows: totalRows } = await pool.query(
      `SELECT COUNT(*)::INT AS count
       FROM orders o
       ${whereSql}`,
      totalValues,
    );

    res.json({
      items: rows.map((row) => ({
        id: row.id,
        status: row.status,
        paymentMethod: row.payment_method,
        paymentStatus: row.payment_status,
        total: Number(row.total),
        subtotal: Number(row.subtotal),
        discount: Number(row.discount),
        platformFee: Number(row.platform_fee),
        createdAt: row.created_at,
        itemCount: row.item_count,
        totalUnits: row.total_units,
        customer: {
          id: row.user_id,
          fullName: row.full_name,
          phone: row.phone,
          email: row.email,
        },
        shippingAddress: row.shipping_address,
      })),
      pagination: {
        page,
        limit,
        total: totalRows[0].count,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/admin/orders/:id", async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const { rows: orderRows } = await pool.query(
      `SELECT
        o.id,
        o.status,
        o.payment_method,
        o.payment_status,
        o.total,
        o.subtotal,
        o.discount,
        o.platform_fee,
        o.shipping_address,
        o.created_at,
        u.id AS user_id,
        u.full_name,
        u.phone,
        u.email
      FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE o.id = $1`,
      [orderId],
    );

    if (!orderRows.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { rows: itemRows } = await pool.query(
      `SELECT
        oi.id,
        oi.product_id,
        oi.name_snapshot,
        oi.price_snapshot,
        oi.quantity,
        (SELECT pi.image_key FROM product_images pi WHERE pi.product_id = oi.product_id ORDER BY pi.position ASC LIMIT 1) AS image_key
      FROM order_items oi
      WHERE oi.order_id = $1
      ORDER BY oi.id ASC`,
      [orderId],
    );

    const order = orderRows[0];

    res.json({
      id: order.id,
      status: order.status,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      platformFee: Number(order.platform_fee),
      createdAt: order.created_at,
      shippingAddress: order.shipping_address,
      customer: {
        id: order.user_id,
        fullName: order.full_name,
        phone: order.phone,
        email: order.email,
      },
      items: itemRows.map((item) => ({
        id: item.id,
        productId: item.product_id,
        name: item.name_snapshot,
        price: Number(item.price_snapshot),
        quantity: Number(item.quantity),
        imageKey: item.image_key,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/admin/orders/:id/status", async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const nextStatus = req.body.status
      ? String(req.body.status).trim().toLowerCase()
      : null;
    const nextPaymentStatus = req.body.paymentStatus
      ? String(req.body.paymentStatus).trim().toLowerCase()
      : null;

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    if (!nextStatus && !nextPaymentStatus) {
      return res
        .status(400)
        .json({ message: "status or paymentStatus is required" });
    }

    if (nextStatus && !allowedOrderStatuses.has(nextStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    if (nextPaymentStatus && !allowedPaymentStatuses.has(nextPaymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const updates = [];
    const values = [];

    if (nextStatus) {
      values.push(nextStatus);
      updates.push(`status = $${values.length}`);
    }

    if (nextPaymentStatus) {
      values.push(nextPaymentStatus);
      updates.push(`payment_status = $${values.length}`);
    }

    values.push(orderId);

    const { rows } = await pool.query(
      `UPDATE orders
       SET ${updates.join(", ")}
       WHERE id = $${values.length}
       RETURNING id, status, payment_method, payment_status, created_at`,
      values,
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order updated",
      order: {
        id: rows[0].id,
        status: rows[0].status,
        paymentMethod: rows[0].payment_method,
        paymentStatus: rows[0].payment_status,
        createdAt: rows[0].created_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { apiRouter: router };
