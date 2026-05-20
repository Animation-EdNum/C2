import re
from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:8000/webapps/bit_de_parite.html"

def test_bit_de_parite_train(page: Page):
    """Test the train mode in bit_de_parite.html"""
    page.goto(BASE_URL)
    
    # Default is medium (5x5 grid -> 25 pixels)
    expect(page.locator("#diff-medium")).to_have_class(re.compile("active"))
    expect(page.locator("#train-grid")).to_be_visible()
    
    pixels = page.locator("#train-grid .pixel")
    # Wait for grid generation
    page.wait_for_timeout(500) 
    expect(pixels).to_have_count(25)
    
    # Change to easy (4x4 grid -> 16 pixels)
    page.locator("#diff-easy").click()
    page.wait_for_timeout(500)
    expect(pixels).to_have_count(16)
    
    # Click a pixel
    pixels.nth(15).click()
    
    # Verify
    page.locator("#verifyBtn").click()
    
def test_bit_de_parite_detect(page: Page):
    """Test the detect mode in bit_de_parite.html"""
    page.goto(BASE_URL)
    page.locator("#tab-detect").click()
    
    expect(page.locator("#detect-grid")).to_be_visible()
    
    # Wait for grid generation
    page.wait_for_timeout(500)
    pixels = page.locator("#detect-grid .pixel")
    
    # Click a pixel to guess the error
    if pixels.count() > 0:
        pixels.nth(0).click()
        
    # Check if a new challenge button is there
    expect(page.locator("#newDetectBtn")).to_be_visible()
