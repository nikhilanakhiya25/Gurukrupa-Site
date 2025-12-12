import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ProductCard from "./ProductCard";
import Footer from "./Footer";
import "./HomePage.css";

const Profile = () => {
  const { user } = useAuth();

  return <h2>Logged in user: {user?.name}</h2>;
};



const featuredProduct = {
  _id: "f1",
  name: "Customize Photo Frame",
  price: "750",
  image: "https://content3.jdmagicbox.com/comp/ahmedabad/b6/079pxx79.xx79.210629124021.b9b6/catalogue/gurukrupa-gift-article-shahibaug-ahmedabad-gift-shops-du0hrs91la.jpg",
  description: "Heart-shaped wooden photo fram"
};

const otherProducts = Array.from({ length: 4 }).map((_, i) => ({
  _id: `p${i + 1}`,
  name: `Wooden Decor ${i + 1}`,
  price: (40 + i * 10).toFixed(2),
  image: `https://picsum.photos/300?random=${i + 10}`,
}));

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="homepage-container">

      {/* 🔥 Banner */}
      <section className="hero-banner">
        <div className="hero-text">
          <h1>Premium Gifts for Every Occasion</h1>
          <p>Unique wooden décor, personalized designs, and handcrafted gift articles.</p>
          <button className="shop-now-btn" >Shop Now</button>
        </div>
      </section>

      {/* ⭐ Featured Product */}
      <section className="highlight-product">
        <div className="highlight-image">
          <img src={featuredProduct.image} alt="Featured Product" />
        </div>

        <div className="highlight-text">
          <h2>{featuredProduct.name}</h2>
          <p>{featuredProduct.description}</p>
          <div className="price">₹ {featuredProduct.price}</div>
          <button className="shop-now-btn">View Details</button>
        </div>
      </section>

      {/* 🛍 Other Products */}
      <section className="product-section">
        <h2>Top Picks For You</h2>
        <div className="product-grid">
          {otherProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
  // export default Profile;
}