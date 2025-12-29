# TODO: Fix getImageSrc Bug in Admin Orders Page

## Completed Tasks
- [x] Identify the bug: getImageSrc is not defined in Orders.jsx
- [x] Replace getImageSrc usage with direct backend image URL
- [x] Fix the map function parameters (removed incorrect 'p' parameter)
- [x] Add proper image styling (width, height, objectFit)
- [x] Ensure REACT_APP_API_URL is used correctly
- [x] Test the fix by deploying to Vercel

## Next Steps
- Redeploy the frontend to Vercel to apply the changes
- Verify that /admin/orders page loads without errors
- Confirm images display correctly from backend /uploads
