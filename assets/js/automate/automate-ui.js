/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

window.treasureBubbleState = { active: false, timer: null, removeTimer: null, hasPlaced: false, text: 'Clique-moi pour ajouter un trésor et des obstacles', wrapper: null, textDiv: null };

function handleTreasureBubbleClick(e) {
    e.stopPropagation();
    window.treasureBubbleState.text = "Clique sur le bouton ci-dessous";
    if (window.treasureBubbleState.removeTimer) clearTimeout(window.treasureBubbleState.removeTimer);

    if (window.treasureBubbleState.textDiv) {
        window.treasureBubbleState.textDiv.textContent = window.treasureBubbleState.text;
    }

    window.treasureBubbleState.removeTimer = setTimeout(() => {
        window.treasureBubbleState.active = false;
        if (window.treasureBubbleState.wrapper) {
            window.treasureBubbleState.wrapper.remove();
            window.treasureBubbleState.wrapper = null;
            window.treasureBubbleState.textDiv = null;
        }
    }, 5000);
}

function triggerTreasureBubble(tab) {
    if (window.treasureBubbleState.hasPlaced) return;
    if (activeTab !== 'explore' && activeTab !== 'simulator') return;

    window.treasureBubbleState.active = true;
    window.treasureBubbleState.text = 'Clique-moi pour ajouter un trésor et des obstacles';

    const btnId = tab === 'explore' ? 'btn-explore-place-elements' : 'btn-place-elements';
    const btn = document.getElementById(btnId);

    if (btn) {
        btn.style.position = 'relative';
        if (window.treasureBubbleState.wrapper) {
            window.treasureBubbleState.wrapper.remove();
            window.treasureBubbleState.wrapper = null;
            window.treasureBubbleState.textDiv = null;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'treasure-speech-bubble-wrapper';
        wrapper.style.position = 'absolute';
        wrapper.style.top = '0';
        wrapper.style.left = '50%';
        wrapper.style.width = '0';
        wrapper.style.height = '0';
        wrapper.style.overflow = 'visible';
        wrapper.style.zIndex = '1000';

        const bubble = document.createElement('div');
        bubble.className = 'treasure-speech-bubble';
        bubble.style.position = 'absolute';
        bubble.style.bottom = 'calc(100% + 10px)';
        bubble.style.left = '50%';
        bubble.style.transform = 'translate(-50%, 0)';
        bubble.onclick = handleTreasureBubbleClick;

        const textDiv = document.createElement('div');
        textDiv.className = 'treasure-speech-bubble-text';
        textDiv.textContent = window.treasureBubbleState.text;

        bubble.appendChild(textDiv);
        wrapper.appendChild(bubble);
        btn.appendChild(wrapper);

        window.treasureBubbleState.wrapper = wrapper;
        window.treasureBubbleState.textDiv = textDiv;

        if (window.treasureBubbleState.removeTimer) clearTimeout(window.treasureBubbleState.removeTimer);
        window.treasureBubbleState.removeTimer = setTimeout(() => {
            window.treasureBubbleState.active = false;
            if (window.treasureBubbleState.wrapper) {
                window.treasureBubbleState.wrapper.remove();
                window.treasureBubbleState.wrapper = null;
                window.treasureBubbleState.textDiv = null;
            }
        }, 5000);
    }
}

let commandsVisible = true;
window.commandsVisible = commandsVisible;

function toggleCommands() {
    playSound('click');
    commandsVisible = !commandsVisible;

    const iconEyeOff = document.getElementById('icon-eye-off');
    const iconEye = document.getElementById('icon-eye');
    const toggleText = document.getElementById('hideCmdToggleText');
    const toggleBtn = document.getElementById('hide-cmd-toggle-btn');

    const simProgram = document.getElementById('sim-program');

    window.commandsVisible = commandsVisible;
    if (window.simState && window.simState.program && window.simState.program.length > 0) {
        window.simState.blindRunAborted = true;
    }

    if (commandsVisible) {
        // Commandes visibles => On propose de les masquer => icône barrée (eye-slash)
        if (iconEyeOff) iconEyeOff.style.display = 'block';
        if (iconEye) iconEye.style.display = 'none';
        if (toggleText) toggleText.textContent = 'Masquer commandes';
        if (toggleBtn) toggleBtn.setAttribute('title', 'Masquer les commandes');
        if (simProgram) simProgram.classList.remove('masked');
    } else {
        // Commandes masquées => On propose de les afficher => icône normale (eye)
        if (iconEyeOff) iconEyeOff.style.display = 'none';
        if (iconEye) iconEye.style.display = 'block';
        if (toggleText) toggleText.textContent = 'Afficher commandes';
        if (toggleBtn) toggleBtn.setAttribute('title', 'Afficher les commandes');
        if (simProgram) simProgram.classList.add('masked');
    }
}

function toggleSpeed() {
    playSound('click');
    window.setSpeedLevel(currentSpeed === 900 ? 2 : 1);
}

window.setSpeedLevel = function (level) {
    const iconSpd1 = document.getElementById('icon-speed-1x');
    const iconSpd2 = document.getElementById('icon-speed-2x');
    const simSpeedBtn = document.getElementById('btn-sim-toggle-speed');
    const chalSpeedBtn = document.getElementById('btn-chal-toggle-speed');
    const drawSpeedBtn = document.getElementById('btn-draw-toggle-speed');
    const readSpeedBtn = document.getElementById('btn-read-toggle-speed');

    if (level === 2) {
        currentSpeed = 400;
        // Si on est en rapide, on propose de passer en lent, donc icône lent
        if (iconSpd1) iconSpd1.style.display = 'block';
        if (iconSpd2) iconSpd2.style.display = 'none';
        if (document.getElementById('speedToggleText')) document.getElementById('speedToggleText').textContent = 'Lent';

        const setSpeedBtnIcon = (btn) => {
            if (btn) {
                btn.setAttribute('title', 'Vitesse : Lent');
                btn.setAttribute('data-tooltip', 'Vitesse : Lent');
                btn['innerHTML'] = '<i data-fa="turtle"></i>';
                window.fa?.createIcons?.(btn);
            }
        };
        setSpeedBtnIcon(simSpeedBtn);
        [chalSpeedBtn, drawSpeedBtn, readSpeedBtn].forEach(setSpeedBtnIcon);
    } else {
        currentSpeed = 900;
        // Si on est en lent, on propose de passer en rapide, donc icône rapide
        if (iconSpd1) iconSpd1.style.display = 'none';
        if (iconSpd2) iconSpd2.style.display = 'block';
        if (document.getElementById('speedToggleText')) document.getElementById('speedToggleText').textContent = 'Rapide';

        const setSpeedBtnIcon = (btn) => {
            if (btn) {
                btn.setAttribute('title', 'Vitesse : Rapide');
                btn.setAttribute('data-tooltip', 'Vitesse : Rapide');
                btn['innerHTML'] = '<i data-fa="rabbit-running"></i>';
                window.fa?.createIcons?.(btn);
            }
        };
        setSpeedBtnIcon(simSpeedBtn);
        [chalSpeedBtn, drawSpeedBtn, readSpeedBtn].forEach(setSpeedBtnIcon);
    }
};

window.getCurrentSpeed = function () {
    return currentSpeed;
};

document.addEventListener('keydown', (e) => {
    if (!['explore', 'simulator', 'challenge', 'read', 'draw'].includes(activeTab)) return;

    if (e.key === 'Tab') {
        if (activeTab === 'explore' || activeTab === 'simulator') {
            const exploreBtn = document.getElementById('btn-explore-edit-mode');
            const simBtn = document.getElementById('btn-sim-edit-mode');
            if (exploreBtn && !exploreBtn.classList.contains('keyboard-visible')) {
                exploreBtn.classList.add('keyboard-visible');
                simBtn?.classList.add('keyboard-visible');
                if (!window.keyboardEditMode) {
                    window.keyboardEditMode = true;
                    exploreBtn.classList.add('active');
                    simBtn?.classList.add('active');
                    playSound('click');
                    showToast('Mode édition clavier activé (flèches pour naviguer, O/T pour éditer)', 'info');
                }
            }
        }
    }

    if (activeTab === 'draw') {
        if (drawState.isAnimating || drawState.locked) return;
        switch (e.key) {
            case 'ArrowUp': e.preventDefault(); addDrawCommand('forward'); break;
            case 'ArrowDown': e.preventDefault(); addDrawCommand('backward'); break;
            case 'ArrowLeft': e.preventDefault(); addDrawCommand('left'); break;
            case 'ArrowRight': e.preventDefault(); addDrawCommand('right'); break;
            case 'Backspace':
                e.preventDefault();
                if (drawState.program.length > 0) {
                    drawState.program.pop();
                    playSound('click');
                    renderDrawProgram();
                }
                break;
            case 'Enter':
                e.preventDefault();
                runDrawProgram();
                break;
        }
    } else if (activeTab === 'explore') {
        if (exploreState.running || window.keyboardEditMode) return;
        switch (e.key) {
            case 'ArrowUp': e.preventDefault(); runSingleCommandExploration('forward'); break;
            case 'ArrowDown': e.preventDefault(); runSingleCommandExploration('backward'); break;
            case 'ArrowLeft': e.preventDefault(); runSingleCommandExploration('left'); break;
            case 'ArrowRight': e.preventDefault(); runSingleCommandExploration('right'); break;
        }
    } else {
        if (simState.running || window.keyboardEditMode) return;
        switch (e.key) {
            case 'ArrowUp': e.preventDefault(); addCmd('forward'); break;
            case 'ArrowDown': e.preventDefault(); addCmd('backward'); break;
            case 'ArrowLeft': e.preventDefault(); addCmd('left'); break;
            case 'ArrowRight': e.preventDefault(); addCmd('right'); break;
            case 'Backspace':
                e.preventDefault();
                if (simState.program.length > 0) {
                    removeSpecificCmd(simState.program.length - 1);
                }
                break;
            case 'Enter':
                e.preventDefault();
                runProgram();
                break;
        }
    }
});


let tabTimer = null;
const popupsShown = { explore: false, simulator: false };

function showTimePopup(tab) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('noNudges') === '1') return;

    let popup = document.getElementById('time-popup');
    if (!popup) {
        const popupHtml = `
                    <div id="time-popup" class="ui-modal-overlay z-top" aria-hidden="true" role="dialog">
                        <div class="ui-modal-content ui-modal-prompt">
                            <h2 id="time-popup-title"></h2>
                            <p id="time-popup-msg"></p>
                            <div class="ui-modal-prompt-actions">
                                <button id="btn-time-popup-yes" class="btn btn-new"></button>
                                <button id="btn-time-popup-no" class="btn btn-outline-error"></button>
                            </div>
                        </div>
                    </div>
                `;
        document.body.insertAdjacentHTML('beforeend', popupHtml);
        popup = document.getElementById('time-popup');
    }

    const titleEl = document.getElementById('time-popup-title');
    const msgEl = document.getElementById('time-popup-msg');
    const btnYes = document.getElementById('btn-time-popup-yes');
    const btnNo = document.getElementById('btn-time-popup-no');

    // Clone to remove old listeners
    const newBtnYes = btnYes.cloneNode(true);
    btnYes.parentNode.replaceChild(newBtnYes, btnYes);
    const newBtnNo = btnNo.cloneNode(true);
    btnNo.parentNode.replaceChild(newBtnNo, btnNo);

    if (tab === 'explore') {
        titleEl.textContent = "Mode Simulateur";
        msgEl.textContent = "Tu explores depuis un moment ! Veux-tu essayer le mode Simulateur pour programmer plusieurs actions d'un coup ?";
        newBtnYes.textContent = "Oui, allons-y !";
        newBtnNo.textContent = "Non, je reste ici";

        newBtnYes.addEventListener('click', () => {
            popupsShown.explore = true;
            popup.classList.remove('active');
            popup.setAttribute('aria-hidden', 'true');
            document.getElementById('tab-simulator').click();
        });
        newBtnNo.addEventListener('click', () => {
            popupsShown.explore = true;
            popup.classList.remove('active');
            popup.setAttribute('aria-hidden', 'true');
        });
    } else if (tab === 'simulator') {
        titleEl.textContent = "Défi sans commande";
        msgEl.textContent = "Tu maîtrises bien le simulateur ! Veux-tu essayer le 'Défi sans commande' pour coder de tête sans les voir ?";
        newBtnYes.textContent = "Oui, je relève le défi !";
        newBtnNo.textContent = "Non, pas encore";

        newBtnYes.addEventListener('click', () => {
            popupsShown.simulator = true;
            popup.classList.remove('active');
            popup.setAttribute('aria-hidden', 'true');
            if (window.commandsVisible) toggleCommands();
        });
        newBtnNo.addEventListener('click', () => {
            popupsShown.simulator = true;
            popup.classList.remove('active');
            popup.setAttribute('aria-hidden', 'true');
        });
    }

    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
}

function startTabTimer(tab) {
    if (tabTimer) {
        clearTimeout(tabTimer);
        tabTimer = null;
    }
    if (tab === 'explore' && !popupsShown.explore) {
        tabTimer = setTimeout(() => showTimePopup('explore'), 240000);
    } else if (tab === 'simulator' && !popupsShown.simulator) {
        tabTimer = setTimeout(() => showTimePopup('simulator'), 360000);
    }
}

let activeTab = 'explore';
window.activeTab = activeTab;

function switchTab(event, tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.getElementById(`view-${tab}`).classList.add('active');
    activeTab = tab;
    window.activeTab = tab;
    startTabTimer(tab);

    if (window.treasureBubbleState) {
        if (window.treasureBubbleState.timer) clearTimeout(window.treasureBubbleState.timer);
        if (window.treasureBubbleState.removeTimer) clearTimeout(window.treasureBubbleState.removeTimer);
        if (window.treasureBubbleState.wrapper) {
            window.treasureBubbleState.wrapper.remove();
            window.treasureBubbleState.wrapper = null;
            window.treasureBubbleState.textDiv = null;
        }
        window.treasureBubbleState.active = false;

        if (!window.treasureBubbleState.hasPlaced && (tab === 'explore' || tab === 'simulator')) {
            window.treasureBubbleState.timer = setTimeout(() => {
                triggerTreasureBubble(tab);
            }, 60000);
        }
    }
    if (tab === 'explore') {
        if (!document.getElementById('explore-grid').innerHTML) {
            buildGrid('explore-grid', GRID_ROWS, GRID_COLS, []);
            renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);
            TrailManager.clear('explore-grid');
        }
    }
    if (tab === 'challenge') newChallenge();
    if (tab === 'read') newReadChallenge();
    if (tab === 'draw') newDrawChallenge();
}


