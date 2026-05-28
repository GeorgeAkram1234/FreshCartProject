## 2025-05-23 - Route-based code splitting
**Learning:** Implementing route-based code splitting using React.lazy and Suspense significantly reduces the initial bundle size (from ~500kB to ~270kB in this case). Static imports in components like ProtectedRoute can block code splitting for the imported components (e.g., Login).
**Action:** Always use Navigate or similar routing mechanisms instead of direct component rendering in wrappers to ensure effective code splitting. Always ensure build artifacts are gitignored.
