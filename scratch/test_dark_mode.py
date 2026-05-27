import re
from playwright.sync_api import Page, expect

def test_dark_mode(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/apprendre_pseudocode.html")
    
    # Check that body starts as light (no 'dark' class by default)
    expect(page.locator("body")).not_to_have_class("dark")
    
    # Open settings dropdown menu
    page.click("#options-menu-btn")
    
    # Click theme toggle button
    page.click("#theme-toggle-btn")
    
    # Check that body now has 'dark' class
    expect(page.locator("body")).to_have_class("dark")
