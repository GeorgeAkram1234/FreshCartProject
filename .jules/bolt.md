## 2025-05-14 - Eliminate N+1 wishlist requests
**Learning:** Individual components fetching their own wishlist status caused N network requests (N = number of products).
**Action:** Use React Query's 'useQuery' with a shared key and 'staleTime' to deduplicate and cache the wishlist fetch across all components.
