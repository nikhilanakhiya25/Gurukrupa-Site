import OrderSuccess from "./components/OrderSucess";
import OrderTracking from "./components/OrderTracking"; // Assuming this exists, or adjust

import MyOrders from "./components/userOrders";
import OrderSuccess from "./components/OrderSucess";
import OrderTracking from "./components/OrderTracking"; // Assuming this exists, or adjust
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

            <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>

              {/* Admin Only */}
              {user?.role?.toLowerCase() === "admin" && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Demo Panel</Link>
              )}
            </div>
          </div>

          {/* Burger Menu Icon */}
          <div className="burger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
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

                  {user?.role === "admin" && (
                    <Link to="/admin/dashboard" className="admin-btn">
                      Demo Panel
                    </Link>
                  )}

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
