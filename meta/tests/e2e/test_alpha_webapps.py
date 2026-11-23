import re
from playwright.sync_api import Page, expect

def test_reseau_de_tri_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/reseau_de_tri.html")
    expect(page).to_have_title(re.compile("Réseau de tri"))

def test_coffre_fort_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/coffre_fort.html")
    expect(page).to_have_title(re.compile("Coffre-fort numérique"))

def test_compresseur_magique_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/compresseur_magique.html")
    expect(page).to_have_title(re.compile("Compresseur magique"))
