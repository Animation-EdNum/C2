import time
from playwright.sync_api import sync_playwright
import os

html_path = f"file://{os.path.abspath('webapps/binaire_codage.html')}"

def run_benchmark():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(html_path)

        # Run benchmark for checkDecToBin optimized block
        result = page.evaluate('''() => {
            let t0 = performance.now();
            const card = document.getElementById('card-dec-bin');
            for (let i = 0; i < 10000; i++) {
                card.style.animation = 'none';
                void card.offsetWidth;
                card.style.animation = 'flashSuccess 0.5s';
            }
            let t1 = performance.now();
            return t1 - t0;
        }''')
        print(f"Optimized Time (10000 iterations): {result} ms")
        browser.close()

if __name__ == "__main__":
    run_benchmark()
