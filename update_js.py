import re

with open('alpha/webapps/jeu_de_la_grue.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the script content
js_search = """        let currentMode = 'collect'; // 'collect' ou 'deliver'
        let currentDifficulty = 'medium'; // 'easy', 'medium', 'hard'

        let globalCorrect = 0;
        let globalStreak = 0;
        let globalBest = 0;

        let gridCols = 5;
        let gridRows = 5;
        let crane = { x: 2, y: 0, holding: false };

        let objects = [];
        let targets = [];

        const feedbackMsg = document.getElementById('feedback-msg');
        const gridEl = document.getElementById('grid');
        const actionTextEl = document.getElementById('action-text');

        function init() {
            setupEventListeners();
            startNewLevel();
            ScoreManager.init('jeu_de_la_grue');
        }

        function setupEventListeners() {
            document.getElementById('tab-collect').addEventListener('click', () => setMode('collect'));
            document.getElementById('tab-deliver').addEventListener('click', () => setMode('deliver'));

            document.getElementById('diff-easy').addEventListener('click', () => setDifficulty('easy'));
            document.getElementById('diff-medium').addEventListener('click', () => setDifficulty('medium'));
            document.getElementById('diff-hard').addEventListener('click', () => setDifficulty('hard'));

            window.addEventListener('keydown', (e) => {
                if (e.repeat) return;

                // Allow keyboard control only if no modal or input is focused
                if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

                switch(e.key) {
                    case 'ArrowUp': e.preventDefault(); moveCrane(0, -1); break;
                    case 'ArrowDown': e.preventDefault(); moveCrane(0, 1); break;
                    case 'ArrowLeft': e.preventDefault(); moveCrane(-1, 0); break;
                    case 'ArrowRight': e.preventDefault(); moveCrane(1, 0); break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault(); actionCrane(); break;
                }
            });

            window.addEventListener('c2_change_difficulty', (e) => {
                const nextDiff = e.detail.difficulty;
                if (nextDiff === '4') document.getElementById('diff-easy')?.click();
                else if (nextDiff === '6') document.getElementById('diff-medium')?.click();
                else if (nextDiff === '8') document.getElementById('diff-hard')?.click();
            });
        }

        function setMode(mode) {
            currentMode = mode;
            document.getElementById('tab-collect').classList.toggle('active', mode === 'collect');
            document.getElementById('tab-deliver').classList.toggle('active', mode === 'deliver');
            startNewLevel();
        }

        function setDifficulty(diff) {
            currentDifficulty = diff;
            document.querySelectorAll('.diff-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`diff-${diff}`).classList.add('active');
            startNewLevel();
        }

        function startNewLevel() {
            if (currentDifficulty === 'easy') { gridCols = 4; gridRows = 4; }
            else if (currentDifficulty === 'medium') { gridCols = 5; gridRows = 5; }
            else if (currentDifficulty === 'hard') { gridCols = 6; gridRows = 6; }

            crane = { x: Math.floor(gridCols / 2), y: 0, holding: false };
            objects = [];
            targets = [];
            feedbackMsg.textContent = '';
            feedbackMsg.className = 'feedback';

            let numObjects = currentDifficulty === 'easy' ? 1 : (currentDifficulty === 'medium' ? 2 : 3);

            let cells = [];
            for(let i=0; i<gridCols; i++) {
                for(let j=1; j<gridRows; j++) {
                    cells.push({x: i, y: j});
                }
            }
            cells.sort(() => Math.random() - 0.5);

            for(let i=0; i<numObjects; i++) {
                let cell = cells.pop();
                objects.push({ id: i, x: cell.x, y: cell.y, delivered: false });
            }

            if (currentMode === 'deliver') {
                for(let i=0; i<numObjects; i++) {
                    let cell = cells.pop();
                    targets.push({ id: i, x: cell.x, y: cell.y });
                }
            }

            renderGrid();
        }

        function renderGrid() {
            gridEl.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
            gridEl.innerHTML = '';

            for(let y=0; y<gridRows; y++) {
                for(let x=0; x<gridCols; x++) {
                    let cellEl = document.createElement('div');
                    cellEl.className = 'cell';

                    let isTarget = targets.some(t => t.x === x && t.y === y);
                    if (isTarget) {
                        let targetEl = document.createElement('div');
                        targetEl.className = 'target-overlay';
                        cellEl.appendChild(targetEl);
                    }

                    let obj = objects.find(o => o.x === x && o.y === y && !o.delivered);
                    if (obj && !(crane.x === x && crane.y === y && crane.holding === obj.id)) {
                        let objEl = document.createElement('i');
                        objEl.setAttribute('data-lucide', 'package');
                        objEl.className = 'object-icon';
                        cellEl.appendChild(objEl);
                    }

                    if (crane.x === x && crane.y === y) {
                        let craneEl = document.createElement('div');
                        craneEl.className = 'crane-overlay';
                        if (crane.holding !== false) {
                            craneEl.innerHTML = `<i data-lucide="crosshair" class="crane-icon crane-holding"></i>`;
                        } else {
                            craneEl.innerHTML = `<i data-lucide="crosshair" class="crane-icon"></i>`;
                        }
                        cellEl.appendChild(craneEl);
                    }

                    gridEl.appendChild(cellEl);
                }
            }

            if (crane.holding !== false) {
                actionTextEl.textContent = 'Déposer';
            } else {
                actionTextEl.textContent = 'Attraper';
            }

            lucide.createIcons();
        }

        function moveCrane(dx, dy) {
            let nx = crane.x + dx;
            let ny = crane.y + dy;
            if (nx >= 0 && nx < gridCols && ny >= 0 && ny < gridRows) {
                crane.x = nx;
                crane.y = ny;
                if (crane.holding !== false) {
                    let obj = objects.find(o => o.id === crane.holding);
                    if (obj) {
                        obj.x = nx;
                        obj.y = ny;
                    }
                }
                renderGrid();
                playSound('click');
            }
        }

        function actionCrane() {
            if (crane.holding !== false) {
                // Drop
                if (currentMode === 'collect') {
                    // Collect mode shouldn't hold, but just in case
                } else if (currentMode === 'deliver') {
                    let targetIdx = targets.findIndex(t => t.x === crane.x && t.y === crane.y);
                    if (targetIdx !== -1) {
                        // Drop on target
                        let obj = objects.find(o => o.id === crane.holding);
                        obj.delivered = true;
                        crane.holding = false;
                        targets.splice(targetIdx, 1);
                        playSound('success');
                        showFeedback('Bien joué !', 'success');
                        renderGrid();
                        checkWin();
                    } else {
                        // Drop on empty?
                        let otherObj = objects.find(o => o.x === crane.x && o.y === crane.y && o.id !== crane.holding && !o.delivered);
                        if (otherObj) {
                            playSound('error');
                            showFeedback('Case occupée !', 'error');
                        } else {
                            crane.holding = false;
                            playSound('click');
                            renderGrid();
                        }
                    }
                }
            } else {
                // Pick up
                let obj = objects.find(o => o.x === crane.x && o.y === crane.y && !o.delivered);
                if (obj) {
                    if (currentMode === 'collect') {
                        obj.delivered = true;
                        playSound('success');
                        showFeedback('Objet collecté !', 'success');
                        renderGrid();
                        checkWin();
                    } else {
                        crane.holding = obj.id;
                        playSound('click');
                        renderGrid();
                    }
                } else {
                    playSound('error');
                }
            }
        }

        function checkWin() {
            if (objects.every(o => o.delivered)) {
                updateScore(true);
                setTimeout(() => {
                    launchConfetti();
                    playSound('win');
                    startNewLevel();
                }, 1000);
            }
        }

        function showFeedback(msg, type) {
            feedbackMsg.textContent = msg;
            feedbackMsg.className = `feedback ${type}`;
            setTimeout(() => {
                feedbackMsg.textContent = '';
                feedbackMsg.className = 'feedback';
            }, 2000);
        }

        function updateScore(correct) {
            if (correct) {
                globalCorrect++;
                globalStreak++;
                if (globalStreak > globalBest) globalBest = globalStreak;
            } else {
                globalStreak = 0;
            }
            document.getElementById('global-correct').textContent = globalCorrect;
            document.getElementById('global-streak').textContent = globalStreak;
            document.getElementById('global-best').textContent = globalBest;

            ScoreManager.updateScore(globalCorrect, globalStreak, globalBest);
        }"""

js_replace = """        let currentDifficulty = 'medium'; // 'easy', 'medium', 'hard'
        let globalCorrect = 0, globalStreak = 0, globalBest = 0;

        const NUM_CUPS = 3;
        const MAX_STACK = 3;

        let cups = [[], [], []];
        let initialCupsState = [[], [], []];
        let targetCups = [[], [], []];

        let craneState = { pos: 0, height: 0, holding: null };
        let program = [];
        let isExecuting = false;

        const feedbackMsg = document.getElementById('feedback-msg');
        const targetBoardEl = document.getElementById('target-board');
        const mainBoardEl = document.getElementById('main-board');
        const craneEl = document.getElementById('crane');
        const craneArmEl = document.getElementById('crane-arm');
        const craneClawEl = document.getElementById('crane-claw');
        const programStrip = document.getElementById('program-strip');
        const playBtn = document.getElementById('play-btn');

        function init() {
            setupEventListeners();
            startNewLevel();
            ScoreManager.init('jeu_de_la_grue');
        }

        function setupEventListeners() {
            document.getElementById('diff-easy').addEventListener('click', () => setDifficulty('easy'));
            document.getElementById('diff-medium').addEventListener('click', () => setDifficulty('medium'));
            document.getElementById('diff-hard').addEventListener('click', () => setDifficulty('hard'));

            window.addEventListener('keydown', (e) => {
                if (e.repeat || isExecuting) return;
                if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

                switch(e.key) {
                    case 'ArrowUp': e.preventDefault(); addInstruction('up'); break;
                    case 'ArrowDown': e.preventDefault(); addInstruction('down'); break;
                    case 'ArrowLeft': e.preventDefault(); addInstruction('left'); break;
                    case 'ArrowRight': e.preventDefault(); addInstruction('right'); break;
                    case ' ': e.preventDefault(); addInstruction('action'); break;
                    case 'Enter': e.preventDefault(); executeProgram(); break;
                    case 'Backspace': e.preventDefault(); deleteLastInstruction(); break;
                }
            });

            window.addEventListener('c2_change_difficulty', (e) => {
                const nextDiff = e.detail.difficulty;
                if (nextDiff === '4') document.getElementById('diff-easy')?.click();
                else if (nextDiff === '6') document.getElementById('diff-medium')?.click();
                else if (nextDiff === '8') document.getElementById('diff-hard')?.click();
            });
        }

        function setDifficulty(diff) {
            currentDifficulty = diff;
            document.querySelectorAll('.diff-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`diff-${diff}`).classList.add('active');
            startNewLevel();
        }

        function generateRandomState(numBlocks) {
            let state = [[], [], []];
            for(let i=0; i<numBlocks; i++) {
                let cupIdx;
                do {
                    cupIdx = Math.floor(Math.random() * NUM_CUPS);
                } while (state[cupIdx].length >= MAX_STACK);
                state[cupIdx].push({ id: i, color: `hsl(${Math.random()*360}, 70%, 50%)` });
            }
            return state;
        }

        function startNewLevel() {
            isExecuting = false;
            program = [];
            clearProgram();

            let numBlocks = currentDifficulty === 'easy' ? 1 : (currentDifficulty === 'medium' ? 2 : 3);

            cups = generateRandomState(numBlocks);
            targetCups = generateRandomState(numBlocks);

            // Ensure they are different
            while (JSON.stringify(cups) === JSON.stringify(targetCups)) {
                targetCups = generateRandomState(numBlocks);
            }

            initialCupsState = JSON.parse(JSON.stringify(cups));
            craneState = { pos: 0, height: 0, holding: null };

            feedbackMsg.textContent = '';
            feedbackMsg.className = 'feedback';

            renderAll();
        }

        function resetToInitial() {
            cups = JSON.parse(JSON.stringify(initialCupsState));
            craneState = { pos: 0, height: 0, holding: null };
            renderAll();
        }

        function renderAll() {
            renderBoard(targetCups, targetBoardEl, true);
            renderBoard(cups, mainBoardEl, false);
            updateCraneVisuals();
            lucide.createIcons();
        }

        function renderBoard(boardState, container, isTarget) {
            container.innerHTML = '';
            for(let i=0; i<NUM_CUPS; i++) {
                let cupEl = document.createElement('div');
                cupEl.className = 'cup';
                if (!isTarget) cupEl.id = `cup-${i}`;

                // Render from bottom to top, flex column-reverse handles this naturally
                for(let j=0; j<boardState[i].length; j++) {
                    let block = boardState[i][j];
                    let blockEl = document.createElement('div');
                    blockEl.className = 'cube';
                    // blockEl.style.background = block.color; // Using default blue for simplicity now
                    cupEl.appendChild(blockEl);
                }
                container.appendChild(cupEl);
            }
        }

        function updateCraneVisuals() {
            const cupWidth = 60;
            const gap = 15;
            const baseX = craneState.pos * (cupWidth + gap);

            craneEl.style.left = `${baseX}px`;

            // Height visual mapping
            const baseArmHeight = 40;
            const dropPerLevel = 50;
            craneArmEl.style.height = `${baseArmHeight + (craneState.height * dropPerLevel)}px`;

            if (craneState.holding) {
                craneEl.classList.add('holding');
            } else {
                craneEl.classList.remove('holding');
            }
        }

        function addInstruction(type) {
            if (isExecuting) return;
            program.push(type);
            renderProgram();
            playSound('click');
        }

        function deleteLastInstruction() {
            if (isExecuting || program.length === 0) return;
            program.pop();
            renderProgram();
            playSound('click');
        }

        function clearProgram() {
            if (isExecuting) return;
            program = [];
            renderProgram();
        }

        function renderProgram() {
            programStrip.innerHTML = '';
            program.forEach((inst, idx) => {
                let stepEl = document.createElement('div');
                stepEl.className = 'prog-step';
                stepEl.id = `prog-step-${idx}`;

                let icon = '';
                if(inst === 'up') icon = 'arrow-up';
                else if(inst === 'down') icon = 'arrow-down';
                else if(inst === 'left') icon = 'arrow-left';
                else if(inst === 'right') icon = 'arrow-right';
                else if(inst === 'action') icon = 'grip-horizontal';

                stepEl.innerHTML = `<i data-lucide="${icon}"></i>`;
                programStrip.appendChild(stepEl);
            });
            lucide.createIcons();
            playBtn.disabled = program.length === 0;
        }

        const delay = ms => new Promise(res => setTimeout(res, ms));

        async function executeProgram() {
            if (isExecuting || program.length === 0) return;
            isExecuting = true;
            playBtn.disabled = true;
            resetToInitial(); // Reset before run

            feedbackMsg.textContent = 'Exécution...';
            feedbackMsg.className = 'feedback';

            for(let i=0; i<program.length; i++) {
                document.querySelectorAll('.prog-step').forEach(el => el.classList.remove('active'));
                let currentStepEl = document.getElementById(`prog-step-${i}`);
                if(currentStepEl) currentStepEl.classList.add('active');

                let inst = program[i];
                let success = processInstruction(inst);

                renderAll();

                if (!success) {
                    playSound('error');
                    showFeedback('Erreur : Mouvement impossible !', 'error');
                    isExecuting = false;
                    playBtn.disabled = false;
                    document.querySelectorAll('.prog-step').forEach(el => el.classList.remove('active'));
                    return;
                }

                playSound('click');
                await delay(600);
            }

            document.querySelectorAll('.prog-step').forEach(el => el.classList.remove('active'));
            checkWin();
        }

        function processInstruction(inst) {
            if (inst === 'left') {
                if (craneState.pos > 0) {
                    craneState.pos--;
                    return true;
                }
                return false;
            } else if (inst === 'right') {
                if (craneState.pos < NUM_CUPS - 1) {
                    craneState.pos++;
                    return true;
                }
                return false;
            } else if (inst === 'down') {
                if (craneState.height < MAX_STACK) {
                    craneState.height++;
                    return true;
                }
                return false;
            } else if (inst === 'up') {
                if (craneState.height > 0) {
                    craneState.height--;
                    return true;
                }
                return false;
            } else if (inst === 'action') {
                let currentStack = cups[craneState.pos];
                // Distance from top of cup
                let blocksInCup = currentStack.length;
                let requiredHeightForAction = MAX_STACK - blocksInCup; // 0 height is top, 3 height is bottom

                if (craneState.holding) {
                    // Try to drop
                    if (blocksInCup < MAX_STACK) { // Needs to be exactly above the top block
                        // In a real precise model, height would need to match. For simplicity and kids,
                        // if they are at or above the drop zone, let it drop, but to teach precision, let's enforce height match
                        if (craneState.height === requiredHeightForAction) {
                            currentStack.push(craneState.holding);
                            craneState.holding = null;
                            return true;
                        }
                    }
                    return false;
                } else {
                    // Try to grab
                    if (blocksInCup > 0) {
                        let requiredHeightForGrab = MAX_STACK - blocksInCup;
                        if (craneState.height === requiredHeightForGrab) {
                            craneState.holding = currentStack.pop();
                            return true;
                        }
                    }
                    return false;
                }
            }
            return false;
        }

        function checkWin() {
            let isWin = JSON.stringify(cups) === JSON.stringify(targetCups) && !craneState.holding;

            if (isWin) {
                updateScore(true);
                showFeedback('Bien joué !', 'success');
                playSound('win');
                launchConfetti();
                setTimeout(() => {
                    startNewLevel();
                }, 2500);
            } else {
                updateScore(false);
                playSound('error');
                showFeedback('Ce nest pas la bonne disposition.', 'error');
                isExecuting = false;
                playBtn.disabled = false;
            }
        }

        function showFeedback(msg, type) {
            feedbackMsg.textContent = msg;
            feedbackMsg.className = `feedback ${type}`;
            if(type === 'error') {
                setTimeout(() => {
                    feedbackMsg.textContent = '';
                    feedbackMsg.className = 'feedback';
                }, 3000);
            }
        }

        function updateScore(correct) {
            if (correct) {
                globalCorrect++;
                globalStreak++;
                if (globalStreak > globalBest) globalBest = globalStreak;
            } else {
                globalStreak = 0;
            }
            document.getElementById('global-correct').textContent = globalCorrect;
            document.getElementById('global-streak').textContent = globalStreak;
            document.getElementById('global-best').textContent = globalBest;

            ScoreManager.updateScore(globalCorrect, globalStreak, globalBest);
        }"""

content = content.replace(js_search, js_replace)

with open('alpha/webapps/jeu_de_la_grue.html', 'w', encoding='utf-8') as f:
    f.write(content)
