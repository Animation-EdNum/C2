import sys

filepath = 'webapps/simulateur_bluebot.html'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
        // Application de l'état "No Drag" si activé
        if (typeof window.noDragParam !== 'undefined' && window.noDragParam) {
            document.querySelectorAll('.program-cmd, .cmd-btn-prog').forEach(el => {
                el.removeAttribute('draggable');
                el.classList.remove('draggable');
                el.style.cursor = 'default';
            });
        }
"""

replace_block = """
        // Application de l'état "No Drag" si activé
        if (typeof window.noDragParam !== 'undefined' && window.noDragParam) {
            document.querySelectorAll('.program-cmd, .cmd-btn-prog').forEach(el => {
                el.removeAttribute('draggable');
                el.classList.remove('draggable');
                el.style.cursor = 'default';
            });
        }

        // Hide Grid Params Check
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('hideGrid') === '1') {
            document.querySelectorAll('.bot-grid').forEach(grid => {
                grid.classList.add('no-grid-lines');
            });
            const toggleBtn = document.getElementById('toggle-hide-grid');
            if (toggleBtn) {
                toggleBtn.checked = true;
            }
        }
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("JS hideGrid param inserted.")
else:
    print("Search block not found in JS hideGrid param")

search_block_2 = """
        document.getElementById('btn-remove-mat').addEventListener('click', () => {
            activeMat = 'none';
            applyMatToAllGrids();
            localStorage.setItem('bb_active_mat', 'none');
            document.querySelectorAll('.mat-item').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.mat-selected-icon').forEach(icon => icon.remove());
        });
"""

replace_block_2 = """
        document.getElementById('btn-remove-mat').addEventListener('click', () => {
            activeMat = 'none';
            applyMatToAllGrids();
            localStorage.setItem('bb_active_mat', 'none');
            document.querySelectorAll('.mat-item').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.mat-selected-icon').forEach(icon => icon.remove());
        });

        const toggleHideGrid = document.getElementById('toggle-hide-grid');
        if(toggleHideGrid) {
            toggleHideGrid.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.querySelectorAll('.bot-grid').forEach(grid => grid.classList.add('no-grid-lines'));
                } else {
                    document.querySelectorAll('.bot-grid').forEach(grid => grid.classList.remove('no-grid-lines'));
                }
            });
        }
"""

with open(filepath, 'r') as f:
    content = f.read()

if search_block_2.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block_2.strip(), replace_block_2.strip()))
    print("JS hideGrid listener inserted.")
else:
    print("Search block not found in JS hideGrid listener")
