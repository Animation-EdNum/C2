with open('alpha/webapps/jeu_de_la_grue.html', 'r') as f:
    content = f.read()

# Add hand-holding as a hidden icon so the subset generator picks it up
content = content.replace('<div id="c2-toast-container"></div>', '<div id="c2-toast-container"></div>\n    <i data-fa="hand-holding" style="display:none;"></i>')

with open('alpha/webapps/jeu_de_la_grue.html', 'w') as f:
    f.write(content)
