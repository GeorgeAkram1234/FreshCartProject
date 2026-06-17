## 2025-05-15 - Wishlist N+1 Deduplication
**Learning:** In a component-heavy page like a product listing, individual components fetching their own state from a shared endpoint causes an N+1 request pattern. React Query collapses these redundant requests automatically if they share the same key and are initiated in the same render cycle.
**Action:** Always centralize data fetching for shared entities like Wishlist or Cart using React Query with a stable key. Ensure `QueryClient` is defined outside the `App` component to maintain cache integrity.

## 2025-05-15 - Repository Hygiene
**Learning:** Committing the `dist/` directory or modifying it directly is a violation of build pipeline standards and can lead to broken production assets.
**Action:** Ensure `dist/` is in `.gitignore` and never manually modify build artifacts.
