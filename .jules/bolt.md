## 2026-04-23 - [Optimized Wishlist Fetching with React Query]
**Learning:** The 'Product' component was performing an N+1 API call pattern by fetching the full wishlist status individually for every product on the home page. Implementing React Query's 'useQuery' with a shared 'wishlist' key effectively deduplicates these requests, reducing network overhead from potentially dozens of calls to just one.
**Action:** Always check for repeated API calls in list components and leverage React Query for request deduplication and caching.
