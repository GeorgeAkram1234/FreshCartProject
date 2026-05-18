## 2025-01-24 - Resolve Wishlist N+1 bottleneck
**Learning:** Each `Product` component was independently fetching the full wishlist to check its status, leading to N API calls (where N is the number of products) on pages like Home and Products.
**Action:** Use React Query with a shared query key and `staleTime` to deduplicate requests across multiple instances of the same component. Invalidate the query on mutation to maintain consistency.
