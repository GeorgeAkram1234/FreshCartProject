from playwright.sync_api import sync_playwright
import time

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Record video to see the UI
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()

        # Mock products API
        page.route("https://ecommerce.routemisr.com/api/v1/products", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"data": [{"_id": "1", "title": "Product 1", "imageCover": "", "ratingsAverage": 4, "price": 100, "description": "Desc 1"}, {"_id": "2", "title": "Product 2", "imageCover": "", "ratingsAverage": 5, "price": 200, "description": "Desc 2"}]}'
        ))

        # Counter for wishlist requests
        wishlist_requests = []
        def handle_wishlist(route):
            wishlist_requests.append(route.request.url)
            route.fulfill(
                status=200,
                content_type="application/json",
                body='{"data": []}'
            )

        # Mock wishlist API (GET)
        page.route("https://ecommerce.routemisr.com/api/v1/wishlist", handle_wishlist)

        # Go to a page that will set localStorage (or just go to login then home)
        # But easier to just inject it
        page.goto("http://localhost:5173/login")
        page.evaluate("localStorage.setItem('token', 'fake-token')")

        # Navigate to home where multiple Product components are rendered
        page.goto("http://localhost:5173/")

        # Wait for products to load and components to mount
        page.wait_for_selector("text=Product 1")
        page.wait_for_timeout(2000) # Give it time to make requests

        print(f"Total wishlist requests: {len(wishlist_requests)}")

        # Take screenshot
        page.screenshot(path="/home/jules/verification/screenshots/wishlist_dedup.png")

        context.close()
        browser.close()

        if len(wishlist_requests) == 1:
            print("SUCCESS: Wishlist requests were deduplicated!")
        else:
            print(f"FAILURE: Expected 1 request, but got {len(wishlist_requests)}")

if __name__ == "__main__":
    run_verification()
