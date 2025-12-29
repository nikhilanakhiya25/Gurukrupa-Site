const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔐 Generate JWT
const generateToken = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET);
};

// ================== SIGNUP ==================
const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        // Check user exists
        const userExists = await User.findOne({
            email
        });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: email === 'admin@example.com',
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    signup,
    login
};

// ================== LOGIN ==================
const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Find user
        const user = await User.findOne({
            email
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({
                message: "Invalid email or password"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
