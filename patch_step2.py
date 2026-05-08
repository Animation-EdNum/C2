import re

with open("assets/js/bluebot/bluebot-engine.js", "r") as f:
    content = f.read()

# Introduce window.domCache before buildGrid
search1 = """        function buildGrid(containerId, rows, cols, obstacles = []) {"""
replace1 = """        window.domCache = window.domCache || {
            elements: {},
            getElement: function(id) {
                if (!this.elements[id] || !document.contains(this.elements[id])) {
                    this.elements[id] = document.getElementById(id);
                }
                return this.elements[id];
            },
            setElement: function(id, el) {
                this.elements[id] = el;
            },
            clearElements: function(prefix) {
                for (let key in this.elements) {
                    if (key.startsWith(prefix)) {
                        delete this.elements[key];
                    }
                }
            }
        };

        function buildGrid(containerId, rows, cols, obstacles = []) {"""

content = content.replace(search1, replace1, 1)

# In buildGrid, clear and set elements
search2 = """
            updateGridContainersAspectRatio();
"""
replace2 = """
            updateGridContainersAspectRatio();
            if (window.domCache) window.domCache.clearElements(containerId);
"""
content = content.replace(search2, replace2, 1)

search3 = """
                    cell.dataset.row = r; cell.dataset.col = c;
"""
replace3 = """
                    cell.dataset.row = r; cell.dataset.col = c;
                    if (window.domCache) window.domCache.setElement(cell.id, cell);
"""
content = content.replace(search3, replace3, 1)

# In triggerRipple, use window.domCache
search4 = """
                grids.forEach(gridId => {
                    const cellId = `${gridId}-cell-${row}-${col}`;
                    const cell = document.getElementById(cellId);
                    if (cell) {
"""
replace4 = """
                grids.forEach(gridId => {
                    const cellId = `${gridId}-cell-${row}-${col}`;
                    const cell = window.domCache ? window.domCache.getElement(cellId) : document.getElementById(cellId);
                    if (cell) {
"""
content = content.replace(search4, replace4, 1)

# Let's also optimize renderPath since it was a loop over path cells, actually I won't touch it since I excluded it, but I CAN optimize placeOverlay which is called very often
search5 = """        function placeOverlay(containerId, overlayId, row, col, content, extraClass, ariaLabel = '') {
            let ov = document.getElementById(overlayId);"""
replace5 = """        function placeOverlay(containerId, overlayId, row, col, content, extraClass, ariaLabel = '') {
            let ov = window.domCache ? window.domCache.getElement(overlayId) : document.getElementById(overlayId);"""
content = content.replace(search5, replace5, 1)

search6 = """            if (isNew) document.getElementById(containerId).appendChild(ov);"""
replace6 = """            if (isNew) {
                const container = window.domCache ? window.domCache.getElement(containerId) : document.getElementById(containerId);
                if (container) container.appendChild(ov);
            }"""
content = content.replace(search6, replace6, 1)

with open("assets/js/bluebot/bluebot-engine.js", "w") as f:
    f.write(content)
