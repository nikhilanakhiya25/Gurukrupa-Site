# TODO List for Gurukrupa-Site Deployment Fix

## Backend Setup (Render)
- [ ] Create backend/index.js with exact code from task
- [ ] Update backend/package.json to match task dependencies
- [ ] Delete backend/vercel.json (not needed for Render)
- [ ] Ensure backend folder structure matches task (models/, routes/, index.js, package.json, .env)

## Frontend Cleanup (Vercel)
- [ ] Delete frontend/server.js (if exists)
- [ ] Delete frontend/src/index.js (backend code)
- [ ] Delete frontend/api/ folder
- [ ] Delete frontend/lib/dbConnect.js
- [ ] Update frontend/vercel.json with headers from task
- [ ] Create frontend/.env with VITE_API_URL
- [ ] Update frontend/src/api/api.js to use VITE_API_URL

## Deployment Preparation
- [ ] Test backend locally (npm start in backend/)
- [ ] Test frontend locally (npm run dev in frontend/)
- [ ] Deploy backend to Render
- [ ] Update VITE_API_URL in frontend/.env with Render URL
- [ ] Deploy frontend to Vercel
