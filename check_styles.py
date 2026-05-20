import os
from playwright.sync_api import sync_playwright

def check():
    filepath = os.path.abspath("webapps/simulateur_automate.html")
    url = f"file://{filepath}"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)
        
        page.wait_for_selector("#tab-simulator")
        page.click("#tab-simulator")
        page.wait_for_selector("#btn-sim-hide-grid")
        
        # Click toggle to hide grid (turn icon to border-all-slash)
        btn = page.locator("#btn-sim-hide-grid")
        btn.click()
        page.wait_for_timeout(500)
        
        # Get button and SVG details
        html = btn.inner_html()
        print("BUTTON HTML:")
        print(html)
        
        svg = btn.locator("svg")
        svg_bbox = svg.bounding_box()
        btn_bbox = btn.bounding_box()
        
        print("\nBOUNDING BOXES:")
        print(f"Button: {btn_bbox}")
        print(f"SVG: {svg_bbox}")
        
        # Get computed styles of SVG
        styles = page.evaluate("""(selector) => {
            const el = document.querySelector(selector);
            const style = window.getComputedStyle(el);
            return {
                display: style.display,
                position: style.position,
                width: style.width,
                height: style.height,
                transform: style.transform,
                transformOrigin: style.transformOrigin,
                margin: style.margin,
                padding: style.padding,
                verticalAlign: style.verticalAlign,
                boxSizing: style.boxSizing
            };
        }""", "#btn-sim-hide-grid svg")
        print("\nSVG COMPUTED STYLES:")
        for k, v in styles.items():
            print(f"  {k}: {v}")
            
        # Get path details
        path = svg.locator("path").first
        path_bbox = path.bounding_box()
        print(f"\nPath bounding box: {path_bbox}")
        
        browser.close()

if __name__ == "__main__":
    check()
