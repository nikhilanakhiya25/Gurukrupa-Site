import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminPanels.css';

export default function AdminPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
      <div className="admin-main">
        <div className="sidebar">
          <h2 class="AdminName">Admin Panel</h2>
          <Link to="/admin/dashboard" className={location.pathname === '/admin/dashboard' ? 'active' : ''}>Dashboard</Link>
          <Link to="/admin/products" className={location.pathname === '/admin/products' ? 'active' : ''}>Products</Link>
          <Link to="/admin/orders" className={location.pathname === '/admin/orders' ? 'active' : ''}>Orders</Link>
          <Link to="/admin/settings" className={location.pathname === '/admin/settings' ? 'active' : ''}>Settings</Link>
        </div>
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    
  );
}
