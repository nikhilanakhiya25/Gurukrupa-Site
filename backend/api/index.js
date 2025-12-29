import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import {
  fileURLToPath
} from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(
  import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://gurukrupa-site-nu.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({
  limit: '10mb'
}));
app.use(express.urlencoded({
  limit: '10mb',
  extended: true
}));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
import authRoutes from '../routes/authRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';
import adminRoutes from '../routes/admin.js';
import userRoutes from '../routes/user.js';
import notificationRoutes from '../routes/notificationRoutes.js';

app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running on Vercel 🚀");
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "API Working"
  });
});

// MongoDB connect (IMPORTANT: connect ONCE)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://nikhilanakhiya1_db_user:GjiKLsVeRsXb5afD@mern-ecom.l8xvija.mongodb.net/?appName=mern-ecom', {
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
export default app;