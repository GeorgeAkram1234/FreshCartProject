## 2024-05-22 - [Centralized Wishlist State Management]
**Learning:** Transitioning from per-component API calls to a centralized `WishlistContext` with an $O(1)$ Set for existence checks significantly reduces network traffic and improves rendering performance for product lists.
**Action:** Always prefer global state providers for data that is shared across many identical components (like "is in wishlist" status for product cards) to avoid redundant fetches and synchronization issues.
