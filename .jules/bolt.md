## 2025-05-15 - [Initial Project State]
**Learning:** The application currently makes redundant O(N) API calls to check wishlist status for each product in a list. A global WishlistContext with a Set for O(1) lookups is the preferred optimization.
**Action:** Implement WishlistContext and refactor Product component.

## 2025-05-15 - [Linting and React Best Practices]
**Learning:** ESLint rules are strict (--max-warnings 0). Components should not import 'React' (it's unnecessary in this project) and should use '/* eslint-disable react/prop-types */' if prop-types are missing. Async functions in Context Providers should use 'useCallback'.
**Action:** Follow these patterns in new code.
