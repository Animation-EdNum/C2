import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

# Replace the incorrect aspect-ratio calculation in bot-grid styling
search_css = """        .bot-grid {
            position: relative;
            display: flex;
            flex-direction: column;
            border: 5px solid var(--skin-grid-border, #e2e8f0);
            border-radius: 12px;
            overflow: visible;
            box-shadow: var(--skin-grid-shadow, 0 10px 25px rgba(0, 0, 0, 0.1));
            background: var(--skin-grid-bg, var(--card-bg));
            width: 100%;
            max-width: min(500px, 55vh);
            aspect-ratio: 1 / 1;
            margin: 0 auto;
        }"""

replace_css = """        .bot-grid {
            position: relative;
            display: flex;
            flex-direction: column;
            border: 5px solid var(--skin-grid-border, #e2e8f0);
            border-radius: 12px;
            overflow: visible;
            box-shadow: var(--skin-grid-shadow, 0 10px 25px rgba(0, 0, 0, 0.1));
            background: var(--skin-grid-bg, var(--card-bg));
            width: 100%;
            max-width: min(500px, 55vh);
            aspect-ratio: var(--grid-cols, 6) / var(--grid-rows, 6);
            margin: 0 auto;
        }"""

if search_css in content:
    content = content.replace(search_css, replace_css)
    with open('webapps/simulateur_bluebot.html', 'w') as f:
        f.write(content)
    print("Fixed grid aspect ratio.")
else:
    print("Grid aspect ratio search string not found.")
