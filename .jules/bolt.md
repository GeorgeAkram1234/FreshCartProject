## 2026-05-15 - Wishlist API Deduplication
**Learning:** The application had an N+1 performance bottleneck where every Product component in a list (Home, Products pages) would individually call the wishlist API to check its status. On a page with 40 products, this resulted in 40 redundant API calls.

**Action:** Migrated wishlist state management to React Query with a shared ['wishlist'] query key. By using a central cache and a defined staleTime (10 minutes), network requests are now deduplicated across all components on the page, reducing the number of wishlist API calls from N to 1.
