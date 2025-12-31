const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController.js");

const { getAllOrders } = require("../controller/orderController.js");

const { protect, admin } = require("../middleware/auth.js");

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Admin routes
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Product routes
router.get("/products", protect, admin, getAllProducts);
router.post("/products", protect, admin, upload.single("image"), createProduct);
router.put("/products/:id", protect, admin, upload.single("image"), updateProduct);
router.delete("/products/:id", protect, admin, deleteProduct);

// Order routes
router.get("/orders", protect, admin, getAllOrders);

module.exports = router;
