# Playwright Tips for Automate Simulator

## 1. Avoid UI Flakiness
Clicking elements (options button, skins modal) is flaky due to animations and obstructed views.
**Solution:** Manipulate the app state directly via `localStorage` and reload.

```python
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # 1. Establish origin
        await page.goto("http://localhost:8000/webapps/simulateur_automate.html?unlockAllSkins=true")
        await page.wait_for_selector('.bot-grid', timeout=5000)

        # 2. Inject state directly
        await page.evaluate("localStorage.setItem('at_active_skin', 'pedago');")
        await page.evaluate("localStorage.setItem('automateSpeed', '1');")

        # 3. Reload to apply state
        await page.goto("http://localhost:8000/webapps/simulateur_automate.html?unlockAllSkins=true")
        await page.wait_for_selector('.bot-grid', timeout=5000)

        # 4. Trigger actions via dispatched events
        await page.evaluate('''
            window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp'}));
        ''')
        await page.wait_for_timeout(2500) # Wait for animation

        # 5. Screenshot specific wrapper
        wrapper = await page.query_selector('.grid-layout-wrapper')
        if wrapper:
            await wrapper.screenshot(path="screenshot.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
```

## 2. Mocking Canvas Context
`confetti.js` functions dynamically append `<canvas>` elements to the body.
To mock these in E2E tests, override `HTMLCanvasElement.prototype.getContext` via `page.evaluate()` before triggering the function.

## 3. General E2E Testing Tips
- **localStorage Setup:** Execute `page.evaluate('localStorage.clear();')` *after* navigating to the page context (e.g., via `page.goto()`), as `localStorage` requires a valid origin.
- **binaire_message.html:** The `#alpha-section` help block is revealed naturally by making 2 consecutive mistakes with a validation cooldown. Simulate this interaction instead of forcing DOM visibility.
- **binaire_studio.html:** In encode mode, verification happens automatically upon input; do not attempt to click a manual verify button.
- **Local Server:** Ensure a local web server is running on port 8000 to allow the test framework to successfully navigate and avoid connection refused errors.
