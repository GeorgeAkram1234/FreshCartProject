## 2024-12-16 - [Wishlist Performance: Redundant API calls]
**Learning:** Checking the wishlist status for every product on a grid view (Home, Products) leads to $O(N)$ network requests if handled per-component. Centralizing this in a `WishlistContext` reduces this to $O(1)$ initial fetch and $O(1)$ local lookups using a `Set`.
**Action:** Always prefer centralizing common application state that requires network verification, especially when multiple components on the same view need the same data.
