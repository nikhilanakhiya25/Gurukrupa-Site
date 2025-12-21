import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("PRODUCT API ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

export default router;
