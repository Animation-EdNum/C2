import os
import re
from playwright.sync_api import sync_playwright

def test_file(page, file_path):
    print(f"Testing {file_path}")
    page.goto(f"file://{os.path.abspath(file_path)}")

    # 1. Assert 'Nouveau' button is gone
    btn_new = page.locator("#decBin-new-btn")
    assert btn_new.count() == 0, "Nouveau button is still present!"

    # Wait for the page to finish initializing
    page.wait_for_timeout(1000)

    # 2. Test Dec -> Bin mistake logic
    # Make sure we give a wrong answer
    dec_val_text = page.locator("#decBin-number").text_content()
    expected_dec = int(dec_val_text)

    # Ensure calc is off initially
    page.evaluate("resetCalc()")

    # Check DecToBin with all 0s (if expected > 0) or all 1s
    if expected_dec == 0:
        page.evaluate("calcState[7] = 1")
    else:
        page.evaluate("calcState = [0,0,0,0,0,0,0,0]")

    btn_check_dec_bin = page.locator("#decBin-check-btn")

    # First mistake
    btn_check_dec_bin.click()
    feedback1 = page.locator("#decBin-feedback").inner_html()
    assert "Il fallait faire" not in feedback1, f"Expected first mistake text to omit expected val, got {feedback1}"

    # Second mistake
    btn_check_dec_bin.click()
    feedback2 = page.locator("#decBin-feedback").inner_html()
    assert "Il fallait faire" in feedback2, f"Expected second mistake text to include expected val, got {feedback2}"

    # 3. Test Bin -> Dec mistake logic
    # Set an invalid or incorrect input
    bin_input = page.locator("#binDec-input")
    bin_input.fill("99999")

    btn_check_bin_dec = page.locator("#binDec-check-btn")

    # First mistake
    btn_check_bin_dec.click()
    feedback3 = page.locator("#binDec-feedback").inner_html()
    assert "Essaie encore" in feedback3, f"Expected 'Essaie encore', got {feedback3}"

    # Second mistake
    btn_check_bin_dec.click()
    feedback4 = page.locator("#binDec-feedback").inner_html()
    assert "ordinateur lit" in feedback4, f"Expected 'ordinateur lit', got {feedback4}"

    print(f"{file_path} checks passed.")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        test_file(page, "webapps/binaire_codage.html")
        test_file(page, "standalone/webapps/binaire_codage.html")

        browser.close()

if __name__ == "__main__":
    main()
