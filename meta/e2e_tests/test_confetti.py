from playwright.sync_api import Page, expect

def test_launch_confetti(page: Page):
    """
    Test that launchConfetti works without crashing.
    """
    # Navigate to a page that already includes confetti.js
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    # Set up a canvas if it doesn't exist (it should, but just in case)
    page.evaluate("""
        () => {
            if (!document.getElementById('confetti-canvas')) {
                const canvas = document.createElement('canvas');
                canvas.id = 'confetti-canvas';
                document.body.appendChild(canvas);
            }
        }
    """)

    # Run the confetti and check if it executed and set canvas sizes
    result = page.evaluate("""
        () => {
            try {
                launchConfetti();
                const cvs = document.getElementById('confetti-canvas');
                return {
                    width: cvs.width,
                    height: cvs.height,
                    success: true
                };
            } catch (e) {
                return {
                    error: e.message,
                    success: false
                };
            }
        }
    """)

    assert result["success"] is True
    assert result["width"] > 0
    assert result["height"] > 0

def test_launch_confetti_no_canvas(page: Page):
    """
    Test that launchConfetti returns early if no canvas exists.
    """
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    # Ensure no canvas exists
    page.evaluate("""
        () => {
            const cvs = document.getElementById('confetti-canvas');
            if (cvs) cvs.remove();
        }
    """)

    # Should not throw
    result = page.evaluate("""
        () => {
            try {
                launchConfetti();
                return true;
            } catch (e) {
                return false;
            }
        }
    """)
    assert result is True

def test_launch_fire(page: Page):
    """
    Test that launchFire works and creates overlay.
    """
    page.goto("http://localhost:8000/webapps/binaire_codage.html")

    # Run launchFire and check overlay
    result = page.evaluate("""
        () => {
            launchFire();
            const overlay = document.querySelector('.critical-success-overlay');
            const cvs = document.getElementById('confetti-canvas');
            return {
                hasOverlay: !!overlay,
                width: cvs.width,
                height: cvs.height
            };
        }
    """)

    assert result["hasOverlay"] is True
    assert result["width"] > 0
    assert result["height"] > 0
