## 2025-05-22 - Centralized Wishlist Fetching with React Query
**Learning:** The 'Product' component was causing an N+1 request pattern by fetching the wishlist individually for every product rendered. Since React Query deduplicates requests with the same key, centralizing this fetch in the 'Product' component with a shared key effectively collapses multiple requests into one.
**Action:** Use React Query 'useQuery' with shared keys for data that is needed across multiple component instances to prevent redundant API calls.
