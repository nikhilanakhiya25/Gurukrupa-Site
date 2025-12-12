// frontend/src/components/Admin/Orders.js
import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "./Order.css";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    // ---------------- LOAD ALL ORDERS ----------------
    const loadOrders = async () => {
        try {
            setLoading(true);

            // FIXED ENDPOINT
            const res = await API.get("/api/orders");

            // Safely extract array
            const arr = Array.isArray(res.data)
                ? res.data
                : res.data.orders || res.data.data || [];

            setOrders(arr);
        } catch (err) {
            console.error("ORDER FETCH ERROR →", err);
            alert(err.response?.data?.message || "Could not load orders");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- UPDATE ORDER STATUS ----------------
    const updateStatus = async (orderId, newStatus) => {
        try {
            // FIXED ENDPOINT
            await API.put(`/api/orders/${orderId}/status`, { status: newStatus });

            // Update UI instantly
            setOrders(prev =>
                prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
            );

            alert("Order status updated");
        } catch (err) {
            console.error("STATUS UPDATE ERROR →", err);
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    return (
        <div className="admin-orders-page">
            <h2>All Orders</h2>

            {loading && <p>Loading...</p>}

            <div className="orders-table">
                <div className="orders-header">
                    <strong>User</strong>
                    <strong>Products</strong>
                    <strong>Total</strong>
                    <strong>Status</strong>
                </div>

                {orders.length === 0 && !loading && <p>No orders found</p>}

                {orders.map(o => (
                    <div key={o._id} className="order-row">

                        <div className="order-col">
                            {o.user?.name ||
                                o.shippingAddress?.name ||
                                "Unknown"}
                        </div>

                        <div className="order-col">
                            {o.items?.map(p =>
                                `${p.product?.name || p.name} x ${p.qty}`
                            ).join(", ")}
                        </div>

                        <div className="order-col">₹ {o.totalAmount || o.totalPrice || 0}</div>

                        <div className="order-col">
                            <select
                                value={o.status || "Pending"}
                                onChange={(e) =>
                                    updateStatus(o._id, e.target.value)
                                }
                            >
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
