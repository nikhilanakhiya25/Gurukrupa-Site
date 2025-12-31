import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { getImageSrc } from '../../utils/getImageSrc';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQty } = useContext(CartContext);
  const navigate = useNavigate();

  // ⭐ Ensure price is treated as number - Safe cart handling
  const total = (cart || []).reduce(
    (sum, i) => sum + Number(i.price || 0) * (i.qty || 0),
    0
  );

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Add products to your cart to see them here.</p>
        <button
          className="continue-btn"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item._id} className="cart-card">

            {/* ✅ FIXED Product Image */}
            <img
              src={getImageSrc(item.image)}
              alt={item.name}
              onError={(e) =>
                (e.target.src = 'https://via.placeholder.com/100')
              }
              className="cart-img"
            />

            <div className="cart-info">
              <h3>{item.name}</h3>

              <p>₹{Number(item.price).toFixed(2)}</p>

              {/* Quantity Controls */}
              <div className="qty-control">
                <button
                  onClick={() => updateQty(item._id, item.qty - 1)}
                  disabled={item.qty === 1}
                >
                  -
                </button>

                <span>{item.qty}</span>

                <button
                  onClick={() => updateQty(item._id, item.qty + 1)}
                >
                  +
                </button>
              </div>

              <p>
                Subtotal: ₹{(Number(item.price) * item.qty).toFixed(2)}
              </p>
            </div>

            {/* Remove Item */}
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="cart-summary">
        <h3>Total: ₹{total.toFixed(2)}</h3>

        <button
          className="checkout-btn"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