/* ================================================================
   LOGIQUE GLOBALE
   ================================================================ */




/* ================================================================
   SVG TRAIL MANAGER
   ================================================================ */
/* ================================================================
   CONFETTI
   ================================================================ */

const gridColsSlider = document.getElementById('grid-cols-slider');
const gridRowsSlider = document.getElementById('grid-rows-slider');
const gridSizeValue = document.getElementById('grid-size-value');

function rebuildAllGrids() {
    if (typeof buildGrid !== 'function') return;
    buildGrid('sim-grid', GRID_ROWS, GRID_COLS, simState.obstacles);
    if (typeof renderRobot === 'function') renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
    if (typeof TrailManager !== 'undefined') TrailManager.clear('sim-grid');

    if (typeof exploreState !== 'undefined' && exploreState.robotRow !== undefined && exploreState.robotRow !== null) {
        buildGrid('explore-grid', GRID_ROWS, GRID_COLS, exploreState.obstacles || []);
        if (typeof renderRobot === 'function') renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);
        if (typeof TrailManager !== 'undefined') TrailManager.clear('explore-grid');
    }

    if (typeof chalState !== 'undefined' && chalState.robotRow !== null) {
        buildGrid('chal-grid', GRID_ROWS, GRID_COLS, chalState.obstacles || []);
        if (typeof renderRobot === 'function') renderRobot('chal-grid', 'chal-robot', chalState.robotRow, chalState.robotCol, chalState.robotDir);
        if (typeof TrailManager !== 'undefined') TrailManager.clear('chal-grid');
    }

    if (typeof readState !== 'undefined' && readState.robotRow !== undefined && readState.robotRow !== null) {
        buildGrid('read-grid', GRID_ROWS, GRID_COLS, readState.obstacles || []);
        if (typeof renderRobot === 'function') renderRobot('read-grid', 'read-robot', readState.robotRow, readState.robotCol, readState.robotDir);
        if (typeof TrailManager !== 'undefined') TrailManager.clear('read-grid');
    }

    if (typeof drawState !== 'undefined' && drawState.robotRow !== undefined && drawState.robotRow !== null) {
        buildGrid('draw-grid', GRID_ROWS, GRID_COLS, []);
        if (typeof renderRobot === 'function') renderRobot('draw-grid', 'draw-robot', drawState.robotRow, drawState.robotCol, drawState.robotDir);
        if (typeof TrailManager !== 'undefined') TrailManager.clear('draw-grid');
    }
}

