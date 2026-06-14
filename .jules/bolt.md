## 2026-06-14 - Route-based code splitting
**Learning:** Static imports in entry points (App.jsx) and middleware components (ProtectedRoute.jsx) significantly bloat the main bundle. Redirecting to routes instead of direct component rendering in ProtectedRoute enables better chunking.
**Action:** Always use React.lazy() for route-level components and ensure middleware doesn't statically import them.
