# Backend Fix TODO

- [x] Update backend/models/Product.js to match the exact schema (remove extra fields like colors, countInStock)
- [x] Update backend/routes/productRoutes.js to match the exact code (fix Product.find() to Product.find(), error message to "PRODUCT API ERROR:")
- [x] Update backend/server.js to match the exact code (remove extra routes, fix test route)
- [x] Create backend/.env file with MONGO_URI
- [x] Test backend locally: cd backend, npm install, node server.js, check http://localhost:5000/api/products returns []
- [ ] Clean up backend structure to match: remove extra directories like config/, controller/, lib/, middleware/, uploads/, utils/, api/, seed.js, vercel.json if not needed
