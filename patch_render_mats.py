import re

with open('webapps/simulateur_bluebot.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_render = """        function renderMatsGrid() {
            const container = document.getElementById('mats-grid-container');
            container.innerHTML = Object.keys(MAT_CONFIG).map(matId => {
                const config = MAT_CONFIG[matId];
                const isActive = activeMat === matId;

                let btnHtml = isActive
                    ? `<button class="btn btn-small" disabled style="background:var(--success); color:white; width:100%;">Activé ✓</button>`
                    : `<button class="btn btn-outline btn-small select-mat-btn" data-mat="${matId}" style="width:100%;">Sélectionner</button>`;

                return `
                    <div class="skin-card ${isActive ? 'active-skin' : ''}" data-mat="${matId}" tabindex="0" >
                        <div class="skin-card-header">
                            <span>${config.name}</span>
                        </div>
                        <div class="skin-preview" style="background: var(--grid-light);">
                            <div style="font-size: 32px; font-weight: bold; color: var(--text-muted); opacity: 0.5;">
                                ${config.icon || 'A'}
                            </div>
                        </div>
                        <div class="skin-desc">${config.desc}</div>
                        <div style="margin-top:auto; padding-top:10px;">
                            ${btnHtml}
                        </div>
                    </div>
                `;
            }).join('');
        }"""

new_render = """        function renderMatsGrid() {
            const container = document.getElementById('mats-list-container');
            container.innerHTML = Object.keys(MAT_CONFIG).filter(matId => matId !== 'none' && matId !== 'custom').map(matId => {
                const config = MAT_CONFIG[matId];
                const isActive = activeMat === matId;

                const exampleHtml = config.example ? `<div class="skin-item-desc" style="font-style: italic; color: var(--accent); margin-top: 4px; font-size: 0.8em;">💡 ${config.example}</div>` : '';

                return `
                    <div class="skin-list-item ${isActive ? 'active-skin' : ''}" data-mat="${matId}" tabindex="0">
                        <div class="skin-item-avatar" style="font-size: 32px;">
                            ${config.icon || 'A'}
                        </div>
                        <div class="skin-item-info">
                            <div class="skin-item-name">${config.name}</div>
                            <div class="skin-item-desc">${config.desc}</div>
                            ${exampleHtml}
                        </div>
                    </div>
                `;
            }).join('');

            // Re-append the custom upload at the end
            const customConfig = MAT_CONFIG['custom'];
            const isCustomActive = activeMat === 'custom';
            const customHtml = `
                <div class="skin-list-item ${isCustomActive ? 'active-skin' : ''}" data-mat="custom" tabindex="0" style="margin-top: 15px; border-top: 1px solid var(--grid-border); border-radius: 0 0 12px 12px; padding-top: 15px;">
                    <div class="skin-item-avatar" style="font-size: 32px;">
                        ${customConfig.icon}
                    </div>
                    <div class="skin-item-info">
                        <div class="skin-item-name">${customConfig.name}</div>
                        <div class="skin-item-desc">${customConfig.desc}</div>
                        <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;" onclick="event.stopPropagation()">
                            <label for="customMatUpload" class="btn btn-outline btn-small"
                                style="cursor: pointer; flex-grow: 1; text-align: center; font-size: 0.85em; padding: 4px 8px;">
                                <i data-lucide="upload" style="width: 14px; height: 14px; margin-right: 5px; vertical-align: middle;"></i>
                                Télécharger image
                            </label>
                            <input type="file" id="customMatUpload" accept="image/*" style="display: none;">
                        </div>
                        <div id="customMatStatus" style="font-size: 0.8em; color: var(--text-muted); margin-top: 5px;"></div>
                    </div>
                </div>
            `;
            container.innerHTML += customHtml;
            lucide.createIcons();

            // Re-bind the upload listener here since the DOM is recreated
            const uploadInput = document.getElementById('customMatUpload');
            if (uploadInput) {
                uploadInput.addEventListener('change', handleCustomMatUpload);
            }
        }"""

if old_render in content:
    content = content.replace(old_render, new_render)
else:
    print("Could not find the exact old_render block.")

# Remove the old customMatUpload listener outside
old_upload_listener = """        document.getElementById('customMatUpload').addEventListener('change', handleCustomMatUpload);"""
if old_upload_listener in content:
    content = content.replace(old_upload_listener, "")

with open('webapps/simulateur_bluebot.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patch Render Mats applied")
