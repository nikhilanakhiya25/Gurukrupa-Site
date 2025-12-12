// Seed script - creates sample products and an admin user
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/mern_ecom";
mongoose.connect(MONGO).then(async ()=>{
  console.log("Connected - seeding...");
  await Product.deleteMany();
  await User.deleteMany();
  await Product.create([
    { name: "Demo Shoe", price: 29.99, description: "Comfort shoe", image: "", colors:["black","white"], countInStock:10},
    { name: "Demo Jacket", price: 59.99, description: "Warm jacket", image: "", colors:["brown"], countInStock:5}
  ]);
  const hashed = await bcrypt.hash("admin123",10);
  await User.create({ name:"Admin", email:"admin@example.com", password:hashed, isAdmin:true });
  console.log("Seed done");
  mongoose.disconnect();
}).catch(console.error);