require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: 'Elegant Saree',
    description: 'Beautiful traditional saree with intricate embroidery.',
    price: 2500,
    image: 'https://via.placeholder.com/300x300?text=Saree',
    colors: ['Red', 'Blue', 'Green'],
    category: 'Sarees',
    countInStock: 10
  },
  {
    name: 'Designer Kurti',
    description: 'Stylish kurti with modern design and comfortable fabric.',
    price: 1200,
    image: 'https://via.placeholder.com/300x300?text=Kurti',
    colors: ['White', 'Black', 'Pink'],
    category: 'Kurtis',
    countInStock: 15
  },
  {
    name: 'Traditional Lehenga',
    description: 'Exquisite lehenga for special occasions.',
    price: 5000,
    image: 'https://via.placeholder.com/300x300?text=Lehenga',
    colors: ['Gold', 'Silver'],
    category: 'Lehengas',
    countInStock: 5
  },
  {
    name: 'Cotton Salwar Suit',
    description: 'Comfortable salwar suit made from pure cotton.',
    price: 1800,
    image: 'https://via.placeholder.com/300x300?text=Salwar+Suit',
    colors: ['Blue', 'Red'],
    category: 'Salwar Suits',
    countInStock: 20
  },
  {
    name: 'Embroidered Dupatta',
    description: 'Elegant dupatta with beautiful embroidery work.',
    price: 800,
    image: 'https://via.placeholder.com/300x300?text=Dupatta',
    colors: ['Cream', 'Purple'],
    category: 'Dupattas',
    countInStock: 25
  },
  {
    name: 'Festive Blouse',
    description: 'Charming blouse perfect for festive wear.',
    price: 600,
    image: 'https://via.placeholder.com/300x300?text=Blouse',
    colors: ['Red', 'Green'],
    category: 'Blouses',
    countInStock: 30
  },
  {
    name: 'Silk Scarf',
    description: 'Luxurious silk scarf with vibrant colors.',
    price: 900,
    image: 'https://via.placeholder.com/300x300?text=Scarf',
    colors: ['Multicolor'],
    category: 'Scarves',
    countInStock: 12
  },
  {
    name: 'Anarkali Dress',
    description: 'Graceful Anarkali dress with flowing design.',
    price: 3200,
    image: 'https://via.placeholder.com/300x300?text=Anarkali+Dress',
    colors: ['Maroon', 'Navy'],
    category: 'Dresses',
    countInStock: 8
  },
  {
    name: 'Chiffon Saree',
    description: 'Lightweight chiffon saree for elegant occasions.',
    price: 2800,
    image: 'https://via.placeholder.com/300x300?text=Chiffon+Saree',
    colors: ['Pink', 'Yellow'],
    category: 'Sarees',
    countInStock: 7
  },
  {
    name: 'Printed Kurti Set',
    description: 'Trendy kurti set with matching bottoms.',
    price: 1500,
    image: 'https://via.placeholder.com/300x300?text=Kurti+Set',
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
