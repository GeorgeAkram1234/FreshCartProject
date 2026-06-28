## 2024-06-28 - Route-based code splitting
**Learning:** Large initial bundle sizes (e.g. ~500kB) can be significantly reduced (~45% reduction) using React.lazy and Suspense. However, static imports in intermediate components like ProtectedRoute can block code splitting for the imported modules.
**Action:** Always use Navigate or similar techniques instead of direct component rendering in route wrappers to enable proper chunking. Ensure build artifacts (dist/) are excluded from version control to maintain repo cleanliness.
