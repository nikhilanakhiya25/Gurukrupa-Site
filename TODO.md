# CORS Fix Task

## Completed Steps
- [x] Update backend/server.js to use specific CORS config allowing frontend domain and localhost
- [x] Fix typo in frontend/src/api/api.js baseURL and add required headers and withCredentials

## Next Steps
- [ ] Redeploy backend on Render (manual deploy)
- [ ] Test API endpoints:
  - Open https://gurukrupa-site-giftarticle.onrender.com/api/products in browser (should return JSON)
  - Open frontend https://gurukrupa-site-giftarticle.vercel.app and check console for CORS errors
- [ ] Verify no CORS errors, products load, no red errors in console
