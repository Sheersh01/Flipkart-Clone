import "./ProductGrid.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, getProducts } from "../lib/apiClient";

function ProductGrid({
  showFilters = true,
  excludeProductId = null,
  initialSearch = "",
}) {
  const normalizedInitialSearch = String(initialSearch || "").trim();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(normalizedInitialSearch);
  const [activeSearch, setActiveSearch] = useState(normalizedInitialSearch);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchTerm(normalizedInitialSearch);
    setActiveSearch(normalizedInitialSearch);
  }, [normalizedInitialSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActiveSearch(searchTerm.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch {
        if (isMounted) {
          setCategories([]);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const data = await getProducts({
          search: activeSearch,
          category: selectedCategory,
          limit: 24,
        });

        if (!isMounted) {
          return;
        }

        const filteredItems = excludeProductId
          ? data.items.filter((item) => item.id !== Number(excludeProductId))
          : data.items;

        setProducts(filteredItems);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to fetch products");
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [activeSearch, selectedCategory, excludeProductId]);

  return (
    <section className="product-grid-section" id="product-grid">
      <div className="container">
        {showFilters && (
          <div className="product-grid-filters">
            <input
              type="text"
              className="product-grid-search"
              value={searchTerm}
              placeholder="Search by product or brand"
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search products by name"
            />
            <select
              className="product-grid-category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              aria-label="Filter products by category"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading && <p className="product-grid-meta">Loading products...</p>}
        {error && (
          <p className="product-grid-meta product-grid-meta--error">{error}</p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="product-grid-meta">No products found.</p>
        )}

        <div className="product-grid">
          {products.map((p) => (
            <Link
              to={`/products/${p.id}`}
              className="product-grid-card"
              key={p.id}
              id={`product-${p.id}`}
            >
              <div className="product-grid-img-wrap">
                <img
                  src={p.imageKey || ""}
                  alt={p.name}
                  className="product-grid-img"
                />
                {p.badge && (
                  <span
                    className={`product-grid-badge product-grid-badge--${p.badgeType}`}
                  >
                    {p.badge}
                  </span>
                )}
                {p.rating && (
                  <span className="product-grid-rating">
                    {p.rating} ★{" "}
                    <span className="product-grid-rating-count">
                      ({p.ratingCount || 0})
                    </span>
                  </span>
                )}
              </div>
              <div className="product-grid-info">
                <p className="product-grid-title">
                  <span className="product-grid-brand">{p.brand}</span> {p.name}
                </p>
                <div className="product-grid-prices">
                  <span className="product-grid-original">₹{p.mrpPrice}</span>
                  <span className="product-grid-sale">₹{p.salePrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductGrid;
