// frontend/src/contexts/CartContext.js
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, qty = 1) => {
    const mongoId = product._id || product.id || product.productId;
    if (!mongoId) {
      toast.error("Product ID missing");
      return;
    }

    setCart(prev => {
      const exists = prev.find(item => item._id === mongoId);
      if (exists) {
        toast.success("Quantity updated");
        return prev.map(item =>
          item._id === mongoId ? { ...item, qty: item.qty + qty } : item
        );
      }
      toast.success("Added to cart");
      return [...prev, { ...product, _id: mongoId, qty }];
    });
  };

  const removeFromCart = id => {
    setCart(prev => prev.filter(item => item._id !== id));
    toast.info("Removed from cart");
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => item._id === id ? { ...item, qty: newQty } : item));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
