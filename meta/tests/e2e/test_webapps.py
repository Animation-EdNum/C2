import re
from playwright.sync_api import Page, expect

def test_binaire_codage_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/binaire_codage.html")
    expect(page).to_have_title(re.compile("Codage binaire"))

def test_binaire_message_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/binaire_message.html")
    expect(page).to_have_title(re.compile("Mots secrets"))

def test_binaire_studio_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/binaire_studio.html")
    expect(page).to_have_title(re.compile("Pixel Studio"))

def test_bit_de_parite_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/bit_de_parite.html")
    expect(page).to_have_title(re.compile("Bit de parité – Entraînement & Détection"))

def test_routage_reseau_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/routage_reseau.html")
    expect(page).to_have_title(re.compile("Routage réseau - Temps et UTI"))

def test_simulateur_automate_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/simulateur_automate.html")
    expect(page).to_have_title(re.compile("Simulateur d'automate"))

def test_jeu_de_la_grue_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/jeu_de_la_grue.html")
    expect(page).to_have_title(re.compile("Jeu de la grue"))

def test_machine_a_trier_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/machine_a_trier.html")
    expect(page).to_have_title(re.compile("Machine à trier"))

def test_dactylo_features(page: Page):
    page.goto("http://localhost:8000/webapps/dactylo.html")
    expect(page).to_have_title(re.compile("Tape-Texte"))
    
    # Check level select
    level_select = page.locator("#levelSelect")
    expect(level_select).to_be_visible()
    
    # Visual keyboard is initially hidden
    keyboard_section = page.locator("#keyboardSection")
    expect(keyboard_section).not_to_be_visible()
    
    # Focus text display box
    text_display_box = page.locator("#textDisplayBox")
    text_display_box.click()
    
    # Type wrong key on physical keyboard -> visual keyboard appears with target highlighted
    page.keyboard.type("x")
    expect(keyboard_section).to_be_visible()
    expect(page.locator(".key.target")).to_be_visible()
    
    # Type expected character ('l')
    expected_char = page.locator("#char-0").text_content()
    page.keyboard.type(expected_char)
    
    # Visual keyboard hides once correct key is pressed
    expect(keyboard_section).not_to_be_visible()
    
    # Char 0 should now have class char-correct
    expect(page.locator("#char-0")).to_have_class(re.compile("char-correct"))
    
    # Next char should be char-current
    expect(page.locator("#char-1")).to_have_class(re.compile("char-current"))

def test_webapps_card_width_on_wide_screen(page: Page):
    """Ensure cards occupy a wide portion of a wide desktop screen."""
    page.set_viewport_size({"width": 1920, "height": 1080})
    for app in [
        "webapps/routage_reseau.html",
        "webapps/binaire_codage.html",
        "webapps/bit_de_parite.html",
        "webapps/simulateur_automate.html"
    ]:
        page.goto(f"http://localhost:8000/{app}")
        card = page.locator(".container, .app-shell").first
        box = card.bounding_box()
        assert box is not None
        assert box["width"] >= 1000, f"{app} card is too narrow: {box['width']}px"

