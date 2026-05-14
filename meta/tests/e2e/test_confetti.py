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
    """Verify launchFire interacts with canvas correctly (arc and fill)."""
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    # Inject a mock context before canvas is created
    page.evaluate("""() => {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, options) {
            const ctx = originalGetContext.call(this, type, options);
            if (type === '2d' && ctx) {
                window.mockArcCalled = false;
                window.mockFillCalled = false;

                const originalArc = ctx.arc;
                const originalFill = ctx.fill;

                ctx.arc = function() {
                    window.mockArcCalled = true;
                    return originalArc.apply(this, arguments);
                };
                ctx.fill = function() {
                    window.mockFillCalled = true;
                    return originalFill.apply(this, arguments);
                };
            }
            return ctx;
        };
    }""")

    page.evaluate("launchFire()")

    # Wait for animation to run a few frames
    page.wait_for_timeout(500)

    arc_called = page.evaluate("window.mockArcCalled")
    fill_called = page.evaluate("window.mockFillCalled")
    dimensions_match = page.evaluate("""() => {
        const canvases = document.querySelectorAll('canvas');
        const cvs = canvases[canvases.length - 1]; // get the dynamically created canvas
        return cvs && cvs.width === window.innerWidth && cvs.height === window.innerHeight;
    }""")

    assert arc_called is True
    assert fill_called is True
    assert dimensions_match is True

def test_launch_confetti_canvas(page: Page):
    """Verify launchConfetti interacts with canvas correctly (fillRect)."""
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    # Inject a mock context before canvas is created
    page.evaluate("""() => {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, options) {
            const ctx = originalGetContext.call(this, type, options);
            if (type === '2d' && ctx) {
                window.mockFillRectCalled = false;

                const originalFillRect = ctx.fillRect;

                ctx.fillRect = function() {
                    window.mockFillRectCalled = true;
                    return originalFillRect.apply(this, arguments);
                };
            }
            return ctx;
        };
    }""")

    page.evaluate("launchConfetti()")

    # Wait for animation to run a few frames
    page.wait_for_timeout(500)

    fillrect_called = page.evaluate("window.mockFillRectCalled")
    dimensions_match = page.evaluate("""() => {
        const canvases = document.querySelectorAll('canvas');
        const cvs = canvases[canvases.length - 1]; // get the dynamically created canvas
        return cvs && cvs.width === window.innerWidth && cvs.height === window.innerHeight;
    }""")

    assert fillrect_called is True
    assert dimensions_match is True

