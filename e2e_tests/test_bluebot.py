"""
E2E tests for the Blue-Bot Simulator (simulateur_bluebot.html).
Covers: page load, tab navigation, simulator mode, challenge mode, decode mode,
skins drawer, mats drawer, dark mode, and ScoreManager integration.
"""
import re
from playwright.sync_api import Page, expect


BASE_URL = "http://localhost:8000/webapps/simulateur_bluebot.html"


# ==============================================================
# 1. Page Load & Structure
# ==============================================================

def test_bluebot_loads_with_correct_title(page: Page):
    """Verify the page loads and has the expected title."""
    page.goto(BASE_URL)
    expect(page).to_have_title(re.compile("Simulateur d'automate"))


def test_bluebot_has_three_tabs(page: Page):
    """Verify the three main navigation tabs exist."""
    page.goto(BASE_URL)
    expect(page.locator("#tab-simulator")).to_be_visible()
    expect(page.locator("#tab-challenge")).to_be_visible()
    expect(page.locator("#tab-read")).to_be_visible()


def test_bluebot_simulator_tab_active_by_default(page: Page):
    """The Simulator tab should be active on load."""
    page.goto(BASE_URL)
    expect(page.locator("#tab-simulator")).to_have_class(re.compile("active"))
    expect(page.locator("#view-simulator")).to_be_visible()


def test_bluebot_has_header_with_home_link(page: Page):
    """Header should contain a link back to the portal."""
    page.goto(BASE_URL)
    link = page.locator("a.header-icon")
    expect(link).to_have_attribute("href", "../index.html")


def test_bluebot_has_footer(page: Page):
    """Footer should contain the standard attribution."""
    page.goto(BASE_URL)
    footer = page.locator("footer")
    expect(footer).to_contain_text("AP EdNum")
    expect(footer).to_contain_text("AGPL-3.0")


# ==============================================================
# 2. Tab Navigation
# ==============================================================

def test_bluebot_switch_to_challenge_tab(page: Page):
    """Clicking the Pilotage tab should display the challenge view."""
    page.goto(BASE_URL)
    page.locator("#tab-challenge").click()
    expect(page.locator("#view-challenge")).to_be_visible()
    expect(page.locator("#view-simulator")).to_be_hidden()


def test_bluebot_switch_to_decode_tab(page: Page):
    """Clicking the Décodage tab should display the decode view."""
    page.goto(BASE_URL)
    page.locator("#tab-read").click()
    expect(page.locator("#view-read")).to_be_visible()
    expect(page.locator("#view-simulator")).to_be_hidden()


def test_bluebot_switch_back_to_simulator(page: Page):
    """Switching tabs and coming back should re-display the simulator."""
    page.goto(BASE_URL)
    page.locator("#tab-challenge").click()
    page.locator("#tab-simulator").click()
    expect(page.locator("#view-simulator")).to_be_visible()


# ==============================================================
# 3. Simulator Mode — Grid & Commands
# ==============================================================

def test_bluebot_sim_grid_rendered(page: Page):
    """The simulator grid should contain cells after load."""
    page.goto(BASE_URL)
    cells = page.locator("#sim-grid .bot-cell")
    expect(cells.first).to_be_visible()
    # Default is 6x6 = 36 cells
    assert cells.count() >= 16, "Grid should have at least 16 cells"


def test_bluebot_sim_command_pad_visible(page: Page):
    """The command pad buttons should be visible in simulator mode."""
    page.goto(BASE_URL)
    expect(page.locator("#pad-fwd")).to_be_visible()
    expect(page.locator("#pad-left")).to_be_visible()
    expect(page.locator("#pad-right")).to_be_visible()
    expect(page.locator("#pad-bwd")).to_be_visible()
    expect(page.locator("#pad-go")).to_be_visible()
    expect(page.locator("#pad-clear")).to_be_visible()


def test_bluebot_sim_add_command(page: Page):
    """Clicking a command button should add a command to the program strip."""
    page.goto(BASE_URL)
    page.locator("#pad-fwd").click()
    # The program strip should now have at least one command element
    cmds = page.locator("#sim-program .program-cmd")
    assert cmds.count() >= 1, "A command should appear in the program strip"


def test_bluebot_sim_clear_commands(page: Page):
    """Clicking the X button should clear all commands from the strip."""
    page.goto(BASE_URL)
    page.locator("#pad-fwd").click()
    page.locator("#pad-fwd").click()
    page.locator("#pad-clear").click()
    cmds = page.locator("#sim-program .program-cmd")
    assert cmds.count() == 0, "Program strip should be empty after clear"


# ==============================================================
# 4. Challenge (Pilotage) Mode
# ==============================================================

def test_bluebot_challenge_difficulty_bar(page: Page):
    """The challenge view should display 4 difficulty buttons."""
    page.goto(BASE_URL)
    page.locator("#tab-challenge").click()
    expect(page.locator("#diff-easy")).to_be_visible()
    expect(page.locator("#diff-medium")).to_be_visible()
    expect(page.locator("#diff-hard")).to_be_visible()
    expect(page.locator("#diff-extreme")).to_be_visible()


def test_bluebot_challenge_grid_exists(page: Page):
    """Challenge mode should render its own grid."""
    page.goto(BASE_URL)
    page.locator("#tab-challenge").click()
    cells = page.locator("#chal-grid .bot-cell")
    expect(cells.first).to_be_visible()


