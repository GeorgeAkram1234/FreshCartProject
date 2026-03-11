## 2025-05-15 - [Hoisting in Context Providers]
**Learning:** Defining async functions as constants (e.g., using `useCallback`) after a `useEffect` that calls them results in a `ReferenceError` because `const` declarations are not hoisted.
**Action:** Always define `useCallback` hooks and other constant-based functions before any `useEffect` hooks that depend on them.

## 2025-05-15 - [Build Artifacts in Git]
**Learning:** Running `npm run build` can modify files in `dist/` which may be tracked in the repository. These should not be included in PRs as they pollute the diff.
**Action:** Use `git restore dist/` or `git reset HEAD dist/` to ensure build artifacts are excluded from the commit.
