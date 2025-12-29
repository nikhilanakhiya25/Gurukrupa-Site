# TODO: Implement Role-Based Access for Admin and Users

## Tasks
- [x] Modify backend authController signup to set isAdmin=true for admin@example.com
- [x] Update frontend AuthContext to set role based on isAdmin
- [ ] Test admin login with admin@example.com
- [ ] Test regular user login and access restrictions

## Status
- Implementation completed. Changes made:
  - Backend: Signup now sets isAdmin=true for admin@example.com
  - Frontend: AuthContext sets role="admin" if isAdmin=true, else "user"
- Testing: Start the backend and frontend servers, then:
  1. Signup with admin@example.com to create admin user
  2. Login with admin@example.com - should redirect to /admin/dashboard and show admin panel
  3. Signup with a regular email (e.g., user@example.com)
  4. Login with regular user - should show only user-side, no admin links