function initApplication() {
    const spellBtn = document.getElementById('btn-toggle-spell-mode');
    const memoryBtn = document.getElementById('btn-toggle-memory-mode');

    function toggleMode(mode) {
        playSound('click');
        const endContainer = document.getElementById('sim-end-container');
        const header = document.getElementById('sim-end-header');
        
        if (mode === 'spell') {
            if (typeof spellMode !== 'undefined' && spellMode) {
                spellMode = false;
                if (endContainer) {
                    endContainer.style.display = 'none';
                    endContainer.classList.remove('manually-toggled');
                }
                if (spellBtn) spellBtn.classList.remove('btn-success');
            } else {
                spellMode = true;
                memoryMode = false;
                collectMode = false;
                if (endContainer) {
                    endContainer.style.display = 'block';
                    endContainer.classList.add('manually-toggled');
                }
                if (header) header.textContent = 'Mot épelé :';
                if (spellBtn) spellBtn.classList.add('btn-success');
                if (memoryBtn) memoryBtn.classList.remove('btn-success');
            }
        } else if (mode === 'memory') {
            if (typeof memoryMode !== 'undefined' && memoryMode) {
                memoryMode = false;
                if (endContainer) {
                    endContainer.style.display = 'none';
                    endContainer.classList.remove('manually-toggled');
                }
                if (memoryBtn) memoryBtn.classList.remove('btn-success');
            } else {
                memoryMode = true;
                spellMode = false;
                collectMode = true;
                if (endContainer) {
                    endContainer.style.display = 'block';
                    endContainer.classList.add('manually-toggled');
                }
                const totalPairs = Math.floor((MAT_CONFIG[activeMat]?.content?.length || 0) / 2);
                if (header) header.textContent = `Paires trouvées : ${memoryPairsFound || 0}/${totalPairs}`; // Updated by game logic
                if (memoryBtn) memoryBtn.classList.add('btn-success');
                if (spellBtn) spellBtn.classList.remove('btn-success');
            }
        }
        
        localStorage.setItem('at_memory_mode', memoryMode);
        localStorage.setItem('at_spell_mode', spellMode);
        localStorage.setItem('at_collect_mode', collectMode);
        
        if (typeof generateMatContent === 'function') generateMatContent(activeMat);
        rebuildAllGrids();

        const endContent = document.getElementById('sim-end-content');
        if (endContent) {
            endContent.querySelectorAll('.end-item').forEach(el => el.remove());
            const emptyEnd = document.getElementById('sim-end-empty');
            if (emptyEnd) emptyEnd.style.display = 'block';
        }
    }

    if (spellBtn) spellBtn.addEventListener('click', () => toggleMode('spell'));
    if (memoryBtn) memoryBtn.addEventListener('click', () => toggleMode('memory'));

    // Restore active state
    activeMat = localStorage.getItem('at_active_mat') || 'none';
    activeSkin = localStorage.getItem('at_active_skin') || 'default';
    if (!MAT_CONFIG[activeMat]) activeMat = 'none';
    
    // Initialize end modes
    const endContainer = document.getElementById('sim-end-container');
    const header = document.getElementById('sim-end-header');
    if (typeof spellMode !== 'undefined' && spellMode) {
        if (spellBtn) spellBtn.classList.add('btn-success');
        if (endContainer) {
            endContainer.style.display = 'block';
            endContainer.classList.add('manually-toggled');
        }
        if (header) header.textContent = 'Mot épelé :';
    } else if (typeof memoryMode !== 'undefined' && memoryMode) {
        if (memoryBtn) memoryBtn.classList.add('btn-success');
        if (endContainer) {
            endContainer.style.display = 'block';
            endContainer.classList.add('manually-toggled');
        }
        const totalPairs = Math.floor((MAT_CONFIG[activeMat]?.content?.length || 0) / 2);
        if (header) header.textContent = `Paires trouvées : ${typeof memoryPairsFound !== 'undefined' ? memoryPairsFound : 0}/${totalPairs}`;
    }
    
    generateMatContent(activeMat);
    const tg = SKIN_CONFIG[activeSkin]?.target;
    const tgtBtn = document.getElementById('btn-target-icon');
    if (tgtBtn) {
        if (tg && tg.includes('<svg')) {
            tgtBtn['innerHTML'] = tg;
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
    const ob = SKIN_CONFIG[activeSkin]?.obstacle;
    const obsBtn = document.getElementById('btn-obstacle-icon');
    if (obsBtn) {
        if (ob && (ob.includes('<svg') || ob.includes('<i'))) {
            obsBtn['innerHTML'] = ob;
            window.fa?.createIcons?.();
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

    // Update UI/Grid
    updateGridSizeSlidersState();
    if (typeof updateEndModesVisibility === 'function') updateEndModesVisibility();
    
    if (window.hasSharedGrid) {
        buildGrid('sim-grid', GRID_ROWS, GRID_COLS, simState.obstacles);
        renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
        if (simState.targetRow !== null && simState.targetCol !== null) {
            renderTarget('sim-grid', 'sim-target', simState.targetRow, simState.targetCol);
        }
        
        buildGrid('explore-grid', GRID_ROWS, GRID_COLS, exploreState.obstacles);
        renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);
        if (exploreState.targetRow !== null && exploreState.targetCol !== null) {
            renderTarget('explore-grid', 'explore-target', exploreState.targetRow, exploreState.targetCol);
        }
    } else {
        buildGrid('sim-grid', GRID_ROWS, GRID_COLS);
        randomizeSimulatorPosition();
        buildGrid('explore-grid', GRID_ROWS, GRID_COLS);
        randomizeExplorePosition();
    }
    updateCustomMatUI();

    // Additional initializations
    ScoreManager.init('simulateur_automate');
    startTabTimer(activeTab);
    updateExtremeVisibility();

    // Set initial speech bubble 1-minute timer on load if not already scheduled
    if (window.treasureBubbleState && !window.treasureBubbleState.hasPlaced) {
        if (!window.treasureBubbleState.timer && (activeTab === 'explore' || activeTab === 'simulator')) {
            const tabAtLoad = activeTab;
            window.treasureBubbleState.timer = setTimeout(() => {
                triggerTreasureBubble(tabAtLoad);
            }, 60000);
        }
    }

    if (activeSkin === 'pirate' || activeSkin === 'manta') startOceanRipples();

    if (window.cmdsHiddenByDefault && commandsVisible && !window.forceBlindcode) {
        toggleCommands();
    }

    // Apply force blindcode if parameter is set
    if (window.forceBlindcode) {
        const toggleBtn = document.getElementById('hide-cmd-toggle-btn');
        if (toggleBtn) toggleBtn.style.display = 'none';
        if (commandsVisible) toggleCommands(); // trigger hiding if currently visible
    }

    // Onboarding éphémère mode Exploration (first-time hint)
    showExploreOnboardingHint();
}

function showExploreOnboardingHint() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('noNudges') === '1') return;
    if (localStorage.getItem('automate_explore_seen_hint')) return;

    const EXPLORE_PAD_IDS = ['explore-pad-fwd', 'explore-pad-bwd', 'explore-pad-left', 'explore-pad-right'];
    let hintTimer;

    // Annule la bulle si l'enfant clique avant le délai de 3 s
    const cancelHint = () => {
        clearTimeout(hintTimer);
        localStorage.setItem('automate_explore_seen_hint', '1');
        EXPLORE_PAD_IDS.forEach(id =>
            document.getElementById(id)?.removeEventListener('click', cancelHint)
        );
    };
    EXPLORE_PAD_IDS.forEach(id =>
        document.getElementById(id)?.addEventListener('click', cancelHint, { once: true })
    );

    // Déclenche la bulle après 3 secondes si aucune interaction
    hintTimer = setTimeout(() => {
        EXPLORE_PAD_IDS.forEach(id =>
            document.getElementById(id)?.removeEventListener('click', cancelHint)
        );
        if (localStorage.getItem('automate_explore_seen_hint')) return;

        const fwdBtn = document.getElementById('explore-pad-fwd');
        if (!fwdBtn) return;

        localStorage.setItem('automate_explore_seen_hint', '1');

        const hint = document.createElement('div');
        hint.className = 'explore-onboarding-hint';

        const icon = document.createElement('i');
        icon.setAttribute('data-fa', 'hand-pointer');
        hint.appendChild(icon);
        hint.appendChild(document.createTextNode(' Appuie pour avancer !'));

        fwdBtn.style.position = 'relative';
        fwdBtn.appendChild(hint);
        window.fa?.createIcons?.();

        const removeHint = () => {
            if (!hint.parentNode) return;
            hint.style.opacity = '0';
            setTimeout(() => hint.remove(), 300);
            EXPLORE_PAD_IDS.forEach(id =>
                document.getElementById(id)?.removeEventListener('click', removeOnClick)
            );
        };
        const removeOnClick = () => removeHint();

        // Disparaît au premier clic sur le pad ou après 5 secondes
        EXPLORE_PAD_IDS.forEach(id =>
            document.getElementById(id)?.addEventListener('click', removeOnClick, { once: true })
        );
        setTimeout(removeHint, 5000);
    }, 3000);
}

document.getElementById('btn-open-mats').addEventListener('click', openMatsModal);
document.getElementById('btn-close-mats').addEventListener('click', closeMatsModal);
document.getElementById('mats-drawer-overlay').addEventListener('click', closeMatsModal);
document.getElementById('btn-remove-mat').addEventListener('click', () => selectMat('none'));

const toggleHideGrid = document.getElementById('toggle-hide-grid');
const handleHideGridClick = () => {
    if (toggleHideGrid) toggleHideGrid.click();
};
const btnExploreHideGrid = document.getElementById('btn-explore-hide-grid');
if (btnExploreHideGrid) btnExploreHideGrid.addEventListener('click', handleHideGridClick);
const btnSimHideGrid = document.getElementById('btn-sim-hide-grid');
if (btnSimHideGrid) btnSimHideGrid.addEventListener('click', handleHideGridClick);
document.getElementById('mats-list-container').addEventListener('click', (e) => {
    const item = e.target.closest('.skin-list-item');
    const matId = item?.dataset.mat;
    if (matId) selectMat(matId);
});
document.getElementById('btn-open-skins').addEventListener('click', openSkinsModal);
const btnExploreCycleMat = document.getElementById('btn-explore-cycle-mat');
if (btnExploreCycleMat) btnExploreCycleMat.addEventListener('click', cycleMat);
const btnSimCycleMat = document.getElementById('btn-sim-cycle-mat');
if (btnSimCycleMat) btnSimCycleMat.addEventListener('click', cycleMat);

document.getElementById('btn-close-skins').addEventListener('click', closeSkinsModal);
document.getElementById('ui-panel-overlay').addEventListener('click', closeSkinsModal);
document.getElementById('speed-toggle-btn').addEventListener('click', toggleSpeed);
document.getElementById('hide-cmd-toggle-btn').addEventListener('click', toggleCommands);

const btnSimToggleSpeed = document.getElementById('btn-sim-toggle-speed');
if (btnSimToggleSpeed) btnSimToggleSpeed.addEventListener('click', toggleSpeed);


const btnChalToggleSpeed = document.getElementById('btn-chal-toggle-speed');
if (btnChalToggleSpeed) btnChalToggleSpeed.addEventListener('click', toggleSpeed);
const btnDrawToggleSpeed = document.getElementById('btn-draw-toggle-speed');
if (btnDrawToggleSpeed) btnDrawToggleSpeed.addEventListener('click', toggleSpeed);
const btnReadToggleSpeed = document.getElementById('btn-read-toggle-speed');
if (btnReadToggleSpeed) btnReadToggleSpeed.addEventListener('click', toggleSpeed);

const btnChalHideGrid = document.getElementById('btn-chal-hide-grid');
if (btnChalHideGrid) btnChalHideGrid.addEventListener('click', handleHideGridClick);
const btnDrawHideGrid = document.getElementById('btn-draw-hide-grid');
if (btnDrawHideGrid) btnDrawHideGrid.addEventListener('click', handleHideGridClick);
const btnReadHideGrid = document.getElementById('btn-read-hide-grid');
if (btnReadHideGrid) btnReadHideGrid.addEventListener('click', handleHideGridClick);

const btnChalCycleMat = document.getElementById('btn-chal-cycle-mat');
if (btnChalCycleMat) btnChalCycleMat.addEventListener('click', cycleMat);
const btnDrawCycleMat = document.getElementById('btn-draw-cycle-mat');
if (btnDrawCycleMat) btnDrawCycleMat.addEventListener('click', cycleMat);
const btnReadCycleMat = document.getElementById('btn-read-cycle-mat');
if (btnReadCycleMat) btnReadCycleMat.addEventListener('click', cycleMat);

document.getElementById('tab-explore').addEventListener('click', (e) => switchTab(e, 'explore'));
document.getElementById('tab-simulator').addEventListener('click', (e) => switchTab(e, 'simulator'));
document.getElementById('tab-challenge').addEventListener('click', (e) => switchTab(e, 'challenge'));
document.getElementById('tab-read').addEventListener('click', (e) => switchTab(e, 'read'));
document.getElementById('tab-draw').addEventListener('click', (e) => switchTab(e, 'draw'));

document.getElementById('diff-easy').addEventListener('click', () => setDifficulty('easy'));
document.getElementById('diff-medium').addEventListener('click', () => setDifficulty('medium'));
document.getElementById('diff-hard').addEventListener('click', () => setDifficulty('hard'));
document.getElementById('diff-extreme').addEventListener('click', () => setDifficulty('extreme'));

document.getElementById('btn-next-challenge').addEventListener('click', newChallenge);

document.getElementById('btn-sim-random-position').addEventListener('click', () => {
    window.hasSharedGrid = false;
    randomizeSimulatorPosition();
});

window.keyboardEditMode = false;
function toggleKeyboardEditMode() {
    window.keyboardEditMode = !window.keyboardEditMode;
    playSound('click');
    
    const exploreBtn = document.getElementById('btn-explore-edit-mode');
    const simBtn = document.getElementById('btn-sim-edit-mode');
    
    if (window.keyboardEditMode) {
        exploreBtn?.classList.add('active');
        simBtn?.classList.add('active');
        showToast('Mode édition clavier activé (flèches pour naviguer, O/T pour éditer)', 'info');
    } else {
        exploreBtn?.classList.remove('active');
        simBtn?.classList.remove('active');
        showToast('Mode édition clavier désactivé (flèches pour déplacer l\'automate)', 'info');
    }
}
const btnExploreEditMode = document.getElementById('btn-explore-edit-mode');
if (btnExploreEditMode) btnExploreEditMode.addEventListener('click', toggleKeyboardEditMode);
const btnSimEditMode = document.getElementById('btn-sim-edit-mode');
if (btnSimEditMode) btnSimEditMode.addEventListener('click', toggleKeyboardEditMode);

document.getElementById('btn-explore-reset').addEventListener('click', () => {
    window.hasSharedGrid = false;
    randomizeExplorePosition();
});
document.getElementById('btn-explore-place-elements').addEventListener('click', () => {
    if (window.treasureBubbleState) {
        window.treasureBubbleState.hasPlaced = true;
        if (window.treasureBubbleState.timer) clearTimeout(window.treasureBubbleState.timer);
        if (window.treasureBubbleState.removeTimer) clearTimeout(window.treasureBubbleState.removeTimer);
        if (window.treasureBubbleState.wrapper) {
            window.treasureBubbleState.wrapper.remove();
            window.treasureBubbleState.wrapper = null;
            window.treasureBubbleState.textDiv = null;
        }
        window.treasureBubbleState.active = false;
    }
    placeRandomExploreTarget();
    randomizeExploreWalls();
});
document.getElementById('btn-explore-clear-walls').addEventListener('click', clearExploreWalls);

document.getElementById('explore-pad-fwd').addEventListener('click', () => runSingleCommandExploration('forward'));
document.getElementById('explore-pad-bwd').addEventListener('click', () => runSingleCommandExploration('backward'));
document.getElementById('explore-pad-left').addEventListener('click', () => runSingleCommandExploration('left'));
document.getElementById('explore-pad-right').addEventListener('click', () => runSingleCommandExploration('right'));

const btnClearEnd = document.getElementById('btn-clear-end');
if (btnClearEnd) {
    btnClearEnd.addEventListener('click', () => {
        const endContent = document.getElementById('sim-end-content');
        const emptyEnd = document.getElementById('sim-end-empty');
        if (endContent) {
            endContent.querySelectorAll('.end-item').forEach(el => el.remove());
        }
        if (emptyEnd) emptyEnd.style.display = 'block';
        
        if (typeof memoryPairsFound !== 'undefined') memoryPairsFound = 0;
        const header = document.getElementById('sim-end-header');
        if (header && typeof memoryMode !== 'undefined' && memoryMode) {
            const totalPairs = Math.floor((MAT_CONFIG[activeMat]?.content?.length || 0) / 2);
            header.textContent = `Paires trouvées : 0/${totalPairs}`;
        }
        
        if (typeof generateMatContent === 'function') generateMatContent(activeMat);
        if (typeof rebuildAllGrids === 'function') rebuildAllGrids();
    });
}

document.getElementById('btn-place-elements').addEventListener('click', () => {
    if (window.treasureBubbleState) {
        window.treasureBubbleState.hasPlaced = true;
        if (window.treasureBubbleState.timer) clearTimeout(window.treasureBubbleState.timer);
        if (window.treasureBubbleState.removeTimer) clearTimeout(window.treasureBubbleState.removeTimer);
        if (window.treasureBubbleState.wrapper) {
            window.treasureBubbleState.wrapper.remove();
            window.treasureBubbleState.wrapper = null;
            window.treasureBubbleState.textDiv = null;
        }
        window.treasureBubbleState.active = false;
    }
    placeRandomSimTarget();
    randomizeSimWalls();
});
const btnToggleEndContainer = document.getElementById('btn-toggle-end-container');
if (btnToggleEndContainer) {
    btnToggleEndContainer.addEventListener('click', () => {
        playSound('click');
        const endContainer = document.getElementById('sim-end-container');
        if (endContainer) {
            if (endContainer.style.display === 'none' || endContainer.style.display === '') {
                endContainer.style.display = 'block';
                endContainer.classList.add('manually-toggled');
            } else {
                endContainer.style.display = 'none';
                endContainer.classList.remove('manually-toggled');
            }
        }
    });
}
document.getElementById('btn-clear-walls').addEventListener('click', clearSimWalls);



document.getElementById('sim-grid').addEventListener('dragover', (e) => { e.preventDefault(); });
document.getElementById('sim-grid').addEventListener('drop', (e) => {
    e.preventDefault();
    const cell = e.target.closest('.bot-cell');
    if (!cell || simState.running) return;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    const isSimObstacle = simState.obstacles && simState.obstacles.some(o => o.r === r && o.c === c);
    if (isSimObstacle) return;
    const isSimTarget = simState.targetRow === r && simState.targetCol === c;
    playSound('click');
    simState.robotRow = r; simState.robotCol = c;
    simState.startRow = r; simState.startCol = c;
    simState.startDir = simState.robotDir;
    resetSimulatorPosition();
    if (isSimTarget) {
        showToast('Trésor récupéré manuellement. Ne compte pas pour le score.', 'warn');
        placeRandomSimTarget(true);
    }
});

document.getElementById('explore-grid').addEventListener('dragover', (e) => { e.preventDefault(); });
document.getElementById('explore-grid').addEventListener('drop', (e) => {
    e.preventDefault();
    const cell = e.target.closest('.bot-cell');
    if (!cell || exploreState.running) return;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    const isExploreObstacle = exploreState.obstacles && exploreState.obstacles.some(o => o.r === r && o.c === c);
    if (isExploreObstacle) return;
    const isExploreTarget = exploreState.targetRow === r && exploreState.targetCol === c;
    playSound('click');
    exploreState.robotRow = r; exploreState.robotCol = c;
    exploreState.startRow = r; exploreState.startCol = c;
    exploreState.absoluteStartRow = r; exploreState.absoluteStartCol = c; exploreState.absoluteStartDir = exploreState.robotDir;
    exploreState.startDir = exploreState.robotDir;
    exploreState.history = [];
    exploreState.stepsThisRun = 0;

    TrailManager.clear('explore-grid');
    renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);

    if (isExploreTarget) {
        showToast('Trésor récupéré manuellement. Ne compte pas pour le score.', 'warn');
        placeRandomExploreTarget(true);
    }
});

