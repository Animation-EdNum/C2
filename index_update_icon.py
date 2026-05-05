with open('index.html', 'r') as f:
    content = f.read()

content = content.replace(
    """<i data-fa="dt-up-from-bracket" style="--fa-primary:#2980b9;--fa-secondary:#3498db;width:32px;height:32px;flex-shrink:0;"></i>
                        Jeu de la grue""",
    """<i data-fa="dt-arrow-up-from-square" style="--fa-primary:#2980b9;--fa-secondary:#3498db;width:32px;height:32px;flex-shrink:0;"></i>
                        Jeu de la grue"""
)

with open('index.html', 'w') as f:
    f.write(content)
