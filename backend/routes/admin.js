// backend/routes/admin.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const Product = require("../models/Product");
const User = require("../models/User");
const orderController = require("../controller/orderController");
const {
  protect,
  admin
} = require("../middleware/auth");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ===================== MULTER CONFIG ===================== */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage
});

/* ===================== PRODUCTS ===================== */

// CREATE product
router.post(
  "/products",
  protect,
  admin,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        colors,
        category,
        countInStock,
        image: imageUrl
      } = req.body;

      let finalImageUrl = imageUrl || ""; // Use provided URL or empty string

      if (req.file) {
        // Upload to Cloudinary if file is provided
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "gurukrupa-products",
        });
        finalImageUrl = result.secure_url;

        // Remove local file after upload
        fs.unlinkSync(req.file.path);
      }

      const product = await Product.create({
        name,
        description,
        price,
        category,
        countInStock,
        image: finalImageUrl,
        colors: colors ? colors.split(",") : [],
      });

      res.json(product);
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);

// UPDATE product
router.put(
  "/products/:id",
  protect,
  admin,
  upload.single("image"),
  async (req, res) => {
    try {
      const update = {
        ...req.body
      };

      // Remove image from update to prevent setting to {} or invalid value
      delete update.image;

      if (req.file) {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "gurukrupa-products",
        });
        update.image = result.secure_url;

        // Remove local file after upload
        fs.unlinkSync(req.file.path);
      }

      if (update.colors) update.colors = update.colors.split(",");

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        update, {
          new: true
        }
      );

      res.json(product);
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);

// DELETE product
router.delete("/products/:id", protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({
      message: "Product deleted"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// GET all products (admin)
router.get("/products", protect, admin, async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1
    });
    res.json({ products });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/* ===================== USERS ===================== */

// GET all users (admin)
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/* ===================== ORDERS ===================== */

// GET all orders (admin)
router.get("/orders", protect, admin, orderController.getAllOrders);

// UPDATE order status
router.put("/orders/:id", protect, admin, async (req, res) => {
  try {
    const order = await orderController.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;
