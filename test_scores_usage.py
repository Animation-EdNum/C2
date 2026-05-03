import re

with open('webapps/routage_reseau.html', 'r') as f:
    content = f.read()

print("Calls to ScoreManager:")
for match in re.findall(r'ScoreManager\.[a-zA-Z]+\(.*\)', content):
    print(match)
