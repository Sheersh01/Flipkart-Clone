import { useEffect, useMemo, useState } from "react";
import "./App.css";

type AdminProduct = {
  id: number;
  brand: string;
  name: string;
  description: string;
  specifications: Record<string, string>;
  mrpPrice: number;
  salePrice: number;
  stock: number;
  rating: number;
  ratingCount: number;
  badge: string | null;
  badgeType: string | null;
  categoryName: string;
  categorySlug: string;
  imageKeys: string[];
};

type ProductPayload = {
  brand: string;
  name: string;
  description: string;
  categoryName: string;
  categorySlug: string;
  mrpPrice: number;
  salePrice: number;
  stock: number;
  rating: number;
  ratingCount: number;
  badge: string;
  badgeType: string;
  imageKeys: string[];
  specifications: Record<string, string>;
};

type AdminOrder = {
  id: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  itemCount: number;
};

type ApiError = {
  message: string;
};

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/$/, "");

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
];

const paymentStatuses = ["pending", "paid", "failed", "refunded"];

const emptyForm: ProductPayload = {
  brand: "",
  name: "",
  description: "",
  categoryName: "",
  categorySlug: "",
  mrpPrice: 0,
  salePrice: 0,
  stock: 0,
  rating: 0,
  ratingCount: 0,
  badge: "",
  badgeType: "",
  imageKeys: [],
  specifications: {},
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const fallback = "Request failed";
    let message = fallback;

    try {
      const errorBody = (await response.json()) as ApiError;
      message = errorBody.message || fallback;
    } catch {
      message = fallback;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function parseSpecLines(text: string): Record<string, string> {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const result: Record<string, string> = {};

  for (const line of lines) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex <= 0) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (key && value) {
      result[key] = value;
    }
  }

  return result;
}

