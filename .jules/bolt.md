## 2024-11-20 - [Bundle Size Optimization]
**Learning:** The initial production bundle was ~498KB with all routes statically imported in `App.jsx`. This leads to poor initial load times as the entire application must be downloaded before the first render.
**Action:** Implement route-level code splitting using `React.lazy` and `Suspense` to reduce the entry chunk size.
