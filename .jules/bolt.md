## 2025-05-15 - [Centralized State vs Per-Component Fetching]
**Learning:** In this codebase, components like `Product` were performing independent API calls for shared state (wishlist), leading to an N+1 network request problem. Centralizing this in a Context with React Query and a Set for O(1) lookups significantly improves performance and UI consistency.
**Action:** Always check if list items are making redundant API calls for global or shared state. Use Context + React Query for centralized caching.
