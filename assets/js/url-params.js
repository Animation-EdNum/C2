/* ============================================================
   url-params.js — URL Configuration and Sharing Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    applyUrlParameters();
    initShareModal();
});

function applyUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);

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
        if (homeBtn) homeBtn.style.display = 'none';
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

    if (urlParams.get('lockMat') === '1') {
        const matBtn = document.getElementById('btn-open-mats');
        if (matBtn) matBtn.style.display = 'none';
    }

    if (urlParams.get('lockSkin') === '1') {
        const skinBtn = document.getElementById('btn-open-skins');
        if (skinBtn) skinBtn.style.display = 'none';
    }

    if (urlParams.get('lockSpeed') === '1') {
        const speedBtn = document.getElementById('btn-speed');
        if (speedBtn) speedBtn.style.display = 'none';
    }

    if (urlParams.get('noCmdToggle') === '1') {
        const cmdToggleBtn = document.getElementById('btn-toggle-cmds');
        if (cmdToggleBtn) cmdToggleBtn.style.display = 'none';
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
            const diffBtn = document.querySelector(`.diff-btn[data-diff="${diff}"]`) ||
                            document.getElementById(`diff-${diff}`) ||
                            document.getElementById(`read-diff-${diff}`);
            if (diffBtn && !diffBtn.classList.contains('locked')) {
                // Remove lock temporarily if locked to set the initial value
                const wasLocked = diffBtn.disabled;
                diffBtn.disabled = false;
                diffBtn.click();
                if(wasLocked) diffBtn.disabled = true;
            } else if (document.getElementById('difficulty-select')) {
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
        }, 50);
    }
}

function initShareModal() {
    // Check if share button exists, if not, create it in action-buttons
    let shareBtn = document.getElementById('btn-share');
    if (!shareBtn) {
        const actionBtns = document.querySelector('.action-buttons');
        if (actionBtns) {
            shareBtn = document.createElement('button');
            shareBtn.className = 'icon-action-btn';
            shareBtn.id = 'btn-share';
            shareBtn.title = 'Partager';
            shareBtn.setAttribute('aria-label', 'Partager');
            shareBtn.innerHTML = '<i data-fa="share-nodes"></i>';
            actionBtns.insertBefore(shareBtn, actionBtns.firstChild);
            // Must create icon after insertion
            if(window.fa && typeof fa.createIcons === 'function') fa.createIcons();
        } else {
            return; // Nowhere to put it
        }
    }

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
                </div>
            </div>

            <div class="share-advanced">
                <button id="btn-toggle-advanced" class="btn-advanced-toggle">
                    Options Avancées <i data-fa="chevron-down"></i>
                </button>

                <div id="share-advanced-options" class="advanced-options-content" style="display: none;">
                    <div class="options-grid">
                        <div class="options-column">
                            <h3>Interface & Navigation</h3>
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-only">
                                <span>Masquer les autres onglets</span>
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
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-lockMat">
                                <span>Verrouiller le tapis</span>
                            </label>
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-lockSkin">
                                <span>Verrouiller le skin</span>
                            </label>
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-lockSpeed">
                                <span>Verrouiller la vitesse</span>
                            </label>
                        </div>

                        <div class="options-column">
                            <h3>Comportement</h3>
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-noCmdToggle">
                                <span>Masquer commandes Blue-Bot</span>
                            </label>
                            <label class="share-checkbox">
                                <input type="checkbox" id="opt-noDrag">
                                <span>Désactiver le glisser-déposer</span>
                            </label>
                            <label class="share-checkbox">
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

    // Event Listeners
    const modalOverlay = document.getElementById('share-modal-overlay');
    const btnClose = document.getElementById('btn-close-share');
    const btnCopy = document.getElementById('btn-copy-share');
    const urlInput = document.getElementById('share-url-input');
    const btnToggleAdvanced = document.getElementById('btn-toggle-advanced');
    const advancedOptions = document.getElementById('share-advanced-options');

    const checkboxes = document.querySelectorAll('.share-checkbox input');

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
            const activeDiff = document.querySelector('.diff-btn.active');
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
            }
        });

        urlInput.value = url.toString();

        // Reset copy button state
        btnCopy.innerHTML = '<i data-fa="clipboard"></i> Copier';
        btnCopy.classList.remove('btn-success');
        if(window.fa && typeof fa.createIcons === 'function') fa.createIcons();
    }

    shareBtn.addEventListener('click', () => {
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
}
