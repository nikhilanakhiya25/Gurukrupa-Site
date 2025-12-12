// backend/utils/whatsapp.js
const axios = require("axios");

const INSTANCE = process.env.ULTRAMSG_INSTANCE; // e.g. instance123
const TOKEN = process.env.ULTRAMSG_TOKEN;

const sendWhatsApp = async (phone, message) => {
  if (!INSTANCE || !TOKEN) {
    console.warn("WhatsApp credentials not set - skipping send");
    return;
  }

  const to = String(phone).replace(/\D/g, "");
  const url = `https://api.ultramsg.com/${INSTANCE}/messages/chat`;

  try {
    await axios.post(url, {
      token: TOKEN,
      to,
      body: message
    });
    console.log("WhatsApp sent to", to);
  } catch (err) {
    console.error("WhatsApp send error:", err.response?.data || err.message || err);
  }
};

module.exports = { sendWhatsApp };
