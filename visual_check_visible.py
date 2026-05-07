from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('http://localhost:8000/webapps/simulateur_bluebot.html')
    page.wait_for_timeout(2000)
    # the first .difficulty-bar might be hidden, find a visible one, or just evaluate js to make them visible
    page.evaluate("document.querySelectorAll('.view').forEach(v => v.classList.add('active'))")
    page.locator('.difficulty-bar').nth(1).screenshot(path='diff_bar_visible.png')
    browser.close()
