import React from "react";
import { motion } from "framer-motion";
import "./AboutUs.css";
import Footer from './Footer';

export default function AboutUs() {
    return (
        <div className="about-container">
            <motion.div
                className="about-left"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>About Us</h1>
                <p>
                    Welcome to <strong>Gurukrupa Gift Article </strong>— a place where creativity meets craftsmanship.
                    We specialize in beautifully designed gift articles, premium wooden décor, customized art pieces, and home decoration products.
                    With years of experience in the gifting industry, we take pride in offering high-quality items that are perfect for birthdays, anniversaries, festivals, corporate events, and home décor.
                    Our mission is to deliver memorable gifts and provide every customer with a pleasant shopping experience.
                    Whether you’re looking for modern designs or personalized gifts, Gurukrupa Gift Article has something special for you.
                </p>


                <p>
                    Our team constantly works to expand our product offerings and enhance our platform, ensuring that every
                    customer finds what they need with ease and confidence.
                </p>


                <p>
                    Thank you for choosing us — we value your trust and look forward to serving you for years to come.
                </p>
            </motion.div>


            <motion.div
                className="about-right"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <img
                    src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70"
                    alt="Team working"
                />
            </motion.div>
            <Footer />
        </div>
    );
}