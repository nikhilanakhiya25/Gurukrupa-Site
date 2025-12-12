import React, { useContext } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import HomePage from "./components/HomePage";
import ProductList from "./components/ProductList";
import LoginPage from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { CartProvider, CartContext } from "./contexts/CartContext";
import { useAuth } from "./contexts/AuthContext";

import Cart from "./components/Cart/Cart";
import Checkout from "./components/Cart/Checkout";
import Payment from "./components/Cart/payment";

import AdminPanel from "./components/Admin/AdminPanel";
import Dashboard from "./components/Admin/Dashboard";
import Products from "./components/Admin/Products";
import Orders from "./components/Admin/Orders";
import Settings from "./components/Admin/Setting";

import MyOrders from "./components/userOrders";
import OrderSuccess from "./components/OrderSucess";
import OrderTracking from "./components/OrderTracking"; // Assuming this exists, or adjust

import "./app.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import logo from "./Images/Logo.jpg";

export default function App() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const handleLogout = () => {
    logout();
    toast.success("Logout Successful!");
  };

  return (
    <CartProvider>
      <div>
        {/* --- TOP NAVBAR --- */}
        <nav className="navbar">
          <div className="nav-left">
            <Link className="logo" to="/">
              <img src={logo} alt="Logo" className="h-10" />
            </Link>

            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>

              {/* Admin Only */}
              {user?.role?.toLowerCase() === "admin" && (
                <Link to="/admin">Admin</Link>
              )}
            </div>
          </div>

          <div className="nav-center">
            <input className="search-box" placeholder="Search products..." />
          </div>

          <div className="nav-right">
            {/* Cart Icon with Badge */}
            <Link className="cart-link" to="/cart">
              🛒
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>

            <div className="auth-links">
              {isLoggedIn ? (
                <>
                  <span className="user-info">
                    Welcome, {user?.name || user?.email}
                  </span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup" className="signup-btn">Signup</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <ToastContainer position="top-right" autoClose={2000} />

        {/* --- ROUTES --- */}
        <div className="page-container">
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
            <Route path="/admin" element={
              user?.role?.toLowerCase() === "admin" ? <AdminPanel /> : <Navigate to="/" />
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </div>
    </CartProvider>
  );
}
