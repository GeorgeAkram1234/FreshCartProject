## 2025-01-24 - [Optimization of Wishlist Status Checks]
**Learning:** In list-rendered components (like a product grid), performing an API call per item to determine state (e.g., "is in wishlist") creates an $O(N)$ network bottleneck. This is significantly worse than $O(N)$ CPU operations because of request overhead and rate limits.
**Action:** Lift the shared state to a global Context. Fetch the entire collection once, store it in a `Set` for $O(1)$ lookups, and provide this state to all child components. This reduces network traffic from $N$ requests to 1 request per page load.
