## 2025-05-14 - [Route-based Code Splitting]
**Learning:** Static imports in entry files like App.jsx or wrappers like ProtectedRoute.jsx prevent effective code splitting even when using React.lazy. Moving redirects to <Navigate /> in ProtectedRoute allowed the Login component to be correctly chunked.
**Action:** Use <Navigate /> for redirects in route guards to decouple chunk dependencies and ensure clean code splitting.
