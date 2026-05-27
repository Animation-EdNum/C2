import re
from playwright.sync_api import Page, expect

def test_apprendre_pseudocode_loads_correctly(page: Page):
    # Collect console errors
    errors = []
    page.on("pageerror", lambda err: errors.append(err))
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)

    # Load the page
    page.goto("http://localhost:8000/alpha/webapps/apprendre_pseudocode.html")
    
    # Assertions
    expect(page).to_have_title(re.compile("Bases du pseudocode"))
    
    # Verify no console errors
    assert len(errors) == 0, f"Found console errors: {errors}"
