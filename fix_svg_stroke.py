import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

# Scale stroke-widths for the new 100x100 cell size
# If old cell size in SVG was 100/6 = 16.66, and stroke-width was 1.2
# 1.2 * 6 = 7.2
content = content.replace("stroke-width: 1.2;", "stroke-width: 7;")
content = content.replace("stroke-width: 0.8;", "stroke-width: 5;")

with open('webapps/simulateur_bluebot.html', 'w') as f:
    f.write(content)

print("Strokes fixed!")
