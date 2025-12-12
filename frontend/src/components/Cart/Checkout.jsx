import React, { useContext, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './Checkouts.css';

export default function Checkout() {
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const savedUser = JSON.parse(localStorage.getItem('user')) || {};

    const [form, setForm] = useState({
        name: savedUser.name || '',
        email: savedUser.email || '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handleNext = (e) => {
        e.preventDefault();

        // Save shipping details before going to payment
        localStorage.setItem("shippingDetails", JSON.stringify(form));

        navigate("/payment");
    };

    return (
        <div className="checkout-page">
            <h2>Shipping Details</h2>

            <div className="checkout-container">
                <div className="checkout-form">
                    <form onSubmit={handleNext}>
                        <input type="text" placeholder="Full Name" value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })} required />

                        <input type="email" placeholder="Email" value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })} required />

                        <input type="text" placeholder="Address" value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })} required />

                        <input type="text" placeholder="City" value={form.city}
                            onChange={e => setForm({ ...form, city: e.target.value })} required />

                        <input type="text" placeholder="Postal Code" value={form.postalCode}
                            onChange={e => setForm({ ...form, postalCode: e.target.value })} required />

                        <input type="text" placeholder="Phone Number" value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })} required />

                        <button className="place-order-btn">Next → Select Payment</button>
                    </form>
                </div>

                <div className="checkout-summary">
                    <h3>Order Summary</h3>

                    {cart.map(item => (
                        <div key={item._id} className="checkout-item">
                            <span>{item.name} x {item.qty}</span>
                            <span>₹{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    ))}

                    <h4>Total: ₹{total.toFixed(2)}</h4>
                </div>
            </div>
        </div>
    );
}
