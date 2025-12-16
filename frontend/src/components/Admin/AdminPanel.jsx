import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";
import "./AdminPanels.css";

export default function AdminPanel() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* HAMBURGER MENU BUTTON */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <User size={32} />
          <h2 className="text">Admin Panel</h2>
        </div>

        <nav className="menu">
          <NavLink to="/admin/dashboard" className="menu-item" onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink to="/admin/products" className="menu-item" onClick={() => setSidebarOpen(false)}>
            <Package size={18} /> Products
          </NavLink>

          <NavLink to="/admin/orders" className="menu-item" onClick={() => setSidebarOpen(false)}>
            <ShoppingCart size={18} /> Orders
          </NavLink>

          <NavLink to="/admin/settings" className="menu-item" onClick={() => setSidebarOpen(false)}>
            <Settings size={18} /> Settings
          </NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* MAIN CONTENT */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
