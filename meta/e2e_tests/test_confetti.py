from playwright.sync_api import Page, expect

def test_launch_confetti(page: Page):
    """
    Test that launchConfetti executes without error.
    """
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    # Call launchConfetti, expect no exceptions
    page.evaluate("launchConfetti()")

    # Simple check to ensure page is still responsive
    expect(page.locator("body")).to_be_visible()


def test_launch_fire(page: Page):
    """
    Test that launchFire creates and later removes the overlay div.
    """
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    # Call launchFire
    page.evaluate("launchFire()")

    # Verify the overlay is present in the DOM
    overlay = page.locator(".critical-success-overlay")
    expect(overlay).to_be_attached()

    # The script removes it after 2500ms, wait 2600ms to be safe
    page.wait_for_timeout(2600)

    # Verify the overlay is removed from the DOM
    expect(overlay).not_to_be_attached()


def test_missing_canvas(page: Page):
    """
    Test that both functions handle a missing canvas gracefully.
    """
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    # Remove the canvas from the DOM
    page.evaluate("document.getElementById('confetti-canvas')?.remove()")

    # Call both functions, expect no exceptions
    page.evaluate("launchConfetti()")
    page.evaluate("launchFire()")

    # Check page remains responsive
    expect(page.locator("body")).to_be_visible()
def test_missing_canvas(page: Page):
    """
    Test that both functions handle a missing canvas gracefully.
    """
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    # Remove the canvas from the DOM
    page.evaluate("document.getElementById('confetti-canvas')?.remove()")

    # Call both functions, expect no exceptions
    page.evaluate("launchConfetti()")
    page.evaluate("launchFire()")

    # Check page remains responsive
    expect(page.locator("body")).to_be_visible()
