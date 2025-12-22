# TODO: Fix Image Base URL with Environment Variables

## ✅ Completed Tasks
- [x] Created frontend/.env file with VITE_IMAGE_BASE_URL placeholder
- [x] Updated frontend/src/api/api.js to use import.meta.env.VITE_IMAGE_BASE_URL
- [x] Updated frontend/src/components/ProductList.jsx to define imageBaseURL using environment variable
- [x] Verified that other components (ProductCard.jsx, Admin/Products.jsx, Cart.jsx) import imageBaseURL from api.js, so they are automatically fixed

## 🔧 Manual Tasks Required
- [ ] Update frontend/.env file content:
  - Change `VITE_IMAGE_BASE_URL=https://your-backend-url.onrender.com`
  - To: `VITE_IMAGE_BASE_URL=https://gurukrupa-site-guftarticle.onrender.com`
- [ ] Add environment variable in Vercel Dashboard:
  - Go to Vercel → Project → Settings → Environment Variables
  - Add: Key: `VITE_IMAGE_BASE_URL`, Value: `https://gurukrupa-site-guftarticle.onrender.com`

## 📝 Notes
- The code now uses environment variables instead of hardcoded URLs
- All image references in ProductList, ProductCard, Admin Products, and Cart components will now use the environment variable
- Make sure to restart the development server after updating .env file

---

# Previous TODO Items (ES Modules Conversion)
- [ ] Convert server.js to ES modules
- [ ] Convert models (User.js, Product.js, Order.js) to ES modules
- [ ] Convert controllers (authController.js, userController.js, orderController.js) to ES modules
- [ ] Convert routes (user.js, notificationRoutes.js, admin.js, orderRoutes.js) to ES modules
- [ ] Convert middleware/auth.js to ES modules
- [ ] Convert utils/sendNotifications.js to ES modules
- [ ] Convert seed.js to ES modules
- [ ] Test the server to ensure it runs without errors
