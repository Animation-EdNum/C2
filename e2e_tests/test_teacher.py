import re
from playwright.sync_api import Page, expect

def test_bareme_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/teacher/bareme.html")
    expect(page).to_have_title(re.compile("Générateur de barèmes"))

def test_tirage_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/teacher/tirage.html")
    expect(page).to_have_title(re.compile("Tirage au Sort"))
