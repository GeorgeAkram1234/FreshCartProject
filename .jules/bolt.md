## 2025-05-14 - [Wishlist Performance Optimization]
**Learning:** The application was suffering from an N+1 request pattern on the frontend where every product in a list would independently fetch the user's wishlist to check for its own presence. This resulted in dozens of redundant API calls per page load.
**Action:** Centralized wishlist state in a `WishlistContext` and used a `useMemo` to create a `Set` for O(1) lookups. This reduced network traffic by ~98% on product-heavy pages and improved rendering efficiency.
