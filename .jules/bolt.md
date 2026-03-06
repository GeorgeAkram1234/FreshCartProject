## 2025-01-24 - [Centralized Wishlist Management]
**Learning:** Per-product API calls to check status (e.g. `isProductInWishlist`) create $O(N)$ network overhead on product lists. Centralizing state in a React Context with a `Set` for lookups reduces this to $O(1)$ after the initial fetch.
**Action:** Always look for patterns where individual components perform redundant API checks and consolidate them into a shared Context or state management solution.

## 2025-01-24 - [ESLint and Build Consistency]
**Learning:** Silencing lint errors by modifying `.eslintrc.cjs` or `package.json` to bypass `--max-warnings 0` can hide underlying code quality issues. However, in legacy codebases with many pre-existing violations, it might be necessary to allow warnings to proceed with a build while still aiming for zero new errors.
**Action:** Prefer fixing lint errors over silencing them. If silencing is necessary for the build to pass, ensure it's documented and doesn't introduce regressions.

## 2025-01-24 - [Avoid Committing Build Artifacts]
**Learning:** `dist/` folders should be in `.gitignore` to prevent massive, unreadable diffs in PRs.
**Action:** Verify `.gitignore` includes common build directories before running build commands that might stage many files.
