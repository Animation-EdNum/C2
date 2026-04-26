import re

with open('webapps/simulateur_bluebot.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure the old custom upload container in the modal is removed, just in case
old_custom_html = """            <div id="mat-upload-container"
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
            </div>"""

if old_custom_html in content:
    content = content.replace(old_custom_html, "")
else:
    print("Old custom container block not found, likely already replaced.")

with open('webapps/simulateur_bluebot.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Verified modifications")
