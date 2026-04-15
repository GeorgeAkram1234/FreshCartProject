## 2025-05-14 - [Wishlist Performance Optimization]
**Learning:** Each Product component was individually checking if it was in the wishlist by fetching the entire wishlist from the API, leading to N network requests for N products.
**Action:** Centralize wishlist state in a Context using React Query. Use a Set for O(1) membership checks in the Product component.
