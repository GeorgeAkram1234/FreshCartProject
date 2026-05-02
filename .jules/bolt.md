## 2026-05-02 - [React Query Deduplication for Wishlist]
**Learning:** React Query successfully resolved an N+1 API call bottleneck in the Product component by deduplicating and caching wishlist requests across all product cards on a page. The shared query key ['wishlist', userToken] ensures that only one request is sent even when dozens of components mount simultaneously.
**Action:** Prefer React Query for data that is shared across many instances of a component to avoid redundant network requests.
