## 2025-05-15 - [Centralized Wishlist State]
**Learning:** Each `Product` component was independently fetching the wishlist to check its status, leading to $N$ redundant API calls on product lists. Instantiating `QueryClient` inside the `App` component caused cache loss on every re-render.
**Action:** Centralize wishlist state in a `WishlistContext` using React Query to reduce network overhead to $O(1)$ and use a `Set` for $O(1)$ presence checks. Always instantiate `QueryClient` outside the component tree.
