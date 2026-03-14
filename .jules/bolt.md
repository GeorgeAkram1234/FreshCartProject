## 2024-05-24 - [N+1 Wishlist API Problem]
**Learning:** Each `Product` component was fetching the entire wishlist independently to check its favorite status. In a list of 40 products, this triggered 40 redundant GET requests.
**Action:** Centralize wishlist state in a `WishlistContext` using a `Set` for $O(1)$ lookups and provide it globally to eliminate redundant network traffic.
