## 2025-06-04 - [Optimizing Wishlist Fetching]
**Learning:** The `Product` component's initial implementation triggered a full wishlist API fetch per instance to check for existence. In list views, this created a severe N+1 performance bottleneck, flooding the network with redundant requests for the same data.
**Action:** Centralize shared data fetching using React Query with a consistent query key (e.g., `['wishlist', userToken]`). This ensures the data is fetched once and shared across all component instances, significantly reducing network overhead and improving perceived performance.
