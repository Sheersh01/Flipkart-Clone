import { Link } from "react-router-dom";
import ProductNavHeader from "../components/ProductNavHeader";
import BottomFooter from "../components/BottomFooter";
import { cartAssets } from "../features/cart";
import "./placeOrder.css";

function PlaceOrderPage() {
  const { assuredBadge, wowBadge, cartProductImage, safeSecure } = cartAssets;

  return (
    <div className="place-order-page">
      <ProductNavHeader />

      <main className="place-order-main">
        <div className="container place-order-layout">
          <section
            className="place-order-left"
            aria-label="Order steps and details"
          >
            <div className="place-order-stepper card-surface">
              <div className="stepper-item stepper-item--done">
                <span className="stepper-circle">✓</span>
                <span className="stepper-label">Address</span>
              </div>
              <div className="stepper-rail" />
              <div className="stepper-item stepper-item--active">
                <span className="stepper-circle">2</span>
                <span className="stepper-label stepper-label--active">
                  Order Summary
                </span>
              </div>
              <div className="stepper-rail" />
              <div className="stepper-item stepper-item--muted">
                <span className="stepper-circle stepper-circle--muted">3</span>
                <span className="stepper-label">Payment</span>
              </div>
            </div>

            <div className="card-surface place-order-address-card">
              <div className="place-order-address-top">
                <div>
                  <p className="place-order-label">Deliver to:</p>
                  <p className="place-order-name-line">
                    Sheersh Saxena{" "}
                    <span className="place-order-home-chip">HOME</span>
                  </p>
                </div>
                <Link to="/cart" className="place-order-change-btn">
                  Change
                </Link>
              </div>
              <p className="place-order-address-text">
                IIT NAGPUR, Near IIITN Main Gate, Nagpur 441108
              </p>
              <p className="place-order-phone">7458902737</p>
            </div>

            <article className="card-surface place-order-item-card">
              <div className="place-order-item-content">
                <div className="place-order-item-media-col">
                  <img
                    src={cartProductImage}
                    alt="Ordered product"
                    className="place-order-item-thumb"
                  />
                  <label
                    className="place-order-qty-field"
                    aria-label="Quantity"
                  >
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

                <div className="place-order-item-info">
                  <h1 className="place-order-item-title">
                    DM Eco medical glove-556 Rubber, Nitrile, Latex Surgical
                    Gloves Latex Examin...
                  </h1>
                  <p className="place-order-item-pack">Pack of 50</p>
                  <p className="place-order-item-rating">
                    ★★★★☆ <span className="place-order-rating-score">4.1</span>
                    <span className="place-order-rating-count">(101)</span>
                    <img
                      src={assuredBadge}
                      alt="Assured"
                      className="place-order-assured"
                    />
                  </p>
                  <p className="place-order-item-price">
                    <span className="place-order-discount">↓16%</span>
                    <span className="place-order-strike">₹600</span>
                    <strong>₹501</strong>
                  </p>
                  <p className="place-order-wow">
                    <img src={wowBadge} alt="Wow" /> Buy at ₹451
                  </p>
                  <p className="place-order-coins">Or Pay ₹475 + 26</p>
                </div>
              </div>

              <div className="place-order-delivery">
                Delivery by Apr 23, Thu
              </div>
            </article>

            <p className="place-order-terms">
              By continuing with the order, you confirm that you are above 18
              years of age, and you agree to the Flipkart's{" "}
              <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>
            </p>
          </section>

          <aside className="place-order-right" aria-label="Order summary">
            <div className="card-surface place-order-summary-card">
              <div className="place-order-summary-row">
                <span>MRP</span>
                <strong>₹600</strong>
              </div>
              <div className="place-order-summary-row">
                <span>Fees ▾</span>
                <strong>₹7</strong>
              </div>
              <div className="place-order-summary-row place-order-summary-row--discount">
                <span>Discounts ▾</span>
                <strong>-₹99</strong>
              </div>
              <div className="place-order-summary-row place-order-summary-row--total">
                <span>Total Amount</span>
                <strong>₹508</strong>
              </div>
              <p className="place-order-save-banner">
                You'll save ₹92 on this order!
              </p>
            </div>

            <div className="place-order-safe-note">
              <img
                src={safeSecure}
                alt="Safe and secure"
                className="place-order-safe-icon"
              />
              <p className="place-order-safe-text">
                Safe and secure payments. Easy returns. 100% Authentic products.
              </p>
            </div>

            <div className="card-surface place-order-action-bar">
              <div className="place-order-action-price">
                <span className="place-order-old-price">600</span>
                <div className="place-order-current-price">
                  <strong>508</strong>
                  <span className="place-order-info-icon" aria-hidden="true">
                    i
                  </span>
                </div>
              </div>
              <Link to="/payment" className="place-order-continue-btn">
                Continue
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <BottomFooter />
    </div>
  );
}

export default PlaceOrderPage;
