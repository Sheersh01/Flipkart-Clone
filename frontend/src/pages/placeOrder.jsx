import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductNavHeader from "../components/ProductNavHeader";
import BottomFooter from "../components/BottomFooter";
import { cartAssets } from "../features/cart";
import { getCheckoutSummary, updateCartItemQuantity } from "../lib/apiClient";
import { resolveProductImage } from "../lib/productImageMap";
import "./placeOrder.css";

const ADDRESS_STORAGE_KEY = "checkoutAddress";

function PlaceOrderPage() {
  const navigate = useNavigate();
  const { assuredBadge, wowBadge, safeSecure } = cartAssets;

  const [checkout, setCheckout] = useState({
    items: [],
    summary: null,
    shippingAddress: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    addressLine: "",
    city: "",
    state: "",
    label: "HOME",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadCheckout() {
      try {
        setLoading(true);
        const data = await getCheckoutSummary();

        if (!isMounted) return;

        setCheckout(data);
        setError("");

        const cachedAddressRaw = localStorage.getItem(ADDRESS_STORAGE_KEY);
        const cachedAddress = cachedAddressRaw
          ? JSON.parse(cachedAddressRaw)
          : null;
        const nextAddress = cachedAddress || data.shippingAddress || form;
        setForm(nextAddress);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load checkout");
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
        savings: 0,
      },
    [checkout.summary],
  );

  async function handleQtyChange(itemId, quantity) {
    try {
      const data = await updateCartItemQuantity(itemId, quantity);
      setCheckout((prev) => ({ ...prev, ...data }));
    } catch (err) {
      alert(err.message || "Unable to update quantity");
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleContinueToPayment() {
    if (!form.fullName || !form.phone || !form.pincode || !form.addressLine) {
      alert("Please complete shipping address details");
      return;
    }

    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(form));
    navigate("/payment");
  }

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
                <span className="stepper-circle">1</span>
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
                    {form.fullName || "Default User"}
                    <span className="place-order-home-chip">
                      {form.label || "HOME"}
                    </span>
                  </p>
                </div>
                <Link to="/cart" className="place-order-change-btn">
                  Change
                </Link>
              </div>

              <div className="place-order-address-form-grid">
                <input
                  className="place-order-address-input"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
                <input
                  className="place-order-address-input"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                />
                <input
                  className="place-order-address-input"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                />
                <input
                  className="place-order-address-input"
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  placeholder="City"
                />
                <input
                  className="place-order-address-input"
                  name="state"
                  value={form.state}
                  onChange={handleInputChange}
                  placeholder="State"
                />
                <input
                  className="place-order-address-input"
                  name="label"
                  value={form.label}
                  onChange={handleInputChange}
                  placeholder="Label (HOME/OFFICE)"
                />
              </div>

              <input
                className="place-order-address-input place-order-address-input--full"
                name="addressLine"
                value={form.addressLine}
                onChange={handleInputChange}
                placeholder="Address Line"
              />

              <p className="place-order-address-text">
                {form.addressLine} {form.city} {form.state} {form.pincode}
              </p>
              <p className="place-order-phone">{form.phone}</p>
            </div>

            {loading && (
              <article
                className="card-surface place-order-item-card"
                style={{ padding: 16 }}
              >
                Loading order summary...
              </article>
            )}
            {error && (
              <article
                className="card-surface place-order-item-card"
                style={{ padding: 16, color: "#b91c1c" }}
              >
                {error}
              </article>
            )}

            {!loading && !error && checkout.items.length === 0 && (
              <article
                className="card-surface place-order-item-card"
                style={{ padding: 16 }}
              >
                <h1 className="place-order-item-title">No item in cart</h1>
                <p className="place-order-item-pack">
                  Go back and add products first.
                </p>
                <Link
                  to="/"
                  className="place-order-change-btn"
                  style={{ display: "inline-block", marginTop: 12 }}
                >
                  Continue Shopping
                </Link>
              </article>
            )}

            {!loading &&
              !error &&
              checkout.items.map((item) => {
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
                  <article
                    className="card-surface place-order-item-card"
                    key={item.id}
                  >
                    <div className="place-order-item-content">
                      <div className="place-order-item-media-col">
                        <Link
                          to={`/products/${item.productId}`}
                          className="place-order-item-thumb-link"
                          aria-label={`Open ${item.name}`}
                        >
                          <img
                            src={resolveProductImage(item.imageKey)}
                            alt={item.name}
                            className="place-order-item-thumb"
                          />
                        </Link>
                        <label
                          className="place-order-qty-field"
                          aria-label="Quantity"
                        >
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

                      <div className="place-order-item-info">
                        <h1 className="place-order-item-title">{item.name}</h1>
                        <p className="place-order-item-pack">
                          Brand: {item.brand}
                        </p>
                        <p className="place-order-item-rating">
                          Rating{" "}
                          <span className="place-order-rating-score">
                            {item.rating}
                          </span>
                          <span className="place-order-rating-count">
                            ({item.ratingCount})
                          </span>
                          <img
                            src={assuredBadge}
                            alt="Assured"
                            className="place-order-assured"
                          />
                        </p>
                        <p className="place-order-item-price">
                          <span className="place-order-discount">
                            -{discountPercent}%
                          </span>
                          <span className="place-order-strike">
                            Rs.{item.mrpPrice}
                          </span>
                          <strong>Rs.{item.salePrice}</strong>
                        </p>
                        <p className="place-order-wow">
                          <img src={wowBadge} alt="Wow" /> Buy at Rs.
                          {Math.max(item.salePrice - 50, 1)}
                        </p>
                        <p className="place-order-coins">
                          Line total: Rs.{item.lineTotal}
                        </p>
                      </div>
                    </div>

                    <div className="place-order-delivery">
                      Delivery by Apr 23, Thu
                    </div>
                  </article>
                );
              })}

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
                <strong>Rs.{summary.subtotal + summary.discount}</strong>
              </div>
              <div className="place-order-summary-row">
                <span>Fees</span>
                <strong>Rs.{summary.platformFee}</strong>
              </div>
              <div className="place-order-summary-row place-order-summary-row--discount">
                <span>Discounts</span>
                <strong>-Rs.{summary.discount}</strong>
              </div>
              <div className="place-order-summary-row place-order-summary-row--total">
                <span>Total Amount</span>
                <strong>Rs.{summary.total}</strong>
              </div>
              <p className="place-order-save-banner">
                You'll save Rs.{summary.savings} on this order!
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
                <span className="place-order-old-price">
                  {summary.subtotal + summary.discount}
                </span>
                <div className="place-order-current-price">
                  <strong>{summary.total}</strong>
                  <span className="place-order-info-icon" aria-hidden="true">
                    i
                  </span>
                </div>
              </div>
              <button
                className="place-order-continue-btn"
                onClick={handleContinueToPayment}
              >
                Continue
              </button>
            </div>
          </aside>
        </div>
      </main>

      <BottomFooter />
    </div>
  );
}

export default PlaceOrderPage;
