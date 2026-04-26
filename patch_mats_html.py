import re

with open('webapps/simulateur_bluebot.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace mats-modal with mats-drawer
old_mats_modal = """    <!-- Mats Modal -->
    <div id="mats-modal" aria-hidden="true" role="dialog" aria-labelledby="mats-modal-title">
        <div class="skins-content">
            <div class="skins-header">
                <h2 id="mats-modal-title">🗺️ Tapis</h2>
                <button class="btn-close-modal" id="btn-close-mats" aria-label="Fermer">✖</button>
            </div>
            <div id="mat-opacity-container"
                style="display: flex; flex-direction: column; align-items: stretch; gap: 5px; margin-bottom: 15px; padding: 15px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 12px;">
                <div
                    style="display: flex; justify-content: space-between; font-size: 1em; color: var(--text-main); font-weight: 600;">
                    <span>Opacité des tapis</span>
                    <span id="matOpacityValue">30%</span>
                </div>
                <input type="range" id="matOpacitySlider" min="0.1" max="1" step="0.1" value="0.3" style="width: 100%;">
            </div>

            <div id="mat-upload-container"
                style="display: flex; flex-direction: column; align-items: stretch; gap: 10px; margin-bottom: 15px; padding: 15px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 12px;">
                <div id="customMatTitle" style="font-size: 1em; color: var(--text-main); font-weight: 600;">Ajouter un
                    tapis personnalisé</div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <label for="customMatUpload" class="btn btn-outline"
                        style="cursor: pointer; flex-grow: 1; text-align: center;">
                        <i data-lucide="upload"
                            style="width: 18px; height: 18px; margin-right: 5px; vertical-align: middle;"></i>
                        Sélectionner une image
                    </label>
                    <input type="file" id="customMatUpload" accept="image/*" style="display: none;">
                </div>
                <div id="customMatStatus"
                    style="font-size: 0.85em; color: var(--text-muted); text-align: center; min-height: 1.2em;"></div>
            </div>

            <div class="skins-grid" id="mats-grid-container">
                <!-- Mats generated via JS -->
            </div>
        </div>
    </div>"""

new_mats_drawer = """    <!-- Mats Drawer Component -->
    <div id="mats-drawer-overlay" class="skins-drawer-overlay" aria-hidden="true"></div>
    <div id="mats-drawer" class="skins-drawer" aria-hidden="true" role="dialog" aria-labelledby="mats-drawer-title">
        <div class="skins-drawer-header" style="flex-direction: column; align-items: stretch; gap: 10px; padding: 15px 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 id="mats-drawer-title">🗺️ Tapis</h2>
                <button class="btn-close-modal" id="btn-close-mats" aria-label="Fermer">✖</button>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; gap: 15px;">
                <div id="mat-opacity-container" style="flex-grow: 1; display: flex; flex-direction: column; gap: 5px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.9em; font-weight: 600;">
                        <span>Opacité</span>
                        <span id="matOpacityValue">30%</span>
                    </div>
                    <input type="range" id="matOpacitySlider" min="0.1" max="1" step="0.1" value="0.3" style="width: 100%;">
                </div>
                <button class="btn btn-outline btn-small" id="btn-remove-mat" style="white-space: nowrap; font-size: 0.9em;">
                    <i data-lucide="trash-2" style="width: 16px; height: 16px; margin-right: 5px;"></i>Aucun tapis
                </button>
            </div>
        </div>
        <div class="skins-list" id="mats-list-container">
            <!-- Mats generated via JS -->
        </div>
    </div>"""

if old_mats_modal in content:
    content = content.replace(old_mats_modal, new_mats_drawer)
else:
    print("Could not find the exact old_mats_modal block.")

with open('webapps/simulateur_bluebot.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patch HTML applied")
