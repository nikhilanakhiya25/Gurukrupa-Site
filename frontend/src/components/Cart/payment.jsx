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
    const [shippingDetails, setShippingDetails] = useState(null);

    // 🔹 Load shipping details
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("shippingDetails"));
        if (!saved) {
            navigate("/checkout");
            return;
        }
        setShippingDetails(saved);
    }, [navigate]);

    // 🔹 Calculate total
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    // 🔹 PLACE ORDER (FIXED)
    const placeOrder = async () => {
        try {
            // ✅ CREATE orderData (THIS WAS MISSING)
            const orderData = {
                orderItems: cart.map((item) => ({
                    product: item._id,
                    name: item.name,
                    price: item.price,
                    qty: item.qty,
                    image: item.image,
                })),
                shippingAddress: shippingDetails,
                paymentMethod: selectedMethod,
                totalPrice,
            };

            console.log("📦 Sending Order:", orderData);

            // ✅ baseURL already has /api → DO NOT add /api again
            const res = await API.post("/", orderData);

            console.log("✅ ORDER SUCCESS:", res.data);

            clearCart();
            localStorage.removeItem("shippingDetails");

            navigate("/order-success/" + res.data._id);
        } catch (error) {
            console.error("❌ ORDER ERROR:", error.response?.data || error.message);
            alert(
                "Order failed: " +
                (error.response?.data?.message || "Unknown error")
            );
        }
    };

    return (
        <div className="payment-page">
            <h2>Select Payment Method</h2>

            <div className="payment-box">
                <div
                    className={`payment-option ${selectedMethod === "COD" ? "active" : ""
                        }`}
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
                        <p>Your order will be placed successfully.</p>
                        <div className="popup-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setConfirmPopup(false)}
                            >
                                Cancel
                            </button>
                            <button className="place-btn" onClick={placeOrder}>
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
