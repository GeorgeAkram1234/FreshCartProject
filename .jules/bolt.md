## 2024-05-15 - Wishlist N+1 Fetch Optimization
**Learning:** Each instance of the Product component was independently fetching the wishlist, leading to O(N) network requests on pages with many products.
**Action:** Use React Query's shared cache with a consistent query key (['wishlist', userToken]) to deduplicate requests into a single O(1) fetch.
