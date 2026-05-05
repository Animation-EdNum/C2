with open('alpha/webapps/jeu_de_la_grue.html', 'r') as f:
    content = f.read()

# Add hand-holding as a hidden icon so the subset generator picks it up
content = content.replace('</body>', '<i data-fa="hand-holding" style="display:none;"></i>\n</body>')

with open('alpha/webapps/jeu_de_la_grue.html', 'w') as f:
    f.write(content)
