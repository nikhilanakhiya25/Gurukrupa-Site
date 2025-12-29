import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Components
import HomePage from "./components/HomePage";
import ProductList from "./components/ProductList";
import LoginPage from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Cart/Checkout";
import Payment from "./components/Cart/payment";
import MyOrders from "./components/userOrders";
import OrderSuccess from "./components/OrderSucess";
import OrderTracking from "./components/OrderTracking";
import AdminPanel from "./components/Admin/AdminPanel";
import Dashboard from "./components/Admin/Dashboard";
import Products from "./components/Admin/Products";
import Orders from "./components/Admin/Orders";
import Settings from "./components/Admin/Setting";
import AdminSidebar from "./components/Admin/AdminSidebar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="page-container">
      {/* Admin Sidebar - Only for admins */}
      {user?.role?.toLowerCase() === "admin" && <AdminSidebar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductList />} />

        {/* Auth */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />

        {/* Cart & Checkout */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={isLoggedIn ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/payment" element={<Payment />} />

        {/* User Order Routes */}
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        <Route path="/track-order/:id" element={<OrderTracking />} />

        {/* Admin Only */}
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
}
