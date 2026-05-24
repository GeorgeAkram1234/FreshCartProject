## 2025-05-24 - [Optimized Wishlist Fetching with React Query]
**Learning:** Found a major N+1 performance bottleneck where every `Product` component independently queried the wishlist API on mount to determine its state. Centralizing this via React Query's `useQuery` with a shared key `['wishlist', userToken]` automatically deduplicates these requests, reducing network overhead by (N-1) requests per page load.
**Action:** Always look for shared state that is currently being fetched independently by multiple instances of a component and migrate to a cached/deduplicated fetching strategy.

## 2025-05-24 - [Strict Linting and Unused Imports]
**Learning:** The project has very strict linting (no-unused-vars) that fails the build on any warning. Many components were importing `React` or assets that were never used, contributing to a high error count.
**Action:** Explicitly remove unused imports (including `React` itself when not needed for JSX in modern React) before attempting a full build to satisfy the strict `lint` script.
