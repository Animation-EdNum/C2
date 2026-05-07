import sys

filepath = 'webapps/binaire_studio.html'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
        // INITIALISATION
        // ==========================================
"""

replace_block = """
        // ==========================================
        // URL PARAMS
        // ==========================================
        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('lockSize') === '1') {
                document.querySelectorAll('.editor-size-btn').forEach(btn => {
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = '0.5';
                });
            }
        });

        // INITIALISATION
        // ==========================================
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("binaire_studio.html updated successfully.")
else:
    print("Search block not found in binaire_studio.html")