function specsToMultiline(specs: Record<string, string>): string {
  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function App() {
  const [tab, setTab] = useState<"products" | "add-product" | "orders">(
    "products",
  );
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductPayload>(emptyForm);
  const [imageInput, setImageInput] = useState("");
  const [specText, setSpecText] = useState("");

  const isEditing = useMemo(() => editingId !== null, [editingId]);
  const dashboardStats = useMemo(() => {
    const lowStockProducts = products.filter(
      (product) => product.stock <= 5,
    ).length;
    const activeOrders = orders.filter(
      (order) => order.status !== "delivered" && order.status !== "cancelled",
    ).length;

    return {
      products: products.length,
      orders: orders.length,
      lowStockProducts,
      activeOrders,
    };
  }, [orders, products]);

  const clearMessages = () => {
    setStatusMessage("");
    setErrorMessage("");
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    clearMessages();
    try {
      const response = await request<{ items: AdminProduct[] }>(
        "/admin/products?limit=200&page=1",
      );
      setProducts(response.items);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to fetch products",
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    clearMessages();
    try {
      const response = await request<{ items: AdminOrder[] }>(
        "/admin/orders?limit=200&page=1",
      );
      setOrders(response.items);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to fetch orders",
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    void loadProducts();
    void loadOrders();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageInput("");
    setSpecText("");
  };

  const editProduct = (product: AdminProduct) => {
    setTab("add-product");
    clearMessages();
    setEditingId(product.id);
    setForm({
      brand: product.brand,
      name: product.name,
      description: product.description,
      categoryName: product.categoryName,
      categorySlug: product.categorySlug,
      mrpPrice: product.mrpPrice,
      salePrice: product.salePrice,
      stock: product.stock,
      rating: product.rating,
      ratingCount: product.ratingCount,
      badge: product.badge || "",
      badgeType: product.badgeType || "",
      imageKeys: product.imageKeys || [],
      specifications: product.specifications || {},
    });
    setImageInput((product.imageKeys || []).join(", "));
    setSpecText(specsToMultiline(product.specifications || {}));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearMessages();
    setSavingProduct(true);

    const payload: ProductPayload = {
      ...form,
      imageKeys: imageInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      specifications: parseSpecLines(specText),
      badge: form.badge.trim(),
      badgeType: form.badgeType.trim(),
      categorySlug: form.categorySlug.trim().toLowerCase(),
    };

    try {
      if (isEditing && editingId !== null) {
        await request(`/admin/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setStatusMessage("Product updated successfully");
      } else {
        await request("/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setStatusMessage("Product created successfully");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save product",
      );
    } finally {
      setSavingProduct(false);
    }
  };

  const deleteProduct = async (productId: number) => {
    const shouldDelete = window.confirm(
      "Delete this product? This action cannot be undone.",
    );
    if (!shouldDelete) {
      return;
    }

    clearMessages();
    try {
      await request(`/admin/products/${productId}`, { method: "DELETE" });
      setStatusMessage("Product deleted successfully");
      if (editingId === productId) {
        resetForm();
      }
      await loadProducts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to delete product",
      );
    }
  };

  const updateOrder = async (
    orderId: number,
    nextStatus: string,
    nextPaymentStatus: string,
  ) => {
    clearMessages();
    try {
      await request(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: nextStatus,
          paymentStatus: nextPaymentStatus,
        }),
      });
      setStatusMessage(`Order #${orderId} updated`);
      await loadOrders();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update order",
      );
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-header admin-hero">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Flipkart Admin Panel</h1>
          <p>
            Manage your catalog, add new products, and monitor customer orders
            from one control center.
          </p>
        </div>
        <div className="admin-hero-chip">
          <span className="chip-dot" />
          Live admin workspace
        </div>
      </header>

      <section className="dashboard-stats" aria-label="Dashboard overview">
        <article className="stat-card">
          <span className="stat-label">Products</span>
          <strong>{dashboardStats.products}</strong>
          <span className="stat-note">Items in catalog</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Orders</span>
          <strong>{dashboardStats.orders}</strong>
          <span className="stat-note">Total customer orders</span>
        </article>
        <article className="stat-card warning">
          <span className="stat-label">Low stock</span>
          <strong>{dashboardStats.lowStockProducts}</strong>
          <span className="stat-note">Products at 5 units or less</span>
        </article>
        <article className="stat-card accent">
          <span className="stat-label">Active orders</span>
          <strong>{dashboardStats.activeOrders}</strong>
          <span className="stat-note">Pending fulfillment</span>
        </article>
      </section>

      <nav className="admin-tabs" aria-label="Admin sections">
        <button
          type="button"
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          Product Catalog
        </button>
        <button
          type="button"
          className={tab === "add-product" ? "active" : ""}
          onClick={() => {
            setTab("add-product");
            clearMessages();
          }}
        >
          Add Product
        </button>
        <button
          type="button"
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
      </nav>

      {statusMessage ? <p className="status ok">{statusMessage}</p> : null}
      {errorMessage ? <p className="status error">{errorMessage}</p> : null}

      {tab === "products" ? (
        <section className="card catalog-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2>Product Catalog</h2>
            </div>
            <div className="actions">
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setTab("add-product");
                  clearMessages();
                }}
              >
                Add Product
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => void loadProducts()}
              >
                Refresh
              </button>
            </div>
          </div>
          <p className="muted card-intro">
            Review inventory, edit listings, and remove outdated products.
          </p>
          {loadingProducts ? <p>Loading products...</p> : null}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Pricing</th>
                  <th>Stock</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <strong>{product.name}</strong>
                      <div className="muted">{product.brand}</div>
                    </td>
                    <td>
                      {product.categoryName}
                      <div className="muted">{product.categorySlug}</div>
                    </td>
                    <td>
                      <div>MRP: {product.mrpPrice}</div>
                      <div>Sale: {product.salePrice}</div>
                    </td>
                    <td>
                      <span
                        className={
                          product.stock <= 5 ? "stock-pill low" : "stock-pill"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td>{(product.imageKeys || []).length}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => editProduct(product)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => void deleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loadingProducts && products.length === 0 ? (
              <p>No products found.</p>
            ) : null}
          </div>
        </section>
      ) : tab === "add-product" ? (
        <section className="add-product-layout">
          <article className="card form-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Product creation</p>
                <h2>
                  {isEditing ? `Edit Product #${editingId}` : "Add Product"}
                </h2>
              </div>
              {isEditing ? (
                <button type="button" className="secondary" onClick={resetForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
            <form className="product-form" onSubmit={submitProduct}>
              <div className="row-2">
                <label>
                  Brand
                  <input
                    value={form.brand}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, brand: e.target.value }))
                    }
                    required
                  />
                </label>
                <label>
                  Product Name
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </label>
              </div>
              <div className="row-2">
                <label>
                  Category Name
                  <input
                    value={form.categoryName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        categoryName: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label>
                  Category Slug
                  <input
                    value={form.categorySlug}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        categorySlug: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>
              <label>
                Description
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  required
                />
              </label>
              <div className="upload-panel">
                <div className="upload-panel-copy">
                  <strong>Product Images</strong>
                  <span className="muted">
                    Add comma-separated image URLs or static image keys.
                  </span>
                </div>
              </div>
              <label>
                Image Keys / URLs
                <textarea
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  rows={2}
                  placeholder="https://example.com/image.jpg, products/item-1"
                  required
                />
              </label>
              <label>
                Specifications (one per line: key: value)
                <textarea
                  value={specText}
                  onChange={(e) => setSpecText(e.target.value)}
                  rows={5}
                  placeholder="Color: Blue&#10;RAM: 8 GB"
                />
              </label>
              <div className="row-3">
                <label>
                  MRP
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.mrpPrice}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        mrpPrice: Number(e.target.value || 0),
                      }))
                    }
                    required
                  />
                </label>
                <label>
                  Sale Price
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.salePrice}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        salePrice: Number(e.target.value || 0),
                      }))
                    }
                    required
                  />
                </label>
                <label>
                  Stock
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        stock: Number(e.target.value || 0),
                      }))
                    }
                    required
                  />
                </label>
              </div>
              <div className="row-4">
                <label>
                  Rating
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        rating: Number(e.target.value || 0),
                      }))
                    }
                  />
                </label>
                <label>
                  Rating Count
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.ratingCount}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        ratingCount: Number(e.target.value || 0),
                      }))
                    }
                  />
                </label>
                <label>
                  Badge
                  <input
                    value={form.badge}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, badge: e.target.value }))
                    }
                    placeholder="Best Seller"
                  />
                </label>
                <label>
                  Badge Type
                  <input
                    value={form.badgeType}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        badgeType: e.target.value,
                      }))
                    }
                    placeholder="highlight"
                  />
                </label>
              </div>
              <div className="actions form-actions">
                <button type="submit" disabled={savingProduct}>
                  {savingProduct
                    ? "Saving..."
                    : isEditing
                      ? "Update Product"
                      : "Create Product"}
                </button>
                {!isEditing ? (
                  <button
                    type="button"
                    className="secondary"
                    onClick={resetForm}
                  >
                    Reset Form
                  </button>
                ) : null}
              </div>
            </form>
          </article>

          <article className="card help-card">
            <p className="eyebrow">Quick guide</p>
            <h2>Product setup workflow</h2>
            <ul className="help-list">
              <li>Fill product basics first, then add category and pricing.</li>
              <li>Use image URLs or keys separated by commas.</li>
              <li>Use one specification per line in the format key: value.</li>
              <li>
                Editing a product opens this tab with the current values loaded.
              </li>
            </ul>
          </article>
        </section>
      ) : (
        <section className="card">
          <div className="card-header">
            <h2>Customer Orders</h2>
            <button
              type="button"
              className="secondary"
              onClick={() => void loadOrders()}
            >
              Refresh
            </button>
          </div>
          {loadingOrders ? <p>Loading orders...</p> : null}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Tracking Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                      <div className="muted">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                      <div className="muted">Items: {order.itemCount}</div>
                    </td>
                    <td>
                      <div>{order.customer.fullName}</div>
                      <div className="muted">{order.customer.phone}</div>
                      <div className="muted">{order.customer.email}</div>
                    </td>
                    <td>
                      <div>{order.paymentMethod}</div>
                      <div className="muted">{order.paymentStatus}</div>
                    </td>
                    <td>{order.total}</td>
                    <td>{order.status}</td>
                    <td>
                      <div className="status-controls">
                        <select
                          defaultValue={order.status}
                          onChange={(e) =>
                            void updateOrder(
                              order.id,
                              e.target.value,
                              order.paymentStatus,
                            )
                          }
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <select
                          defaultValue={order.paymentStatus}
                          onChange={(e) =>
                            void updateOrder(
                              order.id,
                              order.status,
                              e.target.value,
                            )
                          }
                        >
                          {paymentStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loadingOrders && orders.length === 0 ? (
              <p>No orders found.</p>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
