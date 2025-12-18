# TODO: Convert Frontend to Vite for Vercel Deployment

- [ ] Update frontend/package.json: Remove react-scripts, add "type": "module", change scripts to use vite, add vite dependencies.
- [ ] Rename frontend/src/index.js to frontend/src/main.jsx.
- [ ] Update frontend/public/index.html to include <script type="module" src="/src/main.jsx"></script>.
- [ ] Remove the frontend/build folder as it's CRA build.
- [ ] Install dependencies and test build locally.
- [ ] Update Vercel settings: Framework Preset to Vite, Build Command to npm run build, Output Directory to dist, Install Command to npm install.
- [ ] Clear build cache in Vercel and redeploy.
