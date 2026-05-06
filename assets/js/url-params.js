/**
 * url-params.js
 * Gère le verrouillage de l'interface basé sur les paramètres d'URL
 * et fournit la modale de partage pour les enseignants.
 */

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // Application des règles de masquage/verrouillage
    if (params.get('only') === '1') {
        const tabs = document.querySelector('.tabs');
        if (tabs) tabs.style.display = 'none';
    }
    if (params.get('noHome') === '1') {
        const homeBtn = document.querySelector('a[href*="index.html"]');
        if (homeBtn) homeBtn.style.display = 'none';
    }
    if (params.get('noSettings') === '1') {
        const settings = document.querySelector('.settings-dropdown');
        if (settings) settings.style.display = 'none';
    }
    if (params.get('noAudio') === '1') {
        const audioBtn = document.querySelector('#audioToggleBtn');
        if (audioBtn) audioBtn.style.display = 'none';
    }
    if (params.get('noInstructions') === '1') {
        document.querySelectorAll('details.instructions, .chal-instruction').forEach(el => {
            el.style.display = 'none';
        });
    }
    if (params.get('lockDiff') === '1') {
        document.querySelectorAll('.diff-btn').forEach(el => {
            el.style.pointerEvents = 'none';
            el.style.opacity = '0.5';
        });
    }
    if (params.get('lockMat') === '1') {
        const matBtn = document.querySelector('#btn-open-mats');
        if (matBtn) {
            matBtn.style.pointerEvents = 'none';
            matBtn.style.opacity = '0.5';
        }
    }
    if (params.get('lockSkin') === '1') {
        const skinBtn = document.querySelector('#btn-open-skins');
        if (skinBtn) {
            skinBtn.style.pointerEvents = 'none';
            skinBtn.style.opacity = '0.5';
        }
    }
    if (params.get('lockSpeed') === '1') {
        const speedBtn = document.querySelector('#speedToggleBtn');
        if (speedBtn) {
            speedBtn.style.pointerEvents = 'none';
            speedBtn.style.opacity = '0.5';
        }
    }
    if (params.get('noRandom') === '1') {
        // Sélectionne les boutons ayant la classe btn-random ou contenant "random" ou "hasard"
        document.querySelectorAll('.btn-random, [id*="random"], [id*="hasard"]').forEach(el => {
            if (el.tagName === 'BUTTON' || el.classList.contains('btn')) {
                el.style.display = 'none';
            }
        });
    }
});

// === Modale de Partage (Share Modal) ===