document.getElementById('sim-program').addEventListener('click', (e) => {
    const cmdEl = e.target.closest('.program-cmd');
    if (cmdEl) removeSpecificCmd(parseInt(cmdEl.dataset.index));
});

const simEndContent = document.getElementById('sim-end-content');
if (simEndContent) {
    simEndContent.addEventListener('click', (e) => {
        const endItemEl = e.target.closest('.end-item');
        if (endItemEl && spellMode) {
            endItemEl.remove();
            playSound('click');
            if (simEndContent.querySelectorAll('.end-item').length === 0) {
                const emptyEnd = document.getElementById('sim-end-empty');
                if (emptyEnd) emptyEnd.style.display = 'block';
            }
        }
    });
}

document.getElementById('chal-options').addEventListener('click', (e) => {
    const optEl = e.target.closest('.challenge-option');
    if (optEl) pickOption(parseInt(optEl.dataset.index));
});

document.getElementById('read-diff-easy').addEventListener('click', () => setReadDifficulty('easy'));
document.getElementById('read-diff-medium').addEventListener('click', () => setReadDifficulty('medium'));
document.getElementById('read-diff-hard').addEventListener('click', () => setReadDifficulty('hard'));
document.getElementById('read-diff-extreme').addEventListener('click', () => setReadDifficulty('extreme'));

