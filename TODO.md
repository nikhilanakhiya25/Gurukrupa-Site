# TODO List for API and CORS Fixes

## Frontend Fixes
- [x] Update frontend/src/api/api.js to remove /api from baseURL

## Backend Fixes
- [x] Update backend/server.js to mount authRoutes.js for /api/users
- [x] Add correct Vercel domain to CORS origins in backend/server.js
- [x] Add GET /api/users route to authRoutes.js with JWT protection

## Deployment
- [x] Commit and push code changes to repository

## Testing (After Render Redeploy)
- [ ] Redeploy backend on Render (manual step)
- [ ] Test backend health: https://gurukrupa-site-giftarticle.onrender.com/
- [ ] Test products API: https://gurukrupa-site-giftarticle.onrender.com/api/products
- [ ] Test login API (POST) /api/users/login
- [ ] Test signup page /signup
