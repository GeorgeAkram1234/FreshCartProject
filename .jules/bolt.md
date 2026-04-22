## 2025-05-14 - [Wishlist API N+1 Bottleneck]
**Learning:** The `Product` component was performing an individual `isProductInWishlist` check on every render. Since this check involved fetching the entire wishlist from the API, it resulted in N API calls (where N is the number of products) on pages like Home and Products, even though each call returned the same wishlist data.
**Action:** Centralize wishlist data fetching using React Query to deduplicate and cache the request across all components.
