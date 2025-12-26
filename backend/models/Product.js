const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    colors: [String],
    sizes: [String],
    category: String,
    stock: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
