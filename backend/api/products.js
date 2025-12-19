import dbConnect from "../lib/dbConnect.js";
import Product from "../models/Product.js";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("PRODUCT FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}
