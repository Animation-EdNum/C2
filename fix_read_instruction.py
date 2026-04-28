import re

with open("webapps/simulateur_bluebot.html", "r", encoding="utf-8") as f:
    content = f.read()

# Make #read-instruction text much larger in desktop fullscreen
content = re.sub(
    r"body\.fullscreen-map \.empty-program \{\n\s*font-size: 1\.2rem;\n\s*\}",
    r"body.fullscreen-map .empty-program {\n                font-size: 1.2rem;\n            }\n            body.fullscreen-map #read-instruction {\n                font-size: 1.8rem !important;\n                margin-top: 10px;\n                max-width: 600px;\n            }",
    content
)

with open("webapps/simulateur_bluebot.html", "w", encoding="utf-8") as f:
    f.write(content)
