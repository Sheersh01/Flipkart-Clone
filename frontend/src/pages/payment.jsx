import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import codIcon from "../assets/payment/cod.svg";
import cardIcon from "../assets/payment/flipkart.png";
import axisLogo from "../assets/payment/Axis.png";
import sbiLogo from "../assets/payment/SBI.png";
import SearchNav from "../components/SearchNav";
import BottomFooter from "../components/BottomFooter";
import { createOrder, getCheckoutSummary, payOrder } from "../lib/apiClient";
import "./payment.css";

const ADDRESS_STORAGE_KEY = "checkoutAddress";

const paymentMethods = [
  {
    key: "card",
    title: "Card / UPI",
    subtitle: "Pay instantly using card or UPI",
    extra: "Secure checkout",
    icon: cardIcon,
  },
  {
    key: "cash_on_delivery",
    title: "Cash on Delivery",
    subtitle: "Pay when your order is delivered",
    extra: "Available for selected pin codes",
    icon: codIcon,
  },
];

function PaymentPage() {
  const navigate = useNavigate();

  const [activeMethodKey, setActiveMethodKey] = useState("card");
  const [checkout, setCheckout] = useState({ items: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCheckout() {
      try {
        setLoading(true);
        const data = await getCheckoutSummary();
        if (isMounted) {
          setCheckout(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load checkout data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCheckout();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(
    () =>
      checkout.summary || {
        subtotal: 0,
        discount: 0,
        platformFee: 0,
        total: 0,
      },
    [checkout.summary],
  );

  async function handlePay() {
    try {
      if (!checkout.items.length) {
        alert("Cart is empty. Add products before payment.");
        return;
      }

      setIsSubmitting(true);

      const cachedAddressRaw = localStorage.getItem(ADDRESS_STORAGE_KEY);
      const cachedAddress = cachedAddressRaw
        ? JSON.parse(cachedAddressRaw)
        : null;

      const shippingAddress = cachedAddress ||
        checkout.shippingAddress || {
          fullName: "Sheersh Saxena",
          phone: "7458902737",
          pincode: "441108",
          addressLine: "IIT NAGPUR, Near IIITN Main Gate",
          city: "Nagpur",
          state: "Maharashtra",
          label: "HOME",
        };

      const order = await createOrder({
        shippingAddress,
        paymentMethod: activeMethodKey,
      });

      await payOrder({ orderId: order.orderId, method: activeMethodKey });

      navigate(`/order-confirmation/${order.orderId}`);
    } catch (err) {
      alert(err.message || "Payment failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="payment-page">
      <SearchNav showActions showBrandButton />

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
                  {"<"}
                </Link>
                <span>Complete Payment</span>
              </div>
              <div className="payment-secure-pill">100% Secure</div>
            </div>

            <div className="payment-card payment-left-panel">
              <div className="payment-method-list">
                {paymentMethods.map((method) => {
                  const isActive = activeMethodKey === method.key;

                  return (
                    <button
                      key={method.title}
                      type="button"
                      className={`payment-method-item${isActive ? " payment-method-item--active" : ""}`}
                      onClick={() => setActiveMethodKey(method.key)}
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
                          style={{ color: isActive ? "#1e9c4e" : "#6b7280" }}
                        >
                          {method.extra}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="payment-card-panel">
                <p className="payment-note">
                  Note: Please ensure your selected payment method is available.
                  <a href="#"> Learn More</a>
                </p>

                <div className="payment-form-card">
                  <div className="payment-field-block">
                    <label className="payment-form-label" htmlFor="card-number">
                      Card Number
                    </label>
                    <input
                      id="card-number"
                      className="payment-input"
                      defaultValue=""
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
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

                  <button
                    type="button"
                    className="payment-submit-btn"
                    disabled={isSubmitting || loading}
                    onClick={handlePay}
                  >
                    {isSubmitting ? "Processing..." : `Pay Rs.${summary.total}`}
                  </button>

                  {loading && (
                    <p className="payment-error-text">Loading summary...</p>
                  )}
                  {error && <p className="payment-error-text">{error}</p>}
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
                <div>(c) 2007-2026 Flipkart.com</div>
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
                <strong>Rs.{summary.subtotal + summary.discount}</strong>
              </div>
              <div className="payment-summary-row">
                <span>Fees</span>
                <strong>Rs.{summary.platformFee}</strong>
              </div>
              <div className="payment-summary-row">
                <span>Discounts</span>
                <strong>-Rs.{summary.discount}</strong>
              </div>
              <div className="payment-summary-row payment-summary-row--final">
                <span>Total Amount</span>
                <strong>Rs.{summary.total}</strong>
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
