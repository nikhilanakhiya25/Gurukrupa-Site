# TODO: Fix Product Images Display Issue

## Tasks
- [ ] Update `getImageSrc.js` to properly handle full URLs (e.g., Cloudinary URLs) without prefixing with API URL
- [x] Replace invalid Cloudinary URLs in `seed.js` with working placeholder images
- [x] Add onError fallback to all product image `<img>` tags in components (ProductList, Cart, Admin/Products, ProductCard, HomePage, ProductCart)
- [x] Ensure all product details and images are displayed correctly everywhere

## Files to Edit
- frontend/src/utils/getImageSrc.js
- backend/seed.js
- frontend/src/components/ProductList.jsx
- frontend/src/components/Cart/Cart.jsx
- frontend/src/components/Admin/Products.jsx
- frontend/src/components/ProductCard.jsx
- frontend/src/components/HomePage.jsx
- frontend/src/components/ProductCart.jsx
