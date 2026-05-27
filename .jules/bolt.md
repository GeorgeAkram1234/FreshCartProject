## 2025-05-27 - Optimized Route-based Code Splitting and Layout UX

**Learning:** Implementing `React.lazy()` for all routes significantly reduced the initial JavaScript bundle size from ~499 kB to ~273 kB (approx. 45% reduction). Placing the `Suspense` boundary in the `Layout` component around the `<Outlet />` provides a superior user experience compared to wrapping the entire `RouterProvider`, as it preserves the visibility of the Navbar and Footer during route transitions. Additionally, static imports in wrapper components like `ProtectedRoute` can block code splitting for the imported modules; replacing direct component rendering with React Router's `<Navigate />` is a critical pattern for ensuring effective chunking.

**Action:** Always prefer placing `Suspense` boundaries within Layout components rather than at the root level. Use `<Navigate />` for redirects in `ProtectedRoute` to ensure that the redirected-to components (like Login) can be fully moved into their own chunks.
