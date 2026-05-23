## 2026-05-23 - Resolved N+1 Wishlist API Bottleneck
**Learning:** Individual components fetching their own wishlist state created an N+1 network request problem. Migrating to React Query with a shared query key automatically deduplicates these requests into a single network call.
**Action:** Always prefer React Query for global or shared state that depends on API calls to leverage automatic deduplication and caching.
## 2026-05-23 - Implemented Route-based Code Splitting
**Learning:** Large monolithic bundles slow down initial TTI. Implementing React.lazy and Suspense for routes, while updating ProtectedRoute to use Navigate, effectively splits the bundle into smaller, manageable chunks.
**Action:** Use code splitting for all top-level routes and ensure Higher-Order Components (like ProtectedRoute) don't block splitting by statically importing components.
