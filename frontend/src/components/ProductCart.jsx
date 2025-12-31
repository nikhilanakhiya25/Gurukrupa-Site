import React, { useContext } from "react";
import { CartContext } from "./Cart/CartContext";
import { getImageSrc } from "../utils/getImageSrc";

export default function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="product-card">
            <img src={getImageSrc(product.image)} alt={product.name} />
            <h3>{product.name}</h3>
            <div>₹ {product.price}</div>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
    );
}
