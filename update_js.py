import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

js_to_add = """
        const coloredCmdsBtn = document.getElementById('coloredCmdsToggleBtn');
        if (coloredCmdsBtn) {
            coloredCmdsBtn.addEventListener('click', () => {
                document.body.classList.toggle('colored-cmds');
                const isActive = document.body.classList.contains('colored-cmds');
                localStorage.setItem('bb_colored_cmds', isActive ? '1' : '0');

                // Change style to highlight button when active
                if (isActive) {
                    coloredCmdsBtn.style.color = 'var(--accent)';
                } else {
                    coloredCmdsBtn.style.color = '';
                }
            });

            // Init state
            if (localStorage.getItem('bb_colored_cmds') === '1') {
                document.body.classList.add('colored-cmds');
                coloredCmdsBtn.style.color = 'var(--accent)';
            }
        }
"""

# Find a good place to insert this JS logic
# It could be near where speedToggleBtn logic is, but that's in bluebot-ui.js
# Wait, let's see if we should add it in the script tag in simulateur_bluebot.html
# There is a script at the end of body.
