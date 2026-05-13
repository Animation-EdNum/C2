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
        const audioBtn = document.getElementById('audio-toggle-btn');
        if (audioBtn) audioBtn.style.display = 'none';
    }

    if (urlParams.get('coloredCmds') === '1') {
        document.body.classList.add('colored-cmds');
        const toggleBtn = document.getElementById('colored-cmds-toggle-btn');
        if (toggleBtn) toggleBtn.style.display = 'none';
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
        if (diffSelect) diffSelect.disabled = true;
    }

    if (urlParams.has('forceMat')) {
        const forcedMat = urlParams.get('forceMat');
        if (forcedMat && forcedMat !== 'custom') {
            localStorage.setItem('at_active_mat', forcedMat);
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

    if (urlParams.get('unlockAllSkins') === '1') {
        window.unlockAllSkins = true;
    }

    if (urlParams.has('lockSpeed')) {
        const speedBtn = document.getElementById('btn-speed');
        if (speedBtn) speedBtn.style.display = 'none';
        const speedToggleBtn = document.getElementById('speed-toggle-btn');
        if (speedToggleBtn) speedToggleBtn.style.display = 'none';

        if (typeof window.setSpeedLevel === 'function') {
            window.setSpeedLevel(parseInt(urlParams.get('lockSpeed'), 10));
        }
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
                        if (wasLocked) btn.disabled = true;
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
                    if (wasLocked) diffBtn.disabled = true;
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
                    if (typeof generateSequence === 'function') generateSequence();
                    if (typeof initLevel === 'function') initLevel();
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
            shareBtn.innerHTML = '<i data-fa="share-nodes"></i> Partager';
            // Insert at the bottom of the settings menu
            const divider = document.createElement('div');
            divider.className = 'dropdown-divider';
            settingsDropdown.appendChild(divider);
            settingsDropdown.appendChild(shareBtn);
            // Must create icon after insertion
            if (window.fa && typeof fa.createIcons === 'function') fa.createIcons();
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
                    <button class="btn btn-primary" id="btn-test-link"><i data-fa="arrow-up-right-from-square"></i> Tester</button>
                    <button class="btn btn-primary" id="btn-copy-share"><i data-fa="clipboard"></i> Copier</button>
                    <button class="btn btn-primary" id="btn-qr-share"><i data-fa="qrcode"></i> QR</button>
                    <button class="btn btn-primary" id="btn-download-qr" style="display: none;"><i data-fa="download"></i> Télécharger le QR</button>
                </div>
                <div id="share-qr-container" style="display: none; text-align: center; margin-top: 15px;">
                    <canvas id="share-qr-canvas"></canvas>
                </div>
            </div>

            <div class="share-presets" style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
                <button class="btn btn-preset" id="btn-preset-mission" style="flex: 1;" title="Mes élèves font exactement ce que j'ai préparé"><i data-fa="bullseye"></i> Mission</button>
                <button class="btn btn-preset" id="btn-preset-entrainement" style="flex: 1;" title="Je leur donne l'outil, ils explorent / refont à leur rythme"><i data-fa="dumbbell"></i> Entraînement</button>
                <button class="btn btn-preset" id="btn-preset-inclusif" style="flex: 1;" title="J'ai un·e élève dys, TSA, ou non-latéralisé·e dans le groupe"><i data-fa="hand-holding-heart"></i> Inclusif</button>
            </div>

            <div class="share-advanced">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button id="btn-toggle-advanced" class="btn-advanced-toggle">
                        Options Avancées <i data-fa="chevron-down"></i>
                    </button>
                </div>

                <div id="share-advanced-options" class="advanced-options-content" style="display: none;">
                    <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">

                        <div class="options-column" id="col-apparence-pedagogie">
                            <h3>🎨 Apparence</h3>
                            <div class="share-option">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-highContrast">Contraste élevé</label>
                                    <div class="share-option-desc">Active le thème à fort contraste.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-highContrast">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noAudio">Pas de son</label>
                                    <div class="share-option-desc">Désactive le son.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noAudio">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-coloredCmds" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-coloredCmds">Commandes colorées <span class="badge-specific" title="Spécifique à l'application">*</span></label>
                                    <div class="share-option-desc">Colorie les commandes de manière distinctive. Utile pour les personnes non latéralisées.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-coloredCmds">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-noInstructions" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noInstructions">Masquer les instructions</label>
                                    <div class="share-option-desc">Retire les textes d'aide.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noInstructions">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-hideGrid" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-hideGrid">Pas de quadrillage <span class="badge-specific" title="Spécifique à l'application">*</span></label>
                                    <div class="share-option-desc">Désactive les lignes pour estimer les distances sans repère.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-hideGrid">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>

                            <h3 style="margin-top: 20px;">🧠 Pédagogie</h3>
                            <div class="share-option" id="lbl-noCmdToggle">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noCmdToggle">Commandes masquées</label>
                                    <div class="share-option-desc">L'élève peut afficher les commandes manuellement.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noCmdToggle">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-blindcode">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-blindcode">Mode aveugle (Blindcoding)</label>
                                    <div class="share-option-desc">L'élève programme de tête sans voir la trace des commandes.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-blindcode">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-hideDict" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-hideDict">Pas de dictionnaire ASCII <span class="badge-specific" title="Spécifique à l'application">*</span></label>
                                    <div class="share-option-desc">Désactive l'aide visuelle.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-hideDict">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-strictMode" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-strictMode">Mode strict <span class="badge-specific" title="Spécifique à l'application">*</span></label>
                                    <div class="share-option-desc">N'indique pas où sont les erreurs.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-strictMode">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="options-column" id="col-restrictions">
                            <h3>🔐 Restrictions</h3>
                            <div class="share-option" id="lbl-lockDiff">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-lockDiff">Difficulté verrouillée</label>
                                    <div class="share-option-desc">Impose le niveau de difficulté actuel.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-lockDiff">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-only">Mode actuel uniquement</label>
                                    <div class="share-option-desc">Bloque l'application sur le mode actuel.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-only">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noHome">Pas de lien accueil</label>
                                    <div class="share-option-desc">Empêche de quitter l'activité.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noHome">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-noSettings">Pas de réglages</label>
                                    <div class="share-option-desc">Bloque l'accès aux paramètres.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-noSettings">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-lockSkin">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-lockSkin">Pas de skins</label>
                                    <div class="share-option-desc">Pas de personnalisation visuelle du robot.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-lockSkin">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-lockMat">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-lockMat">Sans tapis</label>
                                    <div class="share-option-desc">Désactive le choix de tapis.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-lockMat">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-forceMat">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-forceMat">Tapis imposé</label>
                                    <div class="share-option-desc">Charge le tapis actuellement sélectionné.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-forceMat">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-lockSpeed">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-lockSpeed">Vitesse imposée</label>
                                    <div class="share-option-desc">Charge la vitesse actuellement sélectionnée.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-lockSpeed">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-lockTopology" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-lockTopology">Carte réseau fixe <span class="badge-specific" title="Spécifique à l'application">*</span></label>
                                    <div class="share-option-desc">Même réseau pour tous les élèves.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-lockTopology">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="share-option" id="lbl-unlockEditor" style="display: none;">
                                <div class="share-option-text">
                                    <label class="share-option-label" for="opt-unlockEditor">Débloquer l'éditeur <span class="badge-specific" title="Spécifique à l'application">*</span></label>
                                    <div class="share-option-desc">Mode "Éditeur" accessible immédiatement.</div>
                                </div>
                                <label class="share-toggle">
                                    <input type="checkbox" id="opt-unlockEditor">
                                    <span class="share-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: right; margin-top: 10px; font-size: 0.85em; color: var(--text-secondary, #4a5568);">
                        * = spécifique à l'application
                    </div>
                </div>
            </div>
        </div>
    </div>`

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    if (window.fa && typeof fa.createIcons === 'function') fa.createIcons();

    // Context-Aware Options: Hide options for features not in the current app
    if (!document.getElementById('btn-open-mats')) {
        const lblLockMat = document.getElementById('lbl-lockMat');
        const lblForceMat = document.getElementById('lbl-forceMat');
        if (lblLockMat) lblLockMat.style.display = 'none';
        if (lblForceMat) lblForceMat.style.display = 'none';
    }
    if (!document.getElementById('btn-open-skins')) {
        const lblLockSkin = document.getElementById('lbl-lockSkin');
        if (lblLockSkin) lblLockSkin.style.display = 'none';
    }
    if (!document.getElementById('btn-speed') && !document.getElementById('speed-toggle-btn')) {
        const lblLockSpeed = document.getElementById('lbl-lockSpeed');
        if (lblLockSpeed) lblLockSpeed.style.display = 'none';
    }
    if (!document.getElementById('btn-toggle-cmds') && !document.getElementById('hide-cmd-toggle-btn')) {
        const lblNoCmdToggle = document.getElementById('lbl-noCmdToggle');
        const lblBlindcode = document.getElementById('lbl-blindcode');
        if (lblNoCmdToggle) lblNoCmdToggle.style.display = 'none';
        if (lblBlindcode) lblBlindcode.style.display = 'none';
    }


    const hasInstructions = document.querySelectorAll('.instructions, .chal-instruction').length > 0;
    if (hasInstructions) {
        document.getElementById('lbl-noInstructions').style.display = 'flex';
    }

    // Specific Options Logic
    const hasDifficulties = document.querySelectorAll('.diff-btn').length > 0 || document.getElementById('difficulty-select');
    if (!hasDifficulties) {
        const lblLockDiff = document.getElementById('lbl-lockDiff');
        if (lblLockDiff) lblLockDiff.style.display = 'none';
    }

    const optLockDiff = document.getElementById('opt-lockDiff');

    if (document.querySelector('.alpha-section')) {
        document.getElementById('lbl-hideDict').style.display = 'flex';
    }
    if (window.location.pathname.includes('routage_reseau.html')) {
        document.getElementById('lbl-lockTopology').style.display = 'flex';
    }
    if (window.location.pathname.includes('bit_de_parite.html')) {
        document.getElementById('lbl-strictMode').style.display = 'flex';
    }
    if (window.location.pathname.includes('simulateur_automate.html')) {
        document.getElementById('lbl-hideGrid').style.display = 'flex';
        document.getElementById('lbl-coloredCmds').style.display = 'flex';
    }
    if (window.location.pathname.includes('binaire_studio.html')) {
        document.getElementById('lbl-unlockEditor').style.display = 'flex';
    }


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
            if (activeDiff) currentDiff = activeDiff.dataset.diff || activeDiff.id.split('-').pop();
            else if (document.getElementById('difficulty-select')) currentDiff = document.getElementById('difficulty-select').value;
        }

        if (currentDiff) {
            url.searchParams.set('diff', currentDiff);
        }

        // Add advanced options
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const param = cb.id.replace('opt-', '');

                if (param === 'lockSpeed') {
                    let speedLevel = '1';
                    if (typeof window.getCurrentSpeed === 'function' && window.getCurrentSpeed() === 400) {
                        speedLevel = '2';
                    }
                    url.searchParams.set(param, speedLevel);
                } else {
                    url.searchParams.set(param, '1');
                }

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

        const optLockDiff = document.getElementById('opt-lockDiff');
        const optOnly = document.getElementById('opt-only');
        if ((optLockDiff && optLockDiff.checked) || (optOnly && optOnly.checked)) {
            url.searchParams.set('noNudges', '1');
        }

        // Handle forceMat specifically if it exists and is checked
        const forceMatCb = document.getElementById('opt-forceMat');
        if (forceMatCb && forceMatCb.checked) {
            // we don't want the default behavior (forceMat=1) that was added by the loop
            url.searchParams.delete('forceMat');

            // we need to set it to the actual activeMat
            // Attempt to get activeMat from localStorage as it's the standard way in this app
            let currentMat = localStorage.getItem('at_active_mat') || 'none';
            if (typeof window.activeMat !== 'undefined') currentMat = window.activeMat;

            if (currentMat && currentMat !== 'custom') {
                url.searchParams.set('forceMat', currentMat);
            }
        }

        urlInput.value = url.toString();

        // Reset copy button state
        btnCopy.innerHTML = '<i data-fa="clipboard"></i> Copier';
        btnCopy.classList.remove('btn-success');
        if (window.fa && typeof fa.createIcons === 'function') fa.createIcons();
    }

    shareBtn.addEventListener('click', () => {
        const forceMatCb = document.getElementById('opt-forceMat');
        if (forceMatCb) {
            let currentMat = localStorage.getItem('at_active_mat') || 'none';
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


    // Presets Logic
    const btnPresetMission = document.getElementById('btn-preset-mission');
    const btnPresetEntrainement = document.getElementById('btn-preset-entrainement');
    const btnPresetInclusif = document.getElementById('btn-preset-inclusif');

    function resetAllCheckboxes() {
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
    }

    if (btnPresetMission) {
        btnPresetMission.addEventListener('click', () => {
            resetAllCheckboxes();
            const toCheck = ['opt-lockDiff', 'opt-only', 'opt-noHome', 'opt-noSettings'];
            toCheck.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.checked = true;
            });
            updateShareUrl();
            if (typeof showToast === 'function') {
                showToast("Mode Mission appliqué");
            }
        });
    }

    if (btnPresetEntrainement) {
        btnPresetEntrainement.addEventListener('click', () => {
            resetAllCheckboxes();
            const toCheck = ['opt-noHome', 'opt-only'];
            toCheck.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.checked = true;
            });
            updateShareUrl();
            if (typeof showToast === 'function') {
                showToast("Mode Entraînement appliqué");
            }
        });
    }

    if (btnPresetInclusif) {
        btnPresetInclusif.addEventListener('click', () => {
            resetAllCheckboxes();
            const toCheck = ['opt-highContrast', 'opt-coloredCmds', 'opt-noAudio', 'opt-noHome', 'opt-only'];
            toCheck.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.checked = true;
            });
            updateShareUrl();
            if (typeof showToast === 'function') {
                showToast("Mode Inclusif appliqué");
            }
        });
    }

    btnToggleAdvanced.addEventListener('click', () => {
        const isVisible = advancedOptions.style.display === 'block';
        advancedOptions.style.display = isVisible ? 'none' : 'block';
        btnToggleAdvanced.innerHTML = `Options Avancées <i data-fa="chevron-${isVisible ? 'down' : 'up'}"></i>`;
        if (window.fa && typeof fa.createIcons === 'function') fa.createIcons();
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
            if (window.fa && typeof fa.createIcons === 'function') fa.createIcons();

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
            if (window.fa && typeof fa.createIcons === 'function') fa.createIcons();
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
        if (window.fa && typeof fa.createIcons === 'function') fa.createIcons();
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
    updateShareUrl = function () {
        originalUpdateShareUrl();
        if (qrContainer.style.display === 'block' && typeof QRious !== 'undefined') {
            generateQrCode();
        }
    }
}
