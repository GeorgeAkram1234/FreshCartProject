# Bolt's Journal - Performance Optimizations

## 2024-05-15 - Global Wishlist State Optimization
**Learning:** The application was making a redundant $O(N)$ network request for every product card rendered on the Home and Products pages just to check if the product was in the user's wishlist. This led to hundreds of unnecessary API calls on initial load and search.
**Action:** Implemented a global `WishlistContext` that fetches the wishlist once and provides a `Set` of product IDs for $O(1)$ membership lookups. This reduces network overhead and ensures consistent UI state across the application.
