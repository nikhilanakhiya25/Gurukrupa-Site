import React, { useEffect, useState } from "react";
import API from "../../api/api";
import "./AdminPanels.css";

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

    // ---------------- FETCH PRODUCTS ----------------
    const fetchProducts = async () => {
        try {
            const res = await API.get("/products");

            const productArr =
                Array.isArray(res.data)
                    ? res.data
                    : res.data.products || res.data.data || [];

            setProducts(productArr);
        } catch (error) {
            console.log("Product Fetch Error:", error);
        }
    };

    // ---------------- FETCH USERS ----------------
    const fetchUsers = async () => {
        try {
            const res = await API.get("/users");

            const userArr =
                Array.isArray(res.data)
                    ? res.data
                    : res.data.users || res.data.data || [];

            setUsers(userArr);
        } catch (error) {
            console.log("User Fetch Error:", error);
        }
    };

    // ---------------- FETCH ORDERS ----------------
    const fetchOrders = async () => {
        try {
            const res = await API.get("/orders");

            const orderArr =
                Array.isArray(res.data)
                    ? res.data
                    : res.data.orders || res.data.data || [];

            setOrders(orderArr);

            const sales = orderArr.reduce(
                (sum, order) =>
                    sum + Number(order.totalAmount || order.totalPrice || 0),
                0
            );

            setTotalSales(sales);
        } catch (error) {
            console.log("Order Fetch Error:", error);
        }
    };

    return (
        <div className="dashboard">
            <button onClick={() => window.history.back()} className="back-btn">
                ⬅ Back
            </button>

            <h2>📊 Dashboard Overview</h2>

            {/* Summary Cards */}
            <div className="stats">
                <div className="card">Products <h3>{products.length}</h3></div>
                <div className="card">Users <h3>{users.length}</h3></div>
                <div className="card">Orders <h3>{orders.length}</h3></div>
                <div className="card">Total Sales <h3>₹ {totalSales}</h3></div>
            </div>

            {/* ---------------- PRODUCTS TABLE ---------------- */}
            <h3>📦 All Products</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Colors</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length ? (
                        products.map((p) => (
                            <tr key={p._id}>
                                <td><img src={p.image} alt="" width="50" /></td>
                                <td>{p.name}</td>
                                <td>₹ {p.price}</td>
                                <td>{p.countInStock || p.stock}</td>
                                <td>
                                    {Array.isArray(p.colors)
                                        ? p.colors.join(", ")
                                        : p.color || "-"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5">No Products Found</td></tr>
                    )}
                </tbody>
            </table>

            {/* ---------------- USERS TABLE ---------------- */}
            <h3>👤 All Users</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                    </tr>
                </thead>

                <tbody>
                    {users.length ? (
                        users.map((u) => (
                            <tr key={u._id}>
                                <td>{u.name || "-"}</td>
                                <td>{u.email || "-"}</td>
                                <td>{u.phone || "-"}</td>
                                <td>
                                    {u.role
                                        ? u.role
                                        : u.isAdmin
                                            ? "admin"
                                            : "user"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4">No Users Found</td></tr>
                    )}
                </tbody>
            </table>

            {/* ---------------- ORDERS TABLE ---------------- */}
            <h3>📄 All Orders</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length ? (
                        orders.map((o) => (
                            <tr key={o._id}>
                                <td>{o._id.slice(-6)}</td>
                                <td>{o.user?.name || "Unknown"}</td>
                                <td>₹ {o.totalAmount || o.totalPrice || 0}</td>
                                <td>{o.status || "Pending"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4">No Orders Found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
