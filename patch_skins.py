import re

with open('webapps/simulateur_bluebot.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the click listener logic for skins
old_listener = """        document.getElementById('skins-list-container').addEventListener('click', (e) => {
            const card = e.target.closest('.skin-card');
            const btn = e.target.closest('.select-skin-btn');
            const skinId = (card || btn)?.dataset.skin;
            if (skinId) selectSkin(skinId);
        });"""

new_listener = """        document.getElementById('skins-list-container').addEventListener('click', (e) => {
            const item = e.target.closest('.skin-list-item');
            const skinId = item?.dataset.skin;
            if (skinId && !item.classList.contains('locked')) selectSkin(skinId);
        });"""
content = content.replace(old_listener, new_listener)

# Modify renderSkinsList
old_btn = """                if (isUnlocked) {
                    btnHtml = isActive
                        ? `<button class="btn btn-small" disabled style="background:var(--success); color:white; padding: 4px 8px; font-size: 12px;">✓</button>`
                        : `<button class="btn btn-outline btn-small select-skin-btn" data-skin="${skinId}" style="padding: 4px 8px; font-size: 12px;">Choisir</button>`;
                } else {
                    lockIcon = `<div class="lock-icon" style="position: absolute; font-size: 24px; z-index: 2;">🔒</div>`;
                    btnHtml = `<button class="btn btn-outline btn-small" disabled style="padding: 4px 8px; font-size: 12px; opacity:0.5;">🔒</button>`;
                }"""

new_btn = """                if (!isUnlocked) {
                    lockIcon = `<div class="lock-icon" style="position: absolute; font-size: 24px; z-index: 2;">🔒</div>`;
                }"""
content = content.replace(old_btn, new_btn)

# Remove the action div rendering
old_action = """                        <div class="skin-item-action">
                            ${btnHtml}
                        </div>"""
content = content.replace(old_action, "")

with open('webapps/simulateur_bluebot.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patch applied")
