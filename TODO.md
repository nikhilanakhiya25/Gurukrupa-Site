# TODO: Deploy MERN Ecommerce Project

## 1. Push Code to GitHub
- [x] Initialize Git repository
- [x] Add all files to Git
- [x] Commit changes with message "Initial MERN ecommerce"
- [x] Push to GitHub repository

## 2. Setup MongoDB Atlas (Database Online)
- [ ] Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create FREE cluster (M0, Region: Mumbai recommended)
- [ ] Create Database User (Username, Password)
- [ ] Configure Network Access (Add IP: 0.0.0.0/0)
- [ ] Copy Connection String (e.g., mongodb+srv://username:password@cluster0.mongodb.net/ecommerce)

## 3. Deploy Backend (Node + Express) on Render
- [ ] Create Render account at https://render.com
- [ ] Create New Web Service
- [ ] Connect GitHub repository
- [ ] Set Root Directory: backend
- [ ] Set Build Command: npm install
- [ ] Set Start Command: node server.js
- [ ] Add Environment Variables:
  - MONGO_URI = [MongoDB Connection String]
  - JWT_SECRET = [Your Secret Key]
  - PORT = 5000
- [ ] Deploy and get backend URL (e.g., https://your-backend.onrender.com)

## 4. Deploy Frontend (React) on Vercel / Netlify
- [ ] Choose Vercel (https://vercel.com) or Netlify (https://netlify.com)
- [ ] Create account and connect GitHub repository
- [ ] Set build settings:
  - Build Command: npm run build
  - Publish Directory: build
- [ ] Add environment variables if needed (e.g., REACT_APP_API_URL = [Backend URL])
- [ ] Deploy and get frontend URL

## 5. Finalize and Test
- [ ] Update frontend API calls to use deployed backend URL
- [ ] Test the full application
- [ ] Make any necessary adjustments
