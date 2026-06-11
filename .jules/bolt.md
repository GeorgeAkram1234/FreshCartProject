## 2025-01-30 - [Wishlist N+1 Fetching]
**Learning:** In a product grid, each component fetching its own wishlist status individually leads to an N+1 fetching pattern, severely impacting performance as the grid grows.
**Action:** Use React Query to centralize and deduplicate wishlist fetching across all instances using a shared query key like `['wishlist', userToken]`.
