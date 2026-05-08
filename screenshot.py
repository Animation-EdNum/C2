from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:8000/webapps/binaire_codage.html')
    page.wait_for_timeout(2000)
    page.screenshot(path='binaire_codage_initial.png')
    page.click('#calc-open-btn')
    page.wait_for_timeout(1000)
    page.screenshot(path='binaire_codage_panel_open.png')
    browser.close()
