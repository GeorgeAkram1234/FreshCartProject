## 2026-06-21 - Route-based code splitting
**Learning:** Implementing route-based code splitting using `React.lazy` and `Suspense` significantly reduces the initial bundle size (from 498kB to 273kB) and improves initial load performance. Statically importing components (like `Login` in `ProtectedRoute`) can prevent them from being moved into separate chunks.
**Action:** Always use `React.lazy` for route components and ensure no static imports of those components exist in the critical path (e.g., use `<Navigate />` for redirects instead of direct component rendering).
