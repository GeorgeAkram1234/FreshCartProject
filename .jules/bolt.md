# Bolt's Performance Journal

## 2025-01-24 - [Wishlist Optimization & Query Persistence]
**Learning:** Redundant API calls in `useEffect` within list items (like product cards) create a significant $O(N)$ network bottleneck. Additionally, instantiating `QueryClient` inside a component causes cache resets on re-renders, neutralizing the benefits of React Query.
**Action:** Centralize repetitive state fetching into a Context using React Query. Move `QueryClient` instantiation outside the component tree to ensure cache persistence. Use `Set` for $O(1)$ presence checks in long lists.

## 2025-01-24 - [Build Artifacts and Git Tracking]
**Learning:** Running `npm run build` generates a `dist` directory that might not be in `.gitignore`. If build artifacts are tracked, they bloat the repository and cause unnecessary diff noise.
**Action:** Always verify `.gitignore` includes `dist`. If artifacts were previously tracked, use `git rm -r --cached dist/` to remove them from the index without deleting local files.
