# Fix Image Loading Issue in MERN App

## Information Gathered
- getImageSrc function is already implemented correctly in frontend/src/utils/getImageSrc.js
- Backend server.js already serves static files from /uploads directory
- Most components are using getImageSrc, but some are not:
  - ProductCart.jsx uses src={product.image} directly
  - OrderTracking.jsx uses src={i.image} directly
- VITE_API_URL needs to be set in Vercel environment variables as https://your-backend-url.onrender.com (no trailing slash)

## Plan
- [ ] Update ProductCart.jsx to import and use getImageSrc
- [ ] Update OrderTracking.jsx to import and use getImageSrc
- [ ] Ensure all image usages are consistent

## Dependent Files
- frontend/src/components/ProductCart.jsx
- frontend/src/components/OrderTracking.jsx

## Followup Steps
- Set VITE_API_URL in Vercel dashboard environment variables
- Redeploy frontend on Vercel
- Test image loading
