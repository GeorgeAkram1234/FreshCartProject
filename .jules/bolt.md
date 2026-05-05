## 2026-05-05 - [Wishlist N+1 Fetching]
**Learning:** Each `Product` component was independently fetching the wishlist, causing an N+1 network bottleneck on product listing pages.
**Action:** Migrated wishlist fetching to React Query with a shared `['wishlist', userToken]` key to deduplicate requests and used `loading="lazy"` for product images to improve LCP.
