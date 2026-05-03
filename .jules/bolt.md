## 2025-05-15 - [N+1 Wishlist API Calls]
**Learning:** Each 'Product' component was individually checking its wishlist status on mount, leading to N requests for N products. Using React Query with a shared query key and 'staleTime' deduplicates these into a single request.
**Action:** Always check for repeated API patterns in list views and migrate them to a cached, shared query state.

## 2025-05-15 - [Build Artifacts in Git]
**Learning:** The 'dist' directory was being tracked in Git, causing unnecessary bloat and potential merge conflicts when running 'npm run build'.
**Action:** Ensure 'dist' is added to '.gitignore' and removed from the Git index using 'git rm -r --cached dist/'.
