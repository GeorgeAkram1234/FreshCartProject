## 2026-05-12 - Wishlist Fetching Optimization
**Learning:** In this application, the wishlist was being fetched individually by each product component, leading to N+1 requests on listing pages. Using React Query's shared cache and query keys allows for seamless deduplication and instant UI updates across components.
**Action:** Always check for repeated API calls in list components and prefer centralized data fetching with React Query to ensure both performance and data consistency.
