## 2025-05-15 - Optimized wishlist status check with React Query

**Learning:** Each `Product` component was independently fetching the wishlist on mount, causing an N+1 request pattern (80+ requests on the Home page). Centralizing the data fetch with `@tanstack/react-query` and using a shared query key `['wishlist', userToken]` deduplicates these into a single cached request.

**Action:** Use React Query for shared data across component instances to prevent redundant API calls and implement optimistic UI or efficient cache invalidation on updates.
