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
    expect(page).to_have_title(re.compile("Bit de Parité – Entraînement & Détection"))

def test_routage_reseau_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/routage_reseau.html")
    expect(page).to_have_title(re.compile("Routage réseau - Temps et UTI"))

def test_simulateur_bluebot_has_correct_title(page: Page):
    page.goto("http://localhost:8000/webapps/simulateur_bluebot.html")
    expect(page).to_have_title(re.compile("Simulateur d'automate"))
