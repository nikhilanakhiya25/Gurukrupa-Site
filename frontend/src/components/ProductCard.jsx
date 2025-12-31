import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { getImageSrc } from "../utils/getImageSrc";

export default function ProductCard({ product, showDescription = false }) {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = () => {
        addToCart(product, 1); // Correct product
    };

    return (
        <div className="product-card">
            <div className="img-box">
                <img
                    src={getImageSrc(product.image)}
                    alt={product.name}
                    loading="lazy"
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                        e.target.src = "/no-image.png";
                    }}
                />
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
