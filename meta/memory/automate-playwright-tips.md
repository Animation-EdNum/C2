# Playwright Tips for Automate Simulator

When attempting to take verification screenshots of specific skins or app states in the Automate Simulator via Playwright, relying on clicking UI elements (like the options button and skins modal) is flaky and often results in timeouts because certain elements might be hidden, animated, or obstructed.

Instead, manipulate the app state directly using `localStorage` and reloading:

```python
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # 1. Load the page once to establish origin
        await page.goto("http://localhost:8000/webapps/simulateur_automate.html?unlockAllSkins=true")
        await page.wait_for_selector('.bot-grid', timeout=5000)

        # 2. Set localStorage directly (use 'at_active_skin', not 'automateSkin'!)
        await page.evaluate("localStorage.setItem('at_active_skin', 'pedago');")
        await page.evaluate("localStorage.setItem('automateSpeed', '1');")

        # 3. Reload the page to apply the loaded skin
        await page.goto("http://localhost:8000/webapps/simulateur_automate.html?unlockAllSkins=true")
        await page.wait_for_selector('.bot-grid', timeout=5000)

        # 4. Trigger actions programmatically (e.g. keyboard events)
        await page.evaluate('''
            window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp'}));
            setTimeout(() => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight'})), 500);
            setTimeout(() => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp'})), 1000);
        ''')

        # Wait for animations
        await page.wait_for_timeout(2500)

        # 5. Take screenshot of a specific reliable wrapper
        wrapper = await page.query_selector('.grid-layout-wrapper')
        if wrapper:
            await wrapper.screenshot(path="verification_screenshot.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
```

This bypasses UI flakiness, sets the hidden skin directly, moves the robot, and generates a clean, targeted screenshot of the grid area.
