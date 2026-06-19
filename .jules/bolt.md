## 2026-06-19 - Centralized Wishlist Caching
**Learning:** In this application, every `Product` component was independently fetching the entire user wishlist to check its own status. This resulted in an N+1 API call pattern where rendering N products triggered N duplicate GET requests to `/api/v1/wishlist`. Centralizing this data fetching using React Query with a shared query key `['wishlist', userToken]` automatically collapses these into a single request and ensures consistent UI state across the application.

**Action:** Always check if multiple instances of a component are fetching the same global state independently. Use React Query or a similar caching layer with shared keys to deduplicate requests and reduce server load.
