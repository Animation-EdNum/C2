import sys

filepath = 'webapps/simulateur_bluebot.html'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
        /* Dalles de roche volcanique */
        .skin-volcano .bot-cell.cell-light {
"""

replace_block = """
        .bot-grid.no-grid-lines .bot-cell {
            border-color: transparent !important;
            background: transparent !important;
        }

        /* Dalles de roche volcanique */
        .skin-volcano .bot-cell.cell-light {
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("CSS hideGrid inserted.")
else:
    print("Search block not found in CSS hideGrid")

search_block_2 = """
                <button class="btn btn-outline btn-small" id="btn-remove-mat"
                    style="white-space: nowrap; font-size: 0.9em;">
                    <i data-fa="trash-can" style="width: 16px; height: 16px; margin-right: 5px;"></i>Aucun tapis
                </button>
            </div>
"""

replace_block_2 = """
                <button class="btn btn-outline btn-small" id="btn-remove-mat"
                    style="white-space: nowrap; font-size: 0.9em;">
                    <i data-fa="trash-can" style="width: 16px; height: 16px; margin-right: 5px;"></i>Aucun tapis
                </button>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--grid-border);">
                <label class="share-toggle" style="margin-bottom: 0;">
                    <input type="checkbox" id="toggle-hide-grid">
                    <span class="share-toggle-slider"></span>
                </label>
                <span style="font-size: 0.9em; font-weight: 600;">Masquer le quadrillage</span>
            </div>
"""

with open(filepath, 'r') as f:
    content = f.read()

if search_block_2.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block_2.strip(), replace_block_2.strip()))
    print("HTML hideGrid inserted.")
else:
    print("Search block not found in HTML hideGrid")

search_block_3 = """
        // Draw Board specific config
        let drawMatColor = '#f8fafc';
        let drawLineColor = '#3b82f6';
"""

replace_block_3 = """
        // Draw Board specific config
        let drawMatColor = '#f8fafc';
        let drawLineColor = '#3b82f6';

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
"""

with open(filepath, 'r') as f:
    content = f.read()

if search_block_3.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block_3.strip(), replace_block_3.strip()))
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

        document.getElementById('toggle-hide-grid').addEventListener('change', (e) => {
            if (e.target.checked) {
                document.querySelectorAll('.bot-grid').forEach(grid => grid.classList.add('no-grid-lines'));
                // Optionnel: Mettre a jour URL ou stocker dans le localstorage
            } else {
                document.querySelectorAll('.bot-grid').forEach(grid => grid.classList.remove('no-grid-lines'));
            }
        });
"""

with open(filepath, 'r') as f:
    content = f.read()

if search_block_4.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block_4.strip(), replace_block_4.strip()))
    print("JS hideGrid listener inserted.")
else:
    print("Search block not found in JS hideGrid listener")
