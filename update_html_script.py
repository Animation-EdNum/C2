with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

script_to_add = """
        const coloredCmdsBtn = document.getElementById('coloredCmdsToggleBtn');
        if (coloredCmdsBtn) {
            coloredCmdsBtn.addEventListener('click', () => {
                document.body.classList.toggle('colored-cmds');
                const isActive = document.body.classList.contains('colored-cmds');
                localStorage.setItem('bb_colored_cmds', isActive ? '1' : '0');

                if (isActive) {
                    coloredCmdsBtn.style.color = 'var(--accent)';
                } else {
                    coloredCmdsBtn.style.color = '';
                }
            });

            if (localStorage.getItem('bb_colored_cmds') === '1') {
                document.body.classList.add('colored-cmds');
                coloredCmdsBtn.style.color = 'var(--accent)';
            }
        }
"""

content = content.replace("window.addEventListener('load', () => {", "window.addEventListener('load', () => {\n" + script_to_add)

with open('webapps/simulateur_bluebot.html', 'w') as f:
    f.write(content)
