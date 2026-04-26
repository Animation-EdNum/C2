import re

with open('webapps/simulateur_bluebot.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Adding example field to MAT_CONFIG
content = content.replace(
    "'alphabet': { name: 'Alphabet et nombres', desc: 'Lettres A-Z et chiffres 0-9.', content: Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), icon: '🔤' },",
    "'alphabet': { name: 'Alphabet et nombres', desc: 'Lettres A-Z et chiffres 0-9.', example: 'Épelle ton prénom.', content: Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), icon: '🔤' },"
)

content = content.replace(
    "desc: 'Thème ville et sécurité routière.',",
    "desc: 'Thème ville et sécurité routière.',\n                example: 'Amène le robot au supermarché.',"
)

content = content.replace(
    "desc: 'Chiffres de 0 à 35 pour s\\'entraîner au calcul.',",
    "desc: 'Chiffres de 0 à 35 pour s\\'entraîner au calcul.',\n                example: 'Va sur le résultat de 5 + 7.',"
)

content = content.replace(
    "desc: 'Formes géométriques colorées.',",
    "desc: 'Formes géométriques colorées.',\n                example: 'Trouve le carré rouge.',"
)

content = content.replace(
    "desc: 'Drapeaux du monde.',",
    "desc: 'Drapeaux du monde.',\n                example: 'Va sur le drapeau du Japon.',"
)

content = content.replace(
    "desc: 'Fruits et légumes.',",
    "desc: 'Fruits et légumes.',\n                example: 'Va chercher la pomme.',"
)

content = content.replace(
    "desc: 'Contes et légendes.',",
    "desc: 'Contes et légendes.',\n                example: 'Rejoins le château sans croiser le loup.',"
)

with open('webapps/simulateur_bluebot.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patch Config applied")
