## 2024-05-22 - Static Imports vs Code Splitting
**Learning:** Static imports in utility components like `ProtectedRoute` can block the effective code-splitting of the imported modules (e.g., `Login`), even if those modules are lazy-loaded elsewhere.
**Action:** Use `react-router-dom` redirects like `<Navigate />` instead of direct rendering in guard components to ensure lazy-loaded components are correctly moved into separate chunks.

## 2024-05-22 - React Query N+1 Bottleneck
**Learning:** firing individual `useEffect` API calls within list items creates an N+1 performance bottleneck that bypasses React's rendering optimizations.
**Action:** Migrate list-item state checks to shared React Query `useQuery` hooks. This leverages request deduplication and caching to consolidate multiple redundant requests into a single network call.
