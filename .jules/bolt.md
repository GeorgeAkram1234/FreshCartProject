## 2026-06-08 - Route-based code splitting
**Learning:** Implementing `React.lazy` and `Suspense` significantly reduces the initial production bundle size by splitting routes into separate chunks. In this project, the main bundle size dropped from 498.69 kB to 273.04 kB (~45% reduction).
**Action:** Always consider code splitting for large applications with many routes. Ensure `Suspense` boundaries are placed high enough to catch lazy loads but low enough to keep shared UI (like Navbar) visible.
