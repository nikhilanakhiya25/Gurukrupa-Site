import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ProductCard from "./ProductCard";
import Footer from "./Footer";
import API from "../api/api";
import "./HomePage.css";

export default function HomePage() {
  const { user } = useAuth();

  // 🛒 State for DB products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Featured Product
  const featuredProduct = {
    _id: "f1",
    name: "Customize Photo Frame",
    price: "750",
    image:
      "https://content3.jdmagicbox.com/comp/ahmedabad/b6/079pxx79.xx79.210629124021.b9b6/catalogue/gurukrupa-gift-article-shahibaug-ahmedabad-gift-shops-du0hrs91la.jpg",
    description: "Heart-shaped wooden photo frame",
  };

  // ---------------- LOAD PRODUCTS FROM DB ----------------
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await API.get("/products");
        const data = res.data.products || res.data;
        setProducts(data.slice(0, 5)); // show top 8 products
      } catch (err) {
        console.error("FETCH PRODUCTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="homepage-container">
      {/* 🔥 Hero Banner */}
      <section className="hero-banner">
        <div className="hero-text">
          <h1>Premium Gifts for Every Occasion</h1>
          <p>
            Unique wooden décor, personalized designs, and handcrafted gift articles.
          </p>
          <button className="shop-now-btn">Shop Now</button>
        </div>
      </section>

      {/* ⭐ Featured Product */}
      <section className="highlight-product">
        <div className="highlight-image">
          <img src={getImageSrc(featuredProduct.image)} alt={featuredProduct.name} />
        </div>

        <div className="highlight-text">
          <h2>{featuredProduct.name}</h2>
          <p>{featuredProduct.description}</p>
          <div className="price">₹ {featuredProduct.price}</div>
          <button className="shop-now-btn">View Details</button>
        </div>
      </section>

      {/* 🛍 Products Section */}
      <section className="product-section">
        <h2>Top Picks For You</h2>

        {loading && <p>Loading products...</p>}
        {!loading && products.length === 0 && <p>No products found</p>}

        <div className="product-grid">
          {!loading &&
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
