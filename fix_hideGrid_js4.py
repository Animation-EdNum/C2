import sys

filepath = 'webapps/simulateur_bluebot.html'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
        });
    </script>
    <script src="../assets/js/url-params.js"></script>
</body>
"""

replace_block = """
        });

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

            const toggleHideGrid = document.getElementById('toggle-hide-grid');
            if (toggleHideGrid) {
                toggleHideGrid.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        document.querySelectorAll('.bot-grid').forEach(grid => grid.classList.add('no-grid-lines'));
                    } else {
                        document.querySelectorAll('.bot-grid').forEach(grid => grid.classList.remove('no-grid-lines'));
                    }
                });
            }
        });
    </script>
    <script src="../assets/js/url-params.js"></script>
</body>
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("JS hideGrid param inserted at the end of HTML.")
else:
    print("Search block not found in JS hideGrid param at the end")
