from playwright.sync_api import sync_playwright
import time

def verify_wishlist_dedup():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Track network requests
        wishlist_requests = []
        page.on("request", lambda request: wishlist_requests.append(request.url) if "api/v1/wishlist" in request.url and request.method == "GET" else None)

        # Go to home page
        page.goto("http://localhost:5173/")

        # Inject mock token
        page.evaluate("window.localStorage.setItem('token', 'mock-token')")

        # Reload to trigger AuthContextProvider
        page.reload()

        # Wait for content to load
        time.sleep(10)

        print(f"Total wishlist GET requests: {len(wishlist_requests)}")

        page.screenshot(path="/home/jules/verification/wishlist_dedup.png")
        browser.close()

        if len(wishlist_requests) == 1:
            print("SUCCESS: Wishlist requests deduplicated to 1.")
            return True
        elif len(wishlist_requests) > 1:
            print(f"FAILURE: Found {len(wishlist_requests)} wishlist requests. Expected 1.")
            return False
        else:
            print("WARNING: No wishlist requests detected.")
            return False

if __name__ == "__main__":
    verify_wishlist_dedup()
