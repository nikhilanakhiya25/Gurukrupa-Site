# TODO: Fix 500 Internal Server Error on Deployed Site

## Completed Steps
- [x] Analyze backend code and identify issues
- [x] Create plan to fix API baseURL, env var inconsistency, and data seeding
- [x] Get user confirmation on plan
- [x] Update frontend/src/api/api.js: Change baseURL to "https://wooden-gurukrupa-api.onrender.com" (remove /api)
- [x] Update backend/config/db.js: Change process.env.MONGODB_URI to process.env.MONGO_URI

## Pending Steps
- [x] Run backend/seed.js locally with MONGO_URI set to Atlas connection string to populate data (user action: set MONGO_URI env var and run node backend/seed.js)
- [x] Redeploy backend on Render after fixes (user action)
- [x] Test backend API directly at https://wooden-gurukrupa-api.onrender.com/api/products (user action)
- [x] Verify frontend works after backend fixes (user action)
