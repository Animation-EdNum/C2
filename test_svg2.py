import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

# Let's check the current logic of captureInitialState since we replaced the start marker code earlier.
match = re.search(r'captureInitialState\(.*?\)\s*\{(.*?)\}', content, re.DOTALL)
if match:
    print("Found it!")
else:
    print("Not found.")
