## 2025-05-15 - [Wishlist API Deduplication]
**Learning:** The application was suffering from an N+1 fetching problem where each product component on a list page was individually fetching the entire wishlist to determine its heart icon state. This resulted in dozens of redundant API calls per page load.
**Action:** Use React Query's built-in request deduplication and caching by sharing a common query key across all components that need the same data. Ensure QueryClient is initialized outside the component tree to persist cache.
