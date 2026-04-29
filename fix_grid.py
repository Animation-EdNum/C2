import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

# Replace hardcoded aspect-ratio 1 / 1 with dynamic var based ratio
search = """        .bot-grid {
            position: relative;
            display: flex;

            flex-direction: column;
            border: 3px solid var(--skin-grid-border, var(--grid-border));
            border-radius: 8px;
            overflow: visible;
            box-shadow: var(--skin-grid-shadow, 0 10px 25px rgba(0, 0, 0, 0.1));
            background: var(--skin-grid-bg, var(--card-bg));
            width: 100%;
            max-width: min(500px, 55vh);
            aspect-ratio: 1 / 1;
            margin: 0 auto;
        }"""

replace = """        .bot-grid {
            position: relative;
            display: flex;

            flex-direction: column;
            border: 3px solid var(--skin-grid-border, var(--grid-border));
            border-radius: 8px;
            overflow: visible;
            box-shadow: var(--skin-grid-shadow, 0 10px 25px rgba(0, 0, 0, 0.1));
            background: var(--skin-grid-bg, var(--card-bg));
            width: 100%;
            max-width: min(100%, calc(55vh * (var(--grid-cols, 6) / var(--grid-rows, 6))));
            aspect-ratio: var(--grid-cols, 6) / var(--grid-rows, 6);
            margin: 0 auto;
        }"""

if search in content:
    content = content.replace(search, replace)
    with open('webapps/simulateur_bluebot.html', 'w') as f:
        f.write(content)
    print("Replaced .bot-grid successfully!")
else:
    print("Search string for .bot-grid not found!")
