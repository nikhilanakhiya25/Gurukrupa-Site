require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: 'Elegant Saree',
    description: 'Beautiful traditional saree with intricate embroidery.',
    price: 2500,
    image: 'https://res.cloudinary.com/c-75af072b5b43133257cb17b4755f85/image/upload/v1767004310/sample_saree.jpg',
    colors: ['Red', 'Blue', 'Green'],
    category: 'Sarees',
    countInStock: 10
  },
  {
    name: 'Designer Kurti',
    description: 'Stylish kurti with modern design and comfortable fabric.',
    price: 1200,
    image: 'https://res.cloudinary.com/c-75af072b5b43133257cb17b4755f85/image/upload/v1767004310/sample_kurti.jpg',
    colors: ['White', 'Black', 'Pink'],
    category: 'Kurtis',
    countInStock: 15
  },
  {
    name: 'Traditional Lehenga',
    description: 'Exquisite lehenga for special occasions.',
    price: 5000,
    image: 'https://res.cloudinary.com/c-75af072b5b43133257cb17b4755f85/image/upload/v1767004310/sample_lehenga.jpg',
    colors: ['Gold', 'Silver'],
    category: 'Lehengas',
    countInStock: 5
  },
  {
    name: 'Cotton Salwar Suit',
    description: 'Comfortable salwar suit made from pure cotton.',
    price: 1800,
    image: 'https://res.cloudinary.com/c-75af072b5b43133257cb17b4755f85/image/upload/v1767004310/sample_salwar.jpg',
    colors: ['Blue', 'Red'],
    category: 'Salwar Suits',
    countInStock: 20
  },
  {
    name: 'Embroidered Dupatta',
    description: 'Elegant dupatta with beautiful embroidery work.',
    price: 800,
    image: 'https://res.cloudinary.com/c-75af072b5b43133257cb17b4755f85/image/upload/v1767004310/sample_dupatta.jpg',
    colors: ['Cream', 'Purple'],
    category: 'Dupattas',
    countInStock: 25
  },
  {
    name: 'Festive Blouse',
    description: 'Charming blouse perfect for festive wear.',
    price: 600,
    image: 'https://res.cloudinary.com/c-75af072b5b43133257cb17b4755f85/image/upload/v1767004310/sample_blouse.jpg',
    colors: ['Red', 'Green'],
    category: 'Blouses',
    countInStock: 30
  },
  {
    name: 'Silk Scarf',
    description: 'Luxurious silk scarf with vibrant colors.',
    price: 900,
    image: 'https://res.cloudinary.com/c-75af072b5b43133257cb17b4755f85/image/upload/v1767004310/sample_scarf.jpg',
    colors: ['Multicolor'],
    category: 'Scarves',
    countInStock: 12
  },
  {
    name: 'Anarkali Dress',
    description: 'Graceful Anarkali dress with flowing design.',
    price: 3200,
    image: 'https://res.cloudinary.com/c-75af072b5b43133257cb17b4755f85/image/upload/v1767004310/sample_anarkali.jpg',
    colors: ['Maroon', 'Navy'],
    category: 'Dresses',
    countInStock: 8
  },
  {
    name: 'Chiffon Saree',
    description: 'Lightweight chiffon saree for elegant occasions.',
    price: 2800,
    image: 'https://res.cloudinary.com/c-75af072b5b43133257cb17b4755f85/image/upload/v1767004310/sample_chiffon.jpg',
    colors: ['Pink', 'Yellow'],
    category: 'Sarees',
    countInStock: 7
  },
  {
    name: 'Printed Kurti Set',
    description: 'Trendy kurti set with matching bottoms.',
    price: 1500,
    image: 'https://res.cloudinary.com/c-75af072b5b43133257cb17b4755f85/image/upload/v1767004310/sample_kurti_set.jpg',
    colors: ['Orange', 'Black'],
    category: 'Kurtis',
    countInStock: 18
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-ecom', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');

    await Product.deleteMany({});
    console.log('Existing products cleared');

    await Product.insertMany(products);
    console.log('Products seeded successfully');

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
  }
};

seedDB();
