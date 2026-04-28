import sys

filepath = 'webapps/simulateur_bluebot.html'
with open(filepath, 'r') as f:
    content = f.read()

search = """            'shapes': {
                name: 'Couleurs et formes',
                desc: 'Formes géométriques colorées.',
                example: 'Trouve le carré rouge.',
                icon: '🔵',
                content: [],
                baseContent: [
                    '🔴', '🟠', '🟡', '🟢', '🔵', '🟣',
                    '🟥', '🟧', '🟨', '🟩', '🟦', '🟪',
                    '🔺', '🔻', '🔶', '🔷', '🔸', '🔹'
                ]
            },"""
replace = """            'shapes': {
                name: 'Couleurs et formes',
                desc: 'Formes géométriques colorées.',
                example: 'Trouve le carré rouge.',
                icon: '🔵',
                content: [],
                baseContent: [
                    '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪',
                    '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜',
                    '🔺', '🔻', '🔶', '🔷', '🔸', '🔹', '❤️', '🧡', '💛',
                    '💚', '💙', '💜', '🤎', '🖤', '🤍', '🤎', '🩷', '🩵'
                ]
            },"""

if search in content:
    content = content.replace(search, replace)
    with open(filepath, 'w') as f:
        f.write(content)
    print("Successfully replaced shapes content")
else:
    print("Could not find shapes search block")
