from playwright.sync_api import Page, sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        
        # Go to the app page
        page.goto("http://localhost:8000/alpha/webapps/apprendre_pseudocode.html")
        page.wait_for_timeout(1000)
        
        # Take light mode screenshot
        page.screenshot(path="C:/Users/Swiss/.gemini/antigravity-ide/brain/1b04c31e-f04f-47e5-acfd-de647cd79c54/scratch/light_mode.png")
        print("Saved light mode screenshot.")
        
        # Toggle theme to dark
        page.click("#options-menu-btn")
        page.wait_for_timeout(300)
        page.click("#theme-toggle-btn")
        page.wait_for_timeout(1000)
        
        # Take dark mode screenshot
        page.screenshot(path="C:/Users/Swiss/.gemini/antigravity-ide/brain/1b04c31e-f04f-47e5-acfd-de647cd79c54/scratch/dark_mode.png")
        print("Saved dark mode screenshot.")
        
        browser.close()

if __name__ == "__main__":
    run()
