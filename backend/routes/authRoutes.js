const express = require("express");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const userController = require("../controller/userController");

const router = express.Router();

// Helper: Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "secret123", { expiresIn: "3655d" });
};

// ================= SIGNUP =================
router.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const exists = await User.findOne({
            email
        });
        if (exists) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.isAdmin ? "admin" : "user",
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});

// ================= GET ALL USERS (Admin Only) =================
router.get("/", auth.protect, auth.admin, userController.getAllUsers);

module.exports = router;
