## Tasks
- [x] Add static file serving in backend/server.js: app.use("/uploads", express.static("uploads"));
- [x] Create .env file in frontend root with VITE_IMAGE_BASE_URL=https://gurukrupa-site-gtbp.onrender.com
- [x] Update frontend/src/api/api.js to export imageBaseURL = import.meta.env.VITE_IMAGE_BASE_URL
- [x] Update frontend/src/components/ProductList.jsx to use imageBaseURL for path images
- [x] Update frontend/src/components/ProductCard.jsx to use ${imageBaseURL}/${product.image}
- [x] Update frontend/src/components/Admin/Products.jsx to define getImageSrc or use imageBaseURL
- [x] npm run build in frontend
- [ ] Redeploy frontend to Vercel with VITE_IMAGE_BASE_URL env var
- [ ] Test that images display correctly
=======
## Tasks
- [x] Add static file serving in backend/server.js: app.use("/uploads", express.static("uploads"));
- [x] Create .env file in frontend root with VITE_IMAGE_BASE_URL=https://gurukrupa-site-gtbp.onrender.com
