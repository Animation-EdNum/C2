from playwright.sync_api import Page, expect

def test_launch_fire_overlay(page: Page):
    """Verify launchFire creates and removes the critical success overlay."""
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    # Call launchFire
    page.evaluate("launchFire()")

    # Overlay should be visible
    overlay = page.locator(".critical-success-overlay")
    expect(overlay).to_be_attached()

    # Overlay should be removed after 2.5s
    expect(overlay).not_to_be_attached(timeout=4000)

def test_launch_fire_canvas(page: Page):
    """Verify launchFire creates an animation canvas with correct dimensions and z-index."""
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    initial_canvas_count = page.evaluate("document.querySelectorAll('canvas').length")

    # Call launchFire
    page.evaluate("launchFire()")

    # A new dynamic canvas should be created
    new_canvas_count = page.evaluate("document.querySelectorAll('canvas').length")
    assert new_canvas_count == initial_canvas_count + 1

    # Verify canvas properties (full screen, zIndex 9999)
    canvas_props = page.evaluate("""(() => {
        const canvases = document.querySelectorAll('canvas');
        const cvs = canvases[canvases.length - 1];
        return {
            zIndex: cvs.style.zIndex,
            position: cvs.style.position,
            width: cvs.width,
            height: cvs.height,
            matchesWindow: cvs.width === window.innerWidth && cvs.height === window.innerHeight
        };
    })()""")

    assert canvas_props["zIndex"] == "9999"
    assert canvas_props["position"] == "fixed"
    assert canvas_props["matchesWindow"] is True

def test_launch_confetti_canvas(page: Page):
    """Verify launchConfetti creates an animation canvas with correct dimensions and z-index."""
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    initial_canvas_count = page.evaluate("document.querySelectorAll('canvas').length")

    # Call launchConfetti
    page.evaluate("launchConfetti()")

    # A new dynamic canvas should be created
    new_canvas_count = page.evaluate("document.querySelectorAll('canvas').length")
    assert new_canvas_count == initial_canvas_count + 1

    # Verify canvas properties (full screen, zIndex 9998)
    canvas_props = page.evaluate("""(() => {
        const canvases = document.querySelectorAll('canvas');
        const cvs = canvases[canvases.length - 1];
        return {
            zIndex: cvs.style.zIndex,
            position: cvs.style.position,
            width: cvs.width,
            height: cvs.height,
            matchesWindow: cvs.width === window.innerWidth && cvs.height === window.innerHeight
        };
    })()""")

    assert canvas_props["zIndex"] == "9998"
    assert canvas_props["position"] == "fixed"
    assert canvas_props["matchesWindow"] is True
