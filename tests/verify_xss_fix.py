import os
import pytest
from playwright.sync_api import sync_playwright

@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()

@pytest.fixture
def page(browser):
    page = browser.new_page()
    yield page
    page.close()

def test_bareme_xss_fix(page):
    path = os.path.abspath("ressources/bareme.html")
    page.goto(f"file://{path}", wait_until="domcontentloaded")

    # Inject XSS payload via showToast
    payload = "<img src=x onerror=window.xss_executed=true>"
    page.evaluate(f"showToast('{payload}')")

    # Check if XSS was executed
    xss_executed = page.evaluate("window.xss_executed")
    assert xss_executed is None, "XSS payload was executed!"

    # Check if payload is rendered as text
    toast_span = page.locator(".toast span").first
    assert toast_span.text_content() == payload

def test_bit_de_parite_xss_fix(page):
    path = os.path.abspath("webapps/bit_de_parite.html")
    page.goto(f"file://{path}", wait_until="domcontentloaded")

    # Inject XSS payload via showToast
    payload = "<img src=x onerror=window.xss_executed=true>"
    page.evaluate(f"showToast('{payload}')")

    # Check if XSS was executed
    xss_executed = page.evaluate("window.xss_executed")
    assert xss_executed is None, "XSS payload was executed!"

    # Check if payload is rendered as text
    toast = page.locator("#toast")
    # In bit_de_parite, it prepends ✅ or ❌
    assert payload in toast.text_content()
    assert "<img" in toast.text_content()
