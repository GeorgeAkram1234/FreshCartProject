## 2025-01-24 - [N+1 Wishlist Fetch Bottleneck]
**Learning:** React components (like Product cards) often independently fetch global state (like a user's wishlist) via `useEffect`, creating an N+1 network problem where N components trigger N API calls for the same data.
**Action:** Use React Query with a shared query key (e.g., `['wishlist', userToken]`) and a reasonable `staleTime` to automatically deduplicate these requests into a single network call.

## 2025-01-24 - [Avoid Committing Build Artifacts]
**Learning:** Running production builds locally can generate artifacts in `dist/` that might not be in `.gitignore`, leading to accidental staging of minified files.
**Action:** Always verify `.gitignore` covers build output directories and use `git status` to ensure only source files are staged before submission.
