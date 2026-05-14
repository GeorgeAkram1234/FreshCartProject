## 2025-05-15 - [React Query Migration for Wishlist]
**Learning:** Migrating from manual `useEffect` + `axios` fetching to React Query (TanStack Query) provides significant performance benefits through request deduplication and shared caching. In this codebase, every `Product` component was individually fetching the wishlist, leading to N+1 API calls.
**Action:** Always look for N+1 request patterns in component lists and migrate them to a shared cache solution like React Query with an appropriate `staleTime`.

## 2025-05-15 - [Build Artifacts and UI Regressions]
**Learning:** Running `npm run build` may generate files in `dist/` which should not be committed if they are not already tracked and correctly ignored. Also, performance optimizations should avoid making out-of-scope UI changes (like removing data fields) unless explicitly requested.
**Action:** Ensure `dist/` is in `.gitignore` and removed from git cache if accidentally tracked. Be cautious when refactoring UI components to preserve existing data display.
