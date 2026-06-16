## 2025-06-16 - [Route-based Code Splitting with Protected Routes]
**Learning:** Static imports in high-level wrapper components like `ProtectedRoute` can keep lazily-loaded components (like `Login`) in the main bundle. Refactoring wrappers to use redirects instead of direct rendering is necessary for effective code splitting.
**Action:** Always check wrapper components for static imports when implementing code splitting.
