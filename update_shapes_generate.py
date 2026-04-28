import sys

filepath = 'webapps/simulateur_bluebot.html'
with open(filepath, 'r') as f:
    content = f.read()

search = """                if (matId === 'shapes') {
                    config.content = shuffleArray([...config.baseContent, ...config.baseContent]);
                } else if (matId === 'fairy_tale') {"""
replace = """                if (matId === 'shapes') {
                    // Duplicate enough times to fill a larger grid if needed (e.g. 10x10)
                    let expandedContent = [];
                    const needed = GRID_ROWS * GRID_COLS;
                    while (expandedContent.length < needed) {
                        expandedContent = expandedContent.concat(config.baseContent);
                    }
                    config.content = shuffleArray(expandedContent).slice(0, needed);
                } else if (matId === 'fairy_tale') {"""

if search in content:
    content = content.replace(search, replace)
    with open(filepath, 'w') as f:
        f.write(content)
    print("Successfully replaced generate shapes content")
else:
    print("Could not find generate shapes search block")
