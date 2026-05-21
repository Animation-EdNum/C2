import re
from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:8000/webapps/binaire_studio.html"

def test_binaire_studio_decode(page: Page):
    """Test the decode mode in binaire_studio.html"""
    page.goto(BASE_URL)
    page.locator("#tab-decode").click()
    
    # Wait for grid to load
    expect(page.locator("#grid-decode")).to_be_visible()
    
    # Click some pixels in the decode grid
    pixels = page.locator("#grid-decode .pixel")
    if pixels.count() > 0:
        pixels.nth(0).click()
    
    # Verify
    page.locator("#verifyDecodeBtn").click()
    
def test_binaire_studio_encode(page: Page):
    """Test the encode mode in binaire_studio.html"""
    page.goto(BASE_URL)
    page.locator("#tab-encode").click()
    
    # Wait for static grid and inputs to load
    expect(page.locator("#grid-encode-static")).to_be_visible()
    expect(page.locator("#encode-inputs")).to_be_visible()
    
    # Fill an input
    inputs = page.locator(".encode-row-input")
    if inputs.count() > 0:
        inputs.nth(0).fill("0")
        
    # Verify
    # Verification happens automatically on input

def test_binaire_studio_editor_locked(page: Page):
    """Test that the editor is initially locked."""
    page.goto(BASE_URL)
    
    # The tab should be locked
    expect(page.locator("#tab-editor")).to_have_class(re.compile("locked-tab"))
    expect(page.locator("#tab-editor")).to_be_disabled()
    expect(page.locator("#editor-lock-message")).to_be_visible()
