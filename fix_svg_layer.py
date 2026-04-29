import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

# 1. Update initLayer to use dynamic viewBox
search_init = """            initLayer(containerId) {
                let layer = document.querySelector(`#${containerId} .trail-layer`);
                if (!layer) {
                    layer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    layer.setAttribute("class", "trail-layer");
                    layer.setAttribute("viewBox", "0 0 100 100");
                    layer.setAttribute("preserveAspectRatio", "none");
                    layer.setAttribute("aria-hidden", "true");
                    document.getElementById(containerId).appendChild(layer);
                }
                return layer;
            },"""

replace_init = """            initLayer(containerId) {
                let layer = document.querySelector(`#${containerId} .trail-layer`);
                if (!layer) {
                    layer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    layer.setAttribute("class", "trail-layer");
                    layer.setAttribute("viewBox", `0 0 ${100 * GRID_COLS} ${100 * GRID_ROWS}`);
                    layer.setAttribute("preserveAspectRatio", "none");
                    layer.setAttribute("aria-hidden", "true");
                    document.getElementById(containerId).appendChild(layer);
                } else {
                    // Update viewBox in case grid size changed
                    layer.setAttribute("viewBox", `0 0 ${100 * GRID_COLS} ${100 * GRID_ROWS}`);
                }
                return layer;
            },"""

# 2. Update _getCenter
search_center = """            _getCenter(row, col) {
                const cw = 100 / GRID_COLS;
                const ch = 100 / GRID_ROWS;
                return { x: (col + 0.5) * cw, y: (row + 0.5) * ch };
            },"""

replace_center = """            _getCenter(row, col) {
                // With viewBox = 0 0 (100*cols) (100*rows), each cell is exactly 100x100
                return { x: (col + 0.5) * 100, y: (row + 0.5) * 100 };
            },"""

if search_init in content and search_center in content:
    content = content.replace(search_init, replace_init)
    content = content.replace(search_center, replace_center)
    with open('webapps/simulateur_bluebot.html', 'w') as f:
        f.write(content)
    print("Layer fixed!")
else:
    print("Not found.")
