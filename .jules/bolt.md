## 2026-04-09 - [Centralized Wishlist State]
**Learning:** Per-product API calls for wishlist membership created an N+1 request problem. Centralizing state in a Context with React Query reduced network traffic from O(N) to O(1) per page load.
**Action:** Always prefer centralized state for list-wide properties to avoid redundant API calls in component loops.
