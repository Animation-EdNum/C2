from playwright.sync_api import sync_playwright
import os

def run():
    filepath = os.path.abspath('webapps/simulateur_bluebot.html')
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(f'file://{filepath}')

        # Unlock all skins
        page.evaluate("localStorage.setItem('bb_unlocked_skins', JSON.stringify(['default', 'beebot', 'thymio', 'space', 'volcano']));")
        page.reload()
        page.wait_for_timeout(500)

        page.click('#tab-challenge')
        page.wait_for_timeout(500)
        page.screenshot(path="verification_difficulty.png")

        page.click('#tab-simulator')
        page.wait_for_timeout(500)

        # Open skins modal and screenshot
        page.click('#btn-open-skins')
        page.wait_for_timeout(500)
        page.screenshot(path="verification_skins.png")

        browser.close()

if __name__ == "__main__":
    run()
