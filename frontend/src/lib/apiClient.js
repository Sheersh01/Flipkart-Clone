const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const PRODUCTS_API_BASE_URL =
  import.meta.env.VITE_PRODUCTS_API_URL || "https://dummyjson.com";

const AUTH_STORAGE_KEY = "flipkart-auth-user";
const AUTH_TOKEN_STORAGE_KEY = "flipkart-auth-token";

let cartCount = 0;
const cartCountListeners = new Set();
const authStateListeners = new Set();

function getAuthStateSnapshot() {
  return {
    user: getAuthUser(),
    token: getAuthToken(),
  };
}

function emitAuthState() {
  const snapshot = getAuthStateSnapshot();
  authStateListeners.forEach((listener) => {
    listener(snapshot);
  });
}

export function getAuthUser() {
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (!token) {
    return null;
  }

  const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
}

export function isAuthenticated() {
  return Boolean(getAuthUser() && getAuthToken());
}

export function setAuthUser(user) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  emitAuthState();
}

export function setAuthToken(token) {
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    emitAuthState();
  }
}

export function setAuthSession(user, token) {
  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }

  emitAuthState();
}

export function clearAuthUser() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  emitAuthState();
}

export function subscribeAuthState(listener) {
  if (typeof listener !== "function") {
    return () => {};
  }

  authStateListeners.add(listener);
  listener(getAuthStateSnapshot());

  return () => {
    authStateListeners.delete(listener);
  };
}

export function registerUser(payload) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

function normalizeCartCount(value) {
  const nextCount = Number(value);
  if (!Number.isFinite(nextCount) || nextCount < 0) {
    return 0;
  }
  return Math.floor(nextCount);
}

function emitCartCount(nextCount) {
  cartCount = normalizeCartCount(nextCount);
  cartCountListeners.forEach((listener) => {
    listener(cartCount);
  });
}

function extractCartCount(cartPayload) {
  if (cartPayload?.summary?.totalItems != null) {
    return normalizeCartCount(cartPayload.summary.totalItems);
  }

  if (Array.isArray(cartPayload?.items)) {
    return normalizeCartCount(
      cartPayload.items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
      ),
    );
  }

  return 0;
}

function syncCartCount(cartPayload) {
  emitCartCount(extractCartCount(cartPayload));
}

async function apiRequest(path, options = {}) {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthUser();
    }
    throw new Error(data.message || "Request failed");
  }

  return data;
}

