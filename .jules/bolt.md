## 2024-05-24 - Route-based Code Splitting and Cache Stability
**Learning:** Static imports in utility components like `ProtectedRoute` can block the effective code-splitting of the imported modules (e.g., `Login`) even if they are lazily loaded in `App.jsx`. Replacing direct component rendering with `react-router-dom` redirects (e.g., `<Navigate />`) allows the components to be moved into separate chunks.
**Action:** Use `Navigate` or dynamic imports for conditional rendering in route guards to ensure proper bundle splitting.
