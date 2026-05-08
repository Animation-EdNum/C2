import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        await page.goto("http://localhost:8000/webapps/simulateur_bluebot.html")
        await page.wait_for_timeout(2000)

        # Click on "Simulateur" tab
        await page.click("text=Simulateur")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="screenshot_desktop_sim.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
