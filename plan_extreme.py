import re

with open('webapps/routage_reseau.html', 'r') as f:
    content = f.read()

# Check where difficulty buttons are defined
idx = content.find('<button class="diff-btn" id="diff-hard">🔴 Difficile</button>')
print(content[idx-100:idx+200])
