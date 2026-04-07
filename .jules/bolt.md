## 2025-05-15 - [Centralized Wishlist Management with React Query]
**Learning:** Initial wishlist implementation in the Product component triggered a network request per product to check existence (O(N) API calls on list render). This caused significant latency and unnecessary network traffic.
**Action:** Centralize wishlist state in a Context Provider using React Query. Derive an O(1) lookup Set (wishlistIds) from the cached wishlist array. This reduces network traffic to a single fetch and improves render performance on large product lists.
