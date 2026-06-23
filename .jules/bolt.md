## 2025-05-15 - Route-based Code Splitting
**Learning:** The application currently bundles all routes and components into a single monolithic `index.js` (approx. 498.69 kB). This increases the initial load time and delays the Time to Interactive (TTI), especially on slower networks. Static imports in `App.jsx` and `ProtectedRoute.jsx` prevent Vite/Rollup from effectively splitting the bundle.
**Action:** Implement `React.lazy()` for route components and refactor `ProtectedRoute` to use `Navigate` instead of direct component rendering to enable granular chunking.
