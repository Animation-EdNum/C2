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

def test_pixel_studio_rvb_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/pixel_studio_rvb.html")
    expect(page).to_have_title(re.compile("Pixel Studio RVB"))

def test_pixels_binaires_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/pixels_binaires.html")
    expect(page).to_have_title(re.compile("Pixels Binaires"))

def test_reseau_de_tri_has_correct_title(page: Page):
    page.goto("http://localhost:8000/alpha/webapps/reseau_de_tri.html")
    expect(page).to_have_title(re.compile("Réseau de tri"))
