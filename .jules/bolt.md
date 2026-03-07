## 2024-12-11 - [Redundant Per-Component API Calls]
**Learning:** The application was using an N+1 request pattern where each `Product` component made its own API call to check wishlist status. This led to ~40 redundant requests on the home page.
**Action:** Centralize shared state like wishlist or cart in a Context to fetch once and provide O(1) lookups via a Set.

## 2024-12-11 - [Avoid Build Artifacts in PR]
**Learning:** Committing `dist/` artifacts leads to massive, unreadable PRs and potential merge conflicts.
**Action:** Always ensure `dist/` is ignored and verify the change list before submission.
