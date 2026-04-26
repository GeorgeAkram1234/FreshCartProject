## 2025-05-14 - [React Query for Wishlist]
**Learning:** In e-commerce apps with repeated product components, fetching the same global state (like wishlist) in each component causes N+1 API calls. React Query automatically deduplicates these requests when using the same `queryKey`.
**Action:** Always use React Query for shared data across multiple component instances to ensure network efficiency and UI consistency.
