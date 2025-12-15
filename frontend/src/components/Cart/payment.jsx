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
    const [loading, setLoading] = useState(false);

    // 🔹 Load shipping details
    useEffect(() => {
        const saved = localStorage.getItem("shippingDetails");
        if (!saved) {
            navigate("/checkout");
            return;
        }
        setShippingDetails(JSON.parse(saved));
    }, [navigate]);

    // 🔹 Calculate total safely
    const totalPrice = cart.reduce(
        (sum, item) => sum + Number(item.price) * item.qty,
        0
    );

    // 🔹 PLACE ORDER (FULLY FIXED)
    const placeOrder = async () => {
        if (cart.length === 0) {
            alert("Cart is empty");
            return;
        }

        if (!shippingDetails) {
            alert("Shipping details missing");
            navigate("/checkout");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to place order");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                orderItems: cart.map(item => ({
                    product: item._id,
                    name: item.name,
                    price: Number(item.price),
                    qty: item.qty,
                    image: item.image || ""
                })),
                shippingAddress: shippingDetails,
                paymentMethod: selectedMethod,
                totalPrice
            };

            console.log("📦 Sending Order:", orderData);

            const res = await API.post(
                "/orders",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("✅ ORDER CREATED:", res.data);

            clearCart();
            localStorage.removeItem("shippingDetails");

            // 🔹 backend usually returns order directly
            navigate(`/order-success/${res.data._id}`);
        } catch (error) {
            console.error("❌ ORDER ERROR:", error.response?.data || error.message);
            alert(
                error.response?.data?.message ||
                "Order failed. Please try again."
            );
        } finally {
            setLoading(false);
            setConfirmPopup(false);
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
                    disabled={cart.length === 0}
                >
                    Continue
                </button>
            </div>

            {confirmPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h3>Confirm Order?</h3>
                        <p>Total Amount: ₹{totalPrice}</p>

                        <div className="popup-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setConfirmPopup(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                className="place-btn"
                                onClick={placeOrder}
                                disabled={loading}
                            >
                                {loading ? "Placing..." : "Place Order"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
