import asyncio
from playwright.async_api import async_playwright

async def verify_pasting():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Enable the tab using the URL param 'editor=1' or equivalent if needed, or inject js
        await page.goto("http://localhost:8000/webapps/binaire_studio.html")

        # Unlock the editor tab if it's locked
        await page.evaluate("document.getElementById('tab-editor').disabled = false; document.getElementById('tab-editor').classList.remove('locked-tab');")

        # Click "Éditeur libre" mode tab
        await page.click("button#tab-editor", force=True)
        await page.wait_for_selector("#mode-editor.active")

        # Select textarea
        await page.fill("#editor-output", "01001\n10110\n00100\n11011\n10001")
        await page.wait_for_timeout(500)

        # Take a screenshot
        await page.screenshot(path="screenshot_editor_paste.png")
        await browser.close()

asyncio.run(verify_pasting())
