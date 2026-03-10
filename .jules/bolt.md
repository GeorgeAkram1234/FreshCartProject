## 2024-05-22 - [Optimized Wishlist State Management]
**Learning:** The application was previously performing an N+1 API call pattern for the wishlist: for every product displayed on a page, a separate API request was made to fetch the entire wishlist and check for membership. This resulted in significant network overhead and redundant data transfer.
**Action:** Implemented a global `WishlistContext` to fetch the wishlist once and store IDs in a `Set` for O(1) membership lookups. This centralized approach eliminates redundant network requests and ensures consistent UI state across components.
