const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// example route
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
