## 2025-05-15 - [Wishlist Deduplication]
**Learning:** Each 'Product' component in a list view was independently fetching the entire wishlist to determine its status, leading to an N+1 network request problem.
**Action:** Centralize data fetching using React Query with a shared query key and 'staleTime' to automatically deduplicate requests.

## 2025-05-15 - [QueryClient Persistence]
**Learning:** Instantiating 'new QueryClient()' directly inside a functional component causes the cache to be wiped on every re-render.
**Action:** Use 'useState(() => new QueryClient())' for lazy initialization and persistence across the component lifecycle.
