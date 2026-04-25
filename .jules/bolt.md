## 2025-05-15 - [N+1 Wishlist API Calls]
**Learning:** In a product listing page, individual components checking wishlist status via `useEffect` created an N+1 API call bottleneck. React Query's `useQuery` with a shared key automatically deduplicates these calls into a single request.
**Action:** Always prefer shared React Query hooks for global data like wishlist or cart status to ensure efficiency and UI consistency.
