import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* HAMBURGER MENU BUTTON FOR ADMIN SIDEBAR */}
      <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ADMIN SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}>
        <div className="admin-sidebar-header">
          <User size={24} />
          <h3>Admin Panel</h3>
        </div>

        <nav className="admin-sidebar-menu">
          <NavLink to="/admin/dashboard" className="admin-sidebar-item" onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={16} /> Sample Dashboard
          </NavLink>

          <NavLink to="/admin/products" className="admin-sidebar-item" onClick={() => setSidebarOpen(false)}>
            <Package size={16} /> Products
          </NavLink>

          <NavLink to="/admin/orders" className="admin-sidebar-item" onClick={() => setSidebarOpen(false)}>
            <ShoppingCart size={16} /> Orders
          </NavLink>

          <NavLink to="/admin/settings" className="admin-sidebar-item" onClick={() => setSidebarOpen(false)}>
            <Settings size={16} /> Settings
          </NavLink>
        </nav>

        <button className="admin-sidebar-logout" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
}
