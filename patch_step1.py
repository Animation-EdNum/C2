import re

with open("assets/js/bluebot/bluebot-engine.js", "r") as f:
    content = f.read()

# First step: update buildGrid to use DocumentFragment
search = """
            for (let r = 0; r < rows; r++) {
                const row = document.createElement('div'); row.className = 'grid-row';
                row.setAttribute('role', 'row');
                for (let c = 0; c < cols; c++) {
                    const cell = document.createElement('div');
"""
replace = """
            const fragment = document.createDocumentFragment();
            for (let r = 0; r < rows; r++) {
                const row = document.createElement('div'); row.className = 'grid-row';
                row.setAttribute('role', 'row');
                for (let c = 0; c < cols; c++) {
                    const cell = document.createElement('div');
"""
content = content.replace(search, replace, 1)

search2 = """
                    row.appendChild(cell);
                }
                grid.appendChild(row);
            }
"""
replace2 = """
                    row.appendChild(cell);
                }
                fragment.appendChild(row);
            }
            grid.appendChild(fragment);
"""
content = content.replace(search2, replace2, 1)

with open("assets/js/bluebot/bluebot-engine.js", "w") as f:
    f.write(content)
