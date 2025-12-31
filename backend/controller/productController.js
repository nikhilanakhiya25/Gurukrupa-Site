const Product = require("../models/Product.js");
const cloudinary = require("cloudinary").v2;

// =========================
// GET ALL PRODUCTS (ADMIN)
// =========================
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (err) {
    console.error("GET ALL PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// CREATE PRODUCT
// =========================
const createProduct = async (req, res) => {
  try {
    const { name, price, colors, countInStock } = req.body;

    let image = req.body.image; // Cloudinary URL or uploaded file

    // If file uploaded, upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      image = result.secure_url;
    }

    const product = await Product.create({
      name,
      price: Number(price),
      colors: colors ? JSON.parse(colors) : [],
      countInStock: Number(countInStock),
      image,
    });

    res.status(201).json({ product });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// =========================
// UPDATE PRODUCT
// =========================
const updateProduct = async (req, res) => {
  try {
    const { name, price, colors, countInStock } = req.body;

    let image = req.body.image; // Cloudinary URL or uploaded file

    // If file uploaded, upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      image = result.secure_url;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.price = price ? Number(price) : product.price;
    product.colors = colors ? JSON.parse(colors) : product.colors;
    product.countInStock = countInStock ? Number(countInStock) : product.countInStock;
    if (image) product.image = image;

    await product.save();

    res.json({ product });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// =========================
// DELETE PRODUCT
// =========================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
