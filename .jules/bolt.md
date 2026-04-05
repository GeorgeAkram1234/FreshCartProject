## 2025-05-14 - Centralized Wishlist Management with React Query
**Learning:** Per-product API calls to check wishlist status on mount create O(N) network overhead. Centralizing state in a Context using React Query with a derived `Set` for O(1) lookups significantly improves performance and ensures UI synchronization.
**Action:** Use Context + React Query for server-side state that is shared across many components (like wishlists or carts) to avoid redundant fetches and ensure consistency.
