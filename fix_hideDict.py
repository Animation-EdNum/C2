import sys

filepath = 'webapps/binaire_message.html'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
        // ==========================================
        // ALPHABET GRID
        // ==========================================
"""

replace_block = """
        // ==========================================
        // HIDE DICT (URL PARAM)
        // ==========================================
        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('hideDict') === '1') {
                const style = document.createElement('style');
                style.textContent = `
                    .alpha-section { display: none !important; }
                `;
                document.head.appendChild(style);
            }
        });

        // ==========================================
        // ALPHABET GRID
        // ==========================================
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("binaire_message.html updated successfully.")
else:
    print("Search block not found in binaire_message.html")
