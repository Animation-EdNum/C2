import re
from playwright.sync_api import Page, expect

def test_toggle_theme(page: Page):
    """
    Test the window.toggleTheme function from normal states (light/dark)
    """
    page.goto("http://localhost:8000/index.html")
    # Initialize state to light
    page.evaluate("localStorage.setItem('global_theme', 'light')")

    # Safely reload the page so the script reads the new localStorage state on load
    page.reload()

    # Assert initial state is light
    expect(page.locator("body")).not_to_have_attribute("class", re.compile(r"\bdark\b"))

    # Toggle to dark
    page.evaluate("window.toggleTheme()")
    expect(page.locator("body")).to_have_attribute("class", re.compile(r"\bdark\b"))
    assert page.evaluate("localStorage.getItem('global_theme')") == "dark"

    # Toggle back to light
    page.evaluate("window.toggleTheme()")
    expect(page.locator("body")).not_to_have_attribute("class", re.compile(r"\bdark\b"))
    assert page.evaluate("localStorage.getItem('global_theme')") == "light"
