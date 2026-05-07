import sys

filepath = 'webapps/simulateur_bluebot.html'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--grid-border);">
                <label class="share-toggle" style="margin-bottom: 0;">
                    <input type="checkbox" id="toggle-hide-grid">
                    <span class="share-toggle-slider"></span>
                </label>
                <span style="font-size: 0.9em; font-weight: 600;">Masquer le quadrillage</span>
            </div>
"""

replace_block = """
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--grid-border);">
                <label class="share-toggle" style="margin-bottom: 0;" for="toggle-hide-grid">
                    <input type="checkbox" id="toggle-hide-grid">
                    <span class="share-toggle-slider"></span>
                </label>
                <label for="toggle-hide-grid" style="font-size: 0.9em; font-weight: 600; cursor: pointer; display: flex;">Masquer le quadrillage</label>
            </div>
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("Simulateur Blue-Bot label fix updated successfully.")
else:
    print("Search block not found in Simulateur Blue-Bot label fix block")
