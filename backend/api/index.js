const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));
app.use('/api/admin', require('../routes/admin'));
app.use('/api/user', require('../routes/user'));
app.use('/api/notifications', require('../routes/notificationRoutes'));

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running on Vercel 🚀");
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API Working" });
});

// MongoDB connect (IMPORTANT: connect ONCE)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://nikhilanakhiya1_db_user:Nikhil9763@cluster0.lamrfps.mongodb.net/?appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log("MongoDB connected");
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ✅ EXPORT APP
module.exports = app;
