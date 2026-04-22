with open("webapps/simulateur_bluebot.html", "r") as f:
    content = f.read()

search = """    <div class="action-buttons">
        <button class="icon-action-btn" onclick="ScoreManager.showModal()" title="Détail des scores" aria-label="Détail des scores">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        </button>
        <button class="icon-action-btn btn-skins-action" onclick="openSkinsModal()" title="Ouvrir les skins" aria-label="Ouvrir les skins">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                <rect x="2" y="7" width="20" height="5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
        </button>
        <a href="../index.html" class="icon-action-btn" title="Retour à l'accueil" aria-label="Retour à l'accueil">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        </a>
        <button class="icon-action-btn" id="speedToggleBtn" title="Vitesse (Tortue/Lièvre)"
            aria-label="Changer la vitesse">
            <svg id="icon-speed-1x" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <text x="12" y="16" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="11"
                    stroke="none" fill="currentColor">1x</text>
            </svg>
            <svg id="icon-speed-2x" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 19 22 12 13 5 13 19"></polygon>
                <polygon points="2 19 11 12 2 5 2 19"></polygon>
            </svg>
        </button>
        <button class="icon-action-btn" id="themeToggleBtn" title="Mode sombre/clair" aria-label="Changer de thème">
            <svg id="icon-sun" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg id="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        </button>

        <button class="icon-action-btn" id="audioToggleBtn" title="Activer/Désactiver le son" aria-label="Activer/Désactiver le son">
            <svg id="icon-vol-on" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
            <svg id="icon-vol-off" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        </button>
    </div>

    <!-- Modale des skins -->
    <div id="skins-modal" class="skins-modal">
        <div class="skins-content">
            <button class="skins-close" onclick="closeSkinsModal()">✕</button>
            <h2 style="margin-bottom: 20px; text-align: center;">Trophées & Skins</h2>
            <div id="skins-grid" class="skins-grid">
                <!-- Skins generated via JS -->
            </div>
        </div>
    </div>

    <div class="container">
        <header style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <h1>🤖 Simulateur Blue-Bot</h1>
        </header>"""

replace = """    <!-- Modale des skins -->
    <div id="skins-modal" class="skins-modal">
        <div class="skins-content">
            <button class="skins-close" onclick="closeSkinsModal()">✕</button>
            <h2 style="margin-bottom: 20px; text-align: center;">Trophées & Skins</h2>
            <div id="skins-grid" class="skins-grid">
                <!-- Skins generated via JS -->
            </div>
        </div>
    </div>

    <div class="container">
        <header class="app-header">
            <div style="display:flex; align-items:center; gap:15px; flex-wrap: wrap;">
                <h1>🤖 Simulateur Blue-Bot</h1>
                <button class="icon-action-btn btn-skins-action" onclick="openSkinsModal()" title="Ouvrir les skins" aria-label="Ouvrir les skins">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 12 20 22 4 22 4 12"></polyline>
                        <rect x="2" y="7" width="20" height="5"></rect>
                        <line x1="12" y1="22" x2="12" y2="7"></line>
                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                    </svg>
                </button>
            </div>

            <div class="action-buttons">
                <button class="icon-action-btn" onclick="ScoreManager.showModal()" title="Détail des scores" aria-label="Détail des scores">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                </button>
                <a href="../index.html" class="icon-action-btn" title="Retour à l'accueil" aria-label="Retour à l'accueil">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </a>

                <div class="settings-dropdown">
                    <button class="icon-action-btn" title="Réglages" aria-label="Réglages">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>
                    <div class="settings-dropdown-content">
                        <button class="icon-action-btn" id="speedToggleBtn" title="Vitesse (Tortue/Lièvre)" aria-label="Changer la vitesse">
                            <svg id="icon-speed-1x" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <text x="12" y="16" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="11" stroke="none" fill="currentColor">1x</text>
                            </svg>
                            <svg id="icon-speed-2x" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="13 19 22 12 13 5 13 19"></polygon>
                                <polygon points="2 19 11 12 2 5 2 19"></polygon>
                            </svg>
                        </button>
                        <button class="icon-action-btn" id="themeToggleBtn" title="Mode sombre/clair" aria-label="Changer de thème">
                            <svg id="icon-sun" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            <svg id="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        </button>
                        <button class="icon-action-btn" id="audioToggleBtn" title="Activer/Désactiver le son" aria-label="Activer/Désactiver le son">
                            <svg id="icon-vol-on" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                            <svg id="icon-vol-off" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>"""

