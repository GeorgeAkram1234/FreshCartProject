## 2025-02-14 - Route-based code splitting
**Learning:** Implementing `React.lazy()` for all main routes significantly reduced the initial bundle size (from 498.69 kB to 273.04 kB). However, static imports in intermediate components like `ProtectedRoute` can block effective code-splitting of the imported modules (e.g., `Login`).
**Action:** Use `react-router-dom` redirects like `<Navigate />` instead of direct component rendering in wrappers to ensure lazy-loaded components are moved into separate chunks and not bundled with the wrapper.
