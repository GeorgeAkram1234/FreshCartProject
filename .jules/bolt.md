## 2026-05-17 - Shared Query for Wishlist (N+1 fix)
**Learning:** In a list view where each item component (e.g., `Product`) independently checks its status against a global resource (e.g., `wishlist`), it creates an N+1 API call bottleneck. React Query's shared query keys can automatically deduplicate these requests if triggered simultaneously.
**Action:** Use React Query for any state that is needed by multiple sibling components. Ensure a consistent `queryKey` and appropriate `staleTime` to maximize caching across the application.
