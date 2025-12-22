import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://gurukrupa-giftarticles-site-d9rwn2bah-nikhils-projects-e7dc14d2.vercel.app"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
