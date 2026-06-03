## 2025-01-24 - Route-based Code Splitting
**Learning:** Implementing route-based code splitting using `React.lazy()` and `Suspense` significantly reduces the initial bundle size. In this project, it reduced the main bundle from 498.69 kB to 273.10 kB. However, static imports in `ProtectedRoute` can block certain components (like `Login`) from being moved to separate chunks.
**Action:** Always use `Navigate` for redirects in `ProtectedRoute` instead of direct component rendering to ensure effective code splitting.
