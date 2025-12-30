# TODO: Fix Google Security Issues

## Completed:
- [x] Checked for suspicious scripts (eval, document.write, crypto miners) - None found
- [x] Fixed HTTP links - None found in source code
- [x] Added Helmet to backend for security headers
- [x] Restricted CORS to production domain
- [x] Removed unused test routes (/api/test)

## Remaining:
- [ ] Redeploy frontend on Vercel
- [ ] Redeploy backend on Vercel
- [ ] Request Google Search Console review
- [ ] Verify no HTTP links in production (check VITE_API_URL is HTTPS)
