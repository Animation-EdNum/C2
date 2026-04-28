import sys

filepath = 'webapps/simulateur_bluebot.html'
with open(filepath, 'r') as f:
    content = f.read()

# Replace updateGridContainersAspectRatio
search = """        function updateGridContainersAspectRatio() {
            const containers = document.querySelectorAll('.bot-grid-container');
            containers.forEach(container => {
                container.style.aspectRatio = `${GRID_COLS} / ${GRID_ROWS}`;
            });
        }"""
replace = """        function updateGridContainersAspectRatio() {
            const containers = document.querySelectorAll('.bot-grid-container');
            containers.forEach(container => {
                container.style.aspectRatio = `${GRID_COLS} / ${GRID_ROWS}`;
            });
            const grids = document.querySelectorAll('.bot-grid');
            grids.forEach(grid => {
                grid.style.aspectRatio = `${GRID_COLS} / ${GRID_ROWS}`;
            });
        }"""

if search in content:
    content = content.replace(search, replace)
    with open(filepath, 'w') as f:
        f.write(content)
    print("Successfully replaced updateGridContainersAspectRatio")
else:
    print("Could not find updateGridContainersAspectRatio search block")
