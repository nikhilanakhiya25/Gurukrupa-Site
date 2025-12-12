import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Truck, ShieldCheck } from "lucide-react";
import "./Service.css";


export default function Services() {
    const serviceList = [
        {
            icon: <Briefcase size={32} />,
            title: "Premium Quality Products",
            desc: "Every item is crafted with care and inspected to ensure top-tier quality for our customers.",
        },
        {
            icon: <Truck size={32} />,
            title: "Fast & Safe Delivery",
            desc: "Your orders are delivered quickly and securely with trusted logistics partners.",
        },
        {
            icon: <ShieldCheck size={32} />,
            title: "Secure Payments",
            desc: "We offer safe, encrypted, and reliable payment methods for a smooth checkout experience.",
        },
    ];


    return (
        <div className="services-container">
            <motion.h1
                className="services-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Our Services
            </motion.h1>


            <div className="services-grid">
                {serviceList.map((service, index) => (
                    <motion.div
                        key={index}
                        className="service-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2, duration: 0.4 }}
                    >
                        <div className="service-icon">{service.icon}</div>
                        <h2>{service.title}</h2>
                        <p>{service.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}