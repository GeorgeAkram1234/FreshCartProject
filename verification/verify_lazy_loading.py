import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        loaded_scripts = set()
        page.on("request", lambda request: loaded_scripts.add(request.url) if request.resource_type == "script" else None)

        print("Navigating to home...")
        await page.goto("http://localhost:4173")
        await page.wait_for_load_state("networkidle")

        print("Scripts loaded on initial load:")
        for script in sorted(loaded_scripts):
            if "/assets/" in script:
                print(f"  {script.split('/')[-1]}")

        initial_count = len([s for s in loaded_scripts if "/assets/" in s])

        # Note: Since it redirects to login (if not authenticated), check login chunk
        print("\nChecking if Login chunk was loaded...")
        login_loaded = any("Login-" in s for s in loaded_scripts)
        print(f"Login chunk loaded: {login_loaded}")

        # Check if Home chunk was loaded (it shouldn't be yet if we are redirected to login)
        home_loaded = any("Home-" in s for s in loaded_scripts)
        print(f"Home chunk loaded: {home_loaded}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
