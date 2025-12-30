// frontend/src/components/Cart/OrderSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
    return (
        <div style={{ textAlign: "center", padding: 40 }}>
            <h1>🎉 Order Placed!</h1>
            <p>Your order was placed successfully. You will receive an SMS/WhatsApp confirmation.</p>
            <div style={{ marginTop: 20 }}>
                {/* <Link to="/orders" style={{ marginRight: 10 }}>View my orders</Link> */}
                <Link to="/">Continue shopping</Link>
            </div>
        </div>
    );
}
