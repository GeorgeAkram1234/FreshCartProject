## 2026-05-30 - Route-based code splitting
**Learning:** Implementing route-based code splitting in 'App.jsx' using 'React.lazy' and 'Suspense' significantly reduces the main production bundle size. In this codebase, it reduced the 'index-*.js' file from 498.69 kB to 273.05 kB.
**Action:** Always consider route-based code splitting for applications with many distinct views to improve initial load performance.

## 2026-05-30 - Lazy initialization of QueryClient
**Learning:** Instantiating 'QueryClient' directly inside a functional component causes it to be recreated on every re-render, losing the cache.
**Action:** Use 'useState(() => new QueryClient())' to preserve the instance across re-renders.
