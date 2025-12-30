const express = require("express");
const router = express.Router();

const User = require("../models/User");

// example route
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
