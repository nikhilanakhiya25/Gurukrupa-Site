// backend/controllers/userController.js
const User = require("../models/User");

// GET /api/users  (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users, hide password
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
