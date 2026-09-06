import re
from playwright.sync_api import Page, expect

def test_jeu_de_la_grue_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/jeu_de_la_grue.html")
    expect(page).to_have_title(re.compile("Jeu de la grue"))

def test_machine_a_chiffrer_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/machine_a_chiffrer.html")
    expect(page).to_have_title(re.compile("Machine à chiffrer"))

def test_machine_a_trier_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/machine_a_trier.html")
    expect(page).to_have_title(re.compile("Machine à trier"))

def test_reseau_de_tri_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/reseau_de_tri.html")
    expect(page).to_have_title(re.compile("Réseau de tri"))

def test_coffre_fort_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/coffre_fort.html")
    expect(page).to_have_title(re.compile("Coffre-fort numérique"))

def test_compresseur_magique_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/compresseur_magique.html")
    expect(page).to_have_title(re.compile("Compresseur magique"))

def test_dactylo_features(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/dactylo.html")
    expect(page).to_have_title(re.compile("Dactylo"))
    
    # Check level select and keyboard
    level_select = page.locator("#levelSelect")
    expect(level_select).to_be_visible()
    
    keyboard = page.locator("#visualKeyboard")
    expect(keyboard).to_be_visible()
    
    # Check target key is highlighted
    target_key = page.locator(".key.target")
    expect(target_key).to_be_visible()
    
    # Focus text display and type expected character
    text_display_box = page.locator("#textDisplayBox")
    text_display_box.click()
    
    # Check first letter ('l')
    expected_char = page.locator("#char-0").text_content()
    page.keyboard.type(expected_char)
    
    # Char 0 should now have class char-correct
    expect(page.locator("#char-0")).to_have_class(re.compile("char-correct"))
    
    # Next char should be char-current
    expect(page.locator("#char-1")).to_have_class(re.compile("char-current"))
    
    # Verify precision is 100%
    expect(page.locator("#statAccuracy")).to_have_text("100%")

