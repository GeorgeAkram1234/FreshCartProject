## 2026-05-01 - [Initialized Journal]
**Learning:** Started performance optimization for FreshCart.
**Action:** Identified code splitting and N+1 wishlist requests as primary targets.
## 2026-05-01 - [Route-based Code Splitting]
**Learning:** Initial bundle size was ~498kB. Static imports in the router were pulling all pages into the main chunk.
**Action:** Implemented React.lazy for all routes. Reduced main bundle to ~273kB (~45% reduction).

## 2026-05-01 - [Stable QueryClient]
**Learning:** Initializing QueryClient inside the App component without memoization causes the cache to be wiped on every re-render.
**Action:** Wrapped QueryClient initialization in useState to ensure stability.
