import { useEffect, useMemo, useState } from "react";
import ProductNavHeader from "../components/ProductNavHeader";
import BottomFooter from "../components/BottomFooter";
import { Link } from "react-router-dom";
import { cartAssets } from "../features/cart";
import {
  addCartItem,
  getCart,
  getProducts,
  removeCartItem,
  updateCartItemQuantity,
} from "../lib/apiClient";
import { resolveProductImage } from "../lib/productImageMap";
import { useAppContext } from "../context/AppContext";
import "./cart.css";

function ProductRailSection({ title, subtitle, items, assuredBadge, onAdd }) {
  return (
    <section className="cart-rail-section">
      <h2 className="cart-rail-title">{title}</h2>
      {subtitle && <p className="cart-rail-subtitle">{subtitle}</p>}
      <div className="cart-rail-grid">
        {items.map((item, index) => (
          <article className="cart-rail-card" key={`${title}-${index}`}>
            <Link
              to={`/products/${item.productId || 1}`}
              className="cart-rail-thumb-link"
              aria-label={`Open ${item.title}`}
            >
              <div className="cart-rail-thumb-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-rail-thumb"
                />
              </div>
            </Link>
            <Link
              to={`/products/${item.productId || 1}`}
              className="cart-rail-name-link"
              aria-label={`Open ${item.title}`}
            >
              <p className="cart-rail-name">{item.title}</p>
            </Link>
            <p className="cart-rail-price">
              Rs.{item.price} <span>Rs.{item.strike}</span>
            </p>
            <p className="cart-rail-offer">
              {item.off}
              {item.assured && (
                <img
                  src={assuredBadge}
                  alt="Assured"
                  className="cart-assured-inline"
                />
              )}
            </p>
            <button
              type="button"
              className="cart-add-btn"
              onClick={() => onAdd?.(item.productId)}
            >
              Add to cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function CartPage() {
  const { isAuthenticated } = useAppContext();
  const {
    cartAd,
    assuredBadge,
    wowBadge,
    safeSecure,
    saveForLaterIcon,
    removeIcon,
    buyThisNowIcon,
  } = cartAssets;

  const [cart, setCart] = useState({ items: [], summary: null });
  const [recommendationItems, setRecommendationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCart() {
      try {
        setLoading(true);
        const [data, recommendations] = await Promise.all([
          getCart(),
          getProducts({ limit: 18 }),
        ]);
        if (isMounted) {
          setCart(data);
          setRecommendationItems(
            (recommendations.items || []).map((product) => {
              const discountPercent = product.mrpPrice
                ? Math.max(
                    Math.round(
                      ((product.mrpPrice - product.salePrice) /
                        product.mrpPrice) *
                        100,
                    ),
                    0,
                  )
                : 0;

              return {
                title: `${product.brand} ${product.name}`,
                price: String(product.salePrice),
                strike: String(product.mrpPrice),
                off: `${discountPercent}% off`,
                image: product.imageKey,
                productId: product.id,
              };
            }),
          );
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load cart");
          setRecommendationItems([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(
    () =>
      cart.summary || {
        subtotal: 0,
        discount: 0,
        platformFee: 0,
        total: 0,
        savings: 0,
      },
    [cart.summary],
  );

  const suggestedForYou = recommendationItems.slice(0, 6);
  const itemsMissed = recommendationItems.slice(6, 12);
  const recentlyViewed = recommendationItems.slice(12, 18);

  async function handleQtyChange(itemId, quantity) {
    try {
      const data = await updateCartItemQuantity(itemId, quantity);
      setCart(data);
    } catch (err) {
      alert(err.message || "Unable to update quantity");
    }
  }

  async function handleRemove(itemId) {
    try {
      const data = await removeCartItem(itemId);
      setCart(data);
    } catch (err) {
      alert(err.message || "Unable to remove item");
    }
  }

  async function handleQuickAdd(productId) {
    if (!isAuthenticated) {
      alert("Please log in to add items to cart");
      return;
    }

    const normalizedProductId = Number(productId);
    if (!Number.isInteger(normalizedProductId) || normalizedProductId <= 0) {
      alert("This item is unavailable for quick add");
      return;
    }

    try {
      const data = await addCartItem(normalizedProductId, 1);
      setCart(data);
      alert("Added to cart");
    } catch (err) {
      alert(err.message || "Unable to add item");
    }
  }

  return (
    <div className="cart-page">
      <ProductNavHeader />

      <main className="cart-main">
        <div className="container cart-layout">
          <section
            className="cart-left-scroll"
            aria-label="Cart items and recommendations"
          >
            <div className="cart-card cart-address-card">
              <div>
                <p className="cart-deliver-title">
                  Deliver to: Sheersh Saxena, 441108
                </p>
                <p className="cart-deliver-subtitle">
                  IIT NAGPUR, Near IIITN Main Gate, Nagpur
                </p>
              </div>
              <div className="cart-home-chip">HOME</div>
              <button type="button" className="cart-change-btn">
                Change
              </button>
            </div>

            {loading && (
              <div className="cart-card cart-item-card" style={{ padding: 16 }}>
                Loading cart...
              </div>
            )}
            {error && (
              <div
                className="cart-card cart-item-card"
                style={{ padding: 16, color: "#b91c1c" }}
              >
                {error}
              </div>
            )}

            {!loading && !error && cart.items.length === 0 && (
              <article
                className="cart-card cart-item-card"
                style={{ padding: 16 }}
              >
                <h1 className="cart-item-title">Your cart is empty</h1>
                <p className="cart-item-pack">
                  Add products to continue checkout.
                </p>
                <Link
                  to="/"
                  className="cart-place-btn"
                  style={{ marginTop: 10, display: "inline-flex" }}
                >
                  Continue Shopping
                </Link>
              </article>
            )}

            {!loading &&
              !error &&
              cart.items.map((item) => {
                const discountPercent = item.mrpPrice
                  ? Math.max(
                      Math.round(
                        ((item.mrpPrice - item.salePrice) / item.mrpPrice) *
                          100,
                      ),
                      0,
                    )
                  : 0;

                return (
                  <article className="cart-card cart-item-card" key={item.id}>
                    <div className="cart-item-content">
                      <div className="cart-item-media-col">
                        <Link
                          to={`/products/${item.productId}`}
                          className="cart-item-thumb-link"
                          aria-label={`Open ${item.name}`}
                        >
                          <img
                            src={resolveProductImage(item.imageKey)}
                            alt={item.name}
                            className="cart-item-thumb"
                          />
                        </Link>
                        <label className="cart-qty-field" aria-label="Quantity">
                          <span>Qty:</span>
                          <select
                            value={item.quantity}
                            onChange={(event) =>
                              handleQtyChange(
                                item.id,
                                Number(event.target.value),
                              )
                            }
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </label>
                      </div>
                      <div className="cart-item-info">
                        <h1 className="cart-item-title">{item.name}</h1>
                        <p className="cart-item-pack">Brand: {item.brand}</p>
                        <p className="cart-item-rating">
                          Rating {item.rating} ({item.ratingCount})
                          <img
                            src={assuredBadge}
                            alt="Assured"
                            className="cart-assured-badge"
                          />
                        </p>
                        <p className="cart-item-price">
                          <span className="cart-item-discount">
                            -{discountPercent}%
                          </span>
                          <span className="cart-item-strike">
                            Rs.{item.mrpPrice}
                          </span>
                          <strong>Rs.{item.salePrice}</strong>
                        </p>
                        <p className="cart-item-wow">
                          <img src={wowBadge} alt="Wow" /> Buy at Rs.
                          {Math.max(item.salePrice - 50, 1)}
                        </p>
                        <p className="cart-item-coins">
                          Line total: Rs.{item.lineTotal}
                        </p>
                      </div>
                    </div>

                    <div className="cart-delivery-line">
                      Delivery by Apr 23, Thu
                    </div>

                    <div className="cart-item-actions">
                      <button type="button">
                        <img src={saveForLaterIcon} alt="" aria-hidden="true" />
                        <span>Save for later</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                      >
                        <img src={removeIcon} alt="" aria-hidden="true" />
                        <span>Remove</span>
                      </button>
                      <button type="button">
                        <img src={buyThisNowIcon} alt="" aria-hidden="true" />
                        <span>Buy this now</span>
                      </button>
                    </div>
                  </article>
                );
              })}

            <div className="cart-card cart-ad-wrap">
              <img
                src={cartAd}
                alt="Cart promotional offer"
                className="cart-ad-image"
              />
            </div>

            <ProductRailSection
              title="Suggested for You"
              subtitle="Based on Your Activity"
              items={suggestedForYou}
              assuredBadge={assuredBadge}
              onAdd={handleQuickAdd}
            />

            <ProductRailSection
              title="Items you may have missed"
              items={itemsMissed}
              assuredBadge={assuredBadge}
              onAdd={handleQuickAdd}
            />

            <ProductRailSection
              title="Recently Viewed"
              items={recentlyViewed}
              assuredBadge={assuredBadge}
              onAdd={handleQuickAdd}
            />
          </section>

          <aside className="cart-right-sticky" aria-label="Price details">
            <div className="cart-card cart-summary-card">
              <div className="cart-summary-row">
                <span>MRP</span>
                <strong>Rs.{summary.subtotal + summary.discount}</strong>
              </div>
              <div className="cart-summary-row">
                <span>Fees</span>
                <strong>Rs.{summary.platformFee}</strong>
              </div>
              <div className="cart-summary-row cart-summary-row--discount">
                <span>Discounts</span>
                <strong>-Rs.{summary.discount}</strong>
              </div>
              <div className="cart-summary-row cart-summary-row--total">
                <span>Total Amount</span>
                <strong>Rs.{summary.total}</strong>
              </div>
              <p className="cart-save-banner">
                You'll save Rs.{summary.savings} on this order!
              </p>
            </div>

            <div className="cart-safe-note">
              <img
                src={safeSecure}
                alt="Safe and secure"
                className="cart-safe-icon"
              />
              <p className="cart-safe-text">
                Safe and secure payments. Easy returns. 100% Authentic products.
              </p>
            </div>

            <div className="cart-card cart-order-card">
              <div className="cart-order-prices">
                <span className="cart-order-strike">
                  {summary.subtotal + summary.discount}
                </span>
                <div className="cart-order-current">
                  <strong>{summary.total}</strong>
                  <span className="cart-info-icon" aria-hidden="true">
                    i
                  </span>
                </div>
              </div>
              <Link to="/place-order" className="cart-place-btn">
                Place Order
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <BottomFooter />
    </div>
  );
}

export default CartPage;
