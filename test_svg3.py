import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

match = re.search(r'captureInitialState\(.*?\)\s*\{(.*?)(?=drawSegment)', content, re.DOTALL)
if match:
    print(match.group(1))