function injectShareModalCSS() {
    if (document.getElementById('share-modal-css')) return;
    const style = document.createElement('style');
    style.id = 'share-modal-css';
    style.textContent = `
        #share-modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        #share-modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        #share-modal-content {
            background: var(--card-bg, rgba(255, 255, 255, 0.95));
            border: var(--glass-border, 1px solid rgba(255,255,255,0.4));
            box-shadow: var(--glass-shadow, 0 8px 32px rgba(31,38,135,0.15));
            border-radius: var(--radius-2xl, 20px);
            padding: 30px;
            width: 90%;
            max-width: 600px;
            position: relative;
            transform: scale(0.95) translateY(20px);
            transition: transform 0.3s var(--spring-easing, ease-out);
            color: var(--text-color, #1a202c);
        }
        body.dark #share-modal-content {
            background: rgba(45, 55, 72, 0.95);
            color: #f7fafc;
            border-color: rgba(255,255,255,0.1);
        }
        #share-modal-overlay.active #share-modal-content {
            transform: scale(1) translateY(0);
        }
        .share-url-container {
            display: flex;
            gap: 10px;
            margin: 20px 0;
        }
        #share-url-input {
            flex-grow: 1;
            padding: 12px;
            border-radius: var(--radius-md, 8px);
            border: 1px solid var(--grid-border, #e2e8f0);
            background: var(--bg-color, #f8fafc);
            color: var(--text-color, #1a202c);
            font-family: monospace;
            font-size: 14px;
        }
        body.dark #share-url-input {
            background: #1a202c;
            border-color: #4a5568;
            color: #f7fafc;
        }
        .advanced-options {
            margin-top: 20px;
            border: 1px solid var(--grid-border, #e2e8f0);
            border-radius: var(--radius-md, 8px);
            padding: 10px 15px;
            background: rgba(0,0,0,0.02);
        }
        body.dark .advanced-options {
            border-color: #4a5568;
            background: rgba(255,255,255,0.02);
        }
        .advanced-options summary {
            font-weight: bold;
            cursor: pointer;
            list-style: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .advanced-options summary::-webkit-details-marker {
            display: none;
        }
        .options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 15px;
        }
        .options-grid label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

function createShareModal() {
    if (document.getElementById('share-modal-overlay')) return;

    injectShareModalCSS();

    const overlay = document.createElement('div');
    overlay.id = 'share-modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    overlay.innerHTML = `
        <div id="share-modal-content" class="modal-content" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
            <button class="btn-close-modal" id="btn-close-share" aria-label="Fermer"><i data-fa="xmark"></i></button>
            <h2 id="share-modal-title" style="margin-top:0; display:flex; align-items:center; gap:10px;">
                <i data-fa="share-nodes"></i> Partager cette configuration
            </h2>

            <p>Ce lien conservera les paramètres actuels de l'application.</p>

            <div class="share-url-container">
                <input type="text" id="share-url-input" readonly>
                <button class="btn btn-primary" id="btn-copy-share"><i data-fa="copy"></i> Copier</button>
            </div>

            <details class="advanced-options" id="share-advanced-options">
                <summary>Options avancées (Verrouillage) <i data-fa="chevron-down" id="share-chevron"></i></summary>
                <div class="options-grid">
                    <label><input type="checkbox" id="share-opt-only" class="share-checkbox"> Forcer cet onglet</label>
                    <label><input type="checkbox" id="share-opt-noHome" class="share-checkbox"> Masquer l'accueil</label>
                    <label><input type="checkbox" id="share-opt-noSettings" class="share-checkbox"> Masquer les options</label>
                    <label><input type="checkbox" id="share-opt-noAudio" class="share-checkbox"> Masquer le son</label>
                    <label><input type="checkbox" id="share-opt-noInstructions" class="share-checkbox"> Masquer l'aide</label>
                    <label><input type="checkbox" id="share-opt-lockDiff" class="share-checkbox"> Verrouiller le niveau</label>
                    <label><input type="checkbox" id="share-opt-lockMat" class="share-checkbox"> Verrouiller le tapis</label>
                    <label><input type="checkbox" id="share-opt-lockSkin" class="share-checkbox"> Verrouiller le skin</label>
                    <label><input type="checkbox" id="share-opt-lockSpeed" class="share-checkbox"> Verrouiller la vitesse</label>
                    <label><input type="checkbox" id="share-opt-noCmdToggle" class="share-checkbox"> Masquer cmds (Blue-Bot)</label>
                    <label><input type="checkbox" id="share-opt-noDrag" class="share-checkbox"> Bloquer déplacement libre</label>
                    <label><input type="checkbox" id="share-opt-noRandom" class="share-checkbox"> Masquer le hasard</label>
                </div>
            </details>
        </div>
    `;

    document.body.appendChild(overlay);

    // Events
    document.getElementById('btn-close-share').addEventListener('click', closeShareModal);
    document.getElementById('btn-copy-share').addEventListener('click', copyShareUrl);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeShareModal();
    });

    document.getElementById('share-advanced-options').addEventListener('toggle', (e) => {
        const icon = document.getElementById('share-chevron');
        if (e.target.open) {
            icon.setAttribute('data-fa', 'chevron-up');
        } else {
            icon.setAttribute('data-fa', 'chevron-down');
        }
        if (window.fa && window.fa.createIcons) {
            window.fa.createIcons();
        }
    });

    document.querySelectorAll('.share-checkbox').forEach(cb => {
        cb.addEventListener('change', updateShareUrl);
    });
}

function openShareModal() {
    createShareModal();
    updateShareUrl();
    const overlay = document.getElementById('share-modal-overlay');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    // Inject FontAwesome icons if needed
    if (window.fa && window.fa.createIcons) {
        window.fa.createIcons();
    }
}

window.openShareModal = openShareModal;

function closeShareModal() {
    const overlay = document.getElementById('share-modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
    }
}

function updateShareUrl() {
    const url = new URL(window.location.origin + window.location.pathname);

    // Récupérer l'état de l'application si disponible
    let appState = {};
    if (typeof window.getAppShareState === 'function') {
        appState = window.getAppShareState();
    }

    // Paramètres d'état par défaut (onglet, niveau, etc.)
    for (const [key, value] of Object.entries(appState)) {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, value);
        }
    }

    // Ajouter les paramètres de verrouillage cochés
    const checkboxes = document.querySelectorAll('.share-checkbox');
    checkboxes.forEach(cb => {
        if (cb.checked) {
            const paramName = cb.id.replace('share-opt-', '');
            url.searchParams.set(paramName, '1');
        }
    });

    document.getElementById('share-url-input').value = url.toString();
}

function copyShareUrl() {
    const input = document.getElementById('share-url-input');
    input.select();
    input.setSelectionRange(0, 99999);

    try {
        navigator.clipboard.writeText(input.value).then(() => {
            if (typeof showToast === 'function') {
                showToast("Lien copié dans le presse-papier !", 'success');
            } else {
                alert("Lien copié !");
            }
        });
    } catch (err) {
        document.execCommand("copy");
        if (typeof showToast === 'function') {
            showToast("Lien copié dans le presse-papier !", 'success');
        } else {
            alert("Lien copié !");
        }
    }
}
