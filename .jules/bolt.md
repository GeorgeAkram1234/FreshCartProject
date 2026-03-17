## 2025-05-15 - [Centralized Wishlist Management]
**Learning:** In ecommerce applications, fetching wishlist status individually for each product card leads to $O(N)$ network requests. Using a global context with a `Set` for ID lookups reduces this to $O(1)$ and eliminates redundant fetches.
**Action:** Always centralize commonly accessed user state (like wishlists or cart status) into a Context or State Management store and use efficient data structures like `Set` for membership checks.
