import re

with open('alpha/webapps/jeu_de_la_grue.html', 'r') as f:
    content = f.read()

# Add CSS for desktop layout
css_to_add = """
        @media (min-width: 900px) {
            .desktop-layout {
                display: flex;
                gap: 30px;
                align-items: center;
                justify-content: center;
            }
            .desktop-layout .game-boards {
                flex: 1;
                max-width: 800px;
                margin-bottom: 0;
            }
            .desktop-layout-side {
                flex: 0 0 300px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .desktop-layout-side .score-bar {
                margin-top: 30px;
                padding-top: 30px;
            }
        }
"""

if "desktop-layout" not in content:
    content = content.replace("</style>", css_to_add + "\n    </style>")

# Wrap in desktop-layout
# Search for <div class="game-boards"> and closing of score-bar
# Actually let's use string manipulation

start_idx = content.find('<!-- GAME BOARDS -->')
end_idx = content.find('</div>\n    </div>\n\n    <footer class="no-print">') # We know score-bar ends here and then the container ends

if start_idx != -1 and end_idx != -1:
    replacement = '<div class="desktop-layout">\n        <!-- GAME BOARDS -->'
    content = content.replace('<!-- GAME BOARDS -->', replacement)

    # We need to wrap program-area and score-bar in desktop-layout-side
    program_idx = content.find('<!-- PROGRAMMING AREA -->')
    if program_idx != -1:
        content = content[:program_idx] + '<div class="desktop-layout-side">\n        ' + content[program_idx:]

    score_end_idx = content.find('</div>\n    </div>\n\n    <footer class="no-print">')
    if score_end_idx != -1:
        # insert closing divs
        # first closing div for desktop-layout-side, second for desktop-layout
        content = content[:score_end_idx + 6] + '\n        </div>\n        </div>' + content[score_end_idx + 6:]


with open('alpha/webapps/jeu_de_la_grue.html', 'w') as f:
    f.write(content)
