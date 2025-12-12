import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

export default function Payment() {
    const navigate = useNavigate();
    const { cart, clearCart } = useContext(CartContext);

    const [method, setMethod] = useState("COD");
    const [shipping, setShipping] = useState({});
    const [confirmBox, setConfirmBox] = useState(false);
    const [successPopup, setSuccessPopup] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Load shipping details from checkout page
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("shippingDetails"));
        if (!saved) navigate("/checkout");
        setShipping(saved);
    }, []);

    // Handle order placement
    const placeOrder = async () => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/orders",
                {
                    user: user._id,
                    shippingAddress: {
                        name: shipping.name,
                        email: shipping.email,
                        address: shipping.address,
                        city: shipping.city,
                        postalCode: shipping.postalCode,
                        phone: shipping.phone
                    },
                    totalPrice,
                    paymentMethod: method,
                    items: cart.map(item => ({
                        product: item._id,
                        name: item.name,
                        image: item.image,
                        qty: item.qty,
                        price: item.price
                    }))
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // Show success popup
            setConfirmBox(false);
            setSuccessPopup(true);

            setTimeout(() => {
                clearCart();
                navigate("/");
            }, 2000);

        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Order failed, try again.");
        }
    };

    return (
        <div className="payment-page">
            <h2>Select Payment Method</h2>

            <div className="payment-box">
                <button
                    className={method === "COD" ? "selected-payment" : ""}
                    onClick={() => setMethod("COD")}
                >
                    Cash on Delivery (COD)
                </button>

                <button className="continue-btn" onClick={() => setConfirmBox(true)}>
                    Continue
                </button>
            </div>

            {/* Confirm Order Popup */}
            {confirmBox && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h3>Confirm Order?</h3>
                        <p>Your order will be placed and visible in Admin Panel.</p>

                        <div className="popup-actions">
                            <button className="cancel-btn" onClick={() => setConfirmBox(false)}>
                                Cancel
                            </button>

                            <button className="place-btn" onClick={placeOrder}>
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {successPopup && (
                <div className="popup-overlay">
                    <div className="popup-box success">
                        <h3>🎉 Order Placed Successfully!</h3>
                        <p>Your order is now visible in the Admin Panel.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
