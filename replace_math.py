import sys

filepath = 'webapps/simulateur_bluebot.html'
with open(filepath, 'r') as f:
    content = f.read()

search = """            'math': {
                name: 'Calcul mental',
                desc: 'Chiffres de 0 à 35 pour s\\'entraîner au calcul.',
                example: 'Va sur le résultat de 5 + 7.',
                icon: '🔢',
                content: Array.from({ length: 36 }, (_, i) => i.toString())
            },"""
replace = """            'math': {
                name: 'Calcul mental',
                desc: 'Chiffres de 0 à 100 pour s\\'entraîner au calcul.',
                example: 'Va sur le résultat de 5 + 7.',
                icon: '🔢',
                content: Array.from({ length: 101 }, (_, i) => i.toString())
            },"""

if search in content:
    content = content.replace(search, replace)
    with open(filepath, 'w') as f:
        f.write(content)
    print("Successfully replaced math content")
else:
    print("Could not find math search block")
