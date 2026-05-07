from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('http://localhost:8000/webapps/simulateur_bluebot.html')
    page.wait_for_timeout(2000)
    page.locator('.difficulty-bar').first.screenshot(path='diff_bar_1.png')
    browser.close()
