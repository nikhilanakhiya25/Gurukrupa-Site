# Admin API Routes Fix - TODO

## Completed Tasks
- [x] Added Product and Order models import to backend/routes/admin.js
- [x] Added /products route to admin.js that fetches all products from database
- [x] Added /orders route to admin.js that fetches all orders from database
- [x] Removed demo text from frontend/src/components/Admin/Dashboard.jsx
- [x] Changed title from "Sample Dashboard" to "Dashboard"

## Next Steps
- [ ] Redeploy backend on Render (Manual Deploy → Clear cache & deploy)
- [ ] Test APIs directly in browser:
  - https://gurukrupa-site-gtbp.onrender.com/api/admin/products
  - https://gurukrupa-site-gtbp.onrender.com/api/admin/orders
- [ ] Verify frontend dashboard loads real data instead of showing 0 products/orders

## Notes
- Backend routes are now mounted at /api/admin in server.js
- Frontend is already configured to call /admin/products and /admin/orders (relative to API base)
- Dashboard now uses real API data lengths for counts
