## 2025-05-22 - [Optimized Wishlist Fetching with React Query]
**Learning:** The application suffered from an N+1 API call bottleneck where every Product component individually checked its wishlist status on mount. By centralizing the wishlist state using React Query, 40+ redundant network requests were deduplicated into a single cached request.
**Action:** Always check if list item components are performing independent API calls for shared state; use React Query to deduplicate and cache these requests at the parent or global level.
