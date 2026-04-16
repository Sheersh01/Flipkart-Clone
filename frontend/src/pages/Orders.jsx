import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BottomFooter from "../components/BottomFooter";
import ProductNavHeader from "../components/ProductNavHeader";
import { getOrders } from "../lib/apiClient";
import "./orders.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        setLoading(true);
        const data = await getOrders({ page: 1, limit: 50 });
        if (isMounted) {
          setOrders(data.items || []);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load orders");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="orders-page">
      <ProductNavHeader />

      <main className="orders-main">
        <div className="container orders-wrap">
          <section className="orders-card" aria-label="Orders list">
            <h1>My Orders</h1>

            {loading ? <p>Loading orders...</p> : null}
            {error ? <p className="orders-error">{error}</p> : null}

            {!loading && !error && orders.length === 0 ? (
              <div className="orders-empty-state">
                <p>You have not placed any orders yet.</p>
                <Link to="/" className="orders-primary-btn">
                  Continue Shopping
                </Link>
              </div>
            ) : null}

            {!loading && !error && orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => (
                  <article className="orders-item" key={order.id}>
                    <div className="orders-item-top">
                      <p className="orders-id">Order #{order.id}</p>
                      <span
                        className={`orders-status orders-status--${order.status}`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="orders-meta-grid">
                      <p>
                        <span>Placed:</span>{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <span>Items:</span> {order.itemCount}
                      </p>
                      <p>
                        <span>Payment:</span> {order.paymentMethod}
                      </p>
                      <p>
                        <span>Payment Status:</span> {order.paymentStatus}
                      </p>
                      <p className="orders-total">
                        <span>Total:</span> Rs.{order.total}
                      </p>
                    </div>

                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="orders-view-btn"
                    >
                      View Details
                    </Link>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </main>

      <BottomFooter />
    </div>
  );
}

export default OrdersPage;
