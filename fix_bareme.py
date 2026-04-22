import re

with open('ressources/bareme.html', 'r') as f:
    content = f.read()

# Let's fix bareme headers as well
new_header = """        <header class="app-header">
            <h1>📊 Barème 1-2-4-8...</h1>
            <div class="action-buttons">
                <a href="../index.html" class="icon-action-btn" title="Retour à l'accueil" aria-label="Retour à l'accueil">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </a>
                <div class="settings-dropdown">
                    <button class="icon-action-btn" title="Options" aria-label="Options" id="optionsMenuBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <div class="settings-dropdown-content">
                        <button class="menu-item-btn" id="themeToggleBtn" aria-label="Changer de thème">
                            <svg id="icon-sun" style="display:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            <svg id="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                            <span id="themeToggleText">Changer le thème</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>"""

if "<header class=\"app-header\">" in content:
    # replace existing
    pattern = re.compile(r'<header class=\"app-header\">.*?</header>', re.DOTALL)
    content = pattern.sub(new_header, content)
else:
    # insert
    content = content.replace("<h1>📊 Barème 1-2-4-8...</h1>", new_header)

with open('ressources/bareme.html', 'w') as f:
    f.write(content)

with open('ressources/tirage.html', 'r') as f:
    content = f.read()

new_header_tirage = """        <header class="app-header">
            <h1>🎲 Tirage au sort</h1>
            <div class="action-buttons">
                <a href="../index.html" class="icon-action-btn" title="Retour à l'accueil" aria-label="Retour à l'accueil">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </a>
                <div class="settings-dropdown">
                    <button class="icon-action-btn" title="Options" aria-label="Options" id="optionsMenuBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <div class="settings-dropdown-content">
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
                </div>
            </div>
        </header>"""

if "<header class=\"app-header\">" in content:
    pattern = re.compile(r'<header class=\"app-header\">.*?</header>', re.DOTALL)
    content = pattern.sub(new_header_tirage, content)
else:
    content = content.replace("<h1>🎲 Tirage au sort binaire</h1>", new_header_tirage)

with open('ressources/tirage.html', 'w') as f:
    f.write(content)
