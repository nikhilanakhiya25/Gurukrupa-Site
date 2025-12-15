import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  User
} from "lucide-react";
import "./AdminPanels.css";

export default function AdminPanel() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <User size={32} />
          <h2 className="text">Admin Panel</h2>
        </div>

        <nav className="menu">
          <NavLink to="/admin/dashboard" className="menu-item">
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink to="/admin/products" className="menu-item">
            <Package size={18} /> Products
          </NavLink>

          <NavLink to="/admin/orders" className="menu-item">
            <ShoppingCart size={18} /> Orders
          </NavLink>

          <NavLink to="/admin/settings" className="menu-item">
            <Settings size={18} /> Settings
          </NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