document.getElementById('draw-diff-easy').addEventListener('click', () => setDrawDifficulty('easy'));
document.getElementById('draw-diff-medium').addEventListener('click', () => setDrawDifficulty('medium'));
document.getElementById('draw-diff-hard').addEventListener('click', () => setDrawDifficulty('hard'));
document.getElementById('draw-diff-extreme').addEventListener('click', () => setDrawDifficulty('extreme'));
document.getElementById('btn-next-read').addEventListener('click', newReadChallenge);
document.getElementById('btn-next-draw').addEventListener('click', newDrawChallenge);

// Draw Command Pad
document.getElementById('draw-pad-fwd').addEventListener('click', () => addDrawCommand('forward'));
document.getElementById('draw-pad-bwd').addEventListener('click', () => addDrawCommand('backward'));
document.getElementById('draw-pad-left').addEventListener('click', () => addDrawCommand('left'));
document.getElementById('draw-pad-right').addEventListener('click', () => addDrawCommand('right'));
document.getElementById('draw-pad-go').addEventListener('click', runDrawProgram);
document.getElementById('draw-pad-pause').addEventListener('click', pauseDrawProgram);
document.getElementById('draw-pad-clear').addEventListener('click', clearDrawProgram);

document.getElementById('read-grid').addEventListener('click', (e) => {
    const cell = e.target.closest('.bot-cell');
    if (cell) {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        handleReadGridClick(r, c);
    }
});

