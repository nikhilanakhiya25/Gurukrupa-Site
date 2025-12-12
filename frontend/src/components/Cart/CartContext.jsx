// contexts/CartContext.js
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Add product to cart
    const addToCart = (product) => {
        const exist = cart.find(item => item.product === product._id);
        if (exist) {
            setCart(cart.map(item =>
                item.product === product._id ? { ...item, qty: item.qty + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, product: product._id, qty: 1 }]);
        }
    };

    // Remove product
    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.product !== id));
    };

    // **Update quantity properly**
    const updateQty = (id, qty) => {
        if (qty < 1) return; // prevent 0 or negative
        setCart(cart.map(item =>
            item.product === id ? { ...item, qty } : item
        ));
    };

    // Clear cart
    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
