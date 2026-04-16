const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { Pool } = require("pg");
const { env } = require("../config/env");
const { pool } = require("./pool");
const { categories, products } = require("../data/seedData");

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function ensureDatabaseExists() {
  const adminPool = new Pool({
    host: env.pgHost,
    port: env.pgPort,
    user: env.pgUser,
    password: env.pgPassword,
    database: "postgres",
  });

  try {
    const { rows } = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [env.pgDatabase],
    );

    if (rows.length === 0) {
      await adminPool.query(`CREATE DATABASE "${env.pgDatabase}"`);
      console.log(`Created database ${env.pgDatabase}`);
    }
  } finally {
    await adminPool.end();
  }
}

async function runSchema() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = await fs.readFile(schemaPath, "utf8");
  await pool.query(sql);
}

async function clearData() {
  await pool.query(
    "TRUNCATE TABLE order_items, orders, cart_items, product_images, products, categories, users RESTART IDENTITY CASCADE;",
  );
}

async function seedData() {
  const defaultPasswordHash = createPasswordHash("password123");

  await pool.query(
    "INSERT INTO users (id, full_name, phone, email, password_hash) VALUES (1, $1, $2, $3, $4)",
    [
      "Sheersh Saxena",
      "7458902737",
      "default.user@flipkartclone.dev",
      defaultPasswordHash,
    ],
  );

  const categoryMap = new Map();
  for (const category of categories) {
    const { rows } = await pool.query(
      "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id",
      [category.name, category.slug],
    );
    categoryMap.set(category.slug, rows[0].id);
  }

  for (const product of products) {
    const { rows } = await pool.query(
      `INSERT INTO products
        (category_id, brand, name, description, specifications, mrp_price, sale_price, stock, rating, rating_count, badge, badge_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        categoryMap.get(product.categorySlug),
        product.brand,
        product.name,
        product.description,
        JSON.stringify({
          formFactor: "Ergonomic",
          compatibleDevices: "Laptop, PC",
          warranty: "1 Year",
        }),
        product.mrpPrice,
        product.salePrice,
        product.stock,
        product.rating,
        product.ratingCount,
        product.badge || null,
        product.badgeType || null,
      ],
    );

    const productId = rows[0].id;

    for (let i = 0; i < product.imageKeys.length; i += 1) {
      await pool.query(
        "INSERT INTO product_images (product_id, image_key, position) VALUES ($1, $2, $3)",
        [productId, product.imageKeys[i], i],
      );
    }
  }

  await pool.query(
    "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (1, 1, 1), (1, 2, 1)",
  );

  await pool.query(
    `SELECT setval(
      pg_get_serial_sequence('users', 'id'),
      COALESCE((SELECT MAX(id) FROM users), 1),
      (SELECT EXISTS (SELECT 1 FROM users))
    )`,
  );
}

async function main() {
  try {
    await ensureDatabaseExists();
    await runSchema();
    await clearData();
    await seedData();
    console.log("Database schema and seed completed.");
  } catch (error) {
    console.error("Database setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
