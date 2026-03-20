## 2025-05-22 - Optimize Wishlist API Calls with Global Context

**Learning:** Redundant API calls in list components (O(N) network requests) are a major performance bottleneck. Centralizing shared state in a React Context and using an O(1) data structure like a Set for lookups significantly reduces network overhead and improves UI responsiveness.

**Action:** Always look for O(N) network or computation patterns in list items and consider centralizing them in a parent or context.