document.getElementById('skins-list-container').addEventListener('click', (e) => {
    const item = e.target.closest('.skin-list-item');
    const skinId = item?.dataset.skin;
    if (skinId) selectSkin(skinId);
});

['fwd', 'bwd', 'left', 'right'].forEach(cmd => {
    const id = 'pad-' + cmd;
    const fullCmd = cmd === 'fwd' ? 'forward' : (cmd === 'bwd' ? 'backward' : cmd);
    document.getElementById(id).addEventListener('click', () => addCmd(fullCmd));
});
document.getElementById('pad-go').addEventListener('click', runProgram);
document.getElementById('pad-pause').addEventListener('click', pauseProgram);
document.getElementById('pad-clear').addEventListener('click', clearProgram);

const matOpacitySlider = document.getElementById('mat-opacity-slider');
const matOpacityValue = document.getElementById('mat-opacity-value');
let savedOpacity = localStorage.getItem('at_mat_opacity');
if (savedOpacity) {
    document.documentElement.style.setProperty('--mat-opacity', savedOpacity);
    if (matOpacitySlider) {
        matOpacitySlider.value = savedOpacity;
        matOpacityValue.textContent = Math.round(savedOpacity * 100) + '%';
    }
}
if (matOpacitySlider) {
    matOpacitySlider.addEventListener('input', (e) => {
        const val = e.target.value;
        document.documentElement.style.setProperty('--mat-opacity', val);
        matOpacityValue.textContent = Math.round(val * 100) + '%';
        localStorage.setItem('at_mat_opacity', val);
    });
    matOpacitySlider.addEventListener('mousedown', () => {
        document.getElementById('mats-drawer').classList.add('slider-active-drawer', 'opacity-active');
        document.getElementById('mats-drawer-overlay').classList.add('slider-active-drawer');
    });
    matOpacitySlider.addEventListener('touchstart', () => {
        document.getElementById('mats-drawer').classList.add('slider-active-drawer', 'opacity-active');
        document.getElementById('mats-drawer-overlay').classList.add('slider-active-drawer');
    }, { passive: true });
}

let _gridSizeDebounce = null;
function onGridSizeChanged() {
    GRID_COLS = parseInt(gridColsSlider.value);
    GRID_ROWS = parseInt(gridRowsSlider.value);
    gridSizeValue.textContent = `${GRID_COLS}x${GRID_ROWS}`;
    clearTimeout(_gridSizeDebounce);
    _gridSizeDebounce = setTimeout(() => {
        simState.obstacles = [];
        simState.targetRow = null;
        simState.targetCol = null;
        exploreState.obstacles = [];
        exploreState.targetRow = null;
        exploreState.targetCol = null;
        generateMatContent(activeMat);
        buildGrid('sim-grid', GRID_ROWS, GRID_COLS);
        buildGrid('explore-grid', GRID_ROWS, GRID_COLS);
        randomizeSimulatorPosition();
        randomizeExplorePosition();
        if (activeTab === 'challenge') newChallenge();
        else if (activeTab === 'read') newReadChallenge();
        else if (activeTab === 'draw') newDrawChallenge();
    }, 200);
}

if (gridColsSlider && gridRowsSlider) {
    gridColsSlider.addEventListener('input', onGridSizeChanged);
    gridRowsSlider.addEventListener('input', onGridSizeChanged);

    [gridColsSlider, gridRowsSlider].forEach(slider => {
        slider.addEventListener('mousedown', () => {
            document.getElementById('mats-drawer').classList.add('slider-active-drawer', 'grid-size-active');
            document.getElementById('mats-drawer-overlay').classList.add('slider-active-drawer');
        });
        slider.addEventListener('touchstart', () => {
            document.getElementById('mats-drawer').classList.add('slider-active-drawer', 'grid-size-active');
            document.getElementById('mats-drawer-overlay').classList.add('slider-active-drawer');
        }, { passive: true });
    });
}

window.addEventListener('mouseup', () => {
    document.getElementById('mats-drawer')?.classList.remove('slider-active-drawer', 'opacity-active', 'grid-size-active');
    document.getElementById('mats-drawer-overlay')?.classList.remove('slider-active-drawer');
});
window.addEventListener('touchend', () => {
    document.getElementById('mats-drawer')?.classList.remove('slider-active-drawer', 'opacity-active', 'grid-size-active');
    document.getElementById('mats-drawer-overlay')?.classList.remove('slider-active-drawer');
}, { passive: true });

