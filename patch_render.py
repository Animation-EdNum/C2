import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

# Replace renderProgram
new_render = """
        function renderProgram() {
            const strip = document.getElementById('sim-program');
            const toggleBtn = document.getElementById('hideCmdToggleBtn');

            strip.innerHTML = '';

            if (simState.program.length === 0) {
                strip.insertAdjacentHTML('beforeend', '<div class="empty-program">Ajoute des commandes avec les boutons ou le clavier…</div>');
                if (toggleBtn) {
                    strip.appendChild(toggleBtn);
                }
                return;
            }

            const cmdsHtml = simState.program.map((cmd, i) =>
                `<div class="program-cmd" tabindex="0" data-index="${i}" title="Cliquer pour supprimer">${BB_SVGS[cmd]}</div>`
            ).join('');
            strip.insertAdjacentHTML('beforeend', cmdsHtml);

            if (toggleBtn) {
                strip.appendChild(toggleBtn);
            }
        }
"""

content = re.sub(r'\n        function renderProgram\(\) \{.*?\n        \}', new_render, content, flags=re.DOTALL)

with open('webapps/simulateur_bluebot.html', 'w') as f:
    f.write(content)
