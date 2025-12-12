const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===============================
// 🔐 PROTECT (User Auth Required)
// ===============================
exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = header.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user details to req.user
    req.user = {
      id: user._id.toString(),
      isAdmin: user.isAdmin === true,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
    };

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ===============================
// 🔐 ADMIN CHECK (Admin Only)
// ===============================
exports.admin = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};
