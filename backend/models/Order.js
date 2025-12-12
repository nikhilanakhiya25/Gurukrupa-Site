// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/auth");
const twilio = require("twilio");
const PDFDocument = require("pdfkit");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const SMS_FROM = process.env.TWILIO_SMS;
const WHATSAPP_FROM = "whatsapp:+14155238886";

/* ------------------ CREATE ORDER ------------------ */
router.post("/create", protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: "Order items missing" });

    const items = Array.isArray(orderItems) ? orderItems : [];

    const shipping = {
      fullName: shippingAddress.fullName || shippingAddress.name,
      phone: shippingAddress.phone,
      address: shippingAddress.address,
      city: shippingAddress.city,
      pincode: shippingAddress.pincode || shippingAddress.postalCode,
    };

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress: shipping,
      totalAmount: totalPrice,
      paymentMethod,
      status: "Pending",
    });

    const msg = `Hello ${shipping.fullName},
Your order has been placed!
Order ID: ${order._id}
Amount: ₹${order.totalAmount}
Status: Pending`;

    if (shipping.phone) {
      try {
        await client.messages.create({
          from: SMS_FROM,
          to: shipping.phone,
          body: msg,
        });
      } catch (e) {
        console.log("SMS Error:", e.message);
      }

      try {
        await client.messages.create({
          from: WHATSAPP_FROM,
          to: "whatsapp:" + shipping.phone,
          body: msg,
        });
      } catch (e) {
        console.log("WhatsApp Error:", e.message);
      }
    }

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ------------------ USER: MY ORDERS ------------------ */
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product",
      "name price image"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------ ADMIN: GET ALL ORDERS ------------------ */
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product", "name price image");

    res.json(orders);
  } catch (err) {
    console.error("GET ALL ORDERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------ ADMIN: UPDATE STATUS ------------------ */
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate("user");

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    const phone = order.user?.phone || order.shippingAddress.phone;

    const text = `Hello ${order.user?.name || "Customer"},
Your order ${order._id} status changed to ${status}.`;

    if (phone) {
      try {
        await client.messages.create({
          from: SMS_FROM,
          to: phone,
          body: text,
        });
      } catch (e) {
        console.log("SMS error:", e.message);
      }

      try {
        await client.messages.create({
          from: WHATSAPP_FROM,
          to: "whatsapp:" + phone,
          body: text,
        });
      } catch (e) {
        console.log("WA error:", e.message);
      }
    }

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------ ADMIN: SEND TRACKING MESSAGE ------------------ */
router.post("/:id/track", protect, admin, async (req, res) => {
  try {
    const { message } = req.body;
    const order = await Order.findById(req.params.id).populate("user");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const phone = order.user?.phone || order.shippingAddress.phone;

    const body = `Update for order ${order._id}: ${message}`;

    await client.messages.create({ from: SMS_FROM, to: phone, body });
    await client.messages.create({
      from: WHATSAPP_FROM,
      to: "whatsapp:" + phone,
      body,
    });

    res.json({ message: "Tracking message sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------ INVOICE GENERATION ------------------ */
router.get("/:id/invoice", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email phone"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!req.user.isAdmin && String(order.user._id) !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(22).text("Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${order.createdAt}`);
    doc.text(`Customer: ${order.user?.name}`);
    doc.text(`Phone: ${order.user?.phone}`);
    doc.moveDown();

    doc.fontSize(14).text("Items:");
    order.items.forEach((it, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${it.name} — ${it.qty} × ₹${it.price} = ₹${
          it.qty * it.price
        }`
      );
    });

    doc.moveDown();
    doc.fontSize(16).text(`Total: ₹${order.totalAmount}`, { align: "right" });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
