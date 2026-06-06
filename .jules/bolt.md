## 2025-05-23 - [Optimization of Wishlist N+1 Fetching]
**Learning:** Each instance of the Product component was independently fetching the entire user wishlist to check if it was "favorited." On pages with many products (Home, Products), this resulted in dozens of redundant and synchronous API calls, severely bottlenecking the main thread and network.

**Action:** Centralized wishlist data fetching using React Query with a shared query key. This deduplicates identical requests into a single network call, provides automatic caching across route transitions, and ensures UI consistency (e.g., toggling a favorite in one component instantly updates it everywhere else).
