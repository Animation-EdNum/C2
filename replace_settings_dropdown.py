import os
import re

files_to_update = [
    'webapps/binaire_codage.html',
    'webapps/binaire_message.html',
    'webapps/binaire_studio.html',
    'webapps/bit_de_parite.html',
    'webapps/routage_reseau.html',
    'webapps/simulateur_bluebot.html',
    'ressources/bareme.html',
    'ressources/tirage.html'
]

new_settings_html = """                <div class="settings-dropdown">
                    <button class="icon-action-btn" title="Options" aria-label="Options" id="optionsMenuBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <div class="settings-dropdown-content">
                        <button class="menu-item-btn" onclick="if(typeof ScoreManager !== 'undefined') ScoreManager.showModal()" aria-label="Voir mes statistiques">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                            <span>Voir mes statistiques</span>
                        </button>
                        <button class="menu-item-btn" id="themeToggleBtn" aria-label="Changer de thème">
                            <svg id="icon-sun" style="display:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            <svg id="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                            <span id="themeToggleText">Changer le thème</span>
                        </button>
                        <button class="menu-item-btn" id="audioToggleBtn" aria-label="Activer/Désactiver le son">
                            <svg id="icon-vol-on" style="display:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                            <svg id="icon-vol-off" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                            <span id="audioToggleText">Activer le son</span>
                        </button>
                    </div>
                </div>"""

def replace_in_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, 'r') as f:
        content = f.read()

    # Define a regex pattern that matches the old action-buttons layout (score + home + old dropdown)
    # This might be tricky because each file can have slight variations.
    # Let's try to find the action-buttons div and replace its content.

    # We want to replace the whole action-buttons block with the new layout
    # First, let's extract the header title
    title_match = re.search(r'<h1>(.*?)</h1>', content)
    if not title_match:
        print(f"Could not find h1 in {filepath}")
        return

    title = title_match.group(1)

    # For files that already have the standard header:
    pattern_standard_header = re.compile(r'<div class="action-buttons">.*?</div>\s*</header>', re.DOTALL)

    # Let's create the replacement action-buttons block
    replacement_action_buttons = f"""<div class="action-buttons">
                <a href="../index.html" class="icon-action-btn" title="Retour à l'accueil" aria-label="Retour à l'accueil">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </a>
{new_settings_html}
            </div>
        </header>"""

    if pattern_standard_header.search(content):
        content = pattern_standard_header.sub(replacement_action_buttons, content)
        print(f"Replaced standard header in {filepath}")
    else:
        # Maybe it's bareme.html or tirage.html which don't have the action-buttons yet
        print(f"Could not find standard header pattern in {filepath}. Checking for other patterns.")

        # Let's see if we can find the header
        if '<header' in content:
            # Let's try to build a header for it
            if '<h1>' in content:
                # Find the whole header
                header_pattern = re.compile(r'<header.*?</header>', re.DOTALL)
                header_match = header_pattern.search(content)
                if header_match:
                    old_header = header_match.group(0)
                    new_header = f"""        <header class="app-header">
            <h1>{title}</h1>
            {replacement_action_buttons.replace('</header>', '')}
        </header>"""
                    content = content.replace(old_header, new_header)
                    print(f"Replaced custom header in {filepath}")

    with open(filepath, 'w') as f:
        f.write(content)

for f in files_to_update:
    replace_in_file(f)
