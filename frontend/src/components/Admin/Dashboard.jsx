import React, { useEffect, useState } from "react";
import API from "../../api/api";
import {
    Package,
    Users,
    ShoppingCart,
    IndianRupee,
} from "lucide-react";
import "./AdminPanels.css";

import { imageBaseURL } from "../../api/api";

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {
        fetchProducts();
        fetchUsers();
        fetchOrders();
    }, []);

    // ✅ PRODUCTS
    const fetchProducts = async () => {
        try {
            const res = await API.get("/admin/products");
            setProducts(res.data.products || res.data || []);
        } catch (err) {
            console.log("Products:", err.response?.data || err.message);
        }
    };

    // ✅ USERS
    const fetchUsers = async () => {
        try {
            const res = await API.get("/admin/users");
            setUsers(res.data.users || res.data || []);
        } catch (err) {
            console.log("Users:", err.response?.data || err.message);
        }
    };

    // ✅ ADMIN ORDERS (FIXED)
    const fetchOrders = async () => {
        try {
            const res = await API.get("/admin/orders"); // 🔥 FIX
            const data = res.data.orders || res.data || [];
            setOrders(data);

            const total = data.reduce(
                (sum, o) => sum + Number(o.totalPrice || o.totalAmount || 0),
                0
            );
            setTotalSales(total);
        } catch (err) {
            console.log("Orders:", err.response?.data || err.message);
        }
    };

    return (
        <div className="dashboard">
            <h2 className="page-title">Admin Dashboard</h2>

            {/* ===== SUMMARY ===== */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <Package />
                    <div>
                        <h3>{products.length}</h3>
                        <p>Products</p>
                    </div>
                </div>

                <div className="stat-card green">
                    <Users />
                    <div>
                        <h3>{users.length}</h3>
                        <p>Users</p>
                    </div>
                </div>

                <div className="stat-card orange">
                    <ShoppingCart />
                    <div>
                        <h3>{orders.length}</h3>
                        <p>Orders</p>
                    </div>
                </div>

                <div className="stat-card purple">
                    <IndianRupee />
                    <div>
                        <h3>₹ {totalSales}</h3>
                        <p>Total Sales</p>
                    </div>
                </div>
            </div>

            {/* ===== PRODUCTS ===== */}
            <section className="table-section">
                <h3>📦 Products</h3>
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p._id}>
                                <td>
                                    <img
                                        src={
                                            p.image
                                                ? `${imageBaseURL}${p.image}`
                                                : "https://via.placeholder.com/60"
                                        }
                                        alt={p.name}
                                        onError={(e) =>
                                            (e.target.src = "https://via.placeholder.com/60")
                                        }
                                        className="table-img"
                                    />
                                </td>
                                <td>{p.name}</td>
                                <td>₹ {p.price}</td>
                                <td>
                                    <span
                                        className={`badge ${p.countInStock > 0 ? "success" : "danger"
                                            }`}
                                    >
                                        {p.countInStock > 0 ? "In Stock" : "Out"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* ===== USERS ===== */}
            <section className="table-section">
                <h3>👤 Users</h3>
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span
                                        className={`badge ${u.isAdmin ? "admin" : "user"
                                            }`}
                                    >
                                        {u.isAdmin ? "Admin" : "User"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* ===== ORDERS ===== */}
            <section className="table-section">
                <h3>📄 Orders</h3>
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o._id}>
                                <td>{o._id.slice(-6)}</td>
                                <td>{o.user?.name || "Guest"}</td>
                                <td>₹ {o.totalPrice || o.totalAmount}</td>
                                <td>
                                    <span className="badge warning">
                                        {o.status || "Pending"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Dashboard;
