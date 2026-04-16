import { Navigate, Route, Routes } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import CartPage from "../pages/Cart";
import OrderConfirmationPage from "../pages/OrderConfirmation";
import OrdersPage from "../pages/Orders";
import PlaceOrderPage from "../pages/placeOrder";
import PaymentPage from "../pages/payment";
import ProductPage from "../pages/product";
import SearchResultsPage from "../pages/SearchResults";
import { useAppContext } from "../context/AppContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route path="/place-order" element={<PlaceOrderPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route
        path="/order-confirmation/:orderId"
        element={<OrderConfirmationPage />}
      />
      <Route path="/products" element={<Navigate to="/products/1" replace />} />
      <Route path="/products/:id" element={<ProductPage />} />
    </Routes>
  );
}

export default AppRoutes;
