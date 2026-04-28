import re

with open("webapps/simulateur_bluebot.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix grid scrollbar (reduce height further from 80px to 120px)
content = re.sub(
    r"height: min\(100%, 100vh - 80px\) !important;",
    r"height: min(100%, 100vh - 120px) !important;",
    content
)
content = re.sub(
    r"width: min\(100%, 100vh - 80px\) !important;",
    r"width: min(100%, 100vh - 120px) !important;",
    content
)

# 2. Add padding to fullscreen program-strip and change gap/margins
content = re.sub(
    r"body\.fullscreen-map \.program-cmd \{\n\s*transform: scale\(1\.5\);\n\s*margin: 0 5px;\n\s*\}",
    r"body.fullscreen-map .program-cmd {\n                transform: scale(1.5);\n                margin: 0 10px;\n            }",
    content
)

# 3. Increase mini-cmd sizes
content = re.sub(
    r"body\.fullscreen-map \.mini-cmd \{\n\s*width: 40px;\n\s*height: 40px;\n\s*\}",
    r"body.fullscreen-map .mini-cmd {\n                width: 56px;\n                height: 56px;\n            }",
    content
)
content = re.sub(
    r"body\.fullscreen-map \.mini-cmd svg \{\n\s*width: 20px;\n\s*height: 20px;\n\s*\}",
    r"body.fullscreen-map .mini-cmd svg {\n                width: 28px;\n                height: 28px;\n            }",
    content
)

# Increase challenge-option padding
content = re.sub(
    r"body\.fullscreen-map \.challenge-option \{\n\s*padding: 20px;\n\s*\}",
    r"body.fullscreen-map .challenge-option {\n                padding: 25px;\n            }\n            body.fullscreen-map .option-label {\n                font-size: 24px;\n                min-width: 30px;\n            }\n            body.fullscreen-map .option-cmds {\n                gap: 12px;\n            }",
    content
)

# 4. Make instructions visible and prevent overlap with close button
# We need to ensure that #read-instruction, #sim-program, #chal-options don't get hidden or overlap.
# Let's adjust display: none rule:
content = re.sub(
    r"body\.fullscreen-map \.sim-options, body\.fullscreen-map \.controls, body\.fullscreen-map \.score-bar, body\.fullscreen-map \.legend, body\.fullscreen-map \.icon-action-btn, body\.fullscreen-map #sim-program \{\n\s*display: none !important;\n\s*\}",
    r"body.fullscreen-map .sim-options, body.fullscreen-map .controls, body.fullscreen-map .score-bar, body.fullscreen-map .legend, body.fullscreen-map .icon-action-btn {\n            display: none !important;\n        }",
    content
)

# Increase sim-program in fullscreen
content = re.sub(
    r"body\.fullscreen-map \.challenge-option \{\n\s*padding: 25px;\n\s*\}",
    r"body.fullscreen-map .challenge-option {\n                padding: 25px;\n            }\n            body.fullscreen-map #sim-program {\n                margin-top: 15px;\n                min-height: 80px;\n                align-items: center;\n            }\n            body.fullscreen-map .empty-program {\n                font-size: 1.2rem;\n            }",
    content
)

# Add top padding to full view so close button doesn't hide text
content = re.sub(
    r"body\.fullscreen-map \.exercise-card \{\n\s*flex: 1;\n\s*display: flex;\n\s*flex-direction: column;\n\s*border-radius: 0;\n\s*border: none;\n\s*margin: 0;\n\s*padding: 10px;\n\s*\}",
    r"body.fullscreen-map .exercise-card {\n            flex: 1;\n            display: flex;\n            flex-direction: column;\n            border-radius: 0;\n            border: none;\n            margin: 0;\n            padding: 10px;\n            padding-top: 30px;\n        }",
    content
)

with open("webapps/simulateur_bluebot.html", "w", encoding="utf-8") as f:
    f.write(content)
