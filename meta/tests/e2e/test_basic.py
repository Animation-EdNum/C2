import re
from playwright.sync_api import Page, expect

def test_homepage_has_correct_title(page: Page):
    """
    Test that the index page loads and has the correct title.
    """
    page.goto("http://localhost:8000/index.html")

    # Expect a title "to contain" a substring.
    expect(page).to_have_title(re.compile("Éducation numérique"))
