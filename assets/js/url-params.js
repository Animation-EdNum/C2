/* ============================================================
   url-params.js — URL Configuration and Sharing Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    applyUrlParameters();
    initShareModal();
});

function applyUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);

    if (window.location.search.length > 0) {
        window.isSharedApp = true;
    }


    if (urlParams.get('highContrast') === '1') {
        localStorage.setItem('global_theme', 'high-contrast');
        if (typeof setTheme === 'function') setTheme('high-contrast');
        else {
            document.body.classList.remove('dark');
            document.body.classList.add('high-contrast');
        }
    }

    // 1. Interface & Navigation Hiding
    if (urlParams.get('only') === '1') {
        const tabs = document.querySelector('.tabs');
        if (tabs) tabs.style.display = 'none';

        // Hide swipe indicators if swipe.js is present
        const swipeDots = document.getElementById('swipe-dots');
        if (swipeDots) swipeDots.style.display = 'none';

        // Disable swipe behavior if active
        if (typeof window.swipeEnabled !== 'undefined') {
            window.swipeEnabled = false;
        }
    }

    if (urlParams.get('noHome') === '1') {
        const homeBtn = document.querySelector('a[href*="index.html"]');
        if (homeBtn) {
            homeBtn.removeAttribute('href');
            homeBtn.removeAttribute('title');
            homeBtn.removeAttribute('aria-label');
            homeBtn.classList.add('unlinked');
        }
    }

    if (urlParams.get('noSettings') === '1') {
        const settingsDropdown = document.querySelector('.settings-dropdown');
        if (settingsDropdown) settingsDropdown.style.display = 'none';
    }

    if (urlParams.get('noAudio') === '1') {
        const audioBtn = document.getElementById('audioToggleBtn');
        if (audioBtn) audioBtn.style.display = 'none';
    }

    if (urlParams.get('noInstructions') === '1') {
        const instructions = document.querySelectorAll('.instructions, .chal-instruction');
        instructions.forEach(el => el.style.display = 'none');
    }

    // 2. Locks
    if (urlParams.get('lockDiff') === '1') {
        const diffBtns = document.querySelectorAll('.diff-btn');
        diffBtns.forEach(btn => {
            btn.classList.add('locked');
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); return false; };
        });
        const diffSelect = document.getElementById('difficulty-select');
        if(diffSelect) diffSelect.disabled = true;
    }

    if (urlParams.has('forceMat')) {
        const forcedMat = urlParams.get('forceMat');
        if (forcedMat && forcedMat !== 'custom') {
            localStorage.setItem('bb_active_mat', forcedMat);
        }
    }

    if (urlParams.get('lockMat') === '1') {
        const matBtn = document.getElementById('btn-open-mats');
        if (matBtn) matBtn.style.display = 'none';
    }

    if (urlParams.get('lockSkin') === '1') {
        const skinBtn = document.getElementById('btn-open-skins');
        if (skinBtn) skinBtn.style.display = 'none';

        // Disable skin unlocking entirely
        window.isSkinUnlockDisabled = true;
    }

    if (urlParams.get('lockSpeed') === '1') {
        const speedBtn = document.getElementById('btn-speed');
        if (speedBtn) speedBtn.style.display = 'none';
        const speedToggleBtn = document.getElementById('speedToggleBtn');
        if (speedToggleBtn) speedToggleBtn.style.display = 'none';
    }

    if (urlParams.get('noCmdToggle') === '1') {
        window.cmdsHiddenByDefault = true;
    }

    if (urlParams.get('blindcode') === '1') {
        window.forceBlindcode = true;
    }

    if (urlParams.get('noDrag') === '1') {
        // This is handled by individual apps, we can set a global flag
        window.noDragParam = true;
    }

    if (urlParams.get('noRandom') === '1') {
        const randomBtns = document.querySelectorAll('#btn-random, .btn-random');
        randomBtns.forEach(btn => btn.style.display = 'none');
    }

    // 3. Tab routing
    const targetTab = urlParams.get('tab');
    if (targetTab) {
        // Wait a small delay to ensure app is fully initialized before switching tab
        setTimeout(() => {
            const tabBtn = document.getElementById(`tab-${targetTab}`);
            if (tabBtn) {
                tabBtn.click();
            }
        }, 100);
    }

    // 4. Initial difficulty setting
    const diff = urlParams.get('diff');
    if (diff) {
        setTimeout(() => {
            const diffBtns = document.querySelectorAll(`.diff-btn[data-diff="${diff}"]`);
            let clicked = false;

            if (diffBtns.length > 0) {
                diffBtns.forEach(btn => {
                    if (!btn.classList.contains('locked')) {
                        const wasLocked = btn.disabled;
                        btn.disabled = false;
                        btn.click();
                        if(wasLocked) btn.disabled = true;
                        clicked = true;
                    }
                });
            }

            if (!clicked) {
                const diffBtn = document.getElementById(`diff-${diff}`) ||
                                document.getElementById(`read-diff-${diff}`);
                if (diffBtn && !diffBtn.classList.contains('locked')) {
                    const wasLocked = diffBtn.disabled;
                    diffBtn.disabled = false;
                    diffBtn.click();
                    if(wasLocked) diffBtn.disabled = true;
                    clicked = true;
                }
            }

            if (!clicked) {
                if (document.getElementById('difficulty-select')) {
                    const select = document.getElementById('difficulty-select');
                    select.value = diff;
                    select.dispatchEvent(new Event('change'));
                } else if (typeof setDifficulty === 'function') {
                    setDifficulty(diff);
                } else if (typeof window.currentDifficulty !== 'undefined') {
                    window.currentDifficulty = diff;
                    if(typeof generateSequence === 'function') generateSequence();
                    if(typeof initLevel === 'function') initLevel();
                }
            }
        }, 150);
    }
}

function initShareModal() {
    if (window.isSharedApp) {
        return; // Hide on Shared Apps
    }

    // Check if share button exists, if not, create it in settings-dropdown-content
    let shareBtn = document.getElementById('btn-share');
    if (!shareBtn) {
        const settingsDropdown = document.querySelector('.settings-dropdown-content');
        if (settingsDropdown) {
            shareBtn = document.createElement('button');
            shareBtn.className = 'menu-item-btn';
            shareBtn.id = 'btn-share';
            shareBtn.title = 'Partager';
            shareBtn.setAttribute('aria-label', 'Partager');
            shareBtn.innerHTML = '<i data-fa="share-nodes"></i> Partager l\'activité';
            // Insert at the top of the settings menu
            settingsDropdown.insertBefore(shareBtn, settingsDropdown.firstChild);
            // Must create icon after insertion
            if(window.fa && typeof fa.createIcons === 'function') fa.createIcons();
        } else {
            return; // Nowhere to put it
        }
    }

    // Create Modal HTML
    const modalHTML = `
    <div id="share-modal-overlay" class="ui-modal-overlay" aria-hidden="true">
        <div id="share-modal" class="ui-modal-content" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
            <button class="ui-btn-close" id="btn-close-share" aria-label="Fermer"><i data-fa="xmark"></i></button>

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
                                    <label class="share-option-label" for="opt-highContrast">Mode contraste élevé</label>
                                    <div class="share-option-desc">Active automatiquement le thème à fort contraste.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-highContrast">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
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
                            <div class="share-option" id="lbl-unlockEditor" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-unlockEditor">Débloquer l'éditeur</label>
                                    <div class="share-option-desc">Rend l'éditeur libre accessible immédiatement.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-unlockEditor">
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
    if (window.location.pathname.includes('binaire_studio.html')) {
        document.getElementById('lbl-unlockEditor').style.display = 'flex';
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

    function updateShareUrl() {
        const url = new URL(window.location.href);
        url.search = ''; // Clear existing params

        // Add basic state
        if (typeof window.activeTab !== 'undefined') {
            url.searchParams.set('tab', window.activeTab);
        } else {
            const activeTabBtn = document.querySelector('.tab-btn.active');
            if (activeTabBtn) {
                const tabId = activeTabBtn.id.replace('tab-', '');
                url.searchParams.set('tab', tabId);
            }
        }

        let currentDiff = null;
        if (typeof window.currentDifficulty !== 'undefined') {
            currentDiff = window.currentDifficulty;
        } else {
            const activeDiff = document.querySelector('.view.active .diff-btn.active') || document.querySelector('.diff-btn.active');
            if(activeDiff) currentDiff = activeDiff.dataset.diff || activeDiff.id.split('-').pop();
            else if(document.getElementById('difficulty-select')) currentDiff = document.getElementById('difficulty-select').value;
        }

        if (currentDiff) {
            url.searchParams.set('diff', currentDiff);
        }

        // Add advanced options
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const param = cb.id.replace('opt-', '');
                url.searchParams.set(param, '1');

                // Special handling for lockTopology
                if (param === 'lockTopology') {
                    if (!url.searchParams.has('seed')) {
                        const randomSeed = Math.random().toString(36).substring(2, 10);
                        url.searchParams.set('seed', randomSeed);
                    }
                }
            } else {
                // If lockTopology is unchecked, make sure seed is removed
                const param = cb.id.replace('opt-', '');
                if (param === 'lockTopology') {
                    url.searchParams.delete('seed');
                }
            }
        });

        // Handle forceMat specifically if it exists and is checked
        const forceMatCb = document.getElementById('opt-forceMat');
        if (forceMatCb && forceMatCb.checked) {
            // we don't want the default behavior (forceMat=1) that was added by the loop
            url.searchParams.delete('forceMat');

            // we need to set it to the actual activeMat
            // Attempt to get activeMat from localStorage as it's the standard way in this app
            let currentMat = localStorage.getItem('bb_active_mat') || 'none';
            if (typeof window.activeMat !== 'undefined') currentMat = window.activeMat;

            if (currentMat && currentMat !== 'custom') {
                url.searchParams.set('forceMat', currentMat);
            }
        }

        urlInput.value = url.toString();

        // Reset copy button state
        btnCopy.innerHTML = '<i data-fa="clipboard"></i> Copier';
        btnCopy.classList.remove('btn-success');
        if(window.fa && typeof fa.createIcons === 'function') fa.createIcons();
    }

    shareBtn.addEventListener('click', () => {
        const forceMatCb = document.getElementById('opt-forceMat');
        if (forceMatCb) {
            let currentMat = localStorage.getItem('bb_active_mat') || 'none';
            if (typeof window.activeMat !== 'undefined') currentMat = window.activeMat;
            if (currentMat === 'custom') {
                forceMatCb.disabled = true;
                forceMatCb.checked = false;
                document.getElementById('lbl-forceMat').style.opacity = '0.5';
                document.getElementById('lbl-forceMat').title = 'Impossible de forcer un tapis personnalisé';
            } else {
                forceMatCb.disabled = false;
                document.getElementById('lbl-forceMat').style.opacity = '1';
                document.getElementById('lbl-forceMat').title = '';
            }
        }
        updateShareUrl();
        modalOverlay.classList.add('active');
    });

    btnClose.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    btnToggleAdvanced.addEventListener('click', () => {
        const isVisible = advancedOptions.style.display === 'block';
        advancedOptions.style.display = isVisible ? 'none' : 'block';
        btnToggleAdvanced.innerHTML = `Options Avancées <i data-fa="chevron-${isVisible ? 'down' : 'up'}"></i>`;
        if(window.fa && typeof fa.createIcons === 'function') fa.createIcons();
    });

    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateShareUrl);
    });

    btnTestLink.addEventListener('click', () => {
        window.open(urlInput.value, '_blank');
    });

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(urlInput.value).then(() => {
            btnCopy.innerHTML = '<i data-fa="check"></i> Copié !';
            btnCopy.classList.add('btn-success');
            if(window.fa && typeof fa.createIcons === 'function') fa.createIcons();

            if (typeof showToast === 'function') {
                showToast("Lien copié dans le presse-papiers !", true);
            }
        });
    });

    btnQrShare.addEventListener('click', () => {
        if (qrContainer.style.display === 'block') {
            qrContainer.style.display = 'none';
            if (btnDownloadQr) btnDownloadQr.style.display = 'none';
            btnQrShare.innerHTML = '<i data-fa="qrcode"></i> Afficher le QR Code';
            if(window.fa && typeof fa.createIcons === 'function') fa.createIcons();
            return;
        }

        // Dynamically load QRious if not present
        if (typeof QRious === 'undefined') {
            const script = document.createElement('script');
            script.src = (window.location.pathname.includes('alpha/') ? '../' : '') + '../assets/js/vendor/qrious.min.js';
            // Adjust path based on relative location
            let basePath = '../assets/js/vendor/qrious.min.js';
            if (window.location.pathname.includes('/alpha/webapps/')) {
                basePath = '../../assets/js/vendor/qrious.min.js';
            } else if (!window.location.pathname.includes('webapps/')) {
                basePath = 'assets/js/vendor/qrious.min.js';
            }
            script.src = basePath;
            script.onload = () => {
                generateQrCode();
            };
            document.body.appendChild(script);
        } else {
            generateQrCode();
        }
    });

    function generateQrCode() {
        qrContainer.style.display = 'block';
        if (btnDownloadQr) btnDownloadQr.style.display = 'inline-block';
        btnQrShare.innerHTML = '<i data-fa="qrcode"></i> Masquer le QR Code';
        if(window.fa && typeof fa.createIcons === 'function') fa.createIcons();
        new QRious({
            element: qrCanvas,
            value: urlInput.value,
            size: 200
        });
    }

    if (btnDownloadQr) {
        btnDownloadQr.addEventListener('click', () => {
            if (!qrCanvas) return;
            const dataUrl = qrCanvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'qrcode.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    // Re-generate QR if URL changes and QR is visible
    urlInput.addEventListener('change', () => {
        if (qrContainer.style.display === 'block' && typeof QRious !== 'undefined') {
            generateQrCode();
        }
    });
    // Or simpler, just hook into updateShareUrl, but it's simpler to do it here
    const originalUpdateShareUrl = updateShareUrl;
    updateShareUrl = function() {
        originalUpdateShareUrl();
        if (qrContainer.style.display === 'block' && typeof QRious !== 'undefined') {
            generateQrCode();
        }
    }
}
