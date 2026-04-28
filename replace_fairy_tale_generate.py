import sys

filepath = 'webapps/simulateur_bluebot.html'
with open(filepath, 'r') as f:
    content = f.read()

search = "} else if (matId === 'fairy_tale') {\n                    config.content = shuffleArray([...config.baseContent]).slice(0, 36);\n                }"
replace = "} else if (matId === 'fairy_tale') {\n                    config.content = shuffleArray([...config.baseContent]).slice(0, GRID_ROWS * GRID_COLS);\n                }"

if search in content:
    content = content.replace(search, replace)
    with open(filepath, 'w') as f:
        f.write(content)
    print("Replaced fairy_tale generate!")
else:
    print("Not found fairy_tale generate!")
