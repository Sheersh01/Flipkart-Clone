import { Navigate, Route, Routes } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import CartPage from "../pages/Cart";
import PlaceOrderPage from "../pages/placeOrder";
import PaymentPage from "../pages/payment";
import ProductPage from "../pages/product";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/place-order" element={<PlaceOrderPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/products" element={<Navigate to="/products/1" replace />} />
      <Route path="/products/:id" element={<ProductPage />} />
    </Routes>
  );
}

export default AppRoutes;
