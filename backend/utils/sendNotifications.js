const axios = require("axios");
const nodemailer = require("nodemailer");

module.exports = async function sendNotifications(order, status) {
    try {
        const phone = order.user?.phone || order.shippingAddress?.phone;
        const email = order.user?.email;
        const name = order.user?.name || "Customer";

        const message = `Hello ${name}, your order #${order._id.slice(-6)} is now "${status}".`;

        // ---- SAFETY CHECKS ----
        if (!phone && !email) {
            console.log("No contact info, skipping notifications");
            return;
        }

        // ---- WHATSAPP ----
        if (phone) {
            try {
                await axios.post(
                    `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
                    {
                        messaging_product: "whatsapp",
                        to: phone,
                        type: "text",
                        text: { body: message }
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            } catch (err) {
                console.log("WhatsApp Error:", err.response?.data || err);
            }
        }

        // ---- EMAIL ----
        if (email) {
            try {
                const transport = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS,
                    },
                });
                await transport.sendMail({
                    from: process.env.MAIL_USER,
                    to: email,
                    subject: `Order Update`,
                    text: message,
                });
            } catch (err) {
                console.log("Email error:", err);
            }
        }

    } catch (err) {
        console.log("Notification wrapper error:", err);
    }
};
