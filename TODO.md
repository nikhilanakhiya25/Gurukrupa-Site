# Deployment Steps for Gurukrupa-Site

## Backend Deployment on Render
- [ ] Sign up/login to Render (https://render.com)
- [ ] Create a new Web Service
- [ ] Connect your GitHub repository (Gurukrupa-Site)
- [ ] Set Root Directory to `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Add environment variables (if any, e.g., DATABASE_URL, JWT_SECRET)
- [ ] Deploy the backend
- [ ] Note the deployed URL (e.g., https://gurukrupa-site-backend.onrender.com)

## Frontend Deployment on Vercel
- [ ] Sign up/login to Vercel (https://vercel.com)
- [ ] Import your GitHub repository (Gurukrupa-Site)
- [ ] Set Root Directory to `frontend`
- [ ] Framework Preset: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Deploy the frontend
- [ ] Note the deployed URL (e.g., https://gurukrupa-site.vercel.app)

## Code Updates
- [ ] Update API baseURL in frontend/src/api/api.js to the Render backend URL
- [ ] Commit and push the changes to GitHub
- [ ] Redeploy both services if needed

## Testing
- [ ] Test the frontend URL to ensure it loads
- [ ] Test API calls (login, products, etc.) to ensure backend connectivity
