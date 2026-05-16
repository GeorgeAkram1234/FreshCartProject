## 2025-05-15 - N+1 Wishlist API Bottleneck
**Learning:** Individual components fetching the entire wishlist to determine their own 'in-wishlist' state created an N+1 network bottleneck on product-heavy pages (Home, Products). This hammered the API and slowed initial render.
**Action:** Use React Query for shared, cached state. By fetching the wishlist once at the parent or via a deduplicated query key in children, network requests drop from N+1 to 1.
