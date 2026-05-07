import sys

filepath = 'webapps/simulateur_bluebot.html'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
        // Draw Board specific config
        let drawMatColor = '#f8fafc';
        let drawLineColor = '#3b82f6';
"""

# Try another anchor
search_block_alt = """
        // ==========================================
        // VARIABLES GLOBALES & ETAT
        // ==========================================
"""

replace_block_alt = """
        // ==========================================
        // URL PARAMS INIT
        // ==========================================
        document.addEventListener('DOMContentLoaded', () => {
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
        });

        // ==========================================
        // VARIABLES GLOBALES & ETAT
        // ==========================================
"""

if search_block_alt.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block_alt.strip(), replace_block_alt.strip()))
    print("JS hideGrid param inserted.")
else:
    print("Search block not found in JS hideGrid param")

search_block_4 = """
        document.getElementById('btn-remove-mat').addEventListener('click', () => {
            activeMat = 'none';
            applyMatToAllGrids();
            localStorage.setItem('bb_active_mat', 'none');
            // update btn visuals
            document.querySelectorAll('.mat-item').forEach(el => el.classList.remove('active'));
            // Remove selection checkmarks
            document.querySelectorAll('.mat-selected-icon').forEach(icon => icon.remove());
        });
"""

replace_block_4 = """
        document.getElementById('btn-remove-mat').addEventListener('click', () => {
            activeMat = 'none';
            applyMatToAllGrids();
            localStorage.setItem('bb_active_mat', 'none');
            // update btn visuals
            document.querySelectorAll('.mat-item').forEach(el => el.classList.remove('active'));
            // Remove selection checkmarks
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

if search_block_4.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block_4.strip(), replace_block_4.strip()))
    print("JS hideGrid listener inserted.")
else:
    print("Search block not found in JS hideGrid listener")
