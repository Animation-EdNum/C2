with open('alpha/webapps/jeu_de_la_grue.html', 'r') as f:
    content = f.read()

content = content.replace('min-height: 90px;\n            display: flex;', 'min-height: 90px;\n            height: auto;\n            display: flex;')

with open('alpha/webapps/jeu_de_la_grue.html', 'w') as f:
    f.write(content)
