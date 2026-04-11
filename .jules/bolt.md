## 2026-04-11 - [Centralized Wishlist Management]
**Learning:** Each `Product` component was previously making an independent API call to check if it was in the wishlist, creating an N+1 request problem on product listing pages.
**Action:** Centralized wishlist state in a `WishlistContext` using React Query. Derived a `Set` of IDs for $O(1)$ lookups in product cards, reducing network overhead from $N$ requests to 1 request.
