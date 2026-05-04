from playwright.sync_api import Page, expect

def test_score_manager_initialization(page: Page):
    """Verify ScoreManager starts with empty stats when localStorage is clear."""
    page.goto("http://localhost:8000/webapps/binaire_codage.html")
    page.evaluate("localStorage.clear()")
    page.reload()
    stats = page.evaluate("ScoreManager.stats")
    assert stats == {}

def test_score_manager_add_success(page: Page):
    """Verify addSuccess updates totalSuccess and streak."""
    page.goto("http://localhost:8000/webapps/binaire_codage.html")
    page.evaluate("localStorage.clear()")
    page.reload()
    page.evaluate("ScoreManager.addSuccess('dec_to_bin', 6, 0)")
    stats = page.evaluate("ScoreManager.stats")
    assert stats['dec_to_bin']['6']['totalSuccess'] == 1
    assert stats['dec_to_bin']['6']['streak'] == 1

def test_score_manager_adaptive_difficulty(page: Page):
    """Verify adaptive difficulty popup appears after 3 successes."""
    page.goto("http://localhost:8000/webapps/binaire_codage.html")
    page.evaluate("localStorage.clear()")
    page.reload()
    # Need 3 successes to trigger adaptive difficulty
    page.evaluate("ScoreManager.addSuccess('dec_to_bin', 6, 0)")
    page.evaluate("ScoreManager.addSuccess('dec_to_bin', 6, 0)")
    page.evaluate("ScoreManager.addSuccess('dec_to_bin', 6, 0)")

    # Wait for the adaptive popup (1500ms delay in JS)
    page.wait_for_timeout(2000)
    popup = page.locator("#adaptive-difficulty-popup")
    expect(popup).to_be_visible()

def test_score_manager_add_mistake(page: Page):
    """Verify addMistake increments mistakes and resets streak."""
    page.goto("http://localhost:8000/webapps/binaire_codage.html")
    page.evaluate("localStorage.clear()")
    page.reload()
    page.evaluate("ScoreManager.addSuccess('dec_to_bin', 6, 0)")
    page.evaluate("ScoreManager.addMistake('dec_to_bin', 6)")
    stats = page.evaluate("ScoreManager.stats")
    assert stats['dec_to_bin']['6']['mistakes'] == 1
    assert stats['dec_to_bin']['6']['streak'] == 0

def test_score_manager_reset_scores(page: Page):
    """Verify resetScores clears stats after confirmation."""
    page.goto("http://localhost:8000/webapps/binaire_codage.html")
    page.evaluate("localStorage.clear()")
    page.reload()
    page.evaluate("ScoreManager.addSuccess('dec_to_bin', 6, 0)")

    # Handle confirm dialog
    page.on("dialog", lambda dialog: dialog.accept())
    page.evaluate("ScoreManager.resetScores()")

    stats = page.evaluate("ScoreManager.stats")
    assert stats == {}
