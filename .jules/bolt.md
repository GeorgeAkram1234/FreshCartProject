## 2025-05-15 - [Wishlist Performance Optimization]
**Learning:** In large product lists, per-component API calls to check for wishlist status create significant network overhead and redundant processing ($O(N)$ network requests). Centralizing state in a React Context and using a `Set` for lookups reduces this to $O(1)$ presence checks and a single initial fetch.
**Action:** Prefer global state providers for metadata that applies to many items in a list (e.g., wishlist status, cart quantities, user permissions) to avoid the "waterfall" of component-level effects.
