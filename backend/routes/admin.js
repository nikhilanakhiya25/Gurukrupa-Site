const User = require("../models/User");
const orderController = require("../controller/orderController");
const {
  protect,
  admin
} = require("../middleware/auth");

const Product = require("../models/Product");
const productController = require("../controller/productController");
