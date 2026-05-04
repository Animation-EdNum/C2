import re
from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:8000/webapps/binaire_codage.html"

def test_binaire_codage_dec_to_bin(page: Page):
    """Test the decimal to binary conversion feature."""
    page.goto(BASE_URL)
    page.locator("#tab-dec-bin").click()

    # Read the number to code
    dec_str = page.locator("#decBin-number").inner_text()
    dec_val = int(dec_str)

    # We are in default difficulty (6 bits for medium)
    # The toggles generated for 8 bits, but only 8-currentBits to 7 are visible.
    # Current bits = 6. Visible toggles are index 2 to 7.
    # We get their IDs from `tog-2` to `tog-7`.

    bin_str = format(dec_val, '06b')

    # Click the correct bits
    for i, bit in enumerate(bin_str):
        if bit == '1':
            toggle_id = f"#tog-{i + 2}"
            page.locator(toggle_id).click()

    # Check
    page.locator("#decBin-check-btn").click()
    expect(page.locator("#decBin-feedback")).to_contain_text(re.compile("Parfait", re.IGNORECASE))

def test_binaire_codage_bin_to_dec(page: Page):
    """Test the binary to decimal conversion feature."""
    page.goto(BASE_URL)
    page.locator("#tab-bin-dec").click()

    bin_str = page.locator("#binDec-binary").inner_text()
    dec_val = int(bin_str, 2)

    page.locator("#binDec-input").fill(str(dec_val))
    page.locator("#binDec-check-btn").click()

    expect(page.locator("#binDec-feedback")).to_contain_text(re.compile("Exact", re.IGNORECASE))

def test_binaire_codage_difficulty_toggle(page: Page):
    """Test the difficulty toggles."""
    page.goto(BASE_URL)

    # Click Easy -> 4 bits
    page.locator("#diff-easy").click()
    # The hidden ones do not have the toggle button created, only visible do
    toggles_easy = page.locator("#bit-toggles .bit-toggle")
    expect(toggles_easy).to_have_count(4)

    # Click Medium -> 6 bits
    page.locator("#diff-medium").click()
    toggles_medium = page.locator("#bit-toggles .bit-toggle")
    expect(toggles_medium).to_have_count(6)

    # Click Hard -> 8 bits
    page.locator("#diff-hard").click()
    toggles_hard = page.locator("#bit-toggles .bit-toggle")
    expect(toggles_hard).to_have_count(8)
