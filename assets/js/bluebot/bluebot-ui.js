let commandsVisible = true;

        function toggleCommands() {
            playSound('click');
            commandsVisible = !commandsVisible;

            const iconEyeOff = document.getElementById('icon-eye-off');
            const iconEye = document.getElementById('icon-eye');
            const toggleText = document.getElementById('hideCmdToggleText');
            const toggleBtn = document.getElementById('hideCmdToggleBtn');

            const simProgram = document.getElementById('sim-program');

            if (commandsVisible) {
                if (iconEyeOff) iconEyeOff.style.display = 'block';
                if (iconEye) iconEye.style.display = 'none';
                if (toggleText) toggleText.textContent = 'Masquer commandes';
                if (toggleBtn) toggleBtn.title = 'Masquer les commandes';
                if (simProgram) simProgram.classList.remove('masked');
            } else {
                if (iconEyeOff) iconEyeOff.style.display = 'none';
                if (iconEye) iconEye.style.display = 'block';
                if (toggleText) toggleText.textContent = 'Afficher commandes';
                if (toggleBtn) toggleBtn.title = 'Afficher les commandes';
                if (simProgram) simProgram.classList.add('masked');
            }
        }

        function toggleSpeed() {
            playSound('click');
            const iconSpd1 = document.getElementById('icon-speed-1x');
            const iconSpd2 = document.getElementById('icon-speed-2x');
            if (currentSpeed === 900) {
                currentSpeed = 400;
                if (iconSpd1) iconSpd1.style.display = 'none';
                if (iconSpd2) iconSpd2.style.display = 'block';
                if (document.getElementById('speedToggleText')) document.getElementById('speedToggleText').textContent = 'Vitesse Rapide';
            } else {
                currentSpeed = 900;
                if (iconSpd1) iconSpd1.style.display = 'block';
                if (iconSpd2) iconSpd2.style.display = 'none';
                if (document.getElementById('speedToggleText')) document.getElementById('speedToggleText').textContent = 'Vitesse Normale';
            }
        }

        document.addEventListener('keydown', (e) => {
            if (!['simulator', 'challenge', 'read', 'draw'].includes(activeTab)) return;

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
            } else {
                if (simState.running) return;
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

        let activeTab = 'simulator';

        function switchTab(event, tab) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            event.target.classList.add('active');
            document.getElementById(`view-${tab}`).classList.add('active');
            activeTab = tab;
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

        const gridColsSlider = document.getElementById('gridColsSlider');
        const gridRowsSlider = document.getElementById('gridRowsSlider');
        const gridSizeValue = document.getElementById('gridSizeValue');

        function initApplication() {
            // Restore active state
            activeMat = localStorage.getItem('bb_active_mat') || 'none';
            activeSkin = localStorage.getItem('bb_active_skin') || 'default';
            if (!MAT_CONFIG[activeMat]) activeMat = 'none';
            generateMatContent(activeMat);

            // Initial button update
            const tg = SKIN_CONFIG[activeSkin]?.target;
            const tgtBtn = document.getElementById('btn-target-icon');
            if (tgtBtn) {
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
            const ob = SKIN_CONFIG[activeSkin]?.obstacle;
            const obsBtn = document.getElementById('btn-obstacle-icon');
            if (obsBtn) {
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

            // Update UI/Grid
            updateGridSizeSlidersState();
            buildGrid('sim-grid', GRID_ROWS, GRID_COLS);
            randomizeSimulatorPosition();
            updateCustomMatUI();

            // Additional initializations
            ScoreManager.init('simulateur_bluebot');
            updateExtremeVisibility();

            if (activeSkin === 'pirate') startOceanRipples();
        }

        document.getElementById('btn-open-mats').addEventListener('click', openMatsModal);
        document.getElementById('btn-close-mats').addEventListener('click', closeMatsModal);
        document.getElementById('mats-drawer-overlay').addEventListener('click', closeMatsModal);
        document.getElementById('btn-remove-mat').addEventListener('click', () => selectMat('none'));
        document.getElementById('mats-list-container').addEventListener('click', (e) => {
            const item = e.target.closest('.skin-list-item');
            const matId = item?.dataset.mat;
            if (matId) selectMat(matId);
        });
        document.getElementById('btn-open-skins').addEventListener('click', openSkinsModal);
        document.getElementById('btn-close-skins').addEventListener('click', closeSkinsModal);
        document.getElementById('skins-drawer-overlay').addEventListener('click', closeSkinsModal);
        document.getElementById('speedToggleBtn').addEventListener('click', toggleSpeed);
        document.getElementById('hideCmdToggleBtn').addEventListener('click', toggleCommands);

        document.getElementById('tab-simulator').addEventListener('click', (e) => switchTab(e, 'simulator'));
        document.getElementById('tab-challenge').addEventListener('click', (e) => switchTab(e, 'challenge'));
        document.getElementById('tab-read').addEventListener('click', (e) => switchTab(e, 'read'));
        document.getElementById('tab-draw').addEventListener('click', (e) => switchTab(e, 'draw'));

        document.getElementById('diff-easy').addEventListener('click', () => setDifficulty('easy'));
        document.getElementById('diff-medium').addEventListener('click', () => setDifficulty('medium'));
        document.getElementById('diff-hard').addEventListener('click', () => setDifficulty('hard'));
        document.getElementById('diff-extreme').addEventListener('click', () => setDifficulty('extreme'));

        document.getElementById('btnNextChallenge').addEventListener('click', newChallenge);

        document.getElementById('btnReset').addEventListener('click', randomizeSimulatorPosition);

        const btnClearEnd = document.getElementById('btn-clear-end');
        if (btnClearEnd) {
            btnClearEnd.addEventListener('click', () => {
                const endContent = document.getElementById('sim-end-content');
                const emptyEnd = document.getElementById('sim-end-empty');
                if (endContent) {
                    Array.from(endContent.querySelectorAll('.end-item')).forEach(el => el.remove());
                }
                if (emptyEnd) emptyEnd.style.display = 'block';
            });
        }

        document.getElementById('btn-place-elements').addEventListener('click', () => {
            placeRandomSimTarget();
            randomizeSimWalls();
        });
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

        document.getElementById('sim-program').addEventListener('click', (e) => {
            const cmdEl = e.target.closest('.program-cmd');
            if (cmdEl) removeSpecificCmd(parseInt(cmdEl.dataset.index));
        });

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
        document.getElementById('btnNextRead').addEventListener('click', newReadChallenge);
        document.getElementById('btnNextDraw').addEventListener('click', newDrawChallenge);

        // Draw Command Pad
        document.getElementById('draw-pad-fwd').addEventListener('click', () => addDrawCommand('forward'));
        document.getElementById('draw-pad-bwd').addEventListener('click', () => addDrawCommand('backward'));
        document.getElementById('draw-pad-left').addEventListener('click', () => addDrawCommand('left'));
        document.getElementById('draw-pad-right').addEventListener('click', () => addDrawCommand('right'));
        document.getElementById('draw-pad-go').addEventListener('click', runDrawProgram);
        document.getElementById('draw-pad-clear').addEventListener('click', () => {
            if (drawState.locked || drawState.isAnimating) return;
            drawState.program = [];
            playSound('click');
            renderDrawProgram();
        });

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
        document.getElementById('pad-clear').addEventListener('click', clearProgram);

        const matOpacitySlider = document.getElementById('matOpacitySlider');
        const matOpacityValue = document.getElementById('matOpacityValue');
        let savedOpacity = localStorage.getItem('bb_mat_opacity');
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
                localStorage.setItem('bb_mat_opacity', val);
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
                generateMatContent(activeMat);
                buildGrid('sim-grid', GRID_ROWS, GRID_COLS);
                randomizeSimulatorPosition();
                if (activeTab === 'challenge') newChallenge();
                else if (activeTab === 'read') newReadChallenge();
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
                        localStorage.setItem('bb_custom_mat_image', dataUrl);
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
                if (localStorage.getItem('bb_custom_mat_image')) {
                    titleEl.textContent = "Télécharger une nouvelle image";
                } else {
                    titleEl.textContent = "Ajouter un tapis personnalisé";
                }
            }
        }

        // Restore custom mat on load if exists
        const savedCustomMat = localStorage.getItem('bb_custom_mat_image');
        if (savedCustomMat) {
            document.documentElement.style.setProperty('--custom-mat-url', `url(${savedCustomMat})`);
        }
        updateCustomMatUI();

