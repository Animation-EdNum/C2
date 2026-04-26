import re

with open('webapps/simulateur_bluebot.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the active skin more green instead of just accent bordered
old_css = """        .skin-list-item.active-skin {
            border-color: var(--accent);
            background: rgba(99, 102, 241, 0.1);
        }

        body.dark .skin-list-item.active-skin {
            background: rgba(99, 102, 241, 0.2);
        }"""

new_css = """        .skin-list-item.active-skin {
            border-color: var(--success);
            background: rgba(34, 197, 94, 0.1);
        }

        body.dark .skin-list-item.active-skin {
            background: rgba(34, 197, 94, 0.2);
        }"""
content = content.replace(old_css, new_css)

with open('webapps/simulateur_bluebot.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patch applied")