window.handleCustomMatUpload = function (e) {
    const customMatStatus = document.getElementById('customMatStatus');
    if (!customMatStatus) return;
    const file = e.target.files[0];
    if (!file) return;

    customMatStatus.textContent = "Chargement et optimisation...";

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const MAX_SIZE = 1024;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            try {
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                localStorage.setItem('at_custom_mat_image', dataUrl);
                document.documentElement.style.setProperty('--custom-mat-url', `url(${dataUrl})`);
                updateCustomMatUI();
                selectMat('custom');
                customMatStatus.textContent = "Image ajoutée avec succès !";
                customMatStatus.style.color = "var(--success)";
                setTimeout(() => { customMatStatus.textContent = ""; }, 3000);
            } catch (err) {
                console.error("Erreur lors de la sauvegarde de l'image (peut-être trop grande pour le localStorage) :", err);
                customMatStatus.textContent = "Erreur : image trop grande.";
                customMatStatus.style.color = "var(--error)";
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be selected again
    e.target.value = '';
};

const customMatUpload = document.getElementById('customMatUpload');
if (customMatUpload) {
    customMatUpload.addEventListener('change', window.handleCustomMatUpload);
}

function updateCustomMatUI() {
    const titleEl = document.getElementById('customMatTitle');
    if (titleEl) {
        if (localStorage.getItem('at_custom_mat_image')) {
            titleEl.textContent = "Télécharger une nouvelle image";
        } else {
            titleEl.textContent = "Ajouter un tapis personnalisé";
        }
    }
}

// Restore custom mat on load if exists
const savedCustomMat = localStorage.getItem('at_custom_mat_image');
if (savedCustomMat) {
    document.documentElement.style.setProperty('--custom-mat-url', `url(${savedCustomMat})`);
}
updateCustomMatUI();

// ==========================================
// ACCESSIBILITÉ CLAVIER DE LA GRILLE (A11Y)
// ==========================================
document.addEventListener('keydown', (e) => {
    const cell = e.target.closest('.bot-cell');
    if (!cell) return;

    const grid = cell.closest('.bot-grid');
    if (!grid) return;

    const gridId = grid.id;
    
    // Garde : Mode édition requis pour naviguer et éditer les grilles de simulateur / exploration
    if ((gridId === 'sim-grid' || gridId === 'explore-grid') && !window.keyboardEditMode) {
        return;
    }

    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);

    // Navigation entre les cellules avec les flèches du clavier
    let nextR = r;
    let nextC = c;
    let handled = false;

    if (e.key === 'ArrowUp') {
        nextR = Math.max(0, r - 1);
        handled = true;
    } else if (e.key === 'ArrowDown') {
        nextR = Math.min(GRID_ROWS - 1, r + 1);
        handled = true;
    } else if (e.key === 'ArrowLeft') {
        nextC = Math.max(0, c - 1);
        handled = true;
    } else if (e.key === 'ArrowRight') {
        nextC = Math.min(GRID_COLS - 1, c + 1);
        handled = true;
    }

    if (handled) {
        e.preventDefault();
        const nextCell = document.getElementById(`${gridId}-cell-${nextR}-${nextC}`);
        if (nextCell) {
            nextCell.focus();
        }
        return;
    }

    // Touches d'action principale : Entrée ou Espace
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (gridId === 'sim-grid') {
            if (simState.running) return;
            const isObstacle = simState.obstacles && simState.obstacles.some(o => o.r === r && o.c === c);
            if (isObstacle) return;
            const isTarget = simState.targetRow === r && simState.targetCol === c;
            playSound('click');
            window.keyboardModified = true;
            simState.robotRow = r; simState.robotCol = c;
            simState.startRow = r; simState.startCol = c;
            simState.startDir = simState.robotDir;
            resetSimulatorPosition();
            if (isTarget) {
                showToast('Trésor récupéré manuellement. Ne compte pas pour le score.', 'warn');
                placeRandomSimTarget(true);
            }
        } else if (gridId === 'explore-grid') {
            if (exploreState.running) return;
            const isObstacle = exploreState.obstacles && exploreState.obstacles.some(o => o.r === r && o.c === c);
            if (isObstacle) return;
            const isTarget = exploreState.targetRow === r && exploreState.targetCol === c;
            playSound('click');
            window.keyboardModified = true;
            exploreState.robotRow = r; exploreState.robotCol = c;
            exploreState.startRow = r; exploreState.startCol = c;
            exploreState.absoluteStartRow = r; exploreState.absoluteStartCol = c; exploreState.absoluteStartDir = exploreState.robotDir;
            exploreState.startDir = exploreState.robotDir;
            exploreState.history = [];
            exploreState.stepsThisRun = 0;

            TrailManager.clear('explore-grid');
            renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);

            if (isTarget) {
                showToast('Trésor récupéré manuellement. Ne compte pas pour le score.', 'warn');
                placeRandomExploreTarget(true);
            }
        } else if (gridId === 'read-grid') {
            handleReadGridClick(r, c);
        }
        return;
    }

    // Touche 'o' ou 'O' : ajoute ou retire un obstacle sur la cellule focalisée
    if (e.key.toLowerCase() === 'o') {
        if (gridId === 'sim-grid' || gridId === 'explore-grid') {
            e.preventDefault();
            window.keyboardModified = true;
            if (gridId === 'sim-grid') {
                if (simState.running) return;
                if (r === simState.robotRow && c === simState.robotCol) return;
                if (r === simState.targetRow && c === simState.targetCol) return;
                playSound('click');
                const idx = simState.obstacles.findIndex(o => o.r === r && o.c === c);
                if (idx !== -1) {
                    simState.obstacles.splice(idx, 1);
                } else {
                    simState.obstacles.push({ r, c });
                }
                buildGrid('sim-grid', GRID_ROWS, GRID_COLS, simState.obstacles);
                renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
                if (simState.targetRow !== null && simState.targetCol !== null) {
                    renderTarget('sim-grid', 'sim-target', simState.targetRow, simState.targetCol);
                }
            } else {
                if (exploreState.running) return;
                if (r === exploreState.robotRow && c === exploreState.robotCol) return;
                if (r === exploreState.targetRow && c === exploreState.targetCol) return;
                playSound('click');
                const idx = exploreState.obstacles.findIndex(o => o.r === r && o.c === c);
                if (idx !== -1) {
                    exploreState.obstacles.splice(idx, 1);
                } else {
                    exploreState.obstacles.push({ r, c });
                }
                buildGrid('explore-grid', GRID_ROWS, GRID_COLS, exploreState.obstacles);
                renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);
                if (exploreState.targetRow !== null && exploreState.targetCol !== null) {
                    renderTarget('explore-grid', 'explore-target', exploreState.targetRow, exploreState.targetCol);
                }
            }
            const newCell = document.getElementById(`${gridId}-cell-${r}-${c}`);
            if (newCell) newCell.focus();
        }
        return;
    }

    // Touche 't' ou 'T' : place la cible/trésor sur la cellule focalisée
    if (e.key.toLowerCase() === 't') {
        if (gridId === 'sim-grid' || gridId === 'explore-grid') {
            e.preventDefault();
            window.keyboardModified = true;
            if (gridId === 'sim-grid') {
                if (simState.running) return;
                if (r === simState.robotRow && c === simState.robotCol) return;
                const isObstacle = simState.obstacles.some(o => o.r === r && o.c === c);
                if (isObstacle) return;
                playSound('click');
                simState.targetRow = r;
                simState.targetCol = c;
                simState.firstAttempt = true;
                buildGrid('sim-grid', GRID_ROWS, GRID_COLS, simState.obstacles);
                renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
                renderTarget('sim-grid', 'sim-target', r, c);
            } else {
                if (exploreState.running) return;
                if (r === exploreState.robotRow && c === exploreState.robotCol) return;
                const isObstacle = exploreState.obstacles.some(o => o.r === r && o.c === c);
                if (isObstacle) return;
                playSound('click');
                exploreState.targetRow = r;
                exploreState.targetCol = c;
                buildGrid('explore-grid', GRID_ROWS, GRID_COLS, exploreState.obstacles);
                renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);
                renderTarget('explore-grid', 'explore-target', r, c);
            }
            const newCell = document.getElementById(`${gridId}-cell-${r}-${c}`);
            if (newCell) newCell.focus();
        }
        return;
    }

    // Touche 'r' ou 'R' : pivote l'automate dans le sens horaire
    if (e.key.toLowerCase() === 'r') {
        if (gridId === 'sim-grid' || gridId === 'explore-grid') {
            e.preventDefault();
            playSound('click');
            window.keyboardModified = true;
            if (gridId === 'sim-grid') {
                if (simState.running) return;
                simState.robotDir = (simState.robotDir + 1) % 4;
                simState.startDir = simState.robotDir;
                renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
            } else {
                if (exploreState.running) return;
                exploreState.robotDir = (exploreState.robotDir + 1) % 4;
                exploreState.startDir = exploreState.robotDir;
                exploreState.absoluteStartDir = exploreState.robotDir;
                renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);
            }
        }
        return;
    }
});
