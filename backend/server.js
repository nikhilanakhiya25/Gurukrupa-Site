const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://gurukrupa-giftarticle.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/user"));
app.use("/api/orders", require("./routes/orderRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
