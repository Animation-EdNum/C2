import re
from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:8000/webapps/routage_reseau.html"

def test_routage_reseau_load_and_interact(page: Page):
    """Test routing network loading and basic interactions."""
    page.goto(BASE_URL)
    
    # Verify SVG network loaded
    expect(page.locator("#network-svg-edges")).to_be_visible()
    expect(page.locator("#network-svg-weights")).to_be_visible()
    
    # Ensure there are nodes to click
    nodes = page.locator(".node")
    page.wait_for_timeout(500)
    assert nodes.count() > 2
    
    # Click undo should be disabled initially
    expect(page.locator("#undoBtn")).to_be_disabled()
    
    # Try to click an available node to advance
    available_nodes = page.locator(".node.available")
    if available_nodes.count() > 0:
        available_nodes.nth(0).click()
        
        # Now undo should be enabled
        expect(page.locator("#undoBtn")).to_be_enabled()
        
        # Click undo
        page.locator("#undoBtn").click()
        expect(page.locator("#undoBtn")).to_be_disabled()

def test_routage_reseau_difficulty(page: Page):
    """Test difficulty changes."""
    page.goto(BASE_URL)
    
    page.locator("#diff-hard").click()
    expect(page.locator("#diff-hard")).to_have_class(re.compile("active"))
    expect(page.locator("#card-subtitle")).to_contain_text(re.compile("Réseau difficile", re.IGNORECASE))
