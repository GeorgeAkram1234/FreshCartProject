## 2025-05-14 - [Wishlist Performance Bottleneck]
**Learning:** The application was performing an asynchronous API call (isProductInWishlist) inside every `Product` component's `useEffect`. This resulted in $O(N)$ network requests or redundant state checks when rendering lists of products (e.g., Home or Products pages).
**Action:** Use a global `WishlistContext` to fetch the wishlist once and provide $O(1)$ membership lookups using a `Set` of product IDs. Implement optimistic updates to keep the UI snappy.
