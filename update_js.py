import sys

filepath = 'assets/js/url-params.js'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
    // Create Modal HTML
    const modalHTML = `
    <div id="share-modal-overlay" class="modal-overlay" aria-hidden="true">
        <div id="share-modal" class="modal-content" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
            <button class="btn-close-modal" id="btn-close-share" aria-label="Fermer"><i data-fa="xmark"></i></button>

            <div class="share-header">
                <h2 id="share-modal-title"><i data-fa="share-nodes"></i> Partager l'activité</h2>
                <p>Générez un lien préconfiguré pour vos élèves.</p>
            </div>

            <div class="share-main">
                <div class="share-url-container">
                    <input type="text" id="share-url-input" readonly>
                    <button class="btn btn-primary" id="btn-copy-share"><i data-fa="clipboard"></i> Copier</button>
                    <button class="btn btn-primary" id="btn-qr-share"><i data-fa="qrcode"></i> Afficher le QR Code</button>
                    <button class="btn btn-primary" id="btn-download-qr" style="display: none;"><i data-fa="download"></i> Télécharger le QR</button>
                </div>
                <div id="share-qr-container" style="display: none; text-align: center; margin-top: 15px;">
                    <canvas id="share-qr-canvas"></canvas>
                </div>
            </div>

            <div class="share-advanced">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button id="btn-toggle-advanced" class="btn-advanced-toggle">
                        Options Avancées <i data-fa="chevron-down"></i>
                    </button>

                </div>

                <div id="share-advanced-options" class="advanced-options-content" style="display: none;">
                    <div class="options-grid">
                        <div class="options-column">
                            <h3>Interface & Navigation</h3>
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-only">
                                <span>Masquer les autres modes</span>
                            </label>
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-noHome">
                                <span>Masquer le retour accueil</span>
                            </label>
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-noSettings">
                                <span>Masquer le menu réglages</span>
                            </label>
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-noAudio">
                                <span>Masquer le bouton son</span>
                            </label>
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-noInstructions">
                                <span>Masquer les textes d'aide</span>
                            </label>
                        </div>

                        <div class="options-column">
                            <h3>Verrouillage</h3>
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-lockDiff">
                                <span>Verrouiller le niveau actuel</span>
                            </label>
                            <label class="share-checkbox" id="lbl-lockMat">
                                <input type="checkbox" id="opt-lockMat">
                                <span>Désactiver les tapis</span>
                            </label>
                            <label class="share-checkbox" id="lbl-forceMat">
                                <input type="checkbox" id="opt-forceMat">
                                <span>Forcer le tapis actuel</span>
                            </label>
                            <label class="share-checkbox" id="lbl-lockSkin">
                                <input type="checkbox" id="opt-lockSkin">
                                <span>Désactiver les skins</span>
                            </label>
                            <label class="share-checkbox" id="lbl-lockSpeed">
                                <input type="checkbox" id="opt-lockSpeed">
                                <span>Verrouiller la vitesse</span>
                            </label>
                        </div>

                        <div class="options-column" id="col-behavior">
                            <h3>Comportement</h3>
                            <label class="share-checkbox" id="lbl-noCmdToggle">
                                <input type="checkbox" id="opt-noCmdToggle">
                                <span>Commandes masquées par défaut</span>
                            </label>
                            <label class="share-checkbox" id="lbl-blindcode">
                                <input type="checkbox" id="opt-blindcode">
                                <span>Forcer le mode aveugle (Blindcoding)</span>
                            </label>
                            <label class="share-checkbox" id="lbl-noDrag">
                                <input type="checkbox" id="opt-noDrag">
                                <span>Désactiver le glisser-déposer</span>
                            </label>
                            <label class="share-checkbox" id="lbl-noRandom">
                                <input type="checkbox" id="opt-noRandom">
                                <span>Masquer les boutons hasard</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    if(window.fa && typeof fa.createIcons === 'function') fa.createIcons();

    // Context-Aware Options: Hide options for features not in the current app
    if (!document.getElementById('btn-open-mats')) document.getElementById('lbl-lockMat').style.display = 'none';
    if (!document.getElementById('btn-open-mats')) {
        const lblForceMat = document.getElementById('lbl-forceMat');
        if (lblForceMat) lblForceMat.style.display = 'none';
    }
    if (!document.getElementById('btn-open-skins')) document.getElementById('lbl-lockSkin').style.display = 'none';
    if (!document.getElementById('btn-speed') && !document.getElementById('speedToggleBtn')) document.getElementById('lbl-lockSpeed').style.display = 'none';
    if (!document.getElementById('btn-toggle-cmds') && !document.getElementById('hideCmdToggleBtn')) {
        if (document.getElementById('lbl-noCmdToggle')) document.getElementById('lbl-noCmdToggle').style.display = 'none';
        if (document.getElementById('lbl-blindcode')) document.getElementById('lbl-blindcode').style.display = 'none';
    }
    if (!document.querySelector('#btn-random, .btn-random')) document.getElementById('lbl-noRandom').style.display = 'none';
    if (!document.querySelector('[draggable="true"], .draggable') && typeof window.noDragParam === 'undefined') document.getElementById('lbl-noDrag').style.display = 'none';

    // Hide behavior column if all its children are hidden
    const behaviorLabels = document.querySelectorAll('#col-behavior .share-checkbox');
    let anyBehaviorVisible = false;
    behaviorLabels.forEach(lbl => {
        if (lbl.style.display !== 'none') anyBehaviorVisible = true;
    });
    if (!anyBehaviorVisible) document.getElementById('col-behavior').style.display = 'none';

    // Event Listeners
    const modalOverlay = document.getElementById('share-modal-overlay');
    const btnClose = document.getElementById('btn-close-share');
    const btnCopy = document.getElementById('btn-copy-share');
    const btnQrShare = document.getElementById('btn-qr-share');
    const btnDownloadQr = document.getElementById('btn-download-qr');
    const qrContainer = document.getElementById('share-qr-container');
    const qrCanvas = document.getElementById('share-qr-canvas');
    const urlInput = document.getElementById('share-url-input');
    const btnToggleAdvanced = document.getElementById('btn-toggle-advanced');
    const advancedOptions = document.getElementById('share-advanced-options');

    const checkboxes = document.querySelectorAll('.share-checkbox input');
"""

replace_block = """
    // Create Modal HTML
    const modalHTML = `
    <div id="share-modal-overlay" class="modal-overlay" aria-hidden="true">
        <div id="share-modal" class="modal-content" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
            <button class="btn-close-modal" id="btn-close-share" aria-label="Fermer"><i data-fa="xmark"></i></button>

            <div class="share-header">
                <h2 id="share-modal-title"><i data-fa="share-nodes"></i> Partager l'activité</h2>
                <p>Générez un lien préconfiguré pour vos élèves.</p>
            </div>

            <div class="share-main">
                <div class="share-url-container">
                    <input type="text" id="share-url-input" readonly>
                    <button class="btn btn-primary" id="btn-test-link"><i data-fa="external-link"></i> Tester le lien</button>
                    <button class="btn btn-primary" id="btn-copy-share"><i data-fa="clipboard"></i> Copier</button>
                    <button class="btn btn-primary" id="btn-qr-share"><i data-fa="qrcode"></i> Afficher le QR Code</button>
                    <button class="btn btn-primary" id="btn-download-qr" style="display: none;"><i data-fa="download"></i> Télécharger le QR</button>
                </div>
                <div id="share-qr-container" style="display: none; text-align: center; margin-top: 15px;">
                    <canvas id="share-qr-canvas"></canvas>
                </div>
            </div>

            <div class="share-advanced">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button id="btn-toggle-advanced" class="btn-advanced-toggle">
                        Options Avancées <i data-fa="chevron-down"></i>
                    </button>
                </div>

                <div id="share-advanced-options" class="advanced-options-content" style="display: none;">
                    <div class="options-grid">
                        <div class="options-column">
                            <h3>Interface & Navigation</h3>
                            <div class="share-option">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-only">Forcer le mode actuel</label>
                                    <div class="share-option-desc">Verrouille l'application sur le mode actuel pour éviter toute distraction.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-only">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noHome">Masquer le retour à l'accueil</label>
                                    <div class="share-option-desc">Empêche l'élève de quitter l'activité en cours via le bouton "Home".</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noHome">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noSettings">Masquer le menu réglages</label>
                                    <div class="share-option-desc">Empêche l'accès aux réglages du projet.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noSettings">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noAudio">Masquer le bouton son</label>
                                    <div class="share-option-desc">Désactive la possibilité de couper ou activer le son.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noAudio">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noInstructions">Masquer les textes d'aide</label>
                                    <div class="share-option-desc">Retire les consignes pour un challenge plus brut.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noInstructions">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="options-column">
                            <h3>Verrouillage & Difficulté</h3>
                            <div class="share-option">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-lockDiff">Verrouiller le niveau actuel</label>
                                    <div class="share-option-desc">Désactive les boutons de difficulté. L'élève doit réussir le niveau imposé.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-lockDiff">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-lockMat">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-lockMat">Désactiver les tapis</label>
                                    <div class="share-option-desc">Empêche le changement de tapis.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-lockMat">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-forceMat">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-forceMat">Forcer le tapis actuel</label>
                                    <div class="share-option-desc">Charge automatiquement le tapis actuellement sélectionné.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-forceMat">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-lockSkin">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-lockSkin">Désactiver les skins</label>
                                    <div class="share-option-desc">Empêche la personnalisation visuelle.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-lockSkin">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-lockSpeed">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-lockSpeed">Verrouiller la vitesse</label>
                                    <div class="share-option-desc">Empêche de modifier la vitesse du robot.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-lockSpeed">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="options-column" id="col-behavior">
                            <h3>Comportement & Pédagogie</h3>
                            <div class="share-option" id="lbl-noCmdToggle">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noCmdToggle">Commandes masquées par défaut</label>
                                    <div class="share-option-desc">L'élève devra révéler les commandes lui-même.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noCmdToggle">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-blindcode">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-blindcode">Forcer le mode aveugle (Blindcoding)</label>
                                    <div class="share-option-desc">Oblige l'élève à programmer de tête sans voir la trace des commandes.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-blindcode">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-noDrag">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noDrag">Désactiver le glisser-déposer</label>
                                    <div class="share-option-desc">Désactive la réorganisation des commandes par glisser-déposer.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noDrag">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-noRandom">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noRandom">Masquer les boutons hasard</label>
                                    <div class="share-option-desc">Empêche de générer un nouveau challenge aléatoire.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noRandom">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="options-column" id="col-specific" style="display: none;">
                            <h3>Spécifique à l'application</h3>
                            <div class="share-option" id="lbl-hideDict" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-hideDict">Masquer le dictionnaire ASCII</label>
                                    <div class="share-option-desc">Désactive l'aide visuelle. L'élève doit se débrouiller avec son support papier.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-hideDict">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-lockSize" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-lockSize">Verrouiller la taille de la grille</label>
                                    <div class="share-option-desc">Force l'élève à utiliser la taille de grille actuelle.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-lockSize">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-lockTopology" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-lockTopology">Verrouiller la carte réseau</label>
                                    <div class="share-option-desc">Fige la carte aléatoire. Tous les élèves auront la même.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-lockTopology">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-strictMode" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-strictMode">Mode strict</label>
                                    <div class="share-option-desc">Ne surligne pas l'erreur en rouge immédiatement.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-strictMode">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-hideGrid" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-hideGrid">Masquer le quadrillage</label>
                                    <div class="share-option-desc">Désactive les lignes pour estimer les distances sans repère.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-hideGrid">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    if(window.fa && typeof fa.createIcons === 'function') fa.createIcons();

    // Context-Aware Options: Hide options for features not in the current app
    if (!document.getElementById('btn-open-mats')) document.getElementById('lbl-lockMat').style.display = 'none';
    if (!document.getElementById('btn-open-mats')) {
        const lblForceMat = document.getElementById('lbl-forceMat');
        if (lblForceMat) lblForceMat.style.display = 'none';
    }
    if (!document.getElementById('btn-open-skins')) document.getElementById('lbl-lockSkin').style.display = 'none';
    if (!document.getElementById('btn-speed') && !document.getElementById('speedToggleBtn')) document.getElementById('lbl-lockSpeed').style.display = 'none';
    if (!document.getElementById('btn-toggle-cmds') && !document.getElementById('hideCmdToggleBtn')) {
        if (document.getElementById('lbl-noCmdToggle')) document.getElementById('lbl-noCmdToggle').style.display = 'none';
        if (document.getElementById('lbl-blindcode')) document.getElementById('lbl-blindcode').style.display = 'none';
    }
    if (!document.querySelector('#btn-random, .btn-random')) document.getElementById('lbl-noRandom').style.display = 'none';
    if (!document.querySelector('[draggable="true"], .draggable') && typeof window.noDragParam === 'undefined') document.getElementById('lbl-noDrag').style.display = 'none';

    // Specific Options Logic
    let hasSpecificOption = false;
    if (document.querySelector('.alpha-section')) {
        document.getElementById('lbl-hideDict').style.display = 'flex';
        hasSpecificOption = true;
    }
    if (window.location.pathname.includes('binaire_studio.html')) {
        document.getElementById('lbl-lockSize').style.display = 'flex';
        hasSpecificOption = true;
    }
    if (window.location.pathname.includes('routage_reseau.html')) {
        document.getElementById('lbl-lockTopology').style.display = 'flex';
        hasSpecificOption = true;
    }
    if (window.location.pathname.includes('bit_de_parite.html')) {
        document.getElementById('lbl-strictMode').style.display = 'flex';
        hasSpecificOption = true;
    }
    if (window.location.pathname.includes('simulateur_bluebot.html')) {
        document.getElementById('lbl-hideGrid').style.display = 'flex';
        hasSpecificOption = true;
    }

    if (hasSpecificOption) {
        document.getElementById('col-specific').style.display = 'block';
    }

    // Hide behavior column if all its children are hidden
    const behaviorLabels = document.querySelectorAll('#col-behavior .share-option');
    let anyBehaviorVisible = false;
    behaviorLabels.forEach(lbl => {
        if (lbl.style.display !== 'none') anyBehaviorVisible = true;
    });
    if (!anyBehaviorVisible) document.getElementById('col-behavior').style.display = 'none';

    // Event Listeners
    const modalOverlay = document.getElementById('share-modal-overlay');
    const btnClose = document.getElementById('btn-close-share');
    const btnCopy = document.getElementById('btn-copy-share');
    const btnQrShare = document.getElementById('btn-qr-share');
    const btnDownloadQr = document.getElementById('btn-download-qr');
    const btnTestLink = document.getElementById('btn-test-link');
    const qrContainer = document.getElementById('share-qr-container');
    const qrCanvas = document.getElementById('share-qr-canvas');
    const urlInput = document.getElementById('share-url-input');
    const btnToggleAdvanced = document.getElementById('btn-toggle-advanced');
    const advancedOptions = document.getElementById('share-advanced-options');

    const checkboxes = document.querySelectorAll('.share-toggle input');
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("JS modal HTML replaced successfully.")
else:
    print("Search block not found in JS.")
