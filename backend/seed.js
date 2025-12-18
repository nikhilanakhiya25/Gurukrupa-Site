require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: 'Elegant Saree',
    description: 'Beautiful traditional saree with intricate embroidery.',
    price: 2500,
    image: '/uploads/1765270100902_WhatsApp Image 2025-10-31 at 10.29.23_da85983e.jpg',
    colors: ['Red', 'Blue', 'Green'],
    category: 'Sarees',
    countInStock: 10
  },
  {
    name: 'Designer Kurti',
    description: 'Stylish kurti with modern design and comfortable fabric.',
    price: 1200,
    image: '/uploads/1765705619392_IMG-20251111-WA0032.jpg',
    colors: ['White', 'Black', 'Pink'],
    category: 'Kurtis',
    countInStock: 15
  },
  {
    name: 'Traditional Lehenga',
    description: 'Exquisite lehenga for special occasions.',
    price: 5000,
    image: '/uploads/1765706396310_WhatsApp Image 2025-12-14 at 3.23.21 PM.jpeg',
    colors: ['Gold', 'Silver'],
    category: 'Lehengas',
    countInStock: 5
  },
  {
    name: 'Cotton Salwar Suit',
    description: 'Comfortable salwar suit made from pure cotton.',
    price: 1800,
    image: '/uploads/1765706458232_WhatsApp Image 2025-12-14 at 3.23.04 PM.jpeg',
    colors: ['Blue', 'Red'],
    category: 'Salwar Suits',
    countInStock: 20
  },
  {
    name: 'Embroidered Dupatta',
    description: 'Elegant dupatta with beautiful embroidery work.',
    price: 800,
    image: '/uploads/1765706467029_WhatsApp Image 2025-12-14 at 3.21.30 PM.jpeg',
    colors: ['Cream', 'Purple'],
    category: 'Dupattas',
    countInStock: 25
  },
  {
    name: 'Festive Blouse',
    description: 'Charming blouse perfect for festive wear.',
    price: 600,
    image: '/uploads/1765773121130_WhatsApp Image 2025-12-14 at 3.22.25 PM.jpeg',
    colors: ['Red', 'Green'],
    category: 'Blouses',
    countInStock: 30
  },
  {
    name: 'Silk Scarf',
    description: 'Luxurious silk scarf with vibrant colors.',
    price: 900,
    image: '/uploads/1765773146416_WhatsApp Image 2025-12-14 at 3.26.12 PM.jpeg',
    colors: ['Multicolor'],
    category: 'Scarves',
    countInStock: 12
  },
  {
    name: 'Anarkali Dress',
    description: 'Graceful Anarkali dress with flowing design.',
    price: 3200,
    image: '/uploads/1765773155261_WhatsApp Image 2025-12-14 at 3.22.25 PM.jpeg',
    colors: ['Maroon', 'Navy'],
    category: 'Dresses',
    countInStock: 8
  },
  {
    name: 'Chiffon Saree',
    description: 'Lightweight chiffon saree for elegant occasions.',
    price: 2800,
    image: '/uploads/1765773179900_WhatsApp Image 2025-12-14 at 3.21.59 PM.jpeg',
    colors: ['Pink', 'Yellow'],
    category: 'Sarees',
    countInStock: 7
  },
  {
    name: 'Printed Kurti Set',
    description: 'Trendy kurti set with matching bottoms.',
    price: 1500,
    image: '/uploads/1765773195882_WhatsApp Image 2025-12-14 at 3.23.30 PM.jpeg',
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
