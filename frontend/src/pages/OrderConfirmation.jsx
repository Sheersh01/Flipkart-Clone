import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductNavHeader from "../components/ProductNavHeader";
import BottomFooter from "../components/BottomFooter";
import { getOrder } from "../lib/apiClient";
import { resolveProductImage } from "../lib/productImageMap";
import "./orderConfirmation.css";

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      try {
        setLoading(true);
        const data = await getOrder(orderId);
        if (isMounted) {
          setOrder(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load order");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  return (
    <div className="order-confirmation-page">
      <ProductNavHeader />

      <main className="order-confirmation-main">
        <div className="container order-confirmation-wrap">
          <div className="order-confirmation-card">
            <h1>Order Confirmed</h1>
            {loading && <p>Loading order details...</p>}
            {error && <p className="order-confirmation-error">{error}</p>}

            {order && (
              <>
                <p className="order-confirmation-id">Order ID: #{order.id}</p>
                <p className="order-confirmation-text">
                  Payment Method: {order.paymentMethod}
                </p>
                <p className="order-confirmation-text">
                  Payment Status: {order.paymentStatus}
                </p>
                <p className="order-confirmation-total">
                  Total Paid: Rs.{order.summary.total}
                </p>

                <div className="order-confirmation-items">
                  {order.items.map((item) => (
                    <div className="order-confirmation-item" key={item.id}>
                      <Link
                        to={`/products/${item.productId}`}
                        className="order-confirmation-item-link"
                        aria-label={`Open ${item.name}`}
                      >
                        <img
                          src={resolveProductImage(item.imageKey)}
                          alt={item.name}
                        />
                      </Link>
                      <div>
                        <p>{item.name}</p>
                        <p>
                          Qty: {item.quantity} | Rs.{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="order-confirmation-actions">
              <Link to="/" className="order-confirmation-btn">
                Continue Shopping
              </Link>
              <Link
                to="/cart"
                className="order-confirmation-btn order-confirmation-btn--light"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </main>

      <BottomFooter />
    </div>
  );
}

export default OrderConfirmationPage;
