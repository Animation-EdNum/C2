        /* ================================================================
           SVGS DES BOUTONS DU BLUE-BOT
           ================================================================ */
        const MAT_CONFIG = {
            'none': { name: 'Aucun tapis', desc: 'Grille standard.', content: '', icon: '🚫' },
            'custom': { name: 'Tapis personnalisé', desc: 'Votre propre image', icon: '🖼️', content: '' },
            'alphabet': { name: 'Alphabet et nombres', desc: 'Lettres A-Z et chiffres 0-9.', example: 'Épelle ton prénom.', content: Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), icon: '🔤' },
            'emotions': {
                name: 'Émotions et sentiments',
                desc: 'Reconnaître et nommer les émotions.',
                example: 'Comment te sens-tu aujourd\'hui ?',
                icon: '🎭',
                content: [
                    '😀', '😢', '😡', '😨',
                    '🤢', '😴', '🤔', '🤩',
                    '😭', '🥳', '🥱', '🤐',
                    '🤧', '🤒', '🤕', '🤑'
                ]
            },
            'seasons': {
                name: 'Saisons et météo',
                desc: 'Les saisons et les différents types de météo.',
                example: 'Quel temps fait-il aujourd\'hui ?',
                icon: '☀️',
                content: [
                    '☀️', '🌧️', '⛅', '⛈️', '❄️',
                    '⛄', '🍂', '🍁', '🌸', '🏖️',
                    '🧥', '🧣', '🧤', '☂️', '🌈',
                    '🌪️', '🌫️', '🌂', '🌡️', '🌬️'
                ]
            },
            'city': {
                name: 'Cité',
                desc: 'Thème ville et routes.',
                example: 'Amène le robot au supermarché.',
                icon: '🗺️'
            },
            'math': {
                name: 'Calcul mental',
                desc: 'Chiffres de 0 à 100 pour s\'entraîner au calcul.',
                example: 'Quel est le résultat de 5 + 7 ?',
                icon: '🔢',
                content: Array.from({ length: 101 }, (_, i) => i.toString())
            },
            'shapes': {
                name: 'Couleurs et formes',
                desc: 'Formes géométriques colorées.',
                example: 'Trouve le carré rouge.',
                icon: '🔵',
                content: [],
                baseContent: [
                    // Simple shapes and primary/basic colors first
                    '🔴', '🔵', '🟡', '🟩', '🟥', '🟦', '🟨', '🟢',
                    // Secondary colors and simpler shapes
                    '🟠', '🟣', '🟧', '🟪', '🔺', '🔻',
                    // More complex colors/shapes
                    '⚫', '⚪', '⬛', '⬜', '❤️', '💙', '💚', '💛',
                    // Complex/less common shapes and colors
                    '🔶', '🔷', '🔸', '🔹', '🟤', '🟫', '🤎', '🤍', '🩷', '🩵', '🖤', '🧡', '💜'
                ]
            },
            'geo': {
                name: 'Géographie',
                desc: 'Drapeaux du monde.',
                example: 'Dans quel pays se trouve Tokyo ?',
                icon: '🌍',
                content: [
                    '🇫🇷', '🇩🇪', '🇮🇹', '🇪🇸', '🇵🇹', '🇬🇧', '🇧🇪', '🇳🇱', '🇦🇹', '🇬🇷',
                    '🇸🇪', '🇳🇴', '🇺🇸', '🇨🇦', '🇲🇽', '🇨🇭', '🇨🇴', '🇦🇷', '🇯🇵', '🇰🇷',
                    '🇧🇷', '🇿🇦', '🇦🇺', '🇳🇿', '🇨🇳', '🇮🇳', '🇪🇬', '🇲🇦', '🇸🇳', '🇰🇪',
                    '🇷🇺', '🇹🇷', '🇵🇱', '🇩🇰', '🇫🇮', '🇮🇪', '🇨🇿', '🇭🇺', '🇷🇴', '🇧🇬',
                    '🇷🇸', '🇭🇷', '🇸🇮', '🇸🇰', '🇺🇦', '🇨🇱', '🇵🇪', '🇻🇪', '🇺🇾', '🇵🇾',
                    '🇧🇴', '🇪🇨', '🇨🇺', '🇯🇲', '🇭🇹', '🇩🇴', '🇵🇷', '🇲🇬', '🇳🇬', '🇬🇭',
                    '🇨🇮', '🇨🇲', '🇩🇿', '🇹🇳', '🇱🇾', '🇸🇩', '🇪🇹', '🇸🇴', '🇹🇿', '🇺🇬',
                    '🇷🇼', '🇿🇲', '🇿🇼', '🇲🇿', '🇦🇴', '🇳🇦', '🇧🇼', '🇲🇾', '🇮🇩', '🇵🇭',
                    '🇹🇭', '🇻🇳', '🇲🇲', '🇰🇭', '🇱🇦', '🇸🇬', '🇧🇩', '🇵🇰', '🇮🇷', '🇮🇶',
                    '🇸🇦', '🇦🇪', '🇶🇦', '🇰🇼', '🇴🇲', '🇾🇪', '🇸🇾', '🇯🇴', '🇱🇧', '🇮🇱'
                ]
            },
            'time': {
                name: 'Lecture de l\'heure',
                desc: 'Wie spät ist es ?',
                icon: '⌚',
                content: [
                    '🕛', '🕐', '🕑', '🕒', '🕓', '🕔',
                    '🕕', '🕖', '🕗', '🕘', '🕙', '🕚',
                    '🕧', '🕜', '🕝', '🕞', '🕟', '🕠',
                    '🕡', '🕢', '🕣', '🕤', '🕥', '🕦'
                ]
            },
            'fairy_tale': {
                name: 'Conte personnalisable',
                desc: "L'élève raconte son histoire en programmant le parcours du robot. Mode créatif.",
                icon: '🧚',
                content: [],
                baseContent: [
                    '👸', '🐉', '🧙', '🏰', '🌲', '💎', '👑', '🦄', '⚔️', '🛡️',
                    '🗝️', '📜', '🐴', '🐸', '🧚', '🧜‍♀️', '🧞‍♂️', '🧝‍♀️', '🧛‍♂️', '🧟‍♀️',
                    '🧞‍♀️', '🪞', '🍎', '🍄', '🌼', '🌈', '⭐', '🌙', '☀️', '☁️',
                    '⚡', '🔥', '💧', '🌊', '❄️', '🌪️', '🤴', '🦹', '🦸', '🐺',
                    '🕷️', '🕸️', '🦇', '🥀', '🌹', '🏹', '🪄', '🔮', '🧪', '🩸',
                    '🦴', '☠️', '👻', '👽', '👾', '🤖', '🎃', '🎭', '🎨', '🎻',
                    '🎺', '🪘', '🥁', '⛺', '🛶', '⛵', '⚓', '🧭', '🗺️', '🏔️',
                    '🌋', '🏕️', '🛤️', '🪙', '💰', '💸', '🏺', '💍', '🦅', '🦆',
                    '🦢', '🦩', '🦚', '🦜', '🐊', '🐢', '🦎', '🐍', '🦕', '🦖',
                    '🐳', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙',
                    '🦉', '🦔', '🐿️', '🦡', '🦦', '🪲', '🦋', '🐌', '🐞', '🐜',
                    '🪶', '🪺', '🪹', '🪨', '🪵', '🪴', '🌾', '💐', '🌷', '🪷',
                    '🏵️', '🌸', '🌺', '🌻', '🪻', '🍄‍🟫', '🪸', '🪼',
                    '🦀', '🦞', '🦐', '🦑', '🦪', '🐚'
                ]
            }
        };

        const SKIN_CONFIG = {
            'default': { name: 'Blue-Bot', obstacle: '🧱', target: '⭐', desc: 'Le robot que tu connais bien.' },
            'beebot': { name: 'Bee-Bot', obstacle: '🌳', target: '🌻', desc: 'Utilise "Reculer" au moins une fois pour atteindre le trésor.' },
            'thymio': { name: 'Thymio', obstacle: '🚧', target: '✏️', desc: 'Réussis un décodage (moyen) du premier coup.' },
            'space': { name: 'Rocket', obstacle: '☄️', target: '💎', desc: 'Gagne un pilotage moyen pour débloquer.' },
            'pirate': { name: 'Vaisseau pirate', obstacle: '🐙', target: '🪙', desc: 'Atteint le trésor du premier coup en utilisant plus de 10 instructions.' },
            'f1': { name: 'Formule 1', obstacle: '🛞', target: '🏁', desc: 'Enchaîne 3 victoires de suite (mode Pilotage) sans faire une seule erreur.' },
            'unicorn': { name: 'Licorne magique', obstacle: '⛈️', target: '🧁', desc: 'Tête qui tourne : Mystère...', hidden: true },
            'train': { name: 'Loco', obstacle: '🛑', target: '🚉', desc: 'Parcours un total de 100 cases.' },
            'volcano': {
                name: 'Le sol est EN FEU !!!',
                obstacle: '🧊',
                target: `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><g class="treasure-pile"><g stroke="#92400e" stroke-width="1.5"><circle cx="30" cy="35" r="10" fill="url(#coinGrad)"/><circle cx="70" cy="30" r="9" fill="url(#coinGrad)"/><circle cx="20" cy="55" r="8" fill="url(#coinGrad)"/><circle cx="80" cy="65" r="11" fill="url(#coinGrad)"/><circle cx="45" cy="75" r="12" fill="url(#coinGrad)"/></g><g stroke="#92400e" stroke-width="1.5"><circle cx="45" cy="25" r="11" fill="url(#coinGrad)"/><circle cx="65" cy="50" r="13" fill="url(#coinGrad)"/><circle cx="35" cy="60" r="12" fill="url(#coinGrad)"/><circle cx="60" cy="70" r="9" fill="url(#coinGrad)"/></g><g stroke="#92400e" stroke-width="1.5"><circle cx="50" cy="45" r="15" fill="url(#coinGrad)" filter="url(#goldGlow)"/></g><g fill="none" stroke="#fef3c7" stroke-width="1" opacity="0.5"><circle cx="30" cy="35" r="6"/><circle cx="70" cy="30" r="5"/><circle cx="20" cy="55" r="4"/><circle cx="80" cy="65" r="7"/><circle cx="45" cy="75" r="8"/><circle cx="45" cy="25" r="7"/><circle cx="65" cy="50" r="9"/><circle cx="35" cy="60" r="8"/><circle cx="60" cy="70" r="5"/><circle cx="50" cy="45" r="11"/></g><g class="sparkle s1"><path d="M 30 20 L 32 28 L 40 30 L 32 32 L 30 40 L 28 32 L 20 30 L 28 28 Z" fill="white" filter="url(#goldGlow)"/></g><g class="sparkle s2"><path d="M 70 50 L 72 58 L 80 60 L 72 62 L 70 70 L 68 62 L 60 60 L 68 58 Z" fill="white" filter="url(#goldGlow)"/></g><g class="sparkle s3"><path d="M 50 35 L 53 43 L 61 45 L 53 47 L 50 55 L 47 47 L 39 45 L 47 43 Z" fill="white" filter="url(#goldGlow)"/></g></g></svg>`,
                desc: 'Réussis un décodage (extrême) du premier coup.'
            },
            'cyberbot': { name: 'Cyber-Bot 2077', obstacle: '👾', target: '💾', desc: 'Réussis un pilotage (extrême) du premier coup.' },
            'botanique': { name: 'Bot-anique', obstacle: '🍄', target: '🌸', desc: 'La persévérance finit par payer...', hidden: true },
            'helicopter': { name: 'Hélicoptère', obstacle: '☁️', target: '🏥', desc: "Utilise un tapis." }
        };

        const BB_SVGS = {
            forward: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="4"/><polyline points="5 11 12 4 19 11"/></svg>`,
            backward: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="4" x2="12" y2="20"/><polyline points="19 13 12 20 5 13"/></svg>`,
            left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20v-6a4 4 0 0 0-4-4H4"/><polyline points="10 4 4 10 10 16"/></svg>`,
            right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20v-6a4 4 0 0 1 4-4h12"/><polyline points="14 4 20 10 14 16"/></svg>`
        };

        window.addEventListener('DOMContentLoaded', () => {
            const padFwd = document.getElementById('pad-fwd');
            if (padFwd) padFwd.innerHTML = BB_SVGS.forward;
            const padBwd = document.getElementById('pad-bwd');
            if (padBwd) padBwd.innerHTML = BB_SVGS.backward;
            const padLeft = document.getElementById('pad-left');
            if (padLeft) padLeft.innerHTML = BB_SVGS.left;
            const padRight = document.getElementById('pad-right');
            if (padRight) padRight.innerHTML = BB_SVGS.right;

            const legendContainer = document.getElementById('legend-container');
            if (legendContainer) {
                legendContainer.innerHTML = `
        <div class="legend-item"><div class="legend-dot">${BB_SVGS.forward}</div> Avancer</div>
        <div class="legend-item"><div class="legend-dot">${BB_SVGS.backward}</div> Reculer</div>
        <div class="legend-item"><div class="legend-dot">${BB_SVGS.left}</div> Gauche 90°</div>
        <div class="legend-item"><div class="legend-dot">${BB_SVGS.right}</div> Droite 90°</div>
        <div class="legend-item"><div class="legend-dot" style="background: #22c55e; font-size: 10px; font-weight: bold;">GO</div> Démarrer</div>
        <div class="legend-item"><div class="legend-dot" style="background: #3b82f6; font-size: 10px; font-weight: bold;">X</div> Effacer</div>
    `;
            }
        });

        /* ================================================================
           SKINS ET GAMIFICATION
           ================================================================ */


        function shuffleArray(array) {
            let newArr = [...array];
            let currentIndex = newArr.length, randomIndex;
            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                [newArr[currentIndex], newArr[randomIndex]] = [newArr[randomIndex], newArr[currentIndex]];
            }
            return newArr;
        }

        let drawerTriggerElement = null;


        const trapListeners = new WeakMap();

        function setupFocusTrap(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (!trapListeners.has(modal)) {
                const listener = function(e) {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === firstElement) {
                                lastElement.focus();
                                e.preventDefault();
                            }
                        } else {
                            if (document.activeElement === lastElement) {
                                firstElement.focus();
                                e.preventDefault();
                            }
                        }
                    }
                };
                modal.addEventListener('keydown', listener);
                trapListeners.set(modal, listener);
            }

            // Focus first element on open
            setTimeout(() => firstElement.focus(), 50);
        }

        function openMatsModal() {
            drawerTriggerElement = document.activeElement;
            playSound('click');
            renderMatsGrid();
            document.getElementById('mats-drawer').classList.add('active');
            document.getElementById('mats-drawer-overlay').classList.add('active');
            document.getElementById('mats-drawer-overlay').setAttribute('aria-hidden', 'false');
            document.getElementById('mats-drawer').setAttribute('aria-hidden', 'false');
            setupFocusTrap('mats-drawer');
        }

        function closeMatsModal() {
            if (drawerTriggerElement) drawerTriggerElement.focus();
            playSound('click');
            document.getElementById('mats-drawer').classList.remove('active');
            document.getElementById('mats-drawer-overlay').classList.remove('active');
            document.getElementById('mats-drawer-overlay').setAttribute('aria-hidden', 'true');
            document.getElementById('mats-drawer').setAttribute('aria-hidden', 'true');
        }

        function renderMatsGrid() {
            const container = document.getElementById('mats-list-container');
            container.innerHTML = Object.keys(MAT_CONFIG).filter(matId => matId !== 'none' && matId !== 'custom').map(matId => {
                const config = MAT_CONFIG[matId];
                const isActive = activeMat === matId;

                const exampleHtml = config.example ? `<div class="skin-item-desc" style="font-style: italic; color: var(--accent); margin-top: 4px; font-size: 0.8em;">💡 ${config.example}</div>` : '';

                return `
                    <div class="skin-list-item ${isActive ? 'active-skin' : ''}" data-mat="${matId}" tabindex="0">
                        <div class="skin-item-avatar" style="font-size: 32px;">
                            ${config.icon || 'A'}
                        </div>
                        <div class="skin-item-info">
                            <div class="skin-item-name">${config.name}</div>
                            <div class="skin-item-desc">${config.desc}</div>
                            ${exampleHtml}
                        </div>
                    </div>
                `;
            }).join('');

            // Prepend the custom upload at the beginning
            const customConfig = MAT_CONFIG['custom'];
            const isCustomActive = activeMat === 'custom';
            const customHtml = `
                <div class="skin-list-item ${isCustomActive ? 'active-skin' : ''}" data-mat="custom" tabindex="0" style="margin-bottom: 15px; border-bottom: 1px solid var(--grid-border); border-radius: 12px 12px 0 0; padding-bottom: 15px;">
                    <div class="skin-item-avatar" style="font-size: 32px;">
                        ${customConfig.icon}
                    </div>
                    <div class="skin-item-info">
                        <div class="skin-item-name">${customConfig.name}</div>
                        <div class="skin-item-desc">${customConfig.desc}</div>
                        <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;" onclick="event.stopPropagation()">
                            <label for="customMatUpload" class="btn btn-outline btn-small"
                                style="cursor: pointer; flex-grow: 1; text-align: center; font-size: 0.85em; padding: 4px 8px;">
                                <i data-fa="upload" style="width: 14px; height: 14px; margin-right: 5px; vertical-align: middle;"></i>
                                Télécharger image
                            </label>
                            <input type="file" id="customMatUpload" accept="image/*" style="display: none;">
                        </div>
                        <div id="customMatStatus" style="font-size: 0.8em; color: var(--text-muted); margin-top: 5px;"></div>
                    </div>
                </div>
            `;
            container.innerHTML = customHtml + container.innerHTML;
            fa.createIcons();

            // Re-bind the upload listener here since the DOM is recreated
            const uploadInput = document.getElementById('customMatUpload');
            if (uploadInput) {
                // Ensure we call the existing global function if defined, or define one dynamically
                uploadInput.addEventListener('change', function (e) {
                    if (typeof handleCustomMatUpload === 'function') {
                        handleCustomMatUpload(e);
                    }
                });
            }
        }

        function generateMatContent(matId) {
            if (matId === 'custom') {
                if (!localStorage.getItem('bb_custom_mat_image')) {
                    console.warn("Custom mat selected but no image uploaded.");
                }
                return;
            }
            const config = MAT_CONFIG[matId];
            const endContainer = document.getElementById('sim-end-container');
            if (endContainer) {
                if (config && config.content) {
                    endContainer.style.display = 'block';
                } else {
                    endContainer.style.display = 'none';
                }
            }
            if (!config) {
                console.warn(`Unknown matId: ${matId}`);
                return;
            }
            if (config.baseContent) {
                if (matId === 'shapes') {
                    const needed = GRID_ROWS * GRID_COLS;
                    const neededPairs = Math.floor(needed / 2);
                    let pairsContent = [];
                    let baseIndex = 0;

                    // Pick from baseContent in order (simpler first), duplicating each item for a pair
                    while (pairsContent.length < neededPairs * 2) {
                        const item = config.baseContent[baseIndex % config.baseContent.length];
                        pairsContent.push(item, item);
                        baseIndex++;
                    }

                    // If odd grid size, add one singleton
                    if (needed % 2 !== 0) {
                        pairsContent.push(config.baseContent[baseIndex % config.baseContent.length]);
                    }

                    config.content = shuffleArray(pairsContent);
                } else if (matId === 'fairy_tale') {
                    config.content = shuffleArray([...config.baseContent]).slice(0, GRID_ROWS * GRID_COLS);
                }
            }
        }

        function selectMat(matId) {
            if (matId === 'custom' && !localStorage.getItem('bb_custom_mat_image')) {
                // If user selects custom mat but no image uploaded yet, prompt upload
                const uploadInput = document.getElementById('customMatUpload');
                if (uploadInput) {
                    uploadInput.click();
                }
                return;
            }

            playSound('click');
            activeMat = matId;
            localStorage.setItem('bb_active_mat', matId);
            generateMatContent(matId);

            renderMatsGrid();
            closeMatsModal();
            updateGridSizeSlidersState();

            // Re-render grids to apply mat
            buildGrid('sim-grid', GRID_ROWS, GRID_COLS, simState.obstacles);
            renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
            TrailManager.clear('sim-grid');
            if (simState.targetRow !== null && simState.targetCol !== null) {
                renderTarget('sim-grid', 'sim-target', simState.targetRow, simState.targetCol);
            }
            if (chalState.robotRow !== null) {
                buildGrid('chal-grid', GRID_ROWS, GRID_COLS, chalState.obstacles || []);
                renderRobot('chal-grid', 'chal-robot', chalState.robotRow, chalState.robotCol, chalState.robotDir);
                TrailManager.clear('chal-grid');
                if (chalState.targetRow !== null) renderTarget('chal-grid', 'chal-target', chalState.targetRow, chalState.targetCol);
            }

            if (matId !== 'none') {
                unlockSkin('helicopter');
            }
        }

        function openSkinsModal() {
            drawerTriggerElement = document.activeElement;
            playSound('click');
            renderSkinsList();
            document.getElementById('skins-drawer').classList.add('active');
            document.getElementById('skins-drawer-overlay').classList.add('active');
            document.getElementById('skins-drawer-overlay').setAttribute('aria-hidden', 'false');
            document.getElementById('skins-drawer').setAttribute('aria-hidden', 'false');
            setupFocusTrap('skins-drawer');
        }

        function closeSkinsModal() {
            if (drawerTriggerElement) drawerTriggerElement.focus();
            playSound('click');
            document.getElementById('skins-drawer').classList.remove('active');
            document.getElementById('skins-drawer-overlay').classList.remove('active');
            document.getElementById('skins-drawer-overlay').setAttribute('aria-hidden', 'true');
            document.getElementById('skins-drawer').setAttribute('aria-hidden', 'true');
        }

        function renderSkinsList() {
            const container = document.getElementById('skins-list-container');
            container.innerHTML = Object.keys(SKIN_CONFIG).filter(id => {
                const config = SKIN_CONFIG[id];
                return !config.hidden || unlockedSkins.includes(id);
            }).map(skinId => {
                const config = SKIN_CONFIG[skinId];
                const isUnlocked = unlockedSkins.includes(skinId);
                const isActive = activeSkin === skinId;

                let svg = ROBOT_SVGS[skinId] || ROBOT_SVGS['default'];
                svg = svg.replace(/<animate[\s\S]*?>/gi, ''); // Remove animations for preview
                let btnHtml = '';
                let lockIcon = '';

                if (!isUnlocked) {
                    lockIcon = `<div class="lock-icon" style="position: absolute; font-size: 24px; z-index: 2;">🔒</div>`;
                }

                return `
                    <div class="skin-list-item ${!isUnlocked ? 'locked' : ''} ${isActive ? 'active-skin' : ''}" data-skin="${skinId}" tabindex="0">
                        <div class="skin-item-avatar">
                            ${lockIcon}
                            ${svg}
                        </div>
                        <div class="skin-item-info">
                            <div class="skin-item-name">${config.name}</div>
                            <div class="skin-item-desc">${config.desc}</div>
                        </div>
                        <div class="skin-item-miniatures">
                            <div class="skin-item-mini" title="Obstacle">${config.obstacle}</div>
                            <div class="skin-item-mini" title="Récompense">${config.target}</div>
                        </div>

                    </div>
                `;
            }).join('');
        }

        function redrawTrail(containerId, state) {
            let maxIndex = state.program.length - 1;
            if (state.running || state.failed) {
                maxIndex = state.stepIndex - 1;
            }
            TrailManager.clear(containerId);
            TrailManager.captureInitialState(containerId, state.startRow, state.startCol, state.startDir);
            let tempState = { robotRow: state.startRow, robotCol: state.startCol, robotDir: state.startDir, obstacles: state.obstacles };
            for (let i = 0; i <= maxIndex; i++) {
                let cmd = state.program[i];
                let res = moveRobot(tempState, cmd);
                if (res.robotRow !== tempState.robotRow || res.robotCol !== tempState.robotCol) {
                    TrailManager.addSegment(containerId, res.robotRow, res.robotCol);
                }
                tempState = res;
            }
        }

        function selectSkin(skinId) {
            if (!unlockedSkins.includes(skinId)) return;
            playSound('click');
            activeSkin = skinId;
            localStorage.setItem('bb_active_skin', skinId);

            // Cyber-Bot and Volcano force Dark Mode
            if (skinId === 'cyberbot' || skinId === 'volcano') {
                if (!document.body.classList.contains('dark')) toggleTheme();
            }

            if (skinId === 'pirate') {
                startOceanRipples();
            } else {
                stopOceanRipples();
            }

            renderSkinsList();
            closeSkinsModal();

            // Met à jour les grilles sans réinitialiser leur état
            const grids = ['sim-grid', 'chal-grid', 'read-grid', 'draw-grid'];
            grids.forEach(gridId => {
                const grid = document.getElementById(gridId);
                if (!grid) return;

                // Mettre à jour les classes
                Array.from(grid.classList).forEach(cls => {
                    if (cls.startsWith('skin-')) grid.classList.remove(cls);
                });
                if (activeSkin !== 'volcano') grid.classList.remove('ground-fire');
                if (activeSkin !== 'pirate') grid.classList.remove('ground-ocean');
                else grid.classList.add('ground-ocean');
                grid.classList.add(`skin-${activeSkin}`);

                // Mettre à jour les obstacles
                const obstacles = grid.querySelectorAll('.obstacle');
                const obsSkin = SKIN_CONFIG[activeSkin].obstacle;
                obstacles.forEach(cell => {
                    if (obsSkin.includes('<svg')) {
                        cell.innerHTML = obsSkin;
                        delete cell.dataset.obstacle;
                    } else {
                        cell.innerHTML = '';
                        cell.dataset.obstacle = obsSkin;
                    }
                });
            });

            // Mettre à jour les robots et cibles pour sim-grid
            renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
            if (simState.targetRow !== null && simState.targetCol !== null) {
                renderTarget('sim-grid', 'sim-target', simState.targetRow, simState.targetCol);
            }

            // Mettre à jour les robots et cibles pour chal-grid
            if (chalState.robotRow !== null) {
                renderRobot('chal-grid', 'chal-robot', chalState.robotRow, chalState.robotCol, chalState.robotDir);
                if (chalState.targetRow !== null) {
                    renderTarget('chal-grid', 'chal-target', chalState.targetRow, chalState.targetCol);
                }
            }

            // Mettre à jour les robots et cibles pour read-grid
            if (typeof readState !== 'undefined' && readState.robotRow !== undefined && readState.robotRow !== null) {
                renderRobot('read-grid', 'read-robot', readState.robotRow, readState.robotCol, readState.robotDir);
                // La cible n'est pas rendue ici pour ne pas révéler la solution dans le mode lecture
            }

            // Mettre à jour les robots et cibles pour draw-grid
            if (typeof drawState !== 'undefined' && drawState.robotRow !== undefined && drawState.robotRow !== null) {
                renderRobot('draw-grid', 'draw-robot', drawState.robotRow, drawState.robotCol, drawState.robotDir);
            }

            const tgtBtn = document.getElementById('btn-target-icon');
            if (tgtBtn) {
                const tg = SKIN_CONFIG[activeSkin].target;
                if (tg && tg.includes('<svg')) {
                    tgtBtn.innerHTML = tg;
                    const svg = tgtBtn.querySelector('svg');
                    if (svg) {
                        svg.style.width = '1.2em';
                        svg.style.height = '1.2em';
                        svg.style.display = 'inline-block';
                        svg.style.verticalAlign = 'middle';
                    }
                } else {
                    tgtBtn.innerText = tg || '';
                }
            }
            const obsBtn = document.getElementById('btn-obstacle-icon');
            if (obsBtn) {
                const ob = SKIN_CONFIG[activeSkin].obstacle;
                if (ob && ob.includes('<svg')) {
                    obsBtn.innerHTML = ob;
                    const svg = obsBtn.querySelector('svg');
                    if (svg) {
                        svg.style.width = '1.2em';
                        svg.style.height = '1.2em';
                        svg.style.display = 'inline-block';
                        svg.style.verticalAlign = 'middle';
                    }
                } else {
                    obsBtn.innerText = ob || '';
                }
            }

            // Redraw trails to match new skin
            if (simState.program.length > 0 || simState.running || simState.failed) {
                redrawTrail('sim-grid', simState);
            } else {
                TrailManager.clear('sim-grid');
            }
            if (typeof drawState !== 'undefined' && drawState.program.length > 0) {
                redrawTrail('draw-grid', drawState);
            } else {
                TrailManager.clear('draw-grid');
            }
            if (typeof readState !== 'undefined' && readState.program.length > 0 && readState.isAnimating) {
                // Not perfectly redrawing read path because it uses obstacles in moveRobot which readState has.
                redrawTrail('read-grid', readState);
            } else if (typeof readState !== 'undefined' && !readState.isAnimating) {
                TrailManager.clear('read-grid');
            }
            if (typeof chalState !== 'undefined') {
                // Just clear since chal doesn't store current active program explicitly
                TrailManager.clear('chal-grid');
            }
        }

        function unlockSkin(skinId) {
            if (!unlockedSkins.includes(skinId)) {
                unlockedSkins.push(skinId);
                localStorage.setItem('bb_unlocked_skins', JSON.stringify(unlockedSkins));

                if (activeSkin === 'volcano') {
                    launchFire();
                } else {
                    launchConfetti();
                }

                showToast(`Nouveau Skin débloqué : ${SKIN_CONFIG[skinId].name} ! 🎁`, 'success');
                selectSkin(skinId);
            }
        }



        let activeMat = localStorage.getItem('bb_active_mat') || 'none';
        generateMatContent(activeMat);
        if (!MAT_CONFIG[activeMat]) activeMat = 'none';

        const MAT_GRID_CONSTRAINTS = {
            'alphabet': { cols: 6, rows: 6 },
            'time':     { cols: 6, rows: 4 },
            'emotions': { cols: 4, rows: 4 },
            'seasons':  { cols: 5, rows: 4 },
            'city':     { cols: 8, rows: 8 },
        };

        function updateGridSizeSlidersState() {
            if (!gridColsSlider || !gridRowsSlider) return;
            const constraint = MAT_GRID_CONSTRAINTS[activeMat];
            const locked = !!constraint;
            const title = locked ? `Taille fixe de ${constraint.cols}x${constraint.rows} pour ce tapis` : '';

            gridColsSlider.disabled = locked;
            gridRowsSlider.disabled = locked;
            gridColsSlider.parentElement.style.opacity = locked ? '0.5' : '1';
            gridRowsSlider.parentElement.style.opacity = locked ? '0.5' : '1';
            gridColsSlider.parentElement.title = title;
            gridRowsSlider.parentElement.title = title;

            if (locked && (GRID_COLS !== constraint.cols || GRID_ROWS !== constraint.rows)) {
                gridColsSlider.value = constraint.cols;
                gridRowsSlider.value = constraint.rows;
                onGridSizeChanged();
            }
        }



        let unlockedSkins = JSON.parse(localStorage.getItem('bb_unlocked_skins') || '["default"]');
        let activeSkin = localStorage.getItem('bb_active_skin') || 'default';
        if (!SKIN_CONFIG[activeSkin]) activeSkin = 'default';

        const ROBOT_SVGS = {
            'pirate': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <g transform="scale(0.8) translate(12.5, 12.5)">

                        <path d="M 50 0 Q 30 10 15 35" fill="none" stroke="#38bdf8" stroke-linecap="round">
                            <animate attributeName="stroke-width" values="1; 2; 1" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5; 0.9; 0.5" dur="1.5s" repeatCount="indefinite" />
                        </path>
                        <path d="M 50 0 Q 70 10 85 35" fill="none" stroke="#38bdf8" stroke-linecap="round">
                            <animate attributeName="stroke-width" values="1; 2; 1" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5; 0.9; 0.5" dur="1.5s" repeatCount="indefinite" />
                        </path>

                        <ellipse cx="50" cy="85" rx="5" ry="2" fill="none" stroke="#7dd3fc">
                            <animate attributeName="cy" values="85; 130" dur="2s" repeatCount="indefinite" begin="0s"/>
                            <animate attributeName="rx" values="5; 35" dur="2s" repeatCount="indefinite" begin="0s"/>
                            <animate attributeName="ry" values="2; 15" dur="2s" repeatCount="indefinite" begin="0s"/>
                            <animate attributeName="opacity" values="0.8; 0" dur="2s" repeatCount="indefinite" begin="0s"/>
                            <animate attributeName="stroke-width" values="2; 0.5" dur="2s" repeatCount="indefinite" begin="0s"/>
                        </ellipse>

                        <ellipse cx="50" cy="85" rx="5" ry="2" fill="none" stroke="#7dd3fc">
                            <animate attributeName="cy" values="85; 130" dur="2s" repeatCount="indefinite" begin="0.66s"/>
                            <animate attributeName="rx" values="5; 35" dur="2s" repeatCount="indefinite" begin="0.66s"/>
                            <animate attributeName="ry" values="2; 15" dur="2s" repeatCount="indefinite" begin="0.66s"/>
                            <animate attributeName="opacity" values="0.8; 0" dur="2s" repeatCount="indefinite" begin="0.66s"/>
                            <animate attributeName="stroke-width" values="2; 0.5" dur="2s" repeatCount="indefinite" begin="0.66s"/>
                        </ellipse>

                        <ellipse cx="50" cy="85" rx="5" ry="2" fill="none" stroke="#7dd3fc">
                            <animate attributeName="cy" values="85; 130" dur="2s" repeatCount="indefinite" begin="1.33s"/>
                            <animate attributeName="rx" values="5; 35" dur="2s" repeatCount="indefinite" begin="1.33s"/>
                            <animate attributeName="ry" values="2; 15" dur="2s" repeatCount="indefinite" begin="1.33s"/>
                            <animate attributeName="opacity" values="0.8; 0" dur="2s" repeatCount="indefinite" begin="1.33s"/>
                            <animate attributeName="stroke-width" values="2; 0.5" dur="2s" repeatCount="indefinite" begin="1.33s"/>
                        </ellipse>

                        <circle cx="42" cy="85" r="2" fill="#bae6fd">
                            <animate attributeName="cy" values="85; 120" dur="1.5s" repeatCount="indefinite" begin="0s"/>
                            <animate attributeName="opacity" values="0.8; 0" dur="1.5s" repeatCount="indefinite" begin="0s"/>
                        </circle>
                        <circle cx="58" cy="85" r="3" fill="#bae6fd">
                            <animate attributeName="cy" values="85; 115" dur="1.8s" repeatCount="indefinite" begin="0.5s"/>
                            <animate attributeName="opacity" values="0.7; 0" dur="1.8s" repeatCount="indefinite" begin="0.5s"/>
                        </circle>

                        <line x1="50" y1="20" x2="50" y2="-15" stroke="#3E2723" stroke-width="3" stroke-linecap="round"/>

                        <path d="M 50 0 L 75 30 L 65 85 Q 50 95 35 85 L 25 30 Z" fill="#5C4033" stroke="#271811" stroke-width="2"/>

                        <path d="M 50 6 L 70 32 L 61 82 Q 50 88 39 82 L 30 32 Z" fill="#8B4513" stroke="#3E2723" stroke-width="1"/>
                        <line x1="38" y1="25" x2="62" y2="25" stroke="#3E2723" stroke-width="0.5" opacity="0.6"/>
                        <line x1="33" y1="45" x2="67" y2="45" stroke="#3E2723" stroke-width="0.5" opacity="0.6"/>
                        <line x1="37" y1="65" x2="63" y2="65" stroke="#3E2723" stroke-width="0.5" opacity="0.6"/>

                        <g fill="#111">
                            <rect x="23" y="38" width="10" height="4" rx="1"/>
                            <rect x="67" y="38" width="10" height="4" rx="1"/>
                            <rect x="25" y="62" width="10" height="4" rx="1"/>
                            <rect x="65" y="62" width="10" height="4" rx="1"/>
                        </g>

                        <circle cx="50" cy="35" r="4" fill="#271811"/>
                        <circle cx="50" cy="65" r="4" fill="#271811"/>
                        <path d="M 15 35 Q 50 5 85 35 Q 65 25 50 25 Q 35 25 15 35 Z" fill="#F5F5DC" stroke="#D3D3D3" stroke-width="1"/>
                        <path d="M 10 65 Q 50 30 90 65 Q 70 50 50 50 Q 30 50 10 65 Z" fill="#F5F5DC" stroke="#D3D3D3" stroke-width="1"/>
                        <line x1="20" y1="32" x2="80" y2="32" stroke="#271811" stroke-width="2" stroke-linecap="round"/>
                        <line x1="15" y1="62" x2="85" y2="62" stroke="#271811" stroke-width="2" stroke-linecap="round"/>

                        <g transform="translate(50, 65) scale(0.7)">
                            <path d="M 0 0 Q -10 15 -25 5 L -25 -15 Q -10 -5 0 -20 Z" fill="#111">
                                <animate attributeName="d" values="M 0 0 Q -10 15 -25 5 L -25 -15 Q -10 -5 0 -20 Z; M 0 0 Q -15 5 -25 5 L -25 -15 Q -15 -15 0 -20 Z; M 0 0 Q -10 15 -25 5 L -25 -15 Q -10 -5 0 -20 Z" dur="1s" repeatCount="indefinite" />
                            </path>
                            <circle cx="-12" cy="-5" r="3" fill="white"/>
                            <line x1="-16" y1="-9" x2="-8" y2="-1" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                            <line x1="-16" y1="-1" x2="-8" y2="-9" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                        </g>
                    </g>
                </svg>`,
            'f1': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <g transform="scale(0.8) translate(12.5, 12.5)">
                        <!-- Pneus -->
                        <rect x="20" y="20" width="10" height="20" rx="3" fill="#333" />
                        <rect x="70" y="20" width="10" height="20" rx="3" fill="#333" />
                        <rect x="20" y="60" width="10" height="20" rx="3" fill="#333" />
                        <rect x="70" y="60" width="10" height="20" rx="3" fill="#333" />
                        <!-- Carrosserie -->
                        <path d="M 40 10 L 60 10 L 65 30 L 70 50 L 70 80 L 30 80 L 30 50 L 35 30 Z" fill="#E32636" stroke="#990000" stroke-width="2"/>
                        <!-- Cockpit -->
                        <rect x="42" y="45" width="16" height="15" rx="5" fill="#111" />
                        <!-- Aileron avant -->
                        <rect x="25" y="10" width="50" height="5" fill="#E32636" />
                        <!-- Aileron arrière -->
                        <rect x="25" y="80" width="50" height="8" fill="#111" />
                    </g>
                </svg>`,
            'unicorn': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <g transform="scale(0.8) translate(12.5, 12.5)">
                    <path d="M 45 80 Q 25 105 50 110 Q 75 105 55 80 Z" fill="#FFB6C1" opacity="0.9"/>
                    <path d="M 48 80 Q 35 100 50 105 Q 65 100 52 80 Z" fill="#87CEEB" opacity="0.9"/>

                    <rect x="18" y="65" width="14" height="24" rx="7" fill="#FFF" stroke="#FFC0CB" stroke-width="2" transform="rotate(40, 25, 75)"/>
                    <rect x="68" y="65" width="14" height="24" rx="7" fill="#FFF" stroke="#FFC0CB" stroke-width="2" transform="rotate(-40, 75, 75)"/>
                    <rect x="20" y="30" width="14" height="24" rx="7" fill="#FFF" stroke="#FFC0CB" stroke-width="2" transform="rotate(-45, 27, 42)"/>
                    <rect x="66" y="30" width="14" height="24" rx="7" fill="#FFF" stroke="#FFC0CB" stroke-width="2" transform="rotate(45, 73, 42)"/>

                    <ellipse cx="50" cy="55" rx="24" ry="34" fill="#FFF" stroke="#FFC0CB" stroke-width="2"/>

                    <path d="M 50 25 Q 35 45 52 65 Q 60 75 48 85" fill="none" stroke="#FF69B4" stroke-width="6" stroke-linecap="round"/>
                    <path d="M 50 25 Q 65 40 48 60 Q 40 75 52 85" fill="none" stroke="#87CEEB" stroke-width="6" stroke-linecap="round"/>

                    <polygon points="38,22 20,15 34,30" fill="#FFF" stroke="#FFC0CB" stroke-width="2" stroke-linejoin="round"/>
                    <polygon points="62,22 80,15 66,30" fill="#FFF" stroke="#FFC0CB" stroke-width="2" stroke-linejoin="round"/>

                    <ellipse cx="50" cy="25" rx="16" ry="20" fill="#FFF" stroke="#FFC0CB" stroke-width="2"/>

                    <ellipse cx="37" cy="24" rx="2.5" ry="4.5" fill="#000" transform="rotate(-15, 36, 24)"/>
                    <ellipse cx="63" cy="24" rx="2.5" ry="4.5" fill="#000" transform="rotate(15, 64, 24)"/>

                    <ellipse cx="50" cy="10" rx="12" ry="8" fill="#FFC0CB" />

                    <polygon points="45,10 55,10 50,-15" fill="#FFD700" stroke="#DAA520" stroke-width="1.5" stroke-linejoin="round"/>

                    <path d="M 46,10 L 54,8 M 47,2 L 53,0 M 48,-6 L 52,-8" stroke="#DAA520" stroke-width="2" stroke-linecap="round"/>
                </g>
            </svg>
            `,
            'train': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="cylindre" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#1f2937" />
                        <stop offset="50%" stop-color="#9ca3af" />
                        <stop offset="100%" stop-color="#111827" />
                    </linearGradient>
                    <linearGradient id="toit" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#991b1b" />
                        <stop offset="45%" stop-color="#f87171" />
                        <stop offset="100%" stop-color="#7f1d1d" />
                    </linearGradient>
                    <radialGradient id="or" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stop-color="#fef08a" />
                        <stop offset="50%" stop-color="#eab308" />
                        <stop offset="100%" stop-color="#854d0e" />
                    </radialGradient>
                </defs>

                <g transform="translate(0, 5)">
                    <line x1="36" y1="20" x2="64" y2="20" stroke="#57534e" stroke-width="3"/>
                    <line x1="36" y1="40" x2="64" y2="40" stroke="#57534e" stroke-width="3"/>
                    <line x1="36" y1="60" x2="64" y2="60" stroke="#57534e" stroke-width="3"/>
                    <line x1="36" y1="80" x2="64" y2="80" stroke="#57534e" stroke-width="3"/>

                    <rect x="23" y="14" width="54" height="78" rx="4" fill="#000" opacity="0.3"/>

                    <rect x="25" y="15" width="50" height="75" rx="3" fill="#374151" stroke="#1f2937" stroke-width="1"/>
                    <line x1="28" y1="15" x2="28" y2="90" stroke="#4b5563" stroke-width="1"/>
                    <line x1="72" y1="15" x2="72" y2="90" stroke="#4b5563" stroke-width="1"/>

                    <polygon points="25,15 75,15 50,2" fill="#1f2937" stroke="#111" stroke-width="1.5"/>
                    <line x1="30" y1="12" x2="70" y2="12" stroke="#facc15" stroke-width="1"/>
                    <line x1="35" y1="9" x2="65" y2="9" stroke="#facc15" stroke-width="1"/>
                    <line x1="42" y1="6" x2="58" y2="6" stroke="#facc15" stroke-width="1"/>

                    <rect x="18" y="25" width="8" height="22" rx="2" fill="url(#cylindre)" stroke="#111" stroke-width="1"/>
                    <rect x="74" y="25" width="8" height="22" rx="2" fill="url(#cylindre)" stroke="#111" stroke-width="1"/>
                    <line x1="22" y1="47" x2="22" y2="70" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
                    <line x1="78" y1="47" x2="78" y2="70" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>

                    <rect x="35" y="15" width="30" height="55" fill="url(#cylindre)" stroke="#111" stroke-width="1"/>

                    <line x1="35" y1="25" x2="65" y2="25" stroke="#111" stroke-width="2"/>
                    <line x1="35" y1="45" x2="65" y2="45" stroke="#111" stroke-width="2"/>
                    <line x1="35" y1="60" x2="65" y2="60" stroke="#111" stroke-width="2"/>

                    <circle cx="50" cy="35" r="9" fill="url(#or)" stroke="#713f12" stroke-width="1"/>
                    <circle cx="50" cy="52" r="6" fill="url(#or)" stroke="#713f12" stroke-width="1"/>

                    <circle cx="50" cy="18" r="7" fill="#111" stroke="#374151" stroke-width="2"/>
                    <circle cx="50" cy="18" r="4" fill="#000" />

                    <rect x="22" y="68" width="56" height="25" rx="2" fill="url(#toit)" stroke="#450a0a" stroke-width="1.5"/>
                    <rect x="40" y="72" width="20" height="12" rx="1" fill="#7f1d1d" stroke="#450a0a" stroke-width="1"/>
                    <line x1="42" y1="75" x2="58" y2="75" stroke="#450a0a" stroke-width="1"/>
                    <line x1="42" y1="78" x2="58" y2="78" stroke="#450a0a" stroke-width="1"/>
                    <line x1="42" y1="81" x2="58" y2="81" stroke="#450a0a" stroke-width="1"/>

                    <rect x="46" y="93" width="8" height="6" fill="#1f2937" />
                    <circle cx="50" cy="99" r="3" fill="#111" />

                    <circle cx="50" cy="18" r="5" fill="#f3f4f6" opacity="0.9"/>
                    <circle cx="48" cy="25" r="8" fill="#e5e7eb" opacity="0.7"/>
                    <circle cx="54" cy="35" r="12" fill="#d1d5db" opacity="0.5"/>
                    <circle cx="45" cy="40" r="16" fill="#9ca3af" opacity="0.3"/>
                    <circle cx="60" cy="55" r="20" fill="#d1d5db" opacity="0.15"/>
                </g>
            </svg>
`,
            'helicopter': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <g transform="scale(0.8) translate(12.5, 12.5)">
                        <!-- Corps de l'hélicoptère -->
                        <rect x="35" y="20" width="30" height="50" rx="15" ry="15" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
                        <!-- Queue -->
                        <rect x="47" y="65" width="6" height="25" fill="#ef4444" stroke="#b91c1c" stroke-width="1"/>
                        <circle cx="50" cy="85" r="4" fill="#9ca3af"/>
                        <!-- Patins -->
                        <line x1="25" y1="30" x2="25" y2="70" stroke="#4b5563" stroke-width="3" stroke-linecap="round"/>
                        <line x1="75" y1="30" x2="75" y2="70" stroke="#4b5563" stroke-width="3" stroke-linecap="round"/>
                        <line x1="25" y1="50" x2="35" y2="50" stroke="#4b5563" stroke-width="2"/>
                        <line x1="75" y1="50" x2="65" y2="50" stroke="#4b5563" stroke-width="2"/>
                        <!-- Cockpit -->
                        <ellipse cx="50" cy="35" rx="10" ry="8" fill="#38bdf8" stroke="#0284c7" stroke-width="1"/>
                        <!-- Pales animées -->
                        <g>
                            <line x1="10" y1="50" x2="90" y2="50" stroke="#1f2937" stroke-width="4" stroke-linecap="round"/>
                            <line x1="50" y1="10" x2="50" y2="90" stroke="#1f2937" stroke-width="4" stroke-linecap="round"/>
                            <circle cx="50" cy="50" r="5" fill="#9ca3af" stroke="#4b5563" stroke-width="1"/>
                            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="0.3s" repeatCount="indefinite" />
                        </g>
                    </g>
                </svg>`,
            'default': `
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <rect x="15" y="20" width="70" height="70" rx="30" ry="30" fill="#ffffff" stroke="#3b82f6" stroke-width="3"/>
                    <circle cx="28" cy="15" r="10" fill="white" stroke="#3b82f6" stroke-width="2"/>
                    <circle cx="72" cy="15" r="10" fill="white" stroke="#3b82f6" stroke-width="2"/>
                    <circle cx="28" cy="12" r="3" fill="#1e293b"/>
                    <circle cx="72" cy="12" r="3" fill="#1e293b"/>
                    <circle cx="50" cy="35" r="7" fill="#f97316"/>
                    <circle cx="50" cy="65" r="7" fill="#f97316"/>
                    <circle cx="32" cy="50" r="7" fill="#f97316"/>
                    <circle cx="68" cy="50" r="7" fill="#f97316"/>
                    <circle cx="50" cy="50" r="8" fill="#10b981"/>
                    <circle cx="35" cy="75" r="6" fill="#3b82f6"/>
                    <circle cx="65" cy="75" r="6" fill="#3b82f6"/>
                </svg>`,
            'thymio': `
                <svg viewBox="5 5 90 90" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="violetGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="greyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>

    <style>
        .obey-light {
            animation: obey-pulse 2s ease-in-out infinite alternate;
            filter: url(#violetGlow);
        }
        @keyframes obey-pulse {
            0% { opacity: 1; }
            100% { opacity: 0.3; }
        }
    </style>

    <rect x="13" y="42" width="6" height="32" rx="3" fill="#1c1917" />
    <rect x="81" y="42" width="6" height="32" rx="3" fill="#1c1917" />

    <path d="M 16 88 L 16 35 Q 50 5 84 35 L 84 88 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />

    <rect x="24.95" y="27.6" width="2.5" height="1.5" fill="#1c1917" transform="rotate(-31.7 26.2 28.35)" />
    <rect x="36.85" y="22.05" width="2.5" height="1.5" fill="#1c1917" transform="rotate(-17.1 38.1 22.8)" />
    <rect x="48.75" y="20.25" width="2.5" height="1.5" fill="#1c1917" />
    <rect x="60.65" y="22.05" width="2.5" height="1.5" fill="#1c1917" transform="rotate(17.1 61.9 22.8)" />
    <rect x="72.55" y="27.6" width="2.5" height="1.5" fill="#1c1917" transform="rotate(31.7 73.8 28.35)" />

    <rect x="33.75" y="86.5" width="2.5" height="1.5" fill="#1c1917" />
    <rect x="63.75" y="86.5" width="2.5" height="1.5" fill="#1c1917" />

    <g fill="#94a3b8" stroke="#94a3b8" stroke-width="1.5" filter="url(#greyGlow)">
        <polygon points="50,28 46,33 54,33" fill="#94a3b8" stroke="none" />
        <polygon points="50,52 46,47 54,47" fill="#94a3b8" stroke="none" />
        <polygon points="38,40 43,36 43,44" fill="#94a3b8" stroke="none" />
        <polygon points="62,40 57,36 57,44" fill="#94a3b8" stroke="none" />
        <circle cx="50" cy="40" r="16" fill="none" stroke="#fbbf24" stroke-width="2.5" />
    </g>

    <g>
        <circle cx="50" cy="75" r="5" fill="#1c1917" />
        <g fill="#9333ea" class="obey-light">
            <circle cx="40" cy="75" r="3" />
            <circle cx="60" cy="75" r="3" />
        </g>
    </g>
</svg>`,
            'beebot': `
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <rect x="15" y="20" width="70" height="70" rx="30" ry="30" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
                    <rect x="20" y="30" width="60" height="8" fill="#1e293b"/>
                    <rect x="15" y="48" width="70" height="8" fill="#1e293b"/>
                    <rect x="17" y="66" width="66" height="8" fill="#1e293b"/>
                    <circle cx="28" cy="15" r="10" fill="white" stroke="#ca8a04" stroke-width="2"/>
                    <circle cx="72" cy="15" r="10" fill="white" stroke="#ca8a04" stroke-width="2"/>
                    <circle cx="28" cy="12" r="4" fill="#1e293b"/>
                    <circle cx="72" cy="12" r="4" fill="#1e293b"/>
                    <path d="M 28 5 Q 20 -5 10 5" stroke="#1e293b" stroke-width="2" fill="none"/>
                    <circle cx="10" cy="5" r="2" fill="#1e293b"/>
                    <path d="M 72 5 Q 80 -5 90 5" stroke="#1e293b" stroke-width="2" fill="none"/>
                    <circle cx="90" cy="5" r="2" fill="#1e293b"/>
                </svg>`,
            'space': `
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <!-- Rocket body -->
                    <path d="M 50 10 Q 80 30 80 70 L 20 70 Q 20 30 50 10 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/>
                    <!-- Window / Eye -->
                    <circle cx="50" cy="40" r="15" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
                    <circle cx="55" cy="35" r="4" fill="white" opacity="0.7"/>

                    <!-- Fins -->
                    <path d="M 20 70 L 5 90 L 25 80 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
                    <path d="M 80 70 L 95 90 L 75 80 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>

                    <!-- Flames (CSS animated later if possible, but basic SVG here) -->
                    <path class="rocket-flame" d="M 35 70 Q 50 100 65 70 Q 50 85 35 70 Z" fill="#f97316"/>
                    <path class="rocket-flame-inner" d="M 42 70 Q 50 90 58 70 Q 50 80 42 70 Z" fill="#fef08a"/>
                </svg>`,
            'volcano': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <style>
        .wing-l { transform-origin: 40px 50px; animation: flapL 0.7s ease-in-out infinite alternate; }
        .wing-r { transform-origin: 60px 50px; animation: flapR 0.7s ease-in-out infinite alternate; }
        .fire { transform-origin: 50px 0px; animation: spit 0.15s ease-in-out infinite alternate; }
        .tail { transform-origin: 50px 80px; animation: swish 1.5s ease-in-out infinite alternate; }

        @keyframes flapL { 0% { transform: rotate(5deg) scaleY(1); } 100% { transform: rotate(-20deg) scaleY(0.85); } }
        @keyframes flapR { 0% { transform: rotate(-5deg) scaleY(1); } 100% { transform: rotate(20deg) scaleY(0.85); } }
        @keyframes spit { 0% { transform: scaleY(1) scaleX(0.9); opacity: 0.8; } 100% { transform: scaleY(1.3) scaleX(1.1); opacity: 1; } }
        @keyframes swish { 0% { transform: rotate(-12deg); } 100% { transform: rotate(12deg); } }
    </style>
    <g transform="scale(1.4) translate(-14, -14)">
        <g class="tail">
            <path d="M 45 75 Q 50 135 50 155 Q 50 135 55 75 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="1.5"/>
            <polygon points="50,155 40,140 60,140" fill="#f97316" filter="url(#glow)"/>
            <polygon points="50,115 45,100 55,100" fill="#ea580c"/>
        </g>
        <g class="wing-l">
            <!-- Scaled up wings -->
            <g transform="scale(1.5) translate(-13, -15)">
                <path d="M 40 45 C 5 20 -20 40 0 65 C 10 55 20 70 25 58 C 30 68 35 60 40 60 Z" fill="#dc2626" stroke="#fca5a5" stroke-width="1.5" stroke-opacity="0.7"/>
                <path d="M 40 45 Q 15 30 0 65 M 40 45 Q 20 45 25 58 M 40 45 Q 30 55 35 60" fill="none" stroke="#7f1d1d" stroke-width="2.5"/>
            </g>
        </g>
        <g class="wing-r">
            <!-- Scaled up wings -->
            <g transform="scale(1.5) translate(-20, -15)">
                <path d="M 60 45 C 95 20 120 40 100 65 C 90 55 80 70 75 58 C 70 68 65 60 60 60 Z" fill="#dc2626" stroke="#fca5a5" stroke-width="1.5" stroke-opacity="0.7"/>
                <path d="M 60 45 Q 85 30 100 65 M 60 45 Q 80 45 75 58 M 60 45 Q 70 55 65 60" fill="none" stroke="#7f1d1d" stroke-width="2.5"/>
            </g>
        </g>
        <path d="M 50 22 C 68 28 72 60 50 82 C 28 60 32 28 50 22 Z" fill="#991b1b" stroke="#991b1b" stroke-width="2"/>
        <path d="M 50 32 C 57 45 56 60 50 72 C 44 60 43 45 50 32 Z" fill="url(#lava)" filter="url(#glow)"/>
        <path d="M 40 26 C 40 8 46 3 50 -2 C 54 3 60 8 60 26 Z" fill="#ea580c" stroke="#7f1d1d" stroke-width="1.5"/>
        <path d="M 40 20 Q 25 8 20 25 Q 32 18 40 23" fill="#991b1b" stroke="#f97316" stroke-width="1"/>
        <path d="M 60 20 Q 75 8 80 25 Q 68 18 60 23" fill="#991b1b" stroke="#f97316" stroke-width="1"/>
        <polygon points="44,10 49,13 43,16" fill="#fef08a" filter="url(#glow)"/>
        <polygon points="56,10 51,13 57,16" fill="#fef08a" filter="url(#glow)"/>
    </g>
</svg>`,
            'cyberbot': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <g transform="scale(0.85) translate(8, 8)">
                        <!-- ===== COUCHE GLITCH : 3 copies RGB décalées ===== -->

                        <!-- Rose fluo (décalée gauche) -->
                        <use href="#cyber-arrow" fill="#FF10F0" opacity="0.85" filter="url(#cyber-neon)">
                            <animateTransform attributeName="transform" type="translate"
                            values="-2,0; 1,-1; -3,1; 0,0; -2,0" dur="0.4s" repeatCount="indefinite"/>
                        </use>

                        <!-- Vert Matrix (décalée droite) -->
                        <use href="#cyber-arrow" fill="#00FF41" opacity="0.85" filter="url(#cyber-neon)">
                            <animateTransform attributeName="transform" type="translate"
                            values="2,0; -1,1; 3,-1; 0,0; 2,0" dur="0.35s" repeatCount="indefinite"/>
                        </use>

                        <!-- Cyan (couche centrale qui saute) -->
                        <use href="#cyber-arrow" fill="#00FFFF" opacity="0.5" filter="url(#cyber-neon)">
                            <animateTransform attributeName="transform" type="translate"
                            values="0,0; 0,0; 4,-2; 0,0; -3,2; 0,0" dur="0.8s" repeatCount="indefinite"/>
                            <animate attributeName="opacity"
                            values="0.5;0.2;0.8;0.1;0.5" dur="0.6s" repeatCount="indefinite"/>
                        </use>

                        <!-- Contour net vert qui pulse -->
                        <use href="#cyber-arrow" fill="none" stroke="#00FF41" stroke-width="0.4">
                            <animate attributeName="stroke"
                            values="#00FF41;#FF10F0;#00FFFF;#00FF41" dur="1.5s" repeatCount="indefinite"/>
                        </use>

                        <!-- ===== BANDES DE SCANLINES QUI GLITCH ===== -->
                        <g opacity="0.7">
                            <rect x="0" y="20" width="100" height="1.5" fill="#FF10F0">
                            <animate attributeName="y" values="10;45;25;80;15;60" dur="0.9s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0;0.9;0;0.7;0" dur="0.9s" repeatCount="indefinite"/>
                            </rect>
                            <rect x="0" y="60" width="100" height="0.8" fill="#00FF41">
                            <animate attributeName="y" values="70;30;85;20;55" dur="1.1s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.8;0;0.6;0;0.8" dur="1.1s" repeatCount="indefinite"/>
                            </rect>
                        </g>

                        <!-- ===== BLOCS DE CORRUPTION ===== -->
                        <rect x="0" y="45" width="100" height="3" fill="#FF10F0" opacity="0">
                            <animate attributeName="opacity" values="0;0;0.4;0;0;0" dur="2s" repeatCount="indefinite"/>
                            <animate attributeName="y" values="45;45;48;45;45;45" dur="2s" repeatCount="indefinite"/>
                        </rect>
                    </g>
                </svg>`,
            'botanique': `
                <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="50" cy="50" rx="35" ry="40" fill="#ef4444" stroke="#b91c1c" stroke-width="3"/>
                    <path d="M 50 10 L 50 90" stroke="#1e293b" stroke-width="3"/>
                    <path d="M 25 30 C 50 10 75 30 75 30" fill="none" stroke="#1e293b" stroke-width="4"/>
                    <circle cx="30" cy="45" r="6" fill="#1e293b"/>
                    <circle cx="70" cy="45" r="6" fill="#1e293b"/>
                    <circle cx="40" cy="70" r="5" fill="#1e293b"/>
                    <circle cx="60" cy="70" r="5" fill="#1e293b"/>
                    <circle cx="25" cy="60" r="4" fill="#1e293b"/>
                    <circle cx="75" cy="60" r="4" fill="#1e293b"/>
                    <!-- Head -->
                    <circle cx="50" cy="15" r="12" fill="#1e293b"/>
                    <!-- Antennae -->
                    <path d="M 45 10 C 40 0 30 5 30 5" fill="none" stroke="#1e293b" stroke-width="2"/>
                    <path d="M 55 10 C 60 0 70 5 70 5" fill="none" stroke="#1e293b" stroke-width="2"/>
                </svg>`
        };

