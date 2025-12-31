// src/components/User/OrderTracking.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { getImageSrc } from "../utils/getImageSrc";
import "./OrderTracking.css";

export default function OrderTracking() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        API.get(`/api/orders/${id}`)
            .then((res) => setOrder(res.data))
            .catch((err) => console.error("TRACK ERROR:", err));
    }, [id]);

    if (!order) return <p>Loading...</p>;

    return (
        <div className="tracking-container">
            <h2>Order Tracking</h2>

            <div className="tracking-box">
                <p><b>Order ID:</b> {order._id}</p>
                <p><b>Status:</b> {order.status}</p>

                <h3>Items:</h3>
                {order.items.map((i) => (
                    <div key={i._id} className="track-item">
                        <img src={getImageSrc(i.image)} alt="" />
                        <span>{i.name}</span>
                        <span>Qty: {i.qty}</span>
                        <span>₹{i.price}</span>
                    </div>
                ))}

                <p><b>Total:</b> ₹{order.totalAmount}</p>
            </div>
        </div>
    );
}
