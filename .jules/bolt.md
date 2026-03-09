## 2025-05-15 - [Centralized Wishlist Management]
**Learning:** Per-product API calls to check status (e.g., in a list) is a major performance bottleneck. Centralizing this state in a Context and using a `Set` for O(1) lookups significantly reduces network overhead and improves responsiveness.
**Action:** Always look for patterns where child components are independently fetching the same or related global state. Move such state to a context or global store. Implement optimistic UI updates to maintain high perceived performance when moving from local to global state.