if search in content:
    content = content.replace(search, replace)
    content = content.replace("background: white;", "background: var(--card-bg);")
    content = content.replace("background: #1e293b;", "background: var(--card-bg);")

    # Tooltips
    content = content.replace(
        '<button class="cmd-btn cmd-btn-forward" onclick="addCmd(\'forward\')" aria-label="Avancer"\n                        id="pad-fwd"></button>',
        '<button class="cmd-btn cmd-btn-forward" onclick="addCmd(\'forward\')" aria-label="Avancer" title="Avancer"\n                        id="pad-fwd"></button>'
    )
    content = content.replace(
        '<button class="cmd-btn cmd-btn-left" onclick="addCmd(\'left\')" aria-label="Tourner à gauche"\n                        id="pad-left"></button>',
        '<button class="cmd-btn cmd-btn-left" onclick="addCmd(\'left\')" aria-label="Tourner à gauche" title="Tourner à gauche"\n                        id="pad-left"></button>'
    )
    content = content.replace(
        '<button class="cmd-btn cmd-btn-backward" onclick="addCmd(\'backward\')" aria-label="Reculer"\n                        id="pad-bwd"></button>',
        '<button class="cmd-btn cmd-btn-backward" onclick="addCmd(\'backward\')" aria-label="Reculer" title="Reculer"\n                        id="pad-bwd"></button>'
    )
    content = content.replace(
        '<button class="cmd-btn cmd-btn-right" onclick="addCmd(\'right\')" aria-label="Tourner à droite"\n                        id="pad-right"></button>',
        '<button class="cmd-btn cmd-btn-right" onclick="addCmd(\'right\')" aria-label="Tourner à droite" title="Tourner à droite"\n                        id="pad-right"></button>'
    )

    # Responsive CSS
    search_skins_css = """        /* Skins Modal */
        #skins-modal {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        }

        #skins-modal.active {
            display: flex;
            animation: fadeIn 0.3s forwards;
        }

        .skins-content {
            background: var(--card-bg);
            border: var(--card-border) 1px solid;
            border-radius: 20px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            color: var(--text-main);
        }"""

    replace_skins_css = """        /* Skins Modal */
        #skins-modal {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        }

        #skins-modal.active {
            display: flex;
            animation: fadeIn 0.3s forwards;
        }

        .skins-content {
            background: var(--card-bg);
            border: var(--card-border) 1px solid;
            border-radius: 20px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            color: var(--text-main);
        }

        @media (max-width: 600px) {
            #skins-modal {
                align-items: flex-end;
            }
            .skins-content {
                width: 100%;
                max-width: 100%;
                border-radius: 20px 20px 0 0;
                border-bottom: none;
                max-height: 85vh;
                animation: slideUp 0.3s var(--spring-easing) forwards;
            }
        }

        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }"""

    content = content.replace(search_skins_css, replace_skins_css)

    search_tabs_css = """            /* responsive */

            /* responsive */

            .score-bar {
                gap: 20px;
            }
        }"""

    replace_tabs_css = """            /* responsive */

            /* responsive */

            .score-bar {
                gap: 20px;
            }

            .tabs {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--container-bg);
                backdrop-filter: var(--glass-blur);
                -webkit-backdrop-filter: var(--glass-blur);
                margin-bottom: 0;
                padding: 10px;
                border-top: var(--glass-border);
                z-index: 999;
                border-radius: 20px 20px 0 0;
                justify-content: space-around;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
            }

            .tab-btn {
                flex: 1;
                text-align: center;
                padding: 12px 8px;
            }

            /* padding for content to not be hidden by tabs */
            body {
                padding-bottom: 80px;
            }
        }"""

    content = content.replace(search_tabs_css, replace_tabs_css)

    with open("webapps/simulateur_bluebot.html", "w") as f:
        f.write(content)
