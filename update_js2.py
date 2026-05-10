import re

with open('assets/js/url-params.js', 'r') as f:
    content = f.read()

html_to_add = """
                            <div class="share-option" id="lbl-coloredCmds" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-coloredCmds">Couleurs imposées</label>
                                    <div class="share-option-desc">Active les commandes colorées.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-coloredCmds">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
"""

content = content.replace("""
                            <div class="share-option" id="lbl-noInstructions" style="display: none;">""", html_to_add + """
                            <div class="share-option" id="lbl-noInstructions" style="display: none;">""")


logic_to_add = """
    if (document.getElementById('coloredCmdsToggleBtn')) {
        const lblColoredCmds = document.getElementById('lbl-coloredCmds');
        if (lblColoredCmds) lblColoredCmds.style.display = 'flex';

        const optColoredCmds = document.getElementById('opt-coloredCmds');
        if (optColoredCmds) {
            optColoredCmds.checked = document.body.classList.contains('colored-cmds');
        }
    }
"""

content = content.replace("""
    if (document.getElementById('btn-speed')) {""", logic_to_add + """
    if (document.getElementById('btn-speed')) {""")

apply_logic = """
    if (urlParams.get('coloredCmds') === '1') {
        document.body.classList.add('colored-cmds');
        const toggleBtn = document.getElementById('coloredCmdsToggleBtn');
        if (toggleBtn) toggleBtn.style.display = 'none';
    }
"""

content = content.replace("""
    if (urlParams.get('noInstructions') === '1') {""", apply_logic + """
    if (urlParams.get('noInstructions') === '1') {""")


with open('assets/js/url-params.js', 'w') as f:
    f.write(content)