def test_bluebot_challenge_options_rendered(page: Page):
    """Challenge mode should render answer options."""
    page.goto(BASE_URL)
    page.locator("#tab-challenge").click()
    options = page.locator("#chal-options .challenge-option")
    assert options.count() >= 2, "Challenge should have at least 2 answer options"


def test_bluebot_challenge_switch_difficulty(page: Page):
    """Switching difficulty in challenge mode should reload the challenge."""
    page.goto(BASE_URL)
    page.locator("#tab-challenge").click()
    page.locator("#diff-medium").click()
    expect(page.locator("#diff-medium")).to_have_class(re.compile("active"))


# ==============================================================
# 5. Decode (Décodage) Mode
# ==============================================================

def test_bluebot_decode_has_difficulty_buttons(page: Page):
    """Decode mode should have its own difficulty bar."""
    page.goto(BASE_URL)
    page.locator("#tab-read").click()
    expect(page.locator("#read-diff-easy")).to_be_visible()
    expect(page.locator("#read-diff-hard")).to_be_visible()


def test_bluebot_decode_grid_exists(page: Page):
    """Decode mode should render its own grid."""
    page.goto(BASE_URL)
    page.locator("#tab-read").click()
    cells = page.locator("#read-grid .bot-cell")
    expect(cells.first).to_be_visible()


def test_bluebot_decode_program_strip(page: Page):
    """Decode mode should render a read-only program strip with commands."""
    page.goto(BASE_URL)
    page.locator("#tab-read").click()
    strip = page.locator("#read-program")
    expect(strip).to_be_visible()
    # The strip should contain pre-generated commands
    cmds = strip.locator(".program-cmd")
    assert cmds.count() >= 1, "Decode program strip should have at least 1 command"


# ==============================================================
# 6. Skins Drawer
# ==============================================================

def test_bluebot_skins_drawer_opens(page: Page):
    """Clicking 'Changer de skin' should open the skins drawer."""
    page.goto(BASE_URL)
    # Open the options menu first
    page.locator("#optionsMenuBtn").click()
    page.locator("#btn-open-skins").click()
    expect(page.locator("#skins-drawer")).to_have_attribute("aria-hidden", "false")


def test_bluebot_skins_drawer_has_items(page: Page):
    """The skins drawer should contain multiple skin cards."""
    page.goto(BASE_URL)
    page.locator("#optionsMenuBtn").click()
    page.locator("#btn-open-skins").click()
    cards = page.locator("#skins-list-container .skin-card")
    assert cards.count() >= 3, "Should have at least 3 visible skin cards"


def test_bluebot_skins_drawer_closes(page: Page):
    """Clicking the close button should close the skins drawer."""
    page.goto(BASE_URL)
    page.locator("#optionsMenuBtn").click()
    page.locator("#btn-open-skins").click()
    page.locator("#btn-close-skins").click()
    expect(page.locator("#skins-drawer")).to_have_attribute("aria-hidden", "true")


# ==============================================================
# 7. Mats Drawer
# ==============================================================

def test_bluebot_mats_drawer_opens(page: Page):
    """Clicking 'Changer de tapis' should open the mats drawer."""
    page.goto(BASE_URL)
    page.locator("#optionsMenuBtn").click()
    page.locator("#btn-open-mats").click()
    expect(page.locator("#mats-drawer")).to_have_attribute("aria-hidden", "false")


def test_bluebot_mats_drawer_has_opacity_slider(page: Page):
    """The mats drawer should contain the opacity slider."""
    page.goto(BASE_URL)
    page.locator("#optionsMenuBtn").click()
    page.locator("#btn-open-mats").click()
    expect(page.locator("#matOpacitySlider")).to_be_visible()


def test_bluebot_mats_drawer_has_grid_size_sliders(page: Page):
    """The mats drawer should contain grid size sliders."""
    page.goto(BASE_URL)
    page.locator("#optionsMenuBtn").click()
    page.locator("#btn-open-mats").click()
    expect(page.locator("#gridColsSlider")).to_be_visible()
    expect(page.locator("#gridRowsSlider")).to_be_visible()


# ==============================================================
# 8. Dark Mode
# ==============================================================

def test_bluebot_dark_mode_toggle(page: Page):
    """Toggling dark mode should add the 'dark' class to body."""
    page.goto(BASE_URL)
    page.evaluate("localStorage.setItem('global_theme', 'light')")
    page.reload()

    # Toggle to dark
    page.locator("#optionsMenuBtn").click()
    page.locator("#themeToggleBtn").click()
    expect(page.locator("body")).to_have_class(re.compile("dark"))


# ==============================================================
# 9. Score Display
# ==============================================================

def test_bluebot_score_bars_exist(page: Page):
    """Each mode should have a score bar with counters."""
    page.goto(BASE_URL)
    # Simulator score bar
    expect(page.locator("#sim-star-counter-val")).to_be_attached()

    # Challenge score bar
    page.locator("#tab-challenge").click()
    expect(page.locator("#global-score")).to_be_visible()
    expect(page.locator("#global-streak")).to_be_visible()

    # Decode score bar
    page.locator("#tab-read").click()
    expect(page.locator("#read-global-score")).to_be_visible()
    expect(page.locator("#read-global-streak")).to_be_visible()
