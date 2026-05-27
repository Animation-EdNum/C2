import re
from playwright.sync_api import Page, expect

def test_trace_and_options(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/apprendre_pseudocode.html")
    page.wait_for_timeout(500)
    
    # 1. Verify Calculation Machine exists by default on variables chapter
    expect(page.locator("#visualizer-machine")).to_be_visible()
    
    # 2. Click "Boucle Répéter" tab (Chapter 3)
    page.click("#tab-pseudo_loop")
    page.wait_for_timeout(500)
    
    # 3. Verify visualizer changes to Robot Grid and grid cells exist in DOM
    expect(page.locator("#visualizer-grid")).to_be_visible()
    expect(page.locator("#cell-0-4")).to_be_visible()
    # Symmetrical drone SVG should be present inside robot Cell
    expect(page.locator("#cell-0-4 .robot-agent svg")).to_be_visible()
    
    # 4. Switch back to "Variables" tab
    page.click("#tab-pseudo_var")
    page.wait_for_timeout(500)
    expect(page.locator("#visualizer-machine")).to_be_visible()