async function productsApiRequest(path) {
  const response = await fetch(`${PRODUCTS_API_BASE_URL}${path}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch products");
  }

  return data;
}

function normalizeMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }

  return Math.round(amount);
}

function toTitleCase(value) {
  return String(value || "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function mapDummyProduct(product) {
  const salePrice = normalizeMoney(product.price);
  const discountPercent = Number(product.discountPercentage || 0);
  const mrpPrice =
    discountPercent > 0
      ? normalizeMoney(salePrice / (1 - discountPercent / 100))
      : salePrice;

  const imageKeys = Array.isArray(product.images)
    ? product.images.filter((image) => Boolean(String(image || "").trim()))
    : [];
  const fallbackImage = String(product.thumbnail || "").trim();
  const normalizedImages = imageKeys.length
    ? imageKeys
    : fallbackImage
      ? [fallbackImage]
      : [];

  const specifications = {
    category: product.category || "",
    sku: product.sku || "",
    warrantyInformation: product.warrantyInformation || "",
    shippingInformation: product.shippingInformation || "",
    availabilityStatus: product.availabilityStatus || "",
    weight: product.weight || null,
    dimensions: product.dimensions || null,
  };

  return {
    id: Number(product.id),
    source: "dummyjson",
    cartProductId: Number(product.id),
    category: toTitleCase(product.category),
    categorySlug: String(product.category || "").toLowerCase(),
    brand: product.brand || "Generic",
    name: product.title || "Untitled product",
    description: product.description || "",
    mrpPrice,
    salePrice,
    stock: Number(product.stock || 0),
    rating: Number(product.rating || 0),
    ratingCount: Array.isArray(product.reviews) ? product.reviews.length : 0,
    badge:
      discountPercent > 0 ? `${Math.round(discountPercent)}% off` : undefined,
    badgeType: discountPercent > 0 ? "new" : undefined,
    imageKey: normalizedImages[0] || null,
    imageKeys: normalizedImages,
    specifications,
  };
}

export function getProducts(params = {}) {
  const page = Math.max(Number(params.page || 1), 1);
  const limit = Math.min(Math.max(Number(params.limit || 24), 1), 100);
  const skip = (page - 1) * limit;
  const search = String(params.search || "").trim();
  const category = String(params.category || "")
    .trim()
    .toLowerCase();

  // DummyJSON has separate routes for search and category. If both are present,
  // fetch all search matches and apply category filtering client-side.
  if (search && category) {
    return productsApiRequest(
      `/products/search?q=${encodeURIComponent(search)}&limit=0`,
    ).then((payload) => {
      const products = Array.isArray(payload.products) ? payload.products : [];
      const filtered = products.filter(
        (product) => String(product.category || "").toLowerCase() === category,
      );
      const pageItems = filtered.slice(skip, skip + limit).map(mapDummyProduct);

      return {
        items: pageItems,
        pagination: {
          page,
          limit,
          total: filtered.length,
        },
      };
    });
  }

  let endpoint = `/products?limit=${limit}&skip=${skip}`;

  if (search) {
    endpoint = `/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
  } else if (category) {
    endpoint = `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
  }

  return productsApiRequest(endpoint).then((payload) => ({
    items: (Array.isArray(payload.products) ? payload.products : []).map(
      mapDummyProduct,
    ),
    pagination: {
      page,
      limit,
      total: Number(payload.total || 0),
    },
  }));
}

export function getCategories() {
  return productsApiRequest("/products/categories").then((payload) => {
    const categories = Array.isArray(payload) ? payload : [];

    return categories.map((category, index) => {
      if (typeof category === "string") {
        const slug = category.toLowerCase();
        return {
          id: index + 1,
          name: toTitleCase(category),
          slug,
        };
      }

      const slug = String(category.slug || category.name || `cat-${index + 1}`)
        .trim()
        .toLowerCase();
      return {
        id: index + 1,
        name: category.name || toTitleCase(slug),
        slug,
      };
    });
  });
}

export function getProductById(productId) {
  return productsApiRequest(`/products/${productId}`).then(mapDummyProduct);
}

export function getCart() {
  return apiRequest("/cart").then((data) => {
    syncCartCount(data);
    return data;
  });
}

export function addCartItem(productId, quantity = 1) {
  if (!isAuthenticated()) {
    return Promise.reject(new Error("Please log in to add items to cart"));
  }

  return apiRequest("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  }).then((data) => {
    syncCartCount(data);
    return data;
  });
}

export function updateCartItemQuantity(itemId, quantity) {
  return apiRequest(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  }).then((data) => {
    syncCartCount(data);
    return data;
  });
}

export function removeCartItem(itemId) {
  return apiRequest(`/cart/items/${itemId}`, {
    method: "DELETE",
  }).then((data) => {
    syncCartCount(data);
    return data;
  });
}

export function getCheckoutSummary() {
  return apiRequest("/checkout/summary");
}

export function createOrder(payload) {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((data) => {
    // Cart is cleared on order creation in backend.
    emitCartCount(0);
    return data;
  });
}

export function payOrder(payload) {
  return apiRequest("/payments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOrder(orderId) {
  return apiRequest(`/orders/${orderId}`);
}

export function getOrders(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return apiRequest(`/orders${query ? `?${query}` : ""}`);
}

export function getCartCountSnapshot() {
  return cartCount;
}

export function subscribeCartCount(listener) {
  if (typeof listener !== "function") {
    return () => {};
  }

  cartCountListeners.add(listener);
  listener(cartCount);

  return () => {
    cartCountListeners.delete(listener);
  };
}
