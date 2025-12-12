// frontend/src/components/Cart/Payment.jsx
import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./Payments.css";

export default function Payment() {
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState("COD");
    const [confirmPopup, setConfirmPopup] = useState(false);
    const [successPopup, setSuccessPopup] = useState(false);
    const [shippingDetails, setShippingDetails] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("shippingDetails"));
        if (!saved) {
            navigate("/checkout");
            return;
        }
        setShippingDetails(saved);
    }, []);

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    const placeOrder = async () => {
        try {
            console.log("📦 Sending Order:", orderData);

            const res = await API.post("/api/orders", orderData);

            console.log("✅ ORDER SUCCESS:", res.data);

            toast.success("Order Placed Successfully!");
            navigate("/order-success/" + res.data._id);

        } catch (error) {
            console.error("❌ ORDER ERROR:", error.response?.data || error.message);

            alert("Order failed: " + (error.response?.data?.message || "Unknown error"));
        }
    };


    return (
        <div className="payment-page">
            <h2>Select Payment Method</h2>

            <div className="payment-box">
                <div
                    className={`payment-option ${selectedMethod === "COD" ? "active" : ""}`}
                    onClick={() => setSelectedMethod("COD")}
                >
                    Cash on Delivery (COD)
                </div>

                <button
                    className="continue-btn"
                    onClick={() => setConfirmPopup(true)}
                >
                    Continue
                </button>
            </div>

            {confirmPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h3>Confirm Order?</h3>
                        <p>Your order will be placed and visible in Admin Panel.</p>
                        <div className="popup-actions">
                            <button className="cancel-btn" onClick={() => setConfirmPopup(false)}>Cancel</button>
                            <button className="place-btn" onClick={placeOrder}>Place Order</button>
                        </div>
                    </div>
                </div>
            )}

            {successPopup && (
                <div className="popup-overlay">
                    <div className="popup-box success">
                        <h3>🎉 Order Placed Successfully!</h3>
                        <p>Your order is now visible in the Admin Panel.</p>
                        <div className="popup-actions">
                            <button className="cancel-btn" onClick={() => setSuccessPopup(false)}>Close</button>
                            <button
                                className="place-btn"
                                onClick={() => {
                                    setSuccessPopup(false);
                                    navigate("/");
                                }}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
