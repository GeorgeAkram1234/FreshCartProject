## 2026-04-24 - [N+1 Wishlist API Calls]
**Learning:** Each instance of the Product component was individually fetching the entire wishlist to determine its state, leading to N+1 network requests on product listing pages.
**Action:** Implement React Query (useQuery) with a shared cache key to deduplicate requests and use query invalidation for state synchronization.
