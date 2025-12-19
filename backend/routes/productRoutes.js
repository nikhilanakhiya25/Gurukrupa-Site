const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products); // ✅ MUST RETURN
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Product fetch failed" });
  }
});

module.exports = router;
