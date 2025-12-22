const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ✅ CORRECT CORS CONFIG */
app.use(cors({
  origin: [
    "https://gurukrupa-site-giftarticle.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/products", require("./routes/productRoutes.js"));
app.use("/api/users", require("./routes/authRoutes.js"));
app.use("/api/admin", require("./routes/admin.js"));
app.use("/api/orders", require("./routes/orderRoutes.js"));

// Test route
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
