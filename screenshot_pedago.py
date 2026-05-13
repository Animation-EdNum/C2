import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Load the page with unlockAllSkins
        await page.goto("http://localhost:8000/webapps/simulateur_automate.html?unlockAllSkins=true")
        await page.wait_for_selector('.bot-grid', timeout=5000)

        # Change skin via JS using localStorage variable key 'at_active_skin'
        await page.evaluate("localStorage.setItem('at_active_skin', 'pedago');")
        await page.evaluate("localStorage.setItem('automateSpeed', '1');")

        # Reload to apply
        await page.goto("http://localhost:8000/webapps/simulateur_automate.html?unlockAllSkins=true")
        await page.wait_for_selector('.bot-grid', timeout=5000)

        # Trigger a path programmatically!
        await page.evaluate('''
            window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp'}));
            setTimeout(() => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight'})), 500);
            setTimeout(() => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp'})), 1000);
            setTimeout(() => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp'})), 1500);
        ''')

        await page.wait_for_timeout(2500)

        wrapper = await page.query_selector('.grid-layout-wrapper')
        if wrapper:
            await wrapper.screenshot(path="pedago_screenshot5.png")
            print("Screenshot saved to pedago_screenshot5.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
