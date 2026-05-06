## 2025-05-15 - [Static Imports Blocking Code Splitting]
**Learning:** In a route-based code splitting setup using `React.lazy`, any static import of a component (like `Login`) in another non-lazy component (like `ProtectedRoute`) will prevent Vite/Rollup from moving that component into a separate chunk, even if it's lazily imported in the main router.
**Action:** Use `react-router-dom`'s `<Navigate />` or dynamic imports in such guard components to ensure the target component can be effectively code-split.
