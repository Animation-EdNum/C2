/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const createSVG = (tag) => document.createElementNS("http://www.w3.org/2000/svg", tag);

let GRID_ROWS = 6, GRID_COLS = 6;
let globalScore = 0, globalStreak = 0, globalStreakBest = 0, memoryPairsFound = 0, f1Streak = 0;
let simState = {
            program: [], robotRow: 5, robotCol: 0, robotDir: 0, startRow: 5, startCol: 0, startDir: 0,
            running: false, paused: false, stopped: false, stepIndex: -1, obstacles: [], failed: false, targetRow: null, targetCol: null, starCount: 0,
            firstTryCount: 0, firstAttempt: true, consecutiveMistakes: 0, deletedCommandsCount: 0
        };
        window.simState = simState;

        let exploreState = {
            robotRow: 5, robotCol: 0, robotDir: 0, startRow: 5, startCol: 0, startDir: 0,
            absoluteStartRow: 5, absoluteStartCol: 0, absoluteStartDir: 0,
            running: false, obstacles: [], failed: false, targetRow: null, targetCol: null, starCount: 0,
            firstTryCount: 0, firstAttempt: true, consecutiveMistakes: 0, history: [], stepsThisRun: 0
        };
        window.exploreState = exploreState;

        let chalState = {
            difficulty: 'easy', robotRow: 0, robotCol: 0, robotDir: 0, targetRow: 0, targetCol: 0,
            correctProgram: [], options: [], locked: false, obstacles: [], isAnimating: false
        };

        let readState = {
            difficulty: 'easy', robotRow: 0, robotCol: 0, robotDir: 0, targetRow: 0, targetCol: 0,
            program: [], obstacles: [], locked: false, isAnimating: false, type: 'destination', bugIndex: -1
        };
        let readGlobalScore = 0;
        let readGlobalStreak = 0, readGlobalStreakBest = 0;

        let drawState = {
            difficulty: 'easy', robotRow: 0, robotCol: 0, robotDir: 0, targetCells: [],
            program: [], locked: false, isAnimating: false, paused: false, stopped: false, mistakes: 0
        };
        let drawGlobalScore = 0;
        let drawGlobalStreak = 0, drawGlobalStreakBest = 0;

        let currentSpeed = 900;

        const TrailManager = {
            states: {},

            _getCenter(row, col) {
                // With viewBox = 0 0 (100*cols) (100*rows), each cell is exactly 100x100
                return { x: (col + 0.5) * 100, y: (row + 0.5) * 100 };
            },

            initLayer(containerId) {
                let layer = document.querySelector(`#${containerId} .trail-layer`);
                if (!layer) {
                    layer = createSVG("svg");
                    layer.setAttribute("class", "trail-layer");
                    layer.setAttribute("viewBox", `0 0 ${100 * GRID_COLS} ${100 * GRID_ROWS}`);
                    layer.setAttribute("preserveAspectRatio", "none");
                    layer.setAttribute("aria-hidden", "true");
                    document.getElementById(containerId).appendChild(layer);
                } else {
                    // Update viewBox in case grid size changed
                    layer.setAttribute("viewBox", `0 0 ${100 * GRID_COLS} ${100 * GRID_ROWS}`);
                }
                return layer;
            },

            captureInitialState(containerId, row, col, dirIndex) {
                const layer = this.initLayer(containerId);
                layer.innerHTML = ''; // Clear existing

                const pt = this._getCenter(row, col);
                const rot = dirIndex * 90;

                // Create path element
                const path = createSVG("path");
                path.setAttribute("class", "trail-path");
                const d = `M ${pt.x} ${pt.y} l 0.01 0.01`;
                path.setAttribute("d", d);
                layer.appendChild(path);

                // Draw start marker (cell size is now 100x100 in the new viewBox)
                const g = createSVG("g");
                g.setAttribute("class", "start-marker");

                const circle = createSVG("circle");
                circle.setAttribute("class", "start-marker-circle");
                circle.setAttribute("cx", pt.x);
                circle.setAttribute("cy", pt.y);
                circle.setAttribute("r", "18"); // scaled up from 3

                const chevron = createSVG("path");
                chevron.setAttribute("class", "start-marker-chevron");
                chevron.setAttribute("d", `M ${pt.x - 9} ${pt.y + 6} L ${pt.x} ${pt.y - 6} L ${pt.x + 9} ${pt.y + 6}`);
                chevron.setAttribute("transform", `rotate(${rot} ${pt.x} ${pt.y})`);

                g.appendChild(circle);
                g.appendChild(chevron);

                layer.appendChild(g);

                this.states[containerId] = {
                    points: [{ x: pt.x, y: pt.y }],
                    pathElement: path,
                    extraPaths: [],
                    dString: d
                };

                // Add extra layered paths for specific skins
                if (activeSkin === 'helicopter' || activeSkin === 'pedago') {
                    const shadowPath = createSVG("path");
                    shadowPath.setAttribute("class", "trail-path-helicopter-shadow");
                    shadowPath.setAttribute("d", d);
                    const heliPath = createSVG("path");
                    heliPath.setAttribute("class", "trail-path-helicopter");
                    heliPath.setAttribute("d", d);

                    // Insert before the main path
                    // Render shadow first so it is underneath heliPath
                    layer.insertBefore(heliPath, path);
                    layer.insertBefore(shadowPath, heliPath);

                    // Hide the default solid path
                    path.style.display = 'none';

                    this.states[containerId].extraPaths.push(shadowPath, heliPath);
                } else if (activeSkin === 'f1') {
                    const borderPath = createSVG("path");
                    borderPath.setAttribute("class", "trail-path-border");
                    borderPath.setAttribute("d", d);
                    const redPath = createSVG("path");
                    redPath.setAttribute("class", "trail-path-red");
                    redPath.setAttribute("d", d);

                    // Insert before the main path so they are underneath
                    layer.insertBefore(borderPath, path);
                    layer.insertBefore(redPath, borderPath);

                    this.states[containerId].extraPaths.push(redPath, borderPath);
                } else if (activeSkin === 'train') {
                    // Inject mask for double rail
                    let maskId = `rail-mask-${containerId}`;
                    let mask = layer.querySelector(`#${maskId}`);
                    let maskPath = layer.querySelector(`#${maskId} .rail-mask-path`);

                    if (!mask || !maskPath) {
                        // Clean up partial mask if it exists
                        if (mask) mask.remove();

                        let defs = layer.querySelector('defs');
                        if (!defs) {
                            defs = createSVG("defs");
                            layer.insertBefore(defs, layer.firstChild);
                        }

                        mask = createSVG("mask");
                        mask.setAttribute("id", maskId);
                        mask.setAttribute("maskUnits", "userSpaceOnUse");
                        let rect = createSVG("rect");
                        rect.setAttribute("width", "200%");
                        rect.setAttribute("height", "200%");
                        rect.setAttribute("x", "-50%");
                        rect.setAttribute("y", "-50%");
                        rect.setAttribute("fill", "white");

                        maskPath = createSVG("path");
                        maskPath.setAttribute("class", "rail-mask-path");
                        maskPath.setAttribute("stroke", "black");
                        maskPath.setAttribute("stroke-width", "16");
                        maskPath.setAttribute("fill", "none");
                        maskPath.setAttribute("stroke-linecap", "butt");
                        maskPath.setAttribute("stroke-linejoin", "round");

                        mask.appendChild(rect);
                        mask.appendChild(maskPath);
                        defs.appendChild(mask);
                    }

                    if (maskPath) maskPath.setAttribute("d", d);

                    const tiesPath = createSVG("path");
                    tiesPath.setAttribute("class", "trail-path-ties");
                    tiesPath.setAttribute("d", d);
                    const railBasePath = createSVG("path");
                    railBasePath.setAttribute("class", "trail-path-rail-base");
                    railBasePath.setAttribute("d", d);
                    railBasePath.setAttribute("mask", `url(#${maskId})`);

                    // We don't need railInnerPath anymore for the double rail effect

                    layer.insertBefore(tiesPath, path);
                    layer.insertBefore(railBasePath, path);

                    this.states[containerId].extraPaths.push(tiesPath, railBasePath, maskPath);
                }
            },

            addSegment(containerId, toRow, toCol) {
                const state = this.states[containerId];
                if (!state || !state.pathElement) return;

                const fromPt = state.points[state.points.length - 1];
                const pt = this._getCenter(toRow, toCol);
                state.points.push({ x: pt.x, y: pt.y });
                state.dString += ` L ${pt.x} ${pt.y}`;
                state.pathElement.setAttribute("d", state.dString);
                if (state.extraPaths) {
                    state.extraPaths.forEach(ep => ep.setAttribute("d", state.dString));
                }

                // Effets spéciaux de trace
                const layer = this.initLayer(containerId);

                if (activeSkin === 'cyberbot') {
                    // Trace Matrix (0 et 1)
                    for (let i = 0; i < 3; i++) {
                        const t = createSVG("text");
                        t.setAttribute("class", "trail-matrix-char");
                        const ox = (Math.random() - 0.5) * 40;
                        const oy = (Math.random() - 0.5) * 40;
                        t.setAttribute("x", pt.x + ox);
                        t.setAttribute("y", pt.y + oy);
                        t.textContent = Math.random() > 0.5 ? "1" : "0";
                        layer.appendChild(t);
                    }
                    const persistCount = 3 + Math.floor(Math.random() * 2); // 3 ou 4 chiffres
                    for (let i = 0; i < persistCount; i++) {
                        const p = createSVG("text");
                        p.setAttribute("class", "trail-matrix-persist");
                        const ox = (Math.random() - 0.5) * 50;
                        const oy = (Math.random() - 0.5) * 50;
                        p.setAttribute("x", pt.x + ox);
                        p.setAttribute("y", pt.y + oy);
                        p.textContent = Math.random() > 0.5 ? "1" : "0";
                        p.setAttribute("transform", `rotate(${(Math.random() - 0.5) * 20} ${pt.x + ox} ${pt.y + oy})`);
                        p.style.fontSize = `${36 + Math.random() * 18}px`; // Increased size
                        p.style.opacity = 0.5 + Math.random() * 0.5;
                        layer.appendChild(p);
                    }
                } else if (activeSkin === 'volcano') {
                    // Trace de feu (particules)
                    for (let i = 0; i < 6; i++) {
                        const c = createSVG("circle");
                        c.setAttribute("class", "trail-fire-particle");
                        c.setAttribute("cx", pt.x + (Math.random() - 0.5) * 16);
                        c.setAttribute("cy", pt.y + (Math.random() - 0.5) * 16);
                        c.setAttribute("r", 4 + Math.random() * 5);
                        c.setAttribute("fill", Math.random() > 0.5 ? "#f97316" : "#fef08a");
                        c.style.setProperty("--dx", `${(Math.random() - 0.5) * 36}px`);
                        c.style.setProperty("--dy", `${(Math.random() - 0.5) * 36}px`);
                        layer.appendChild(c);
                        setTimeout(() => c.remove(), 800);
                    }
                    // Coulée de lave persistante
                    if (fromPt) {
                        const seg = createSVG("line");
                        seg.setAttribute("class", "trail-lava-segment");
                        seg.setAttribute("x1", fromPt.x);
                        seg.setAttribute("y1", fromPt.y);
                        seg.setAttribute("x2", pt.x);
                        seg.setAttribute("y2", pt.y);
                        layer.insertBefore(seg, layer.firstChild); // en dessous des particules
                        setTimeout(() => { if (seg && seg.parentNode) seg.remove(); }, 5000);
                    }

                    // Braises incandescentes qui restent et pulsent
                    const emberCount = 2 + Math.floor(Math.random() * 2);
                    for (let i = 0; i < emberCount; i++) {
                        const e = createSVG("circle");
                        e.setAttribute("class", "trail-lava-ember");
                        e.setAttribute("cx", pt.x + (Math.random() - 0.5) * 24);
                        e.setAttribute("cy", pt.y + (Math.random() - 0.5) * 24);
                        e.setAttribute("r", 4 + Math.random() * 5);
                        e.style.animationDelay = `${Math.random() * 2}s`;
                        layer.appendChild(e);
                        setTimeout(() => { if (e && e.parentNode) e.remove(); }, 5000);
                    }
                } else if (activeSkin === 'botanique') {
                    // Trace Nature (Liane et feuilles)
                    const prevPt = state.points[state.points.length - 2] || fromPt;
                    const dx = pt.x - prevPt.x;
                    const dy = pt.y - prevPt.y;
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                    // Ajouter une feuille au milieu du segment
                    const midX = (prevPt.x + pt.x) / 2;
                    const midY = (prevPt.y + pt.y) / 2;

                    const leaf = createSVG("path");
                    leaf.setAttribute("d", "M 0 0 C 5 -10 15 -10 20 0 C 15 10 5 10 0 0 Z");
                    leaf.setAttribute("fill", "#65a30d");
                    leaf.setAttribute("stroke", "#3f6212");
                    leaf.setAttribute("stroke-width", "1");

                    // Alterner les côtés
                    const side = (state.points.length % 2 === 0) ? 45 : -45;
                    leaf.setAttribute("transform", `translate(${midX}, ${midY}) rotate(${angle + side}) scale(1.6)`); // Increased scale
                    layer.appendChild(leaf);

                    // Ajouter une feuille à la fin
                    const endLeaf = leaf.cloneNode(true);
                    endLeaf.setAttribute("transform", `translate(${pt.x}, ${pt.y}) rotate(${angle - side / 2}) scale(1.2)`); // Increased scale
                    layer.appendChild(endLeaf);
                }
            },

            clear(containerId) {
                const layer = document.querySelector(`#${containerId} .trail-layer`);
                if (layer) layer.innerHTML = '';
                delete this.states[containerId];
            },

            removeLastSegment(containerId) {
                const state = this.states[containerId];
                if (!state || state.points.length <= 1) return;

                state.points.pop();
                // Rebuild dString
                let newD = "";
                state.points.forEach((p, i) => {
                    newD += i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`;
                });
                state.dString = newD;
                state.pathElement.setAttribute("d", state.dString);
                if (state.extraPaths) {
                    state.extraPaths.forEach(ep => ep.setAttribute("d", state.dString));
                }
            }
        };

        /* ================================================================
           MOTEUR DU ROBOT (SIMULATEUR)
           ================================================================ */
        function addCmd(cmd) {
            if (simState.running) return;
            if (window.commandsVisible === true) {
                simState.blindRunAborted = true;
            }
            playSound('click');
            if (simState.program.length >= 24) { showToast('Mémoire pleine (24 commandes max)', 'error'); return; }
            simState.program.push(cmd); renderProgram();
        }

        async function runSingleCommandExploration(cmd) {
            if (exploreState.running) return;
            playSound('click'); 
            exploreState.running = true; 
            exploreState.failed = false; 

            // Track history for rendering or future needs (but NO SKIN UNLOCKS)
            if (!exploreState.history) exploreState.history = [];
            exploreState.history.push(cmd);
            if (!exploreState.stepsThisRun) exploreState.stepsThisRun = 0;

            exploreState.startRow = exploreState.robotRow; 
            exploreState.startCol = exploreState.robotCol; 
            exploreState.startDir = exploreState.robotDir;

            if (!TrailManager.states['explore-grid']) {
                TrailManager.captureInitialState('explore-grid', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);
            }

            const result = moveRobot(exploreState, cmd);
            exploreState.robotRow = result.robotRow; 
            exploreState.robotCol = result.robotCol; 
            exploreState.robotDir = result.robotDir;

            if (!result.blocked && (cmd === 'forward' || cmd === 'backward')) exploreState.stepsThisRun++;

            renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);

            if (result.blocked) {
                playSound('error');
                exploreState.failed = true;
                exploreState.firstAttempt = false;
                exploreState.consecutiveMistakes++;

                document.getElementById('explore-robot').classList.add('shake');
                setTimeout(() => document.getElementById('explore-robot').classList.remove('shake'), 350);
                document.body.classList.add('window-shake');
                setTimeout(() => document.body.classList.remove('window-shake'), 500);
                showToast('Attention ! Obstacle en vue. Exécution stoppée.', 'error');
            } else {
                if (cmd === 'forward' || cmd === 'backward') {
                    await sleep(350);
                    TrailManager.addSegment('explore-grid', exploreState.robotRow, exploreState.robotCol);
                } else {
                    await sleep(150);
                }
            }

            // Update global total steps (but we don't unlock skins here)
            if (exploreState.stepsThisRun > 0 && (cmd === 'forward' || cmd === 'backward') && !result.blocked) {
                const totalSteps = (parseInt(localStorage.getItem('at_total_steps') || '0')) + 1;
                localStorage.setItem('at_total_steps', totalSteps);
            }

            if (!exploreState.failed && exploreState.targetRow !== null && exploreState.robotRow === exploreState.targetRow && exploreState.robotCol === exploreState.targetCol) {
                playSound('success');
                if (activeSkin === 'cyberbot') showToast('WELCOME TO THE MATRIX 🕶️', 'success');
                else handleStreakCelebration(1, false, false); // Explore has no streak, celebrate lightly

                exploreState.starCount++;
                exploreState.firstTryCount += exploreState.firstAttempt ? 1 : 0;
                exploreState.consecutiveMistakes = 0;

                showToast('Trésor trouvé ! Félicitations !', 'success');
                
                const counterVal = document.getElementById('sim-star-counter-val');
                if (counterVal) counterVal.textContent = exploreState.starCount;
                const firstTryVal = document.getElementById('sim-first-try-val');
                if (firstTryVal) firstTryVal.textContent = exploreState.firstTryCount;

                const target = document.getElementById('explore-target');
                if (target) {
                    target.classList.add('pulse');
                    setTimeout(() => {
                        target.classList.remove('pulse');
                        target.remove();
                        exploreState.targetRow = null;
                        exploreState.targetCol = null;
                        exploreState.firstAttempt = true;
                        exploreState.history = [];
                        exploreState.absoluteStartRow = exploreState.robotRow;
                        exploreState.absoluteStartCol = exploreState.robotCol;
                        exploreState.absoluteStartDir = exploreState.robotDir;
                        exploreState.stepsThisRun = 0;
                        placeRandomExploreTarget(true);
                    }, 500);
                }
            }
            
            if (!exploreState.failed && MAT_CONFIG[activeMat] && (MAT_CONFIG[activeMat].content || MAT_CONFIG[activeMat].baseContent)) {
                const cell = document.querySelector(`#explore-grid .bot-cell[data-row="${exploreState.robotRow}"][data-col="${exploreState.robotCol}"] .mat-content`);
                if (cell && cell.innerHTML.trim()) {
                    if (typeof collectMode !== 'undefined' && collectMode) {
                        // Remove emoji from grid cell (collected)
                        const gridCell = cell.closest('.bot-cell');
                        cell.remove();
                        if (gridCell) gridCell.classList.add('cell-collected');
                    }
                }
            }

            exploreState.running = false; 
        }
        function removeSpecificCmd(index) {
            if (simState.running) return;
            if (window.commandsVisible === true) {
                simState.blindRunAborted = true;
            }
            simState.deletedCommandsCount = (simState.deletedCommandsCount || 0) + 1;
            playSound('click'); simState.program.splice(index, 1); renderProgram();
        }
        function clearProgram() {
            if (simState.running) {
                simState.stopped = true;
                return;
            }
            simState.blindRunAborted = false;
            simState.deletedCommandsCount = (simState.deletedCommandsCount || 0) + simState.program.length;
            playSound('click'); simState.program = []; simState.stepIndex = -1; simState.failed = false; renderProgram();
        }

        function pauseProgram() {
            if (!simState.running) return;
            playSound('click');
            simState.paused = !simState.paused;
        }


        function countReachable(startR, startC, startD, obstacles) {
            const queue = [{ r: startR, c: startC, d: startD }];
            const visited = new Set([`${startR},${startC},${startD}`]);
            const visitedCells = new Set([`${startR},${startC}`]);
            const cmds = ['forward', 'left', 'right', 'backward'];

            while (queue.length > 0) {
                const curr = queue.shift();
                for (let cmd of cmds) {
                    const res = moveRobot({ robotRow: curr.r, robotCol: curr.c, robotDir: curr.d, obstacles }, cmd);
                    if (!res.blocked) {
                        const key = `${res.robotRow},${res.robotCol},${res.robotDir}`;
                        if (!visited.has(key)) {
                            visited.add(key);
                            visitedCells.add(`${res.robotRow},${res.robotCol}`);
                            queue.push({ r: res.robotRow, c: res.robotCol, d: res.robotDir });
                        }
                    }
                }
            }
            return visitedCells.size;
        }

        function randomizeSimWalls() {
            if (simState.running) return;
            playSound('click');
            let attempts = 0;
            let bestObstacles = [];
            let maxReachable = 0;
            let success = false;

            do {
                let tempObstacles = [];
                for (let r = 0; r < GRID_ROWS; r++) {
                    for (let c = 0; c < GRID_COLS; c++) {
                        if (r === simState.robotRow && c === simState.robotCol) continue;
                        if (simState.targetRow !== null && r === simState.targetRow && c === simState.targetCol) continue;
                        if (Math.random() < 0.18) tempObstacles.push({ r, c });
                    }
                }
                attempts++;

                if (simState.targetRow !== null) {
                    let path = findShortestPath(simState.robotRow, simState.robotCol, simState.robotDir, simState.targetRow, simState.targetCol, tempObstacles);
                    if (path !== null) {
                        bestObstacles = tempObstacles;
                        success = true;
                    }
                } else {
                    let reachable = countReachable(simState.robotRow, simState.robotCol, simState.robotDir, tempObstacles);
                    if (reachable > maxReachable) {
                        maxReachable = reachable;
                        bestObstacles = tempObstacles;
                    }
                    if (reachable >= 15) {
                        success = true;
                    }
                }
            } while (!success && attempts < 50);

            simState.obstacles = bestObstacles;
            buildGrid('sim-grid', GRID_ROWS, GRID_COLS, simState.obstacles);
            renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);

            if (simState.targetRow !== null && simState.targetCol !== null) {
                renderTarget('sim-grid', 'sim-target', simState.targetRow, simState.targetCol);
            }
            TrailManager.clear('sim-grid');
        }

        function placeRandomSimTarget(silent = false) {
            if (simState.running) return;
            if (!silent) playSound('click');

            let attempts = 0;
            let targetR, targetC;

            do {
                targetR = Math.floor(Math.random() * GRID_ROWS);
                targetC = Math.floor(Math.random() * GRID_COLS);
                attempts++;
            } while (attempts < 100 && (
                simState.obstacles.some(o => o.r === targetR && o.c === targetC) ||
                (Math.abs(targetR - simState.robotRow) <= 1 && Math.abs(targetC - simState.robotCol) <= 1) ||
                findShortestPath(simState.robotRow, simState.robotCol, simState.robotDir, targetR, targetC, simState.obstacles) === null
            ));

            if (attempts < 100) {
                simState.targetRow = targetR;
                simState.targetCol = targetC;
                simState.firstAttempt = true; // Nouveau trésor, nouveau premier essai
                simState.deletedCommandsCount = 0;
                renderTarget('sim-grid', 'sim-target', targetR, targetC);

                const counter = document.getElementById('sim-score-bar');
                if (counter) counter.style.display = 'flex';
                const counterVal = document.getElementById('sim-star-counter-val');
                if (counterVal) counterVal.textContent = simState.starCount;
            }
        }

        function clearSimWalls() {
            if (simState.running) return;
            playSound('click');
            simState.obstacles = [];
            simState.targetRow = null;
            simState.targetCol = null;
            simState.starCount = 0;
            simState.firstTryCount = 0;
            simState.firstAttempt = true;
            simState.deletedCommandsCount = 0;
            memoryPairsFound = 0;

            const counter = document.getElementById('sim-score-bar');
            if (counter) counter.style.display = 'none';

            // Remove mat
            if (typeof selectMat === 'function') selectMat('none');
            // Specifically clear custom mat if user requested it
            localStorage.removeItem('at_custom_mat_image');
            document.documentElement.style.setProperty('--custom-mat-url', 'none');
            if (typeof updateCustomMatUI === 'function') updateCustomMatUI();

            buildGrid('sim-grid', GRID_ROWS, GRID_COLS, []);
            renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
            TrailManager.clear('sim-grid');

            const target = document.getElementById('sim-target');
            if (target) target.remove();
        }
        function randomizeSimulatorPosition() {
            if (simState.running) return;
            playSound('click');

            let newRow, newCol;
            let attempts = 0;
            do {
                newRow = Math.floor(Math.random() * GRID_ROWS);
                newCol = Math.floor(Math.random() * GRID_COLS);
                attempts++;
            } while (attempts < 100 && (
                simState.obstacles.some(o => o.r === newRow && o.c === newCol) ||
                (simState.targetRow !== null && newRow === simState.targetRow && newCol === simState.targetCol)
            ));

            simState.robotRow = newRow;
            simState.robotCol = newCol;
            simState.startRow = newRow;
            simState.startCol = newCol;
            let randomDir = Math.floor(Math.random() * 4);
            simState.robotDir = randomDir;
            simState.startDir = randomDir;
            simState.stepIndex = -1;
            simState.failed = false;

            TrailManager.clear('sim-grid');
            renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
            renderProgram();
        }

        function resetSimulatorPosition() {
            if (simState.running) return;
            playSound('click');
            simState.robotRow = simState.startRow;
            simState.robotCol = simState.startCol;
            simState.robotDir = simState.startDir;
            simState.stepIndex = -1; simState.failed = false;

            TrailManager.clear('sim-grid');
            renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
            if (simState.targetRow !== null && simState.targetCol !== null) {
                renderTarget('sim-grid', 'sim-target', simState.targetRow, simState.targetCol);
            }
            renderProgram();
        }

        function randomizeExploreWalls() {
            if (exploreState.running) return;
            playSound('click');
            let attempts = 0;
            let bestObstacles = [];
            let maxReachable = 0;
            let success = false;

            do {
                let tempObstacles = [];
                for (let r = 0; r < GRID_ROWS; r++) {
                    for (let c = 0; c < GRID_COLS; c++) {
                        if (r === exploreState.robotRow && c === exploreState.robotCol) continue;
                        if (exploreState.targetRow !== null && r === exploreState.targetRow && c === exploreState.targetCol) continue;
                        if (Math.random() < 0.18) tempObstacles.push({ r, c });
                    }
                }
                attempts++;

                if (exploreState.targetRow !== null) {
                    let path = findShortestPath(exploreState.robotRow, exploreState.robotCol, exploreState.robotDir, exploreState.targetRow, exploreState.targetCol, tempObstacles);
                    if (path !== null) {
                        bestObstacles = tempObstacles;
                        success = true;
                    }
                } else {
                    let reachable = countReachable(exploreState.robotRow, exploreState.robotCol, exploreState.robotDir, tempObstacles);
                    if (reachable > maxReachable) {
                        maxReachable = reachable;
                        bestObstacles = tempObstacles;
                    }
                    if (reachable >= 15) {
                        success = true;
                    }
                }
            } while (!success && attempts < 50);

            exploreState.obstacles = bestObstacles;
            buildGrid('explore-grid', GRID_ROWS, GRID_COLS, exploreState.obstacles);
            renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);

            if (exploreState.targetRow !== null && exploreState.targetCol !== null) {
                renderTarget('explore-grid', 'explore-target', exploreState.targetRow, exploreState.targetCol);
            }
            TrailManager.clear('explore-grid');
        }

        function placeRandomExploreTarget(silent = false) {
            if (exploreState.running) return;
            if (!silent) playSound('click');

            let attempts = 0;
            let targetR, targetC;

            do {
                targetR = Math.floor(Math.random() * GRID_ROWS);
                targetC = Math.floor(Math.random() * GRID_COLS);
                attempts++;
            } while (attempts < 100 && (
                exploreState.obstacles.some(o => o.r === targetR && o.c === targetC) ||
                (Math.abs(targetR - exploreState.robotRow) <= 1 && Math.abs(targetC - exploreState.robotCol) <= 1) ||
                findShortestPath(exploreState.robotRow, exploreState.robotCol, exploreState.robotDir, targetR, targetC, exploreState.obstacles) === null
            ));

            if (attempts < 100) {
                exploreState.targetRow = targetR;
                exploreState.targetCol = targetC;
                exploreState.firstAttempt = true;
                renderTarget('explore-grid', 'explore-target', targetR, targetC);
            }
        }

        function clearExploreWalls() {
            if (exploreState.running) return;
            playSound('click');
            exploreState.obstacles = [];
            exploreState.targetRow = null;
            exploreState.targetCol = null;
            exploreState.starCount = 0;
            exploreState.firstTryCount = 0;
            exploreState.firstAttempt = true;
            exploreState.history = [];
            exploreState.absoluteStartRow = exploreState.robotRow;
            exploreState.absoluteStartCol = exploreState.robotCol;
            exploreState.absoluteStartDir = exploreState.robotDir;
            exploreState.stepsThisRun = 0;

            // Remove mat
            if (typeof selectMat === 'function') selectMat('none');
            // Specifically clear custom mat if user requested it
            localStorage.removeItem('at_custom_mat_image');
            document.documentElement.style.setProperty('--custom-mat-url', 'none');
            if (typeof updateCustomMatUI === 'function') updateCustomMatUI();

            buildGrid('explore-grid', GRID_ROWS, GRID_COLS, []);
            renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);
            TrailManager.clear('explore-grid');

            const target = document.getElementById('explore-target');
            if (target) target.remove();
        }

        function randomizeExplorePosition() {
            if (exploreState.running) return;
            playSound('click');

            let newRow, newCol;
            let attempts = 0;
            do {
                newRow = Math.floor(Math.random() * GRID_ROWS);
                newCol = Math.floor(Math.random() * GRID_COLS);
                attempts++;
            } while (attempts < 100 && (
                exploreState.obstacles.some(o => o.r === newRow && o.c === newCol) ||
                (exploreState.targetRow !== null && newRow === exploreState.targetRow && newCol === exploreState.targetCol)
            ));

            exploreState.robotRow = newRow;
            exploreState.robotCol = newCol;
            exploreState.startRow = newRow;
            exploreState.startCol = newCol;
            exploreState.absoluteStartRow = newRow;
            exploreState.absoluteStartCol = newCol;
            let randomDir = Math.floor(Math.random() * 4);
            exploreState.robotDir = randomDir;
            exploreState.absoluteStartDir = randomDir;
            exploreState.startDir = randomDir;
            exploreState.failed = false;
            exploreState.history = [];
            exploreState.stepsThisRun = 0;

            TrailManager.clear('explore-grid');
            renderRobot('explore-grid', 'explore-robot', exploreState.robotRow, exploreState.robotCol, exploreState.robotDir);
        }

        function renderProgram() {
            const strip = document.getElementById('sim-program');
            const toggleBtn = document.getElementById('hide-cmd-toggle-btn');

            strip.innerHTML = '';

            if (simState.program.length === 0) {
                strip.insertAdjacentHTML('beforeend', '<div class="empty-program">Ajoute des commandes avec les boutons ou le clavier…</div>');
                if (toggleBtn) {
                    strip.appendChild(toggleBtn);
                }
                return;
            }

            const cmdsHtml = simState.program.map((cmd, i) => {
                const cls = cmd === 'forward' ? 'fwd' : cmd === 'backward' ? 'bwd' : cmd;
                return `<div class="program-cmd ${cls}" tabindex="0" data-index="${i}" title="Cliquer pour supprimer">${AT_SVGS[cmd]}</div>`;
            }).join('');
            strip.insertAdjacentHTML('beforeend', cmdsHtml);

            if (toggleBtn) {
                strip.appendChild(toggleBtn);
            }
        }



        function renderProgramStep() {
            const strip = document.getElementById('sim-program');
            for (const el of strip.querySelectorAll('.active-step, .error-step')) {
                el.classList.remove('active-step', 'error-step');
            }
            if (simState.stepIndex >= 0) {
                const cmds = strip.querySelectorAll('.program-cmd');
                if (cmds[simState.stepIndex]) {
                    cmds[simState.stepIndex].classList.add(simState.failed ? 'error-step' : 'active-step');
                }
            }
        }


        function moveRobot(state, cmd) {
            let { robotRow: r, robotCol: c, robotDir: d, obstacles } = state;
            if (cmd === 'left') { d -= 1; }
            else if (cmd === 'right') { d += 1; }
            else {
                const step = cmd === 'forward' ? 1 : -1;
                const normD = ((d % 4) + 4) % 4;
                const dr = [-1, 0, 1, 0], dc = [0, 1, 0, -1];
                const nr = r + dr[normD] * step, nc = c + dc[normD] * step;
                if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS) {
                    if (obstacles && obstacles.some(o => o.r === nr && o.c === nc)) return { ...state, robotDir: d, blocked: true };
                    r = nr; c = nc;
                } else { return { ...state, robotDir: d, blocked: true }; }
            }
            return { ...state, robotRow: r, robotCol: c, robotDir: d, blocked: false };
        }


        function handleObstacleCollision() {
            playSound('error');
            simState.failed = true; simState.firstAttempt = false; renderProgramStep();
            simState.consecutiveMistakes++;
            ScoreManager.addMistake('simulator', null);
            if (simState.consecutiveMistakes >= 5) unlockSkin('botanique');

            // Shake du robot
            document.getElementById('sim-robot').classList.add('shake');
            setTimeout(() => document.getElementById('sim-robot').classList.remove('shake'), 350);
            // Shake global de la fenêtre
            document.body.classList.add('window-shake');
            setTimeout(() => document.body.classList.remove('window-shake'), 500);
            showToast('Attention ! Obstacle en vue. Exécution stoppée.', 'error');
        }

        function handleTargetReached() {
            playSound('success');

            if (activeSkin === 'cyberbot') {
                showToast('WELCOME TO THE MATRIX 🕶️', 'success');
            } else {
                handleStreakCelebration(1, false, false); // Sim has no streak, light celebration
            }

            // Statistiques en mode simulateur
            if (simState.targetRow !== null) {
                ScoreManager.addSuccess('simulator', null, simState.firstAttempt ? 0 : 1);
                simState.starCount++;
                simState.firstTryCount += simState.firstAttempt ? 1 : 0;
                simState.consecutiveMistakes = 0; // Reset

                // Déblocage Bee-Bot
                let zigzagOk = true;
                if (simState.program.length < 2) {
                    zigzagOk = false;
                } else {
                    for (let idx = 1; idx < simState.program.length; idx++) {
                        if (simState.program[idx] === simState.program[idx-1]) {
                            zigzagOk = false;
                            break;
                        }
                    }
                }
                if (zigzagOk) {
                    unlockSkin('beebot');
                }

                // Déblocage Pirate-Bot
                if (simState.wasBlindRun) {
                    unlockSkin('pirate');
                }

                // Déblocage Thymio
                if (!simState.program.includes('forward')) {
                    unlockSkin('thymio');
                }

                // Déblocage L'Indécis Chronique
                if (simState.firstAttempt && simState.deletedCommandsCount >= 10) {
                    unlockSkin('indecis');
                }
                // Déblocage Manta
                const progStr = simState.program.join(',');
                if (progStr.includes('left,left,left,left') || progStr.includes('right,right,right,right')) {
                    unlockSkin('manta');
                }

                showToast('Trésor trouvé ! Félicitations !', 'success');
            } else {
                showToast('Bravo ! Tu as atteint la récompense !', 'success');
            }

            const counterVal = document.getElementById('sim-star-counter-val');
            if (counterVal) counterVal.textContent = simState.starCount;
            const firstTryVal = document.getElementById('sim-first-try-val');
            if (firstTryVal) firstTryVal.textContent = simState.firstTryCount;

            const target = document.getElementById('sim-target');
            if (target) {
                target.classList.add('pulse');
                setTimeout(() => {
                    target.classList.remove('pulse');
                    target.remove();
                    simState.targetRow = null;
                    simState.targetCol = null;
                    simState.program = [];
                    simState.stepIndex = -1;
                    simState.failed = false;
                    simState.firstAttempt = true;
                    simState.deletedCommandsCount = 0;
                    renderProgram();
                    placeRandomSimTarget(true);
                }, 500);
            }
        }

        function handleTargetMissed(stepsThisRun) {
            // Rocket unlock: Revenir à la case de départ sans atteindre le trésor, avec exactement 20 instructions
            if (simState.robotRow === simState.startRow && simState.robotCol === simState.startCol && simState.program.length === 20) {
                unlockSkin('space');
            }

            simState.firstAttempt = false; // Exécution sans succès
            if (simState.targetRow !== null && simState.targetCol !== null) {
                showToast("Exécution terminée mais tu n'es pas arrivé sur le trésor", 'warn');
            } else {
                showToast("Exécution terminée !", 'success');
            }
        }

        function collectCellContent() {
            let addedItem = false;
            const endContainer = document.getElementById('sim-end-container');
            const isCraneActive = endContainer && (endContainer.style.display !== 'none' && endContainer.style.display !== '');
            
            if (MAT_CONFIG[activeMat] && (MAT_CONFIG[activeMat].content || MAT_CONFIG[activeMat].baseContent)) {
                const cell = document.querySelector(`#sim-grid .bot-cell[data-row="${simState.robotRow}"][data-col="${simState.robotCol}"] .mat-content`);
                if (cell && cell.innerHTML.trim()) {
                    // Only collect/store if crane is active
                    if (isCraneActive) {
                        const endContent = document.getElementById('sim-end-content');
                        const emptyEnd = document.getElementById('sim-end-empty');
                        if (emptyEnd) emptyEnd.style.display = 'none';
                        const el = document.createElement('div');
                        el.className = 'end-item';
                        el.innerHTML = cell.innerHTML.trim();
                        if (endContent) endContent.appendChild(el);
                        
                        if (typeof collectMode !== 'undefined' && collectMode) {
                            // Remove emoji from grid cell (collected)
                            const gridCell = cell.closest('.bot-cell');
                            cell.remove();
                            if (gridCell) gridCell.classList.add('cell-collected');
                        }
                        addedItem = true;
                        checkMemoryPair('sim-grid', cell.innerHTML.trim());
                    }
                }
            }
            return addedItem;
        }

        async function runProgram() {
            if (simState.running && simState.paused) {
                simState.paused = false;
                playSound('click');
                return;
            }
            if (simState.running || simState.program.length === 0) return;
            simState.wasBlindRun = false;
            if (window.commandsVisible === false && !simState.blindRunAborted) {
                simState.wasBlindRun = true;
            }
            playSound('click'); simState.running = true; simState.paused = false; simState.stopped = false; simState.failed = false; toggleCmdButtons(true);

            // Nouvelle origine du ghost à l'endroit où le robot démarre
            simState.startRow = simState.robotRow; simState.startCol = simState.robotCol; simState.startDir = simState.robotDir;

            TrailManager.clear('sim-grid');
            TrailManager.captureInitialState('sim-grid', simState.robotRow, simState.robotCol, simState.robotDir);

            let stepsThisRun = 0;
            for (let i = 0; i < simState.program.length; i++) {
                while (simState.paused && !simState.stopped) {
                    await sleep(100);
                }
                if (simState.stopped) {
                    break;
                }

                simState.stepIndex = i; renderProgramStep();
                const cmd = simState.program[i];

                const result = moveRobot(simState, cmd);
                simState.robotRow = result.robotRow; simState.robotCol = result.robotCol; simState.robotDir = result.robotDir;
                if (!result.blocked && (cmd === 'forward' || cmd === 'backward')) stepsThisRun++;

                renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);

                if (result.blocked) {
                    handleObstacleCollision();
                    break;
                }

                // Tracé synchronisé : attendre la fin de la transition CSS du robot, puis tracer
                if (cmd === 'forward' || cmd === 'backward') {
                    await sleep(350); // Durée transition CSS du robot
                    TrailManager.addSegment('sim-grid', simState.robotRow, simState.robotCol);
                }

                // Pause après chaque commande (y compris les rotations)
                await sleep(currentSpeed - (cmd === 'forward' || cmd === 'backward' ? 350 : 0));
            }

            if (stepsThisRun > 0) {
                const totalSteps = (parseInt(localStorage.getItem('at_total_steps') || '0')) + stepsThisRun;
                localStorage.setItem('at_total_steps', totalSteps);
                if (totalSteps >= 100) unlockSkin('train');
            }

            if (simState.stopped) {
                simState.running = false;
                simState.paused = false;
                simState.stopped = false;
                toggleCmdButtons(false);
                // Reset robot position
                simState.robotRow = simState.startRow;
                simState.robotCol = simState.startCol;
                simState.robotDir = simState.startDir;
                renderRobot('sim-grid', 'sim-robot', simState.startRow, simState.startCol, simState.startDir);
                TrailManager.clear('sim-grid');
                clearProgram();
                return;
            }

            let addedItem = false;
            if (!simState.failed) {
                simState.stepIndex = -1; renderProgramStep();

                if (simState.targetRow !== null && simState.robotRow === simState.targetRow && simState.robotCol === simState.targetCol) {
                    handleTargetReached();
                } else {
                    handleTargetMissed(stepsThisRun);
                }

                // Ajouter le contenu de la case atteinte à la fin de l'exécution
                if (collectCellContent()) {
                    addedItem = true;
                }
            }
            simState.running = false;
            simState.paused = false;
            simState.stopped = false;
            toggleCmdButtons(false);
            if (addedItem) {
                clearProgram();
            }
        }


        function checkMemoryPair(gridId, content) {
            if (!memoryMode) return false;

            const endContent = document.getElementById('sim-end-content');
            const items = Array.from(endContent.querySelectorAll('.end-item:not(.memory-matched)'));

            const lastItem = items[items.length - 1];
            if (!lastItem) return false;

            const match = items.slice(0, -1).find(el => el.innerHTML.trim() === content);

            if (match) {
                match.classList.add('memory-matched');
                lastItem.classList.add('memory-matched');

                playSound('success');
                handleStreakCelebration(1, false, false); // Paire individuelle — légère célébration
                showToast('Paire trouvée ! 🎉', 'success');
                memoryPairsFound++;
                if (memoryPairsFound >= 4) unlockSkin('helicopter');

                const header = document.getElementById('sim-end-header');
                if (header && typeof memoryMode !== 'undefined' && memoryMode) {
                    const totalPairs = Math.floor((MAT_CONFIG[activeMat]?.content?.length || 0) / 2);
                    header.textContent = `Paires trouvées : ${memoryPairsFound}/${totalPairs}`;
                }

                const allCells = document.querySelectorAll(`#${gridId} .bot-cell .mat-content`);
                let removed = 0;
                allCells.forEach(cell => {
                    if (cell.innerHTML.trim() === content && removed < 2) {
                        cell.closest('.bot-cell').classList.add('memory-cleared');
                        cell.remove();
                        removed++;
                    }
                });

                setTimeout(() => {
                    match.remove();
                    lastItem.remove();

                    const remaining = endContent.querySelectorAll('.end-item');
                    if (remaining.length === 0) {
                        const emptyEnd = document.getElementById('sim-end-empty');
                        if (emptyEnd) emptyEnd.style.display = 'block';
                    }

                    const remainingContent = document.querySelectorAll(
                        `#${gridId} .bot-cell .mat-content`
                    );
                    if (remainingContent.length === 0) {
                        handleStreakCelebration(3, false, false); // All pairs found = mini fête
                        showToast('🔥 Toutes les paires trouvées ! Champion !', 'success');
                    }
                }, 600);

                return true;
            }

            return false;
        }

        function toggleCmdButtons(disabled) {
            document.querySelectorAll('#sim-cmd-pad .cmd-btn').forEach(b => {
                if (b.id === 'pad-pause' || b.id === 'pad-clear' || b.id === 'pad-go') {
                    b.disabled = false;
                } else {
                    b.disabled = disabled;
                }
            });
            document.getElementById('btn-sim-random-position').disabled = disabled;
        }
        function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

        /* ================================================================
           PILOTAGE : PATHFINDING & GÉNÉRATION
           ================================================================ */
        function updateExtremeVisibility() {
            const stats = ScoreManager.stats;
            const chalHardSuccess = stats['chal'] && stats['chal']['hard'] && stats['chal']['hard'].totalSuccess > 0;
            const readHardSuccess = stats['read'] && stats['read']['hard'] && stats['read']['hard'].totalSuccess > 0;
            const drawHardSuccess = stats['draw'] && stats['draw']['hard'] && stats['draw']['hard'].totalSuccess > 0;

            if (chalHardSuccess) document.getElementById('diff-extreme')?.classList.add('unlocked');
            if (readHardSuccess) document.getElementById('read-diff-extreme')?.classList.add('unlocked');
            if (drawHardSuccess) document.getElementById('draw-diff-extreme')?.classList.add('unlocked');
        }

        function setDifficulty(diff) {
            playSound('click'); chalState.difficulty = diff;
            document.querySelectorAll('#view-challenge .diff-btn').forEach(b => b.classList.toggle('active', b.dataset.diff === diff));
            newChallenge();
        }
        function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

        function findShortestPath(startR, startC, startD, targetR, targetC, obstacles) {
            const queue = [{ r: startR, c: startC, d: startD, path: [] }];
            const visited = new Set([`${startR},${startC},${startD}`]);
            const cmds = ['forward', 'left', 'right', 'backward'];

            while (queue.length > 0) {
                const curr = queue.shift();
                if (curr.r === targetR && curr.c === targetC) return curr.path; // Stop exactement sur l'étoile

                for (let cmd of cmds) {
                    const res = moveRobot({ robotRow: curr.r, robotCol: curr.c, robotDir: curr.d, obstacles }, cmd);
                    if (!res.blocked) {
                        const key = `${res.robotRow},${res.robotCol},${res.robotDir}`;
                        if (!visited.has(key)) {
                            visited.add(key);
                            if (curr.path.length < 12) {
                                queue.push({ r: res.robotRow, c: res.robotCol, d: res.robotDir, path: [...curr.path, cmd] });
                            }
                        }
                    }
                }
            }
            return null;
        }

        /**
         * Vérifie qu'au moins un obstacle se trouve "entre" le robot et la cible,
         * c'est-à-dire qu'un chemin en ligne droite (même row ou même col) est bloqué,
         * ou qu'un obstacle se situe dans le rectangle délimité par les deux positions.
         */
        function hasObstacleBetween(startR, startC, targetR, targetC, obstacles) {
            const minR = Math.min(startR, targetR);
            const maxR = Math.max(startR, targetR);
            const minC = Math.min(startC, targetC);
            const maxC = Math.max(startC, targetC);

            return obstacles.some(o => {
                // L'obstacle est dans le rectangle englobant (exclus les coins start/target)
                if (o.r >= minR && o.r <= maxR && o.c >= minC && o.c <= maxC) {
                    if ((o.r === startR && o.c === startC) || (o.r === targetR && o.c === targetC)) return false;
                    return true;
                }
                return false;
            });
        }

        function generateChallengePath(diff) {
            let minL, maxL, minBack;
            if (diff === 'easy') { minL = 3; maxL = 4; minBack = 0; }
            else if (diff === 'medium') { minL = 4; maxL = 5; minBack = 0; }
            else if (diff === 'hard') { minL = 6; maxL = 8; minBack = 0; }
            else { minL = 6; maxL = 10; minBack = 1; } // extreme

            for (let attempts = 0; attempts < 1000; attempts++) {
                let startR = randomInt(0, GRID_ROWS - 1);
                let startC = randomInt(0, GRID_COLS - 1);
                let startD = randomInt(0, 3);

                let targetR = randomInt(0, GRID_ROWS - 1);
                let targetC = randomInt(0, GRID_COLS - 1);

                if (startR === targetR && startC === targetC) continue;

                let obstacles = [];
                let numObs = 0;
                if (diff === 'medium') numObs = randomInt(1, 2);
                else if (diff === 'hard') numObs = randomInt(3, 4);
                else if (diff === 'extreme') numObs = randomInt(5, 7);

                while (obstacles.length < numObs) {
                    let or = randomInt(0, GRID_ROWS - 1);
                    let oc = randomInt(0, GRID_COLS - 1);
                    if ((or !== startR || oc !== startC) && (or !== targetR || oc !== targetC)) {
                        if (!obstacles.some(o => o.r === or && o.c === oc)) obstacles.push({ r: or, c: oc });
                    }
                }

                // Pour Medium et plus, forcer un obstacle entre robot et cible si possible
                if (diff !== 'easy' && !hasObstacleBetween(startR, startC, targetR, targetC, obstacles)) {
                    const minR = Math.min(startR, targetR), maxR = Math.max(startR, targetR);
                    const minC = Math.min(startC, targetC), maxC = Math.max(startC, targetC);
                    if (maxR - minR > 0 || maxC - minC > 0) {
                        let or = randomInt(minR, maxR);
                        let oc = randomInt(minC, maxC);
                        if ((or !== startR || oc !== startC) && (or !== targetR || oc !== targetC)) {
                            if (!obstacles.some(o => o.r === or && o.c === oc)) obstacles.push({ r: or, c: oc });
                        }
                    }
                }

                let path = findShortestPath(startR, startC, startD, targetR, targetC, obstacles);

                if (path && path.length >= minL && path.length <= maxL) {
                    let backwardCount = path.filter(c => c === 'backward').length;

                    if (diff !== 'extreme' && backwardCount > 0) continue;
                    if (diff === 'extreme' && backwardCount < minBack) continue;

                    return { startR, startC, startD, targetR, targetC, correct: path, obstacles };
                }
            }
            // Fallback
            return { startR: 5, startC: 0, startD: 0, targetR: 3, targetC: 0, correct: ['forward', 'forward'], obstacles: [] };
        }

        function generateFakeOption(correctPath, startR, startC, startD, targetR, targetC, obstacles) {
            const noBackward = (chalState.difficulty !== 'extreme');
            const mutCmds = noBackward ? ['forward', 'left', 'right'] : ['forward', 'backward', 'left', 'right'];
            const endCmds = noBackward ? ['forward'] : ['forward', 'backward'];

            let fake; let tries = 0;
            do {
                fake = [...correctPath];
                let numMut = randomInt(1, Math.max(1, Math.floor(fake.length / 2)));
                for (let i = 0; i < numMut; i++) {
                    let idx = randomInt(0, fake.length - 1);
                    fake[idx] = mutCmds[randomInt(0, mutCmds.length - 1)];
                }

                // Ensure fake doesn't end with left or right
                while (fake.length > 0 && (fake[fake.length - 1] === 'left' || fake[fake.length - 1] === 'right')) {
                    fake[fake.length - 1] = endCmds[randomInt(0, endCmds.length - 1)];
                }

                tries++;
            } while (tries < 50 && (JSON.stringify(fake) === JSON.stringify(correctPath) || programReachesTarget(fake, startR, startC, startD, targetR, targetC, obstacles)));

            if (programReachesTarget(fake, startR, startC, startD, targetR, targetC, obstacles)) {
                let fallback = new Array(correctPath.length).fill('forward');
                return fallback;
            }
            return fake;
        }

        function programReachesTarget(program, startR, startC, startD, targetR, targetC, obstacles) {
            let r = startR, c = startC, d = startD;
            for (const cmd of program) {
                const res = moveRobot({ robotRow: r, robotCol: c, robotDir: d, obstacles }, cmd);
                r = res.robotRow; c = res.robotCol; d = res.robotDir;
                if (res.blocked) break;
            }
            return r === targetR && c === targetC;
        }

        /* ================================================================
           DÉCODAGE DE CODE
           ================================================================ */
        function setReadDifficulty(diff) {
            playSound('click'); readState.difficulty = diff;
            document.querySelectorAll('#view-read .diff-btn').forEach(b => b.classList.toggle('active', b.dataset.diff === diff));
            newReadChallenge();
        }

        function setDrawDifficulty(diff) {
            playSound('click'); drawState.difficulty = diff;
            document.querySelectorAll('#view-draw .diff-btn').forEach(b => b.classList.toggle('active', b.dataset.diff === diff));
            newDrawChallenge();
        }

        function generateDrawChallenge(diff) {
            const easyShapes = [
                { name: 'bâton', path: ['forward', 'forward'] },
                { name: 'ligne droite', fem: true, path: ['forward', 'forward', 'forward'] },
                { name: 'longue ligne', fem: true, path: ['forward', 'forward', 'forward', 'forward'] },
                { name: 'coin', path: ['forward', 'right', 'forward'] },
                { name: 'coin gauche', path: ['forward', 'left', 'forward'] },
                { name: 'petit L', path: ['forward', 'forward', 'right', 'forward'] },
                { name: 'L inversé', path: ['forward', 'forward', 'left', 'forward'] },
                { name: 'petit U', path: ['forward', 'right', 'forward', 'right', 'forward'] },
                { name: 'U inversé', path: ['forward', 'left', 'forward', 'left', 'forward'] },
                { name: 'crochet', path: ['forward', 'right', 'forward', 'left', 'forward'] },
            ];
            const mediumShapes = [
                { name: 'carré', path: ['forward', 'right', 'forward', 'right', 'forward', 'right', 'forward'], closed: true },
                { name: 'escalier', path: ['forward', 'right', 'forward', 'left', 'forward', 'right', 'forward'] },
                { name: 'L long', path: ['forward', 'forward', 'forward', 'right', 'forward', 'forward'] },
                { name: 'grand L', path: ['forward', 'forward', 'right', 'forward', 'forward'] },
                { name: 'J', path: ['forward', 'forward', 'forward', 'left', 'forward'] },
                { name: 'créneau', path: ['forward', 'right', 'forward', 'right', 'forward', 'left', 'forward', 'left', 'forward'] },
                { name: 'rectangle', path: ['forward', 'forward', 'right', 'forward', 'right', 'forward', 'forward', 'right', 'forward'], closed: true },
                { name: 'pont', path: ['forward', 'forward', 'right', 'forward', 'right', 'forward', 'forward'] },
                { name: 'toboggan', path: ['forward', 'forward', 'right', 'forward', 'right', 'forward'] },
                { name: 'vague', fem: true, path: ['forward', 'right', 'forward', 'left', 'forward', 'left', 'forward', 'right', 'forward'] },
            ];
            const shapes = {
                easy: easyShapes,
                medium: mediumShapes,
                hard: [...easyShapes, ...mediumShapes],
                extreme: [
                    { name: 'grand carré', path: ['forward', 'forward', 'right', 'forward', 'forward', 'right', 'forward', 'forward', 'right', 'forward', 'forward'], closed: true },
                    { name: 'serpentin', path: ['forward', 'forward', 'right', 'forward', 'right', 'forward', 'forward', 'left', 'forward', 'left', 'forward', 'forward'] },
                    { name: 'U imbriqué', path: ['forward', 'forward', 'forward', 'right', 'forward', 'forward', 'right', 'forward', 'forward', 'forward', 'right', 'forward', 'right', 'forward'] },
                    { name: 'labyrinthe', path: ['forward', 'forward', 'right', 'forward', 'right', 'forward', 'left', 'forward', 'left', 'forward', 'forward'] },
                    { name: 'spirale', fem: true, path: ['forward', 'right', 'forward', 'right', 'forward', 'forward', 'right', 'forward', 'forward', 'right', 'forward', 'forward', 'forward'] },
                    { name: 'grand rectangle', path: ['forward', 'forward', 'forward', 'right', 'forward', 'right', 'forward', 'forward', 'forward', 'right', 'forward'], closed: true },
                    { name: 'S', path: ['forward', 'forward', 'left', 'forward', 'forward', 'left', 'forward', 'forward', 'right', 'forward', 'forward', 'right', 'forward', 'forward'] },
                    { name: 'double créneau', path: ['forward', 'right', 'forward', 'right', 'forward', 'left', 'forward', 'left', 'forward', 'right', 'forward', 'right', 'forward'] },
                    { name: 'escalier long', path: ['forward', 'right', 'forward', 'left', 'forward', 'right', 'forward', 'left', 'forward', 'right', 'forward'] },
                    { name: 'clé', fem: true, path: ['forward', 'forward', 'forward', 'right', 'forward', 'right', 'forward', 'left', 'forward', 'left', 'forward'] },
                ]
            };

            for (let attempts = 0; attempts < 1000; attempts++) {
                const shapeList = shapes[diff];
                const shapeDef = shapeList[randomInt(0, shapeList.length - 1)];

                let startR = randomInt(0, GRID_ROWS - 1);
                let startC = randomInt(0, GRID_COLS - 1);
                let startD = randomInt(0, 3); // 0: N, 1: E, 2: S, 3: W

                let currR = startR;
                let currC = startC;
                let currD = startD;
                let valid = true;

                const targetCells = new Set([`${currR},${currC}`]);

                for (let cmd of shapeDef.path) {
                    const res = moveRobot({ robotRow: currR, robotCol: currC, robotDir: currD, obstacles: [] }, cmd);
                    if (res.blocked) {
                        valid = false;
                        break;
                    }
                    currR = res.robotRow;
                    currC = res.robotCol;
                    currD = res.robotDir;
                    targetCells.add(`${currR},${currC}`);
                }

                if (valid) {
                    return {
                        startR, startC, startD,
                        targetCells: Array.from(targetCells).map(coord => {
                            const [r, c] = coord.split(',').map(Number);
                            return { r, c };
                        }),
                        name: shapeDef.name,
                        fem: shapeDef.fem || false,
                        path: shapeDef.path,
                        closed: shapeDef.closed || false
                    };
                }
            }
            // Fallback if no shape fits (unlikely on empty grid)
            return {
                startR: 0, startC: 0, startD: 1,
                targetCells: [{ r: 0, c: 0 }, { r: 0, c: 1 }],
                name: 'ligne', fem: true,
                path: ['forward'],
                closed: false
            };
        }

        function generateShapeThumbnail(path, startD = 0) {
            let x = 0;
            let y = 0;
            let dir = startD; // Use actual start direction (0: N, 1: E, 2: S, 3: W)
            const points = [{x, y}];

            let minX = 0, maxX = 0, minY = 0, maxY = 0;

            for (const cmd of path) {
                if (cmd === 'left') dir -= 1;
                else if (cmd === 'right') dir += 1;
                else if (cmd === 'forward') {
                    const normD = ((dir % 4) + 4) % 4;
                    if (normD === 0) y -= 1;
                    else if (normD === 1) x += 1;
                    else if (normD === 2) y += 1;
                    else if (normD === 3) x -= 1;
                    points.push({x, y});
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            }

            const width = Math.max(2, maxX - minX + 1);
            const height = Math.max(2, maxY - minY + 1);
            const size = Math.max(width + 2, height + 2); // Add padding of 1 cell on all sides minimum

            const cellSize = 20;
            const viewBoxSize = size * cellSize;

            const padX = Math.floor((size - width) / 2);
            const padY = Math.floor((size - height) / 2);

            let gridRects = '';
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    const isDark = (r + c) % 2 === 1;
                    const fillOpacity = isDark ? '0.08' : '0.03';
                    gridRects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="currentColor" fill-opacity="${fillOpacity}" stroke="var(--border)" stroke-width="1" />`;
                }
            }

            const polylinePoints = points.map(p => {
                const c = p.x - minX + padX;
                const r = p.y - minY + padY;
                return `${c * cellSize + cellSize / 2},${r * cellSize + cellSize / 2}`;
            }).join(' ');

            const startC = points[0].x - minX + padX;
            const startR = points[0].y - minY + padY;
            const startX = startC * cellSize + cellSize / 2;
            const startY = startR * cellSize + cellSize / 2;

            const displaySize = size * 20;

            const arrowSize = 6;
            const arrowPath = `M ${startX} ${startY - arrowSize} L ${startX + arrowSize*0.7} ${startY + arrowSize*0.7} L ${startX - arrowSize*0.7} ${startY + arrowSize*0.7} Z`;

            return `
                <svg width="${displaySize}" height="${displaySize}" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" style="background: var(--card-bg); color: var(--text-main); border: 2px solid var(--card-border); border-radius: 8px; margin-top: 10px; display: inline-block; box-shadow: var(--card-shadow); overflow: hidden;">
                    ${gridRects}
                    <polyline points="${polylinePoints}" stroke="var(--accent, #2563eb)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                    <circle cx="${startX}" cy="${startY}" r="3" fill="var(--error)" />
                    <path d="${arrowPath}" fill="var(--error)" stroke="var(--error)" stroke-linejoin="round" transform="rotate(${startD * 90}, ${startX}, ${startY})" />
                </svg>
            `;
        }

        function newDrawChallenge() {
            if (drawState.isAnimating) return;
            drawState.locked = false;
            drawState.mistakes = 0;
            drawState.program = [];
            document.getElementById('btn-next-draw').style.display = 'none';

            let chal = generateDrawChallenge(drawState.difficulty);

            drawState.robotRow = chal.startR;
            drawState.robotCol = chal.startC;
            drawState.robotDir = chal.startD;
            drawState.targetCells = chal.targetCells;
            drawState.mustClose = chal.closed;
            drawState.startR = chal.startR;
            drawState.startC = chal.startC;

            const article = chal.fem ? 'une' : 'un';
            let instructionHTML = `Programme le robot pour tracer ${article} <strong>${chal.name}</strong> !<br>`;
            instructionHTML += generateShapeThumbnail(chal.path, chal.startD);

            if (drawState.difficulty === 'hard' || drawState.difficulty === 'extreme') {
                instructionHTML += `<div style="font-size: 0.9em; margin-top: 5px; color: var(--text-muted);"><i data-fa="eye-slash" style="width: 16px; height: 16px; vertical-align: middle;"></i> Pas d'aide sur la grille !</div>`;
            }

            document.getElementById('draw-instruction').innerHTML = instructionHTML;
            window.fa?.createIcons?.();

            buildGrid('draw-grid', GRID_ROWS, GRID_COLS, []); // No obstacles in draw mode yet
            renderRobot('draw-grid', 'draw-robot', chal.startR, chal.startC, chal.startD);
            TrailManager.clear('draw-grid');
            renderDrawProgram();

            // Highlight target cells only for easy and medium
            if (drawState.difficulty === 'easy' || drawState.difficulty === 'medium') {
                const targetSet = new Set(drawState.targetCells.map(c => `${c.r},${c.c}`));
                const drawCells = document.querySelectorAll('#draw-grid .bot-cell');
                for (const el of drawCells) {
                    if (targetSet.has(`${el.dataset.row},${el.dataset.col}`)) {
                        el.classList.add('draw-target');
                    }
                }
            }

            // Re-render robot to ensure it is above the target cells
            renderRobot('draw-grid', 'draw-robot', chal.startR, chal.startC, chal.startD);
        }

        window.newDrawChallenge = newDrawChallenge;

        function addDrawCommand(cmd) {
            if (drawState.locked || drawState.isAnimating) return;
            drawState.program.push(cmd);
            playSound('click');
            renderDrawProgram();
        }

        function pauseDrawProgram() {
            if (!drawState.isAnimating) return;
            playSound('click');
            drawState.paused = !drawState.paused;
        }

        function clearDrawProgram() {
            if (drawState.isAnimating) {
                drawState.stopped = true;
                return;
            }
            if (drawState.locked) return;
            drawState.program = [];
            playSound('click');
            renderDrawProgram();
        }

        async function runDrawProgram() {
            if (drawState.isAnimating && drawState.paused) {
                drawState.paused = false;
                playSound('click');
                return;
            }
            if (drawState.locked || drawState.isAnimating || drawState.program.length === 0) return;
            drawState.isAnimating = true;
            drawState.paused = false;
            drawState.stopped = false;
            drawState.locked = true;

            let currR = drawState.robotRow;
            let currC = drawState.robotCol;
            let currD = drawState.robotDir;

            const visited = new Set([`${currR},${currC}`]);

            TrailManager.captureInitialState('draw-grid', currR, currC, currD);

            // Mark start cell as visited immediately
            const startCell = document.querySelector(`#draw-grid .bot-cell[data-row="${currR}"][data-col="${currC}"]`);
            if (startCell) startCell.classList.add('visited-draw');

            for (const cmd of drawState.program) {
                while (drawState.paused && !drawState.stopped) {
                    await sleep(100);
                }
                if (drawState.stopped) {
                    break;
                }

                const res = moveRobot({ robotRow: currR, robotCol: currC, robotDir: currD, obstacles: [] }, cmd);
                currR = res.robotRow;
                currC = res.robotCol;
                currD = res.robotDir;

                renderRobot('draw-grid', 'draw-robot', currR, currC, currD);

                if (res.blocked) {
                    playSound('error');
                    document.getElementById('draw-robot').classList.add('shake');
                    setTimeout(() => document.getElementById('draw-robot').classList.remove('shake'), 350);
                    break;
                }

                if (cmd === 'forward' || cmd === 'backward') {
                    await sleep(350);
                    TrailManager.addSegment('draw-grid', currR, currC);

                    const cell = document.querySelector(`#draw-grid .bot-cell[data-row="${currR}"][data-col="${currC}"]`);
                    if (cell) cell.classList.add('visited-draw');
                    visited.add(`${currR},${currC}`);
                }

                await sleep(currentSpeed - (cmd === 'forward' || cmd === 'backward' ? 350 : 0));
            }

            if (drawState.stopped) {
                drawState.isAnimating = false;
                drawState.paused = false;
                drawState.stopped = false;
                drawState.locked = false;
                // Reset robot position & trail
                drawState.robotRow = drawState.startR;
                drawState.robotCol = drawState.startC;
                drawState.robotDir = drawState.startD;
                renderRobot('draw-grid', 'draw-robot', drawState.startR, drawState.startC, drawState.startD);
                TrailManager.clear('draw-grid');
                document.querySelectorAll('#draw-grid .visited-draw').forEach(el => el.classList.remove('visited-draw'));
                clearDrawProgram();
                return;
            }

            // Validation
            const targetSet = new Set(drawState.targetCells.map(c => `${c.r},${c.c}`));
            let isCorrect = true;
            let errorMsg = `La forme n'est pas exacte !`;

            if (visited.size !== targetSet.size) {
                isCorrect = false;
            } else {
                for (const v of visited) {
                    if (!targetSet.has(v)) {
                        isCorrect = false;
                        break;
                    }
                }
            }

            if (isCorrect && drawState.mustClose) {
                if (currR !== drawState.startR || currC !== drawState.startC) {
                    isCorrect = false;
                    errorMsg = `La forme doit être fermée !`;
                }
            }

            if (isCorrect) {
                playSound('success');
                showToast('Forme réussie !', 'success');
                simState.consecutiveMistakes = 0;

                drawGlobalScore++;
                drawGlobalStreak++;
                ScoreManager.addSuccess("draw", drawState.difficulty, drawState.mistakes || 0);
                updateExtremeVisibility();

                document.getElementById('draw-global-score').textContent = drawGlobalScore;
                document.getElementById('draw-global-streak').textContent = drawGlobalStreak;

                if (drawGlobalStreak > 0) {
                    const drawIsExtreme = (drawState.difficulty === 'extreme');
                    if (drawGlobalStreak > drawGlobalStreakBest) drawGlobalStreakBest = drawGlobalStreak;
                    const drawNewRecord = (drawGlobalStreak === drawGlobalStreakBest);
                    handleStreakCelebration(drawGlobalStreak, drawIsExtreme, drawNewRecord);
                }

                if (drawState.difficulty === 'extreme' && (!drawState.mistakes || drawState.mistakes === 0)) {
                    unlockSkin('unicorn');
                }

                document.getElementById('btn-next-draw').style.display = 'inline-flex';
                if (isCorrect) setTimeout(() => { if (document.getElementById('btn-next-draw').style.display !== 'none' && activeTab === 'draw') newDrawChallenge(); }, 3000);
            } else {
                playSound('error');
                showToast(errorMsg, 'error');
                drawGlobalStreak = 0;
                drawState.mistakes++;
                simState.consecutiveMistakes++;
                if (simState.consecutiveMistakes >= 5) unlockSkin('botanique');
                ScoreManager.addMistake("draw", drawState.difficulty);
                document.getElementById('draw-global-streak').textContent = drawGlobalStreak;

                // Reset for retry
                setTimeout(() => {
                    if (activeTab === 'draw') {
                        drawState.locked = false;
                        // Reset robot position
                        renderRobot('draw-grid', 'draw-robot', drawState.robotRow, drawState.robotCol, drawState.robotDir);
                        TrailManager.clear('draw-grid');
                        // Remove visited classes
                        document.querySelectorAll('#draw-grid .visited-draw').forEach(el => el.classList.remove('visited-draw'));
                    }
                }, 1500);
            }

            drawState.isAnimating = false;
        }

        function renderDrawProgram() {
            const strip = document.getElementById('draw-program');
            if (drawState.program.length === 0) {
                strip.innerHTML = '<div class="empty-program">Ajoute des commandes...</div>';
            } else {
                strip.innerHTML = drawState.program.map((cmd, i) => {
                    return `<div class="program-cmd" data-index="${i}">${AT_SVGS[cmd]}</div>`;
                }).join('');

                // Add delete listeners
                strip.querySelectorAll('.program-cmd').forEach(cmdEl => {
                    cmdEl.addEventListener('click', (e) => {
                        if (drawState.locked || drawState.isAnimating) return;
                        const idx = parseInt(e.currentTarget.dataset.index);
                        drawState.program.splice(idx, 1);
                        playSound('click');
                        renderDrawProgram();
                    });
                });
            }
        }

        window.newReadChallenge = newReadChallenge;

        function newReadChallenge() {
            if (readState.isAnimating) return;
            readState.locked = false;
            readState.mistakes = 0; // Reset mistakes for the new challenge
            document.getElementById('btn-next-read').style.display = 'none';

            readState.type = 'destination';

            let chal = generateChallengePath(readState.difficulty);

            readState.robotRow = chal.startR; readState.robotCol = chal.startC; readState.robotDir = chal.startD;
            readState.targetRow = chal.targetR; readState.targetCol = chal.targetC;
            readState.obstacles = chal.obstacles;

            readState.program = [...chal.correct];
            readState.bugIndex = -1;
            document.getElementById('read-instruction').innerHTML = "Où va s'arrêter le robot ? <strong>Clique sur la case finale.</strong>";

            buildGrid('read-grid', GRID_ROWS, GRID_COLS, chal.obstacles);
            renderRobot('read-grid', 'read-robot', chal.startR, chal.startC, chal.startD);
            TrailManager.clear('read-grid');

            const target = document.getElementById('read-target');
            if (target) target.remove();

            renderReadProgram();
        }

        function renderReadProgram() {
            const strip = document.getElementById('read-program');
            strip.innerHTML = readState.program.map((cmd, i) => {
                return `<div class="program-cmd read-only-cmd" data-index="${i}">${AT_SVGS[cmd]}</div>`;
            }).join('');
        }

        async function handleReadGridClick(r, c) {
            if (readState.locked || readState.isAnimating || readState.type !== 'destination') return;

            readState.locked = true;
            readState.isAnimating = true;

            const isCorrect = (r === readState.targetRow && c === readState.targetCol);
            const cell = document.querySelector(`#read-grid .bot-cell[data-row="${r}"][data-col="${c}"]`);

            if (isCorrect) {
                readState.locked = true;
                simState.consecutiveMistakes = 0;
                readGlobalScore++;
                readGlobalStreak++;
                ScoreManager.addSuccess('read', readState.difficulty, 0);
                updateExtremeVisibility();

                // Déblocages
                if (readState.difficulty === 'extreme') {
                    if (readState.mistakes === 0) {
                        unlockSkin('volcano');
                        document.getElementById('sim-grid').classList.add('ground-fire');
                        document.getElementById('chal-grid').classList.add('ground-fire');
                        document.getElementById('read-grid').classList.add('ground-fire');
                        showToast('Le sol est maintenant EN FEU !', 'success');
                    }
                }

                if (cell) cell.style.background = 'rgba(16, 185, 129, 0.4)'; // vert

                document.getElementById('read-global-score').textContent = readGlobalScore;
                document.getElementById('read-global-streak').textContent = readGlobalStreak;

                // Animate robot to destination
                let currR = readState.robotRow, currC = readState.robotCol, currD = readState.robotDir;
                TrailManager.captureInitialState('read-grid', currR, currC, currD);
                for (const cmd of readState.program) {
                    const res = moveRobot({ robotRow: currR, robotCol: currC, robotDir: currD, obstacles: readState.obstacles }, cmd);
                    currR = res.robotRow; currC = res.robotCol; currD = res.robotDir;
                    renderRobot('read-grid', 'read-robot', currR, currC, currD);

                    if (cmd === 'forward' || cmd === 'backward') {
                        await sleep(350);
                        TrailManager.addSegment('read-grid', currR, currC);
                    }

                    await sleep(currentSpeed - (cmd === 'forward' || cmd === 'backward' ? 350 : 0));
                }

                playSound('success');
                handleStreakCelebration(1, false, false); // Read: light celebration, no streak
                showToast(`Excellent ! C'est la bonne réponse !`, 'success');

                if (readGlobalStreak > 0) {
                    const readIsExtreme = (readState.difficulty === 'extreme');
                    if (readGlobalStreak > readGlobalStreakBest) readGlobalStreakBest = readGlobalStreak;
                    const readNewRecord = (readGlobalStreak === readGlobalStreakBest);
                    handleStreakCelebration(readGlobalStreak, readIsExtreme, readNewRecord);
                }

            } else {
                playSound('error');
                if (cell) {
                    cell.style.background = 'rgba(239, 68, 68, 0.4)'; // rouge
                    setTimeout(() => cell.style.background = '', 1000);
                }
                readGlobalStreak = 0;
                readState.mistakes = (readState.mistakes || 0) + 1;
                simState.consecutiveMistakes++;
                if (simState.consecutiveMistakes >= 5) unlockSkin('botanique');
                ScoreManager.addMistake("read", readState.difficulty);
                document.getElementById('read-global-streak').textContent = readGlobalStreak;
                showToast('Faux. Essaie encore !', 'error');
                readState.locked = false;
            }

            if (isCorrect) {
                document.getElementById('btn-next-read').style.display = 'inline-flex';
                setTimeout(() => { if (document.getElementById('btn-next-read').style.display !== 'none' && activeTab === 'read') newReadChallenge(); }, 3000);
            }
            readState.isAnimating = false;
        }

        function newChallenge() {
            if (chalState.isAnimating) return;
            chalState.mistakes = 0;
            chalState.locked = false; document.getElementById('btn-next-challenge').style.display = 'none';

            const chal = generateChallengePath(chalState.difficulty);
            chalState.robotRow = chal.startR; chalState.robotCol = chal.startC; chalState.robotDir = chal.startD;
            chalState.targetRow = chal.targetR; chalState.targetCol = chal.targetC;
            chalState.correctProgram = chal.correct; chalState.obstacles = chal.obstacles;

            const numOptions = 3;
            const correctIdx = randomInt(0, numOptions - 1); const options = [];

            for (let i = 0; i < numOptions; i++) {
                if (i === correctIdx) options.push({ cmds: chal.correct, isCorrect: true });
                else options.push({ cmds: generateFakeOption(chal.correct, chal.startR, chal.startC, chal.startD, chal.targetR, chal.targetC, chal.obstacles), isCorrect: false });
            }
            chalState.options = options;

            buildGrid('chal-grid', GRID_ROWS, GRID_COLS, chal.obstacles);
            renderRobot('chal-grid', 'chal-robot', chal.startR, chal.startC, chal.startD);
            TrailManager.clear('chal-grid');
            renderTarget('chal-grid', 'chal-target', chal.targetR, chal.targetC);
            renderChallengeOptions();

            // Afficher l'indice "reculer" uniquement en mode Extrême
            const hintEl = document.getElementById('chal-hint');
            if (hintEl) hintEl.style.display = chalState.difficulty === 'extreme' ? 'block' : 'none';
        }

        window.newChallenge = newChallenge;

        function renderChallengeOptions() {
            const container = document.getElementById('chal-options'); const labels = ['A', 'B', 'C'];
            container.innerHTML = chalState.options.map((opt, i) => {
                const cmds = opt.cmds.map(cmd => `<div class="mini-cmd">${AT_SVGS[cmd]}</div>`).join('');
                return `<div class="challenge-option" data-idx="${i}" tabindex="0" data-index="${i}"><span class="option-label">${labels[i]}</span><div class="option-cmds">${cmds}</div></div>`;
            }).join('');
        }

        async function pickOption(idx) {
            if (chalState.isAnimating) return;
            if (chalState.locked && !chalState.options[idx].isCorrect) return;

            playSound('click'); chalState.isAnimating = true;
            const opts = document.querySelectorAll('.challenge-option');
            opts.forEach(o => o.classList.add('locked'));

            const option = chalState.options[idx]; const el = opts[idx];

            // Reset robot to start for this attempt
            let startR = chalState.robotRow, startC = chalState.robotCol, startD = chalState.robotDir;
            let r = startR, c = startC, d = startD;

            TrailManager.clear('chal-grid');
            TrailManager.captureInitialState('chal-grid', r, c, d);
            renderRobot('chal-grid', 'chal-robot', r, c, d);

            for (const cmd of option.cmds) {
                const result = moveRobot({ robotRow: r, robotCol: c, robotDir: d, obstacles: chalState.obstacles }, cmd);
                r = result.robotRow; c = result.robotCol; d = result.robotDir;

                // Déplacer le robot d'abord (déclenche la transition CSS)
                renderRobot('chal-grid', 'chal-robot', r, c, d);

                if (result.blocked) {
                    playSound('error');
                    document.getElementById('chal-robot').classList.add('shake');
                    setTimeout(() => document.getElementById('chal-robot').classList.remove('shake'), 350);

                    // Shake global de la fenêtre
                    document.body.classList.add('window-shake');
                    setTimeout(() => document.body.classList.remove('window-shake'), 500);
                    break;
                }

                // Tracé synchronisé : attendre la fin de la transition CSS du robot, puis tracer
                if (cmd === 'forward' || cmd === 'backward') {
                    await sleep(350);
                    TrailManager.addSegment('chal-grid', r, c);
                }

                // Pause après chaque commande (y compris les rotations)
                await sleep(currentSpeed - (cmd === 'forward' || cmd === 'backward' ? 350 : 0));
            }

            if (!chalState.locked) {
                chalState.locked = true;
                if (option.isCorrect) {
                    playSound('success');
                    simState.consecutiveMistakes = 0;

                    globalScore++;
                    globalStreak++;
                    if (globalStreak > globalStreakBest) globalStreakBest = globalStreak;
                    ScoreManager.addSuccess("chal", chalState.difficulty, chalState.mistakes || 0);
                    updateExtremeVisibility();

                    document.getElementById('global-score').textContent = globalScore;
                    document.getElementById('global-streak').textContent = globalStreak;

                    const chalIsExtreme = (chalState.difficulty === 'extreme');
                    const chalActualNewRecord = (globalStreak === globalStreakBest);
                    handleStreakCelebration(globalStreak, chalIsExtreme, chalActualNewRecord);

                    // Déblocages
                    if (chalState.difficulty === 'extreme' && (!chalState.mistakes || chalState.mistakes === 0)) unlockSkin('cyberbot');
                    
                    if (chalState.difficulty !== 'easy') {
                        f1Streak++;
                    } else {
                        f1Streak = 0;
                    }

                    if (f1Streak >= 3) unlockSkin('f1');

                    showToast(`Bravo ! Pilotage réussi !`, 'success');
                    el.classList.add('correct');
                    const target = document.getElementById('chal-target');
                    if (target) target.classList.add('pulse');
                } else {
                    playSound('error');
                    el.classList.add('wrong');
                    globalStreak = 0;
                    f1Streak = 0;
                    chalState.mistakes = (chalState.mistakes || 0) + 1;
                    simState.consecutiveMistakes++;
                    if (simState.consecutiveMistakes >= 5) unlockSkin('botanique');
                    ScoreManager.addMistake("chal", chalState.difficulty);
                    document.getElementById('global-streak').textContent = globalStreak;
                    chalState.options.forEach((o, j) => { if (o.isCorrect) opts[j].classList.add('correct'); });
                    showToast('Faux. Clique sur la proposition en vert pour voir la solution.', 'error');
                }
                document.getElementById('btn-next-challenge').style.display = 'inline-flex';
                if (option.isCorrect) setTimeout(() => { if (document.getElementById('btn-next-challenge').style.display !== 'none' && activeTab === 'challenge') newChallenge(); }, 3000);
            } else if (option.isCorrect) {
                playSound('success');
                const target = document.getElementById('chal-target');
                if (target) target.classList.add('pulse');
            }
            chalState.isAnimating = false;
        }

        /* ================================================================
           GRILLE ET AFFICHAGE
           ================================================================ */

        // --- Effet Océan ---
        let oceanRippleInterval = null;

        function startOceanRipples() {
            if (oceanRippleInterval) clearInterval(oceanRippleInterval);
            oceanRippleInterval = setInterval(() => {
                if (activeSkin !== 'pirate' && activeSkin !== 'manta') return;
                const row = Math.floor(Math.random() * GRID_ROWS);
                const col = Math.floor(Math.random() * GRID_COLS);
                triggerRipple(row, col);
            }, 5000);
        }

        function stopOceanRipples() {
            if (oceanRippleInterval) {
                clearInterval(oceanRippleInterval);
                oceanRippleInterval = null;
            }
        }

        function triggerRipple(row, col) {
            for (let r = 0; r < GRID_ROWS; r++) {
                for (let c = 0; c < GRID_COLS; c++) {
                    const dist = Math.abs(r - row) + Math.abs(c - col);
                    const delay = dist * 900;

                    setTimeout(() => {
                        // Trouver les cellules dans toutes les grilles possibles
                        const grids = ['explore-grid', 'sim-grid', 'chal-grid', 'read-grid', 'draw-grid'];
                        grids.forEach(gridId => {
                            const cellId = `${gridId}-cell-${r}-${c}`;
                            const cell = document.getElementById(cellId);
                            if (cell) {
                                cell.classList.add('ripple');
                                cell.classList.remove('ripple-fade');
                                setTimeout(() => {
                                    cell.classList.add('ripple-fade');
                                    cell.classList.remove('ripple');
                                }, 600);
                            }
                        });
                    }, delay);
                }
            }
        }

        function updateGridContainersAspectRatio() {
            const containers = document.querySelectorAll('.bot-grid-container');
            containers.forEach(container => {
                container.style.aspectRatio = `${GRID_COLS} / ${GRID_ROWS}`;
                container.style.setProperty('--grid-cols', GRID_COLS);
                container.style.setProperty('--grid-rows', GRID_ROWS);
            });
            const grids = document.querySelectorAll('.bot-grid');
            grids.forEach(grid => {
                grid.style.aspectRatio = `${GRID_COLS} / ${GRID_ROWS}`;
            });
        }

        function buildGrid(containerId, rows, cols, obstacles = []) {
            const grid = document.getElementById(containerId);
            grid.innerHTML = ''; grid.style.position = 'relative';
            grid.setAttribute('role', 'grid');
            grid.setAttribute('aria-label', `Grille ${rows}x${cols}`);

            updateGridContainersAspectRatio();

            // Appliquer la classe du skin à la grille pour le CSS
            Array.from(grid.classList).forEach(cls => {
                if (cls.startsWith('skin-')) grid.classList.remove(cls);
            });
            if (activeSkin !== 'volcano') {
                grid.classList.remove('ground-fire');
            }
            if (activeSkin !== 'pirate' && activeSkin !== 'manta') {
                grid.classList.remove('ground-ocean');
            } else {
                grid.classList.add('ground-ocean');
            }
            grid.classList.add(`skin-${activeSkin}`);

            // Appliquer la classe du tapis
            Array.from(grid.classList).forEach(cls => {
                if (cls.startsWith('mat-')) grid.classList.remove(cls);
            });
            if (activeMat !== 'none') {
                grid.classList.add(`mat-${activeMat}`);
            }

            // Build a 2D array representation of obstacles for O(1) lookups
            const obsGrid = Array(rows);
            for (let r = 0; r < rows; r++) {
                obsGrid[r] = Array(cols).fill(false);
            }
            if (obstacles && obstacles.length > 0) {
                for (let i = 0; i < obstacles.length; i++) {
                    const o = obstacles[i];
                    if (o.r >= 0 && o.r < rows && o.c >= 0 && o.c < cols) {
                        obsGrid[o.r][o.c] = true;
                    }
                }
            }

            for (let r = 0; r < rows; r++) {
                const row = document.createElement('div'); row.className = 'grid-row';
                row.setAttribute('role', 'row');
                for (let c = 0; c < cols; c++) {
                    const cell = document.createElement('div');
                    cell.className = 'bot-cell ' + ((r + c) % 2 === 0 ? 'cell-light' : 'cell-dark');
                    cell.setAttribute('role', 'gridcell');
                    cell.id = `${containerId}-cell-${r}-${c}`;
                    const isObstacle = obsGrid[r][c];
                    if (isObstacle) {
                        cell.classList.add('obstacle');
                        const obs = SKIN_CONFIG[activeSkin].obstacle;
                        if (obs.includes('<svg') || obs.includes('<i')) {
                            cell.innerHTML = obs;
                        } else {
                            cell.dataset.obstacle = obs;
                        }
                    } else if (MAT_CONFIG[activeMat] && MAT_CONFIG[activeMat].content) {
                        // Ajouter le texte du tapis si ce n'est pas un obstacle et si un tapis avec du contenu est sélectionné
                        const content = MAT_CONFIG[activeMat].content;
                        const index = r * cols + c;
                        if (index < content.length) {
                            const span = document.createElement('span');
                            span.className = 'mat-content';
                            span.innerHTML = content[index];
                            cell.appendChild(span);
                        }
                    }
                    cell.dataset.row = r; cell.dataset.col = c;
                    cell.setAttribute('aria-label', `Ligne ${r + 1}, colonne ${c + 1}, ${isObstacle ? SKIN_CONFIG[activeSkin].name + ' Obstacle' : 'Vide'}`);

                    row.appendChild(cell);
                }
                grid.appendChild(row);
            }
            window.fa?.createIcons?.();
        }

        function placeOverlay(containerId, overlayId, row, col, content, extraClass, ariaLabel = '') {
            let ov = document.getElementById(overlayId);
            const isNew = !ov;
            if (isNew) {
                ov = document.createElement('div'); ov.id = overlayId; ov.className = extraClass || '';
            }
            if (content !== null) {
                if (content.startsWith('<')) {
                    ov.innerHTML = content;
                } else {
                    ov.innerText = content;
                }
            }
            ov.style.width = (100 / GRID_COLS) + '%';
            ov.style.height = (100 / GRID_ROWS) + '%';
            ov.style.transform = `translate(${col * 100}%, ${row * 100}%)`;
            ov.setAttribute('role', 'img');
            if (ariaLabel) ov.setAttribute('aria-label', ariaLabel);
            if (isNew) document.getElementById(containerId).appendChild(ov);
        }

        function initVolcanoAnimation() {
            const triggerDragonFire = () => {
                const scheduleNext = () => {
                    window.dragonFireTimeout = setTimeout(triggerDragonFire, Math.random() * 8000 + 5000);
                };

                const cvs = document.getElementById('dragon-fire-canvas');
                if (!cvs) { scheduleNext(); return; }

                let activeOverlay = null;
                if (typeof activeTab !== 'undefined') {
                    activeOverlay = document.getElementById(activeTab + '-robot');
                } else {
                    const overlays = document.querySelectorAll('.robot-overlay');
                    for (let i = 0; i < overlays.length; i++) {
                        const rect = overlays[i].getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0) {
                            activeOverlay = overlays[i];
                            break;
                        }
                    }
                }

                if (!activeOverlay || !document.contains(activeOverlay)) { scheduleNext(); return; }

                const rect = activeOverlay.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) { scheduleNext(); return; }

                const ctx = cvs.getContext('2d');
                cvs.width = window.innerWidth;
                cvs.height = window.innerHeight;

                let startX = rect.left + rect.width / 2;
                let startY = rect.top + rect.height / 2;

                let parts = [];
                let frameCount = 0;

                // Calculate angle and origin based on current robot orientation
                let currentDir = 0;
                const body = activeOverlay.querySelector('.robot-body');
                if (body && body.style.transform) {
                    const match = body.style.transform.match(/rotate\(([-\d.]+)deg\)/);
                    if (match) {
                        let deg = parseFloat(match[1]);
                        let dirIndex = Math.round(deg / 90);
                        currentDir = ((dirIndex % 4) + 4) % 4;
                    }
                }

                let baseAngle = -Math.PI / 2; // Up by default
                if (currentDir === 0) startY -= 40; // Up
                if (currentDir === 1) { baseAngle = 0; startX += 40; } // Right
                if (currentDir === 2) { baseAngle = Math.PI / 2; startY += 40; } // Down
                if (currentDir === 3) { baseAngle = Math.PI; startX -= 40; } // Left

                function createParticle() {
                    const angle = baseAngle + (Math.random() - 0.5) * (Math.PI / 3);
                    const speed = Math.random() * 8 + 4;
                    const cols = ['#fef08a', '#fde047', '#f59e0b', '#ea580c', '#dc2626', '#991b1b', '#292524'];

                    parts.push({
                        x: startX + (Math.random() - 0.5) * 10,
                        y: startY + (Math.random() - 0.5) * 10,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        c: cols[Math.floor(Math.random() * cols.length)],
                        s: Math.random() * 15 + 5,
                        life: 1.0,
                        decay: Math.random() * 0.03 + 0.025
                    });
                }

                for (let i = 0; i < 27; i++) createParticle();

                function anim() {
                    if (!document.contains(activeOverlay)) {
                        ctx.clearRect(0, 0, cvs.width, cvs.height);
                        scheduleNext();
                        return;
                    }

                    ctx.clearRect(0, 0, cvs.width, cvs.height);

                    if (frameCount < 20) {
                        for (let i = 0; i < 3; i++) createParticle();
                    }
                    frameCount++;

                    let alive = false;

                    ctx.globalCompositeOperation = 'screen';

                    for (let i = parts.length - 1; i >= 0; i--) {
                        let p = parts[i];
                        p.x += p.vx;
                        p.y += p.vy;
                        p.s *= 0.95;
                        p.life -= p.decay;

                        if (p.life > 0 && p.s > 0.5) {
                            alive = true;
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
                            ctx.fillStyle = p.c;
                            ctx.globalAlpha = p.life;
                            ctx.fill();
                        } else {
                            parts.splice(i, 1);
                        }
                    }

                    ctx.globalCompositeOperation = 'source-over';
                    ctx.globalAlpha = 1.0;

                    if (alive) {
                        window.dragonFireAnimFrame = requestAnimationFrame(anim);
                    } else {
                        scheduleNext();
                    }
                }
                anim();
            };

            if (!window.dragonFireActive) {
                window.dragonFireActive = true;
                window.dragonFireTimeout = setTimeout(triggerDragonFire, Math.random() * 8000 + 5000);
            }
        }

        function renderRobot(containerId, overlayId, row, col, dirIndex) {
            const deg = dirIndex * 90;
            const normalizedDir = ((dirIndex % 4) + 4) % 4;
            const directions = ['Haut', 'Droite', 'Bas', 'Gauche'];
            const dirStr = directions[normalizedDir] || 'Haut';
            const ariaMsg = `Robot en ligne ${row + 1}, colonne ${col + 1}, orienté vers ${dirStr}`;

            const existingOverlay = document.getElementById(overlayId);
            const needsFullRender = !existingOverlay || existingOverlay.dataset.skin !== activeSkin;

            if (needsFullRender) {
                let svg = ROBOT_SVGS[activeSkin] || ROBOT_SVGS['default'];
                svg = svg.replace(/id="([^"]+)"/g, `id="$1_${containerId}"`)
                         .replace(/url\(#([^)]+)\)/g, `url(#$1_${containerId})`)
                         .replace(/href="#([^"]+)"/g, `href="#$1_${containerId}"`);
                const html = `<div class="robot-body" style="transform:rotate(${deg}deg)">${svg}</div>`;
                placeOverlay(containerId, overlayId, row, col, html, 'robot-overlay', ariaMsg);
                document.getElementById(overlayId).dataset.skin = activeSkin;
            } else {
                placeOverlay(containerId, overlayId, row, col, null, 'robot-overlay', ariaMsg);
                const robotBody = existingOverlay.querySelector('.robot-body');
                if (robotBody) {
                    robotBody.style.transform = `rotate(${deg}deg)`;
                }
            }

            // Update aria-live region to announce position to screen readers
            const liveRegion = document.getElementById(containerId + '-aria-live');
            if (liveRegion) {
                liveRegion.textContent = ariaMsg;
            } else {
                // Global fallback
                const globalLive = document.getElementById('robot-aria-live');
                if (globalLive) globalLive.textContent = ariaMsg;
            }

            const overlay = document.getElementById(overlayId);

            if (overlay) {
                overlay.style.cursor = 'pointer'; // Make it clear it's clickable
                overlay.onclick = (e) => {
                    // Prevent switching if the simulation is running
                    if (typeof simState !== 'undefined' && simState && simState.running) return;
                    if (typeof chalState !== 'undefined' && chalState && chalState.isAnimating) return;
                    if (typeof readState !== 'undefined' && readState && readState.isAnimating) return;
                    if (typeof drawState !== 'undefined' && drawState && drawState.isAnimating) return;
                    e.preventDefault();
                    e.stopPropagation();

                    // Calculate next skin based on SKIN_CONFIG order, filtering for unlocked ones
                    const availableSkins = Object.keys(SKIN_CONFIG).filter(id => unlockedSkins.includes(id));
                    const currentIndex = availableSkins.indexOf(activeSkin);
                    if (currentIndex !== -1 && availableSkins.length > 1) {
                        const nextSkinId = availableSkins[(currentIndex + 1) % availableSkins.length];
                        selectSkin(nextSkinId);
                    }
                };
            }

            if (overlay && (containerId === 'sim-grid' || containerId === 'explore-grid')) {
                overlay.setAttribute('draggable', 'true');
                overlay.ondragstart = (e) => {
                    const isExplore = containerId === 'explore-grid';
                    if ((isExplore && typeof exploreState !== 'undefined' && exploreState.running) || 
                        (!isExplore && typeof simState !== 'undefined' && simState.running)) {
                        e.preventDefault();
                        return;
                    }
                    e.dataTransfer.setData('text/plain', 'robot');
                    e.dataTransfer.effectAllowed = 'move';
                };
            }

            // Clear previous volcano loops if any (only if we're not using the volcano skin, so we don't break moving animation)
            if (activeSkin !== 'volcano') {
                if (window.dragonFireTimeout) clearTimeout(window.dragonFireTimeout);
                if (window.dragonFireAnimFrame) cancelAnimationFrame(window.dragonFireAnimFrame);
                window.dragonFireActive = false;

                // Clear the canvas to ensure no frozen fire particles are left when robot changes/moves
                const cvs = document.getElementById('dragon-fire-canvas');
                if (cvs) {
                    const ctx = cvs.getContext('2d');
                    ctx.clearRect(0, 0, cvs.width, cvs.height);
                }
            }

            if (overlay) {
                if (activeSkin === 'volcano') {
                    initVolcanoAnimation();
                }
            }

        }

        function renderTarget(containerId, overlayId, row, col) {
            const targetChar = SKIN_CONFIG[activeSkin].target || '⭐';
            const wrappedContent = `<div class="target-inner">${targetChar}</div>`;
            placeOverlay(containerId, overlayId, row, col, wrappedContent, 'target-overlay', `Cible en ligne ${row + 1}, colonne ${col + 1}`);

            const targetOverlay = document.getElementById(overlayId);
            if (targetOverlay) {
                if (activeSkin === 'space') targetOverlay.classList.add('glow-space');
                else targetOverlay.classList.remove('glow-space');
            }
        }

