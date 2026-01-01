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
                        Address: Shop No.35, Sahajanand Shopping Centre, opp. Rajasthan School, Shahibag, Ahmedabad, Gujarat 380004
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
                        {/* <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li> */}
                    </ul>
                </div>

                {/* CONTACT + SOCIAL */}
                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <p>Email: gurukrupagiftarticles@gmail.com </p>
                    <p>Phone: 6355279928 /7284818088</p>
                    <div className="social-icons">
                        <Link to="https://www.google.com/maps/place/Gurukrupa+Gift+Article/@23.0466857,72.5859239,801m/data=!3m2!1e3!4b1!4m6!3m5!1s0x395e85431c4a9069:0xa04d125c1366cdbc!8m2!3d23.0466857!4d72.5884988!16s%2Fg%2F11m41mg7hs?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D" target="_blank">📍</Link>
                        <Link to="https://facebook.com" target="_blank">📘</Link>
                        
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
