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

            const res = await API.get("/orders");

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
            await API.put(`/orders/${orderId}/status`, { status: newStatus });

            setOrders(prev =>
                prev.map(o =>
                    o._id === orderId ? { ...o, status: newStatus } : o
                )
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

                {/* HEADER */}
                <div className="orders-header">
                    <strong>User Details</strong>
                    <strong>Products</strong>
                    <strong>Total</strong>
                    <strong>Status</strong>
                </div>

                {orders.length === 0 && !loading && (
                    <p>No orders found</p>
                )}

                {/* ORDERS */}
                {orders.map(o => (
                    <div key={o._id} className="order-row">

                        {/* USER DETAILS */}
                        <div className="order-col user-details">
                            <p><b>Name:</b> {o.user?.name || o.shippingAddress?.name || "N/A"}</p>
                            <p><b>Email:</b> {o.user?.email || "N/A"}</p>
                            <p><b>Phone:</b> {o.user?.phone || o.shippingAddress?.phone || "N/A"}</p>
                            <p>
                                <b>Address:</b>{" "}
                                {o.shippingAddress
                                    ? `${o.shippingAddress.address}, ${o.shippingAddress.city} - ${o.shippingAddress.pincode}`
                                    : "N/A"}
                            </p>
                        </div>

                        {/* PRODUCTS WITH IMAGE + QTY */}
                        <div className="order-col products-col">
                            {o.items?.map((item, index) => (
                                <div key={item.product?._id || index} className="product-item">
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/${item.product?.image}`}
                                        alt={item.product?.name}
                                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                        onError={(e) =>
                                            (e.target.src = "https://via.placeholder.com/60")
                                        }
                                        className="table-img"
                                    />

                                    <div className="product-info">
                                        <p><b>{item.product?.name || item.name}</b></p>
                                        <p>Qty: {item.qty}</p>
                                        <p>Price: ₹ {item.price || item.product?.price || 0}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* TOTAL */}
                        <div className="order-col">
                            ₹ {o.totalAmount || o.totalPrice || 0}
                        </div>

                        {/* STATUS */}
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
