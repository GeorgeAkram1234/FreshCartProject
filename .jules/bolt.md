## 2025-01-24 - [Route-based Code Splitting]
**Learning:** Static imports for all route components in `App.jsx` result in a large initial bundle size (approx. 500kB), which negatively impacts LCP and TTI.
**Action:** Use `React.lazy()` and `Suspense` for route-based code splitting to modularize the bundle and improve initial load performance.
