## 2025-05-14 - [Fix N+1 wishlist fetch bottleneck using React Query]
**Learning:** Each `Product` component was fetching the entire wishlist individually to check its own "in-wishlist" status. On a page with 40 products, this triggered 40 redundant API calls. React Query deduplicates these automatically when using the same `queryKey`.
**Action:** Use `useQuery` for shared resources in list items to let React Query handle request deduplication and caching.
