import re

with open("webapps/simulateur_bluebot.html", "r", encoding="utf-8") as f:
    content = f.read()

# Make the exit button more prominent
content = re.sub(
    r'<button id="btn-exit-fullscreen" style="([^"]*)" class="btn btn-new" title="Quitter le plein écran">✖</button>',
    r'<button id="btn-exit-fullscreen" style="\1 font-size: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);" class="btn btn-new" title="Quitter le plein écran">✖</button>',
    content
)

with open("webapps/simulateur_bluebot.html", "w", encoding="utf-8") as f:
    f.write(content)
