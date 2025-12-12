const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) { const dir = path.join(__dirname, "..", "uploads"); if (!fs.existsSync(dir)) fs.mkdirSync(dir); cb(null, dir); },
  filename: function (req, file, cb) { cb(null, Date.now()+"_"+file.originalname); }
});
const upload = multer({ storage });

router.post("/product", protect, admin, upload.single("image"), async (req,res)=>{
  try{
    const { name, description, price, colors, category, countInStock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const p = await Product.create({ name, description, price, image, colors: colors ? colors.split(",") : [], category, countInStock });
    res.json(p);
  }catch(err){ res.status(500).json({ message: err.message }); }
});

router.put("/product/:id", protect, admin, upload.single("image"), async (req,res)=>{
  try{
    const update = { ...req.body };
    if(req.file) update.image = `/uploads/${req.file.filename}`;
    if(update.colors) update.colors = update.colors.split(",");
    const p = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(p);
  }catch(err){ res.status(500).json({ message: err.message }); }
});

router.delete("/product/:id", protect, admin, async (req,res)=>{
  try{
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  }catch(err){ res.status(500).json({ message: err.message }); }
});

module.exports = router;