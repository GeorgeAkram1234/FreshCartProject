## 2025-03-03 - Client-side N+1 Wishlist Fetching
**Learning:** Each `Product` component was independently fetching the entire wishlist to check if it was already "liked", leading to N API requests on product listing pages.
**Action:** Centralized wishlist fetching using React Query with a shared `['wishlist']` key and `staleTime`. This deduplicates the N requests into a single request per page load.
