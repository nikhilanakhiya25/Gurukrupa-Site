import React from "react";
import { Link } from "react-router-dom"; // <-- IMPORTANT
import "./Footer.css";


export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-top">

                {/* ABOUT SECTION */}
                <div className="footer-about">
                    <h3>GuruKrup Gift Article </h3>
                    <p>
                        Shop the latest trends in fashion, electronics, and more. Fast
                        delivery, easy returns, and 24/7 support.
                    </p>
                </div>

                {/* NAVIGATION LINKS */}
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                        <li><Link to="/login">Login / Signup</Link></li>
                    </ul>
                </div>

                {/* CONTACT + SOCIAL */}
                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <p>Email: support@mernecom.com</p>
                    <p>Phone: 6355279928 /7284818088</p>
                    <div className="social-icons">
                        <Link to="https://google.com" target="_blank">🌐</Link>
                        <Link to="https://facebook.com" target="_blank">📘</Link>
                        <Link to="https://twitter.com" target="_blank">🐦</Link>
                        <Link to="https://instagram.com" target="_blank">📸</Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2025 GuruKrupa Gift Article. All rights reserved.</p>
            </div>
        </footer>
    );
}
