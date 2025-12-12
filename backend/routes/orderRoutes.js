// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth"); // expects exported protect & admin

// Create order (POST /api/orders)
router.post("/", auth.protect, orderController.createOrder);

// Get orders of logged-in user (GET /api/orders/my)
router.get("/my", auth.protect, orderController.getMyOrders);

// Admin: get all orders (GET /api/orders)
router.get("/", auth.protect, orderController.getAllOrders);

// Update order status (PUT /api/orders/:id/status)
router.put("/:id/status", auth.protect, auth.admin, orderController.updateStatus);

// Admin: send tracking message (POST /api/orders/:id/track)
router.post("/:id/track", auth.protect, auth.admin, orderController.sendTrackingMessage);

// Invoice download (GET /api/orders/:id/invoice)
router.get("/:id/invoice", auth.protect, orderController.getInvoice);

module.exports = router;
