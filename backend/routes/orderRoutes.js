const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateStatus, getInvoice, sendTrackingMessage } = require("../controller/orderController.js");
const { protect, admin } = require("../middleware/auth.js");

// Create order (POST /api/orders)
router.post("/", protect, orderController.createOrder);

// Get orders of logged-in user (GET /api/orders/my)
router.get("/my", protect, orderController.getMyOrders);

// Admin: get all orders (GET /api/orders)
router.get("/", protect, admin, orderController.getAllOrders);

// Update order status (PUT /api/orders/:id/status)
router.put("/:id/status", protect, admin, orderController.updateStatus);

// Admin: send tracking message (POST /api/orders/:id/track)
router.post("/:id/track", protect, admin, orderController.sendTrackingMessage);

// Invoice download (GET /api/orders/:id/invoice)
router.get("/:id/invoice", protect, orderController.getInvoice);

module.exports = router;
