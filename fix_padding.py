import re

with open("webapps/simulateur_bluebot.html", "r", encoding="utf-8") as f:
    content = f.read()

# Make sure the top padding is also applied in desktop layout to avoid the close button overlap
content = re.sub(
    r"body\.fullscreen-map \.exercise-card \{\n\s*display: grid;\n\s*grid-template-columns: minmax\(0, 1fr\) auto;\n\s*align-content: center;\n\s*align-items: center;\n\s*justify-items: center;\n\s*gap: 15px 40px;\n\s*padding: 20px;\n\s*\}",
    r"body.fullscreen-map .exercise-card {\n                display: grid;\n                grid-template-columns: minmax(0, 1fr) auto;\n                align-content: center;\n                align-items: center;\n                justify-items: center;\n                gap: 15px 40px;\n                padding: 40px 20px 20px 20px;\n            }",
    content
)

with open("webapps/simulateur_bluebot.html", "w", encoding="utf-8") as f:
    f.write(content)
