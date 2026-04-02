import time
from playwright.sync_api import sync_playwright
import os

html_path = f"file://{os.path.abspath('webapps/binaire_codage.html')}"

def run_benchmark():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(html_path)

        # Test 1: Just lookup vs Cached lookup
        result_lookup_baseline = page.evaluate('''() => {
            let t0 = performance.now();
            let el;
            for (let i = 0; i < 1000000; i++) {
                el = document.getElementById('card-dec-bin');
                el = document.getElementById('card-dec-bin');
                el = document.getElementById('card-dec-bin');
            }
            let t1 = performance.now();
            return t1 - t0;
        }''')

        result_lookup_optimized = page.evaluate('''() => {
            let t0 = performance.now();
            let el;
            const card = document.getElementById('card-dec-bin');
            for (let i = 0; i < 1000000; i++) {
                el = card;
                el = card;
                el = card;
            }
            let t1 = performance.now();
            return t1 - t0;
        }''')

        print(f"Lookup Baseline Time (1000000 iterations): {result_lookup_baseline} ms")
        print(f"Lookup Optimized Time (1000000 iterations): {result_lookup_optimized} ms")
        browser.close()

if __name__ == "__main__":
    run_benchmark()
