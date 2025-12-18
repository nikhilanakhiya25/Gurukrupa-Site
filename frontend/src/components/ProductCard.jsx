import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { imageBaseURL } from "../api/api";

export default function ProductCard({ product, showDescription = false }) {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = () => {
        addToCart(product, 1); // Correct product
    };

    return (
        <div className="product-card">
            <div className="img-box">
                <img src={`${imageBaseURL}${product.image}`} alt={product.name} />
            </div>

            <h3>{product.name}</h3>
            <p className="price">₹{product.price}</p>

            {showDescription && (
                <p className="description">{product.description}</p>
            )}

            <button className="btn-add" onClick={handleAddToCart}>
                Add to Cart
            </button>
        </div>
    );
}
