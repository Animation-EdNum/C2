import re
from playwright.sync_api import Page, expect

def test_bareme_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/teacher/bareme.html")
    expect(page).to_have_title(re.compile("Générateur de barèmes"))

def test_tirage_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/teacher/tirage.html")
    expect(page).to_have_title(re.compile("Tirage au Sort"))

def test_time_timer_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/teacher/time_timer.html")
    expect(page).to_have_title(re.compile("Minuteur visuel"))

def test_qrcode_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/teacher/qrcode.html")
    expect(page).to_have_title(re.compile("Créateur de QR codes"))

def test_time_timer_play_pause_and_reset(page: Page):
    page.goto("http://localhost:8000/webapps/teacher/time_timer.html")
    expect(page.locator("#playBtnText")).to_have_text("Démarrer")
    expect(page.locator("#iconPlay")).to_be_visible()
    expect(page.locator("#iconPause")).not_to_be_visible()

    # Start
    page.click("#mainPlayBtn")
    expect(page.locator("#playBtnText")).to_have_text("Pause")
    expect(page.locator("#iconPlay")).not_to_be_visible()
    expect(page.locator("#iconPause")).to_be_visible()

    # Pause
    page.wait_for_timeout(1200)
    page.click("#mainPlayBtn")
    expect(page.locator("#playBtnText")).to_have_text("Reprendre")
    expect(page.locator("#iconPlay")).to_be_visible()
    expect(page.locator("#iconPause")).not_to_be_visible()

    # Reset
    page.locator("#activityTitleInput").fill("Devoir")
    page.click("#reset-cache-btn")
    expect(page.locator("#activityTitleInput")).to_have_value("")
    expect(page.locator(".c2-toast")).to_be_visible()

def test_qrcode_reset(page: Page):
    page.goto("http://localhost:8000/webapps/teacher/qrcode.html")
    page.locator("#inputUrl").fill("https://example.com/custom")
    page.locator("#inputTitle").fill("Custom Title")
    page.click("#reset-cache-btn")
    expect(page.locator("#inputUrl")).to_have_value("https://ednum.org")
    expect(page.locator("#inputTitle")).to_have_value("Portail Éducation Numérique")
    expect(page.locator(".c2-toast")).to_be_visible()

def test_bareme_reset(page: Page):
    page.goto("http://localhost:8000/webapps/teacher/bareme.html")
    page.locator("#totalPoints").fill("45")
    page.locator("#titleInput").fill("Evaluation")
    page.click("#reset-cache-btn")
    expect(page.locator("#totalPoints")).to_have_value("20")
    expect(page.locator("#titleInput")).to_have_value("")
    expect(page.locator(".c2-toast")).to_be_visible()

def test_tirage_reset(page: Page):
    page.goto("http://localhost:8000/webapps/teacher/tirage.html")
    page.locator("#totalParticipants").fill("20")
    page.click("#initBtn")
    expect(page.locator("#drawView")).to_be_visible()
    page.click("#reset-cache-btn")
    expect(page.locator("#setupView")).to_be_visible()
    expect(page.locator("#totalParticipants")).to_have_value("")
    expect(page.locator(".c2-toast")).to_be_visible()

def test_sim_dyslexie_reset(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/teacher/sim_dyslexie.html")
    page.locator("#inputSeverity").fill("0.3")
    page.locator("#inputSeverity").dispatch_event("input")
    expect(page.locator("#valSeverity")).to_have_text("30%")
    page.click("#reset-cache-btn")
    expect(page.locator("#valSeverity")).to_have_text("80%")
    expect(page.locator(".c2-toast")).to_be_visible()


