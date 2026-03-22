
## 2025-05-14 - [Wishlist Optimization: N+1 to 1]
**Learning:** In list views (Home/Products), making an API call per item to check wishlist status creates a massive bottleneck and triggers rate limits/network congestion.
**Action:** Centralize frequently accessed cross-component state (like Wishlist) in a React Context with O(1) lookups (Set). This reduced network requests by ~98% on the product listing page (40+ requests down to 1).
