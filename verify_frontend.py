from playwright.sync_api import sync_playwright

def verify_screens():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # We need to clear local storage, but playwright only lets us do this after loading the page
        # or we just simulate the clicks from the start. We will simulate the whole flow.

        page.goto("http://localhost:8000/alpha/webapps/detective_ia.html")
        page.evaluate("localStorage.clear();")
        page.reload()

        page.wait_for_selector("#screen-theme.active")
        page.click("#ds-animals")

        page.wait_for_selector("#screen-difficulty.active")
        page.click("#diff-easy")

        page.wait_for_selector("#screen-game.active")
        page.screenshot(path="screenshot_game2.png")

        browser.close()

if __name__ == "__main__":
    verify_screens()
