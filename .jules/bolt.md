## 2025-05-14 - N+1 Wishlist API Bottleneck
**Learning:** Each `Product` component was independently fetching the entire wishlist to check its status, leading to N+1 API calls on pages with many products (e.g., Home, Products).
**Action:** Use React Query's `useQuery` with a shared key `['wishlist', userToken]` to deduplicate these requests into a single API call per page load/cache invalidation.

## 2025-05-14 - QueryClient Re-initialization
**Learning:** Initializing `QueryClient` directly in the `App` component body causes it to be recreated on every re-render of `App`, losing the cache.
**Action:** Use `useState(() => new QueryClient())` to ensure the `QueryClient` is only created once (lazy initialization).
