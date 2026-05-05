with open('alpha/webapps/jeu_de_la_grue.html', 'r') as f:
    content = f.read()

# Subtitle to chal-instruction
content = content.replace(
    """<p class="subtitle">Déplace la grue pour attraper et déplacer des objets !</p>""",
    """<div class="chal-instruction">Déplace la grue pour attraper et déplacer des objets !</div>"""
)

# Also update the arrow-up-from-square icon
content = content.replace(
    """<i data-fa="up-from-bracket"></i>""",
    """<i data-fa="arrow-up-from-square"></i>"""
)

with open('alpha/webapps/jeu_de_la_grue.html', 'w') as f:
    f.write(content)
