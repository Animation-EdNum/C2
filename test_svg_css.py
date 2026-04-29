import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

match = re.search(r'\.trail-path\s*{[^}]*}', content)
if match:
    print(match.group(0))

match2 = re.search(r'\.start-marker-chevron\s*{[^}]*}', content)
if match2:
    print(match2.group(0))
