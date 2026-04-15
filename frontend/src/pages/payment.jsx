import { Link } from "react-router-dom";
import flipkartWordmark from "../assets/payment/flipkart.png";
import razorpayIcon from "../assets/payment/razorpay.svg";
import stripeIcon from "../assets/payment/stripe.svg";
import codIcon from "../assets/payment/cod.svg";
import axisLogo from "../assets/payment/Axis.png";
import sbiLogo from "../assets/payment/SBI.png";
import BottomFooter from "../components/BottomFooter";
import "./payment.css";

const paymentMethods = [
  {
    title: "Razorpay",
    subtitle: "Fast checkout using cards, UPI and wallet",
    extra: "Get up to 5% cashback • 2 offers available",
    icon: razorpayIcon,
    active: true,
  },
  {
    title: "Stripe",
    subtitle: "Pay securely with international card support",
    extra: "Secure global payment gateway",
    icon: stripeIcon,
  },
  {
    title: "Cash on Delivery",
    subtitle: "Pay when your order is delivered",
    extra: "Available for selected pin codes",
    icon: codIcon,
  },
];

function PaymentPage() {
  return (
    <div className="payment-page">
      <header className="payment-topbar">
        <div className="payment-topbar-inner">
          <img
            src={flipkartWordmark}
            alt="Flipkart"
            className="payment-topbar-logo"
          />
        </div>
      </header>

      <main className="payment-main">
        <div className="container payment-layout">
          <section className="payment-left" aria-label="Payment methods">
            <div className="payment-card payment-page-header">
              <div className="payment-page-title">
                <Link
                  to="/place-order"
                  className="payment-back-btn"
                  aria-label="Go back to order summary"
                >
                  ←
                </Link>
                <span>Complete Payment</span>
              </div>
              <div className="payment-secure-pill">🔒 100% Secure</div>
            </div>

            <div className="payment-card payment-left-panel">
              <div className="payment-method-list">
                {paymentMethods.map((method, index) => (
                  <div
                    key={method.title}
                    className={`payment-method-item${method.active ? " payment-method-item--active" : ""}`}
                  >
                    <div className="payment-method-icon">
                      <img src={method.icon} alt={`${method.title} icon`} />
                    </div>
                    <div className="payment-method-text">
                      <p className="payment-method-title">{method.title}</p>
                      <p className="payment-method-subtitle">
                        {method.subtitle}
                      </p>
                      <p
                        className="payment-method-subtitle"
                        style={{ color: method.active ? "#1e9c4e" : "#6b7280" }}
                      >
                        {method.extra}
                      </p>
                    </div>
                    {index > 0 && (
                      <div className="payment-method-unavailable">
                        <span>Unavailable</span>
                        <span className="payment-method-unavailable-icon">
                          ?
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="payment-card-panel">
                <p className="payment-note">
                  Note: Please ensure your card can be used for online
                  transactions. <a href="#">Learn More</a>
                </p>

                <div className="payment-form-card">
                  <div className="payment-field-block">
                    <label className="payment-form-label" htmlFor="card-number">
                      Card Number
                    </label>
                    <input
                      id="card-number"
                      className="payment-input payment-input--error"
                      defaultValue=""
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                    <p className="payment-error-text">
                      Card number is required
                    </p>
                  </div>

                  <div className="payment-row">
                    <div className="payment-field-block">
                      <label
                        className="payment-form-label"
                        htmlFor="valid-thru"
                      >
                        Valid Thru
                      </label>
                      <input
                        id="valid-thru"
                        className="payment-small-input"
                        placeholder="MM / YY"
                      />
                    </div>
                    <div className="payment-field-block payment-cvv-wrap">
                      <label className="payment-form-label" htmlFor="cvv">
                        CVV
                      </label>
                      <input
                        id="cvv"
                        className="payment-small-input"
                        placeholder="CVV"
                      />
                      <span className="payment-cvv-help">?</span>
                    </div>
                  </div>

                  <button type="button" className="payment-submit-btn">
                    Pay ₹508
                  </button>
                </div>
              </div>
            </div>

            <div className="payment-footer">
              <div className="payment-footer-row">
                <div className="payment-footer-links">
                  Policies: <a href="#">Returns Policy</a> |{" "}
                  <a href="#">Terms of use</a> | <a href="#">Security</a> |{" "}
                  <a href="#">Privacy</a>
                </div>
                <div>© 2007-2026 Flipkart.com</div>
                <div>
                  Need help? Visit the <a href="#">Help Center</a> or{" "}
                  <a href="#">Contact Us</a>
                </div>
              </div>
            </div>
          </section>

          <aside className="payment-right" aria-label="Order summary">
            <div className="payment-right-summary">
              <div className="payment-summary-row">
                <span>MRP (incl. of all taxes)</span>
                <strong>₹600</strong>
              </div>
              <div className="payment-summary-row">
                <span>Fees</span>
                <strong>₹7</strong>
              </div>
              <div className="payment-summary-row">
                <span>Platform Fee</span>
                <strong>₹7</strong>
              </div>
              <div className="payment-summary-row">
                <span>Discounts</span>
                <strong>-₹99</strong>
              </div>
              <div className="payment-summary-row">
                <span>MRP Discount</span>
                <strong>-₹66</strong>
              </div>
              <div className="payment-summary-row">
                <span>Coupons for you</span>
                <strong>-₹33</strong>
              </div>
              <div className="payment-summary-row payment-summary-row--final">
                <span>Total Amount</span>
                <strong>₹508</strong>
              </div>
            </div>

            <div className="payment-offer-card">
              <div>
                <div className="payment-offer-text">5% Cashback</div>
                <div className="payment-offer-subtext">
                  Claim now with payment offers
                </div>
              </div>
              <div className="payment-offer-badges">
                <span className="payment-offer-badge">
                  <img src={axisLogo} alt="Axis Bank" />
                </span>
                <span className="payment-offer-badge">
                  <img src={sbiLogo} alt="SBI Card" />
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BottomFooter />
    </div>
  );
}

export default PaymentPage;
