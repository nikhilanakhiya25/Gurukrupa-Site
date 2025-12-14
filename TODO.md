# TODO: Make JWT Tokens Not Expire

- [x] Edit backend/controller/authController.js to remove expiresIn from generateToken function
- [ ] Verify that login and authentication still work without token expiration

# TODO: Fix 500 Internal Server Error in Admin Orders

- [x] Recreate backend/models/Order.js with proper Order schema
- [x] Test the admin orders endpoint to ensure 500 error is resolved
