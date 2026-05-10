import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

# Add the button in the HTML
new_button = """                        <button class="menu-item-btn" id="coloredCmdsToggleBtn" aria-label="Activer/Désactiver les commandes colorées">
                            <i data-fa="children"></i>
                            <span id="coloredCmdsToggleText">Couleurs</span>
                        </button>
"""

content = content.replace(
    '<button class="menu-item-btn" id="audioToggleBtn"',
    new_button + '                        <button class="menu-item-btn" id="audioToggleBtn"'
)

with open('webapps/simulateur_bluebot.html', 'w') as f:
    f.write(content)
