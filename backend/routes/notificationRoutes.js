// backend/routes/notificationRoutes.js
const express = require("express");
const axios = require("axios");
const Order = require("../models/Order");
const nodemailer = require("nodemailer");

const router = express.Router();

// ENV VARIABLES
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;

const FAST2SMS_KEY = process.env.FAST2SMS_KEY;

router.post("/send", async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await Order.findById(orderId).populate("user");
        if (!order) return res.status(404).json({ message: "Order not found" });

        const phone = order.user?.phone || order.shippingAddress?.phone;
        const email = order.user?.email;
        const name = order.user?.name || "Customer";

        const message = `Hello ${name}, your order #${orderId.slice(-6)} is now "${status}". Thank you for shopping!`;

        // ----------------------------------------------------
        // 1️⃣ SEND WHATSAPP MESSAGE (META CLOUD API)
        // ----------------------------------------------------
        if (phone) {
            await axios.post(
                `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: phone,
                    type: "text",
                    text: { body: message }
                },
                {
                    headers: {
                        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // ----------------------------------------------------
        // 2️⃣ SEND SMS (Twilio OR Fast2SMS)
        // ----------------------------------------------------

        // --- TWILIO (international) ---
        if (TWILIO_SID && TWILIO_AUTH) {
            const twilio = require("twilio")(TWILIO_SID, TWILIO_AUTH);
            await twilio.messages.create({
                body: message,
                from: TWILIO_NUMBER,
                to: phone,
            });
        }

        // --- FAST2SMS (India-only) ---
        if (FAST2SMS_KEY) {
            await axios.post(
                "https://www.fast2sms.com/dev/bulkV2",
                {
                    message,
                    language: "english",
                    route: "v3",
                    numbers: phone,
                },
                {
                    headers: {
                        authorization: FAST2SMS_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // ----------------------------------------------------
        // 3️⃣ SEND EMAIL (Nodemailer)
        // ----------------------------------------------------
        if (email) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: email,
                subject: `Order Update: #${orderId.slice(-6)}`,
                text: message,
            });
        }

        return res.json({ success: true, message: "Notifications sent!" });

    } catch (err) {
        console.error("Notification Error:", err);
        res.status(500).json({ message: "Failed to send notifications" });
    }
});

module.exports = router;
