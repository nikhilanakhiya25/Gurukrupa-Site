// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");

// USER: Create order
router.post("/", auth.protect, orderController.createOrder);

// USER: Get logged-in user's orders
router.get("/myorders", auth.protect, orderController.getMyOrders);

// ADMIN: Get ALL orders
router.get("/", auth.protect, auth.admin, orderController.getAllOrders);

// ADMIN: Update order status
router.put("/:id/status", auth.protect, auth.admin, orderController.updateStatus);

// ADMIN: Send tracking message
router.post("/:id/track", auth.protect, auth.admin, orderController.sendTrackingMessage);

// USER: Download invoice
router.get("/:id/invoice", auth.protect, orderController.getInvoice);

module.exports = router;
