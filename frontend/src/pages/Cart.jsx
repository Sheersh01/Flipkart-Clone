import ProductNavHeader from "../components/ProductNavHeader";
import BottomFooter from "../components/BottomFooter";
import { Link } from "react-router-dom";
import { cartAssets, cartContent } from "../features/cart";
import "./cart.css";

function ProductRailSection({ title, subtitle, items, assuredBadge }) {
  return (
    <section className="cart-rail-section">
      <h2 className="cart-rail-title">{title}</h2>
      {subtitle && <p className="cart-rail-subtitle">{subtitle}</p>}
      <div className="cart-rail-grid">
        {items.map((item, index) => (
          <article className="cart-rail-card" key={`${title}-${index}`}>
            <div className="cart-rail-thumb-wrap">
              <img
                src={item.image}
                alt={item.title}
                className="cart-rail-thumb"
              />
            </div>
            <p className="cart-rail-name">{item.title}</p>
            <p className="cart-rail-price">
              ₹{item.price} <span>₹{item.strike}</span>
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
            <button type="button" className="cart-add-btn">
              Add to cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function CartPage() {
  const {
    cartAd,
    assuredBadge,
    wowBadge,
    cartProductImage,
    safeSecure,
    saveForLaterIcon,
    removeIcon,
    buyThisNowIcon,
  } = cartAssets;

  const { suggestedForYou, itemsMissed, recentlyViewed } = cartContent;

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

            <article className="cart-card cart-item-card">
              <div className="cart-item-content">
                <div className="cart-item-media-col">
                  <img
                    src={cartProductImage}
                    alt="Ordered product"
                    className="cart-item-thumb"
                  />
                  <label className="cart-qty-field" aria-label="Quantity">
                    <span>Qty:</span>
                    <select defaultValue="2">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </label>
                </div>
                <div className="cart-item-info">
                  <h1 className="cart-item-title">
                    DM Eco medical glove-556 Rubber, Nitrile, Latex Surgical
                    Gloves Latex Examin...
                  </h1>
                  <p className="cart-item-pack">Pack of 50</p>
                  <p className="cart-item-rating">
                    ★★★★☆ 4.1 (101)
                    <img
                      src={assuredBadge}
                      alt="Assured"
                      className="cart-assured-badge"
                    />
                  </p>
                  <p className="cart-item-price">
                    <span className="cart-item-discount">↓16%</span>
                    <span className="cart-item-strike">₹600</span>
                    <strong>₹501</strong>
                  </p>
                  <p className="cart-item-wow">
                    <img src={wowBadge} alt="Wow" /> Buy at ₹451
                  </p>
                  <p className="cart-item-coins">Or Pay ₹475 + 26</p>
                </div>
              </div>

              <div className="cart-delivery-line">Delivery by Apr 23, Thu</div>

              <div className="cart-item-actions">
                <button type="button">
                  <img src={saveForLaterIcon} alt="" aria-hidden="true" />
                  <span>Save for later</span>
                </button>
                <button type="button">
                  <img src={removeIcon} alt="" aria-hidden="true" />
                  <span>Remove</span>
                </button>
                <button type="button">
                  <img src={buyThisNowIcon} alt="" aria-hidden="true" />
                  <span>Buy this now</span>
                </button>
              </div>
            </article>

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
            />

            <ProductRailSection
              title="Items you may have missed"
              items={itemsMissed}
              assuredBadge={assuredBadge}
            />

            <ProductRailSection
              title="Recently Viewed"
              items={recentlyViewed}
              assuredBadge={assuredBadge}
            />
          </section>

          <aside className="cart-right-sticky" aria-label="Price details">
            <div className="cart-card cart-summary-card">
              <div className="cart-summary-row">
                <span>MRP</span>
                <strong>₹600</strong>
              </div>
              <div className="cart-summary-row">
                <span>Fees ▾</span>
                <strong>₹7</strong>
              </div>
              <div className="cart-summary-row cart-summary-row--discount">
                <span>Discounts ▾</span>
                <strong>-₹99</strong>
              </div>
              <div className="cart-summary-row cart-summary-row--total">
                <span>Total Amount</span>
                <strong>₹508</strong>
              </div>
              <p className="cart-save-banner">You'll save ₹92 on this order!</p>
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
                <span className="cart-order-strike">600</span>
                <div className="cart-order-current">
                  <strong>508</strong>
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
