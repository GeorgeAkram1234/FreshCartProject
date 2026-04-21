## 2025-05-15 - [Wishlist N+1 Optimization]
**Learning:** React components (like `Product.jsx`) that render in lists often suffer from N+1 API call patterns if they independently fetch state (e.g., "is this in wishlist?"). This creates significant network overhead and redundant work.
**Action:** Use React Query's built-in request deduplication by sharing a `queryKey` across all list items. By moving the `QueryClient` outside the `App` component and using a centralized service for wishlist fetching, N network requests are collapsed into 1 cached request, drastically improving page load performance.

## 2025-05-15 - [Fragment Import Requirement]
**Learning:** Even when using JSX syntax, standard React components/utilities like `Fragment` (or `React.Fragment`) must be explicitly imported or referenced via the `React` namespace if the environment requires it for proper transpilation and bundling.
**Action:** Ensure `import { Fragment } from 'react'` is present when replacing top-level shorthand `<></>` if specific needs arise, or simply maintain consistent JSX patterns that the linter/bundler expects.
