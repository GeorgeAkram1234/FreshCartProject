## 2026-04-08 - Route-based code splitting
**Learning:** Static imports in ProtectedRoute can prevent components (like Login) from being moved into separate chunks even if they are lazily loaded in App.jsx.
**Action:** Use `<Navigate to="/login" />` in ProtectedRoute instead of rendering the `<Login />` component directly to allow the Login component to be correctly code-split.
