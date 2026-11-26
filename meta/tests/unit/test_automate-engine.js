const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const automateEngineSrc = fs.readFileSync('assets/js/automate/automate-engine.js', 'utf-8');
const automateUiSrc = fs.readFileSync('assets/js/automate/automate-ui.js', 'utf-8');

const treasureBubbleCode = automateUiSrc.substring(
    automateUiSrc.indexOf('window.treasureBubbleState ='),
    automateUiSrc.indexOf('window.triggerTreasureBubble = triggerTreasureBubble;') + 'window.triggerTreasureBubble = triggerTreasureBubble;'.length
);

function setupDOM(url = "http://localhost/") {
    const dom = new JSDOM(`<!DOCTYPE html><html><body>
        <div class="tabs">
            <button class="tab-btn active" id="tab-explore"></button>
            <button class="tab-btn" id="tab-simulator"></button>
        </div>
        <div id="view-explore" class="view active">
            <div id="explore-grid" class="bot-grid"></div>
            <button class="icon-action-btn" id="btn-explore-place-elements"></button>
            <button id="explore-pad-fwd"></button>
        </div>
        <div id="view-simulator" class="view">
            <div id="sim-grid" class="bot-grid"></div>
            <button class="icon-action-btn" id="btn-place-elements"></button>
            <button id="pad-fwd"></button>
            <button id="pad-go"></button>
        </div>
    </body></html>`, { runScripts: "dangerously", url });
    const window = dom.window;

    window.activeTab = 'explore';
    window.activeSkin = 'default';
    window.activeMat = 'none';
    window.MAT_CONFIG = {};
    window.currentSpeed = 400;
    window.showToast = () => {};
    window.unlockSkin = () => {};
    window.playSound = () => {};

    // Evaluate automate-engine.js into the jsdom window environment
    window.eval(automateEngineSrc);
    // Evaluate treasure bubble logic
    window.eval(treasureBubbleCode);

    // Override setTimeout to run callbacks synchronously for testing timer logic without actually waiting
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = (cb, delay) => {
        return originalSetTimeout(cb, delay);
    };

    return window;
}

test('handleSpeechBubbleClick', async (t) => {
    await t.test('updates skin unlock bubble state and DOM text', () => {
        const window = setupDOM();
        const document = window.document;

        // Add elements
        const wrapper = document.createElement('div');
        wrapper.classList.add('skin-speech-bubble-wrapper');
        const bubble = document.createElement('div');
        bubble.classList.add('skin-speech-bubble');
        const textDiv = document.createElement('div');
        textDiv.classList.add('skin-speech-bubble-text');
        bubble.appendChild(textDiv);
        wrapper.appendChild(bubble);
        document.body.appendChild(wrapper);

        // Initialize state
        window.skinUnlockBubbleState = { active: false, timer: null, text: '' };

        // Mock event object
        const mockEvent = {
            stopPropagation: () => {},
        };

        window.handleSpeechBubbleClick(mockEvent);

        assert.strictEqual(window.skinUnlockBubbleState.text, "Clique sur l'automate !");

        const textDivs = document.querySelectorAll('.skin-speech-bubble-text');
        assert.strictEqual(textDivs.length, 1);
        assert.strictEqual(textDivs[0].textContent, "Clique sur l'automate !");
    });

    await t.test('clears previous timer and sets a new one', async () => {
        const window = setupDOM();
        const document = window.document;

        // Add elements
        const wrapper = document.createElement('div');
        wrapper.classList.add('skin-speech-bubble-wrapper');
        const bubble = document.createElement('div');
        bubble.classList.add('skin-speech-bubble');
        const textDiv = document.createElement('div');
        textDiv.classList.add('skin-speech-bubble-text');
        bubble.appendChild(textDiv);
        wrapper.appendChild(bubble);
        document.body.appendChild(wrapper);

        let clearTimeoutCalled = false;
        let mockTimerId = 12345;

        // Mock clearTimeout
        const originalClearTimeout = window.clearTimeout;
        window.clearTimeout = (timer) => {
            if (timer === mockTimerId) clearTimeoutCalled = true;
            originalClearTimeout(timer);
        };

        // Override setTimeout to synchronous for faster test
        window.setTimeout = (cb) => { cb(); return 99999; };

        // Initialize state with an existing timer
        window.skinUnlockBubbleState = { active: true, timer: mockTimerId, text: 'old text' };

        // Mock event
        const mockEvent = { stopPropagation: () => {} };

        window.handleSpeechBubbleClick(mockEvent);

        assert.ok(clearTimeoutCalled, 'clearTimeout should be called for existing timer');
        assert.notStrictEqual(window.skinUnlockBubbleState.timer, mockTimerId, 'A new timer should be created');

        // Assert the state after the synchronous setTimeout callback execution
        assert.strictEqual(window.skinUnlockBubbleState.active, false, 'State should be inactive after timer');

        const wrappers = window.document.querySelectorAll('.skin-speech-bubble-wrapper, .skin-speech-bubble');
        assert.strictEqual(wrappers.length, 0, 'Bubbles should be removed after timer');
    });

    await t.test('calls stopPropagation on the event', () => {
        const window = setupDOM();
        let stopPropagationCalled = false;
        const mockEvent = {
            stopPropagation: () => { stopPropagationCalled = true; }
        };

        window.handleSpeechBubbleClick(mockEvent);

        assert.ok(stopPropagationCalled, 'stopPropagation should be called');
    });
});

test('treasureBubbleState and nudge triggers', async (t) => {
    await t.test('triggerTreasureBubble creates bubble above button and handles click', () => {
        const window = setupDOM();
        const document = window.document;

        assert.strictEqual(window.treasureBubbleState.active, false);

        window.triggerTreasureBubble('explore');

        assert.strictEqual(window.treasureBubbleState.active, true);
        const bubble = document.querySelector('.treasure-speech-bubble');
        assert.ok(bubble, 'Speech bubble should be inserted into DOM');
        const text = document.querySelector('.treasure-speech-bubble-text');
        assert.ok(text.textContent.includes('trésor'), 'Text should mention trésor');

        // Clicking the bubble should trigger click on the button
        let buttonClicked = false;
        document.getElementById('btn-explore-place-elements').addEventListener('click', () => {
            buttonClicked = true;
        });

        bubble.click();
        assert.strictEqual(buttonClicked, true, 'Clicking bubble should trigger the button click');
    });

    await t.test('triggerTreasureBubble is prevented when noNudges=1', () => {
        const window = setupDOM("http://localhost/?noNudges=1");

        window.triggerTreasureBubble('explore');
        assert.strictEqual(window.treasureBubbleState.active, false);
        assert.strictEqual(window.document.querySelectorAll('.treasure-speech-bubble').length, 0);
    });

    await t.test('exploration triggers treasure bubble after 3 moves when targetRow is null', async () => {
        const window = setupDOM();
        window.exploreState = {
            robotRow: 2, robotCol: 2, robotDir: 0,
            targetRow: null, targetCol: null,
            running: false, obstacles: [], failed: false
        };
        window.activeTab = 'explore';
        window.treasureBubbleState.hasPlaced = false;
        window.treasureBubbleState.exploreMoves = 0;

        // Mock sleep and moveRobot
        window.sleep = () => Promise.resolve();
        window.moveRobot = (state) => ({ robotRow: state.robotRow, robotCol: state.robotCol, robotDir: state.robotDir, blocked: false });
        window.renderRobot = () => {};
        window.playSound = () => {};
        window.TrailManager = { states: {}, captureInitialState: () => {}, addSegment: () => {} };

        await window.runSingleCommandExploration('forward');
        assert.strictEqual(window.treasureBubbleState.exploreMoves, 1);
        assert.strictEqual(window.treasureBubbleState.active, false);

        await window.runSingleCommandExploration('forward');
        assert.strictEqual(window.treasureBubbleState.exploreMoves, 2);
        assert.strictEqual(window.treasureBubbleState.active, false);

        await window.runSingleCommandExploration('forward');
        assert.strictEqual(window.treasureBubbleState.exploreMoves, 3);
        assert.strictEqual(window.treasureBubbleState.active, true);
    });

    await t.test('simulator triggers treasure bubble after program run when targetRow is null', async () => {
        const window = setupDOM();
        window.simState.program = ['forward'];
        window.simState.targetRow = null;
        window.simState.targetCol = null;
        window.simState.running = false;
        window.simState.stopped = false;
        window.simState.failed = false;
        window.activeTab = 'simulator';
        window.treasureBubbleState.hasPlaced = false;
        window.treasureBubbleState.simRuns = 0;

        // Mock sleep and moveRobot
        window.sleep = () => Promise.resolve();
        window.moveRobot = (state) => ({ robotRow: state.robotRow, robotCol: state.robotCol, robotDir: state.robotDir, blocked: false });
        window.renderRobot = () => {};
        window.renderProgramStep = () => {};
        window.playSound = () => {};
        window.toggleCmdButtons = () => {};
        window.TrailManager = { states: {}, clear: () => {}, captureInitialState: () => {}, addSegment: () => {} };

        await window.runProgram();
        assert.strictEqual(window.treasureBubbleState.simRuns, 1);
        assert.strictEqual(window.treasureBubbleState.active, true);
    });
});

test('pickOption challenge completion without ReferenceError on target', async (t) => {
    await t.test('completes first-try correct answer in challenge mode and pulses #chal-target', async () => {
        const window = setupDOM();
        const document = window.document;

        const grid = document.createElement('div');
        grid.id = 'chal-grid';
        const robot = document.createElement('div');
        robot.id = 'chal-robot';
        const target = document.createElement('div');
        target.id = 'chal-target';
        const scoreEl = document.createElement('span');
        scoreEl.id = 'global-score';
        const streakEl = document.createElement('span');
        streakEl.id = 'global-streak';
        const nextBtn = document.createElement('button');
        nextBtn.id = 'btn-next-challenge';
        nextBtn.style.display = 'none';
        const optBtn = document.createElement('div');
        optBtn.className = 'challenge-option';
        document.body.append(grid, robot, target, scoreEl, streakEl, nextBtn, optBtn);

        window.activeTab = 'challenge';
        window.ScoreManager = {
            stats: {},
            addSuccess: () => true,
            addMistake: () => {}
        };
        window.handleStreakCelebration = () => {};
        window.sleep = () => Promise.resolve();
        window.moveRobot = (state) => ({ robotRow: state.robotRow, robotCol: state.robotCol + 1, robotDir: state.robotDir, blocked: false });
        window.renderRobot = () => {};
        window.TrailManager = { clear: () => {}, captureInitialState: () => {}, addSegment: () => {} };
        Object.assign(window.simState, { consecutiveMistakes: 0 });
        Object.assign(window.chalState, {
            isAnimating: false,
            locked: false,
            difficulty: 'easy',
            robotRow: 0,
            robotCol: 0,
            robotDir: 0,
            obstacles: [],
            mistakes: 0,
            options: [{ cmds: ['forward'], isCorrect: true }]
        });

        await window.pickOption(0);

        assert.strictEqual(window.chalState.locked, true);
        assert.strictEqual(window.chalState.isAnimating, false);
        assert.strictEqual(scoreEl.textContent, '1');
        assert.strictEqual(nextBtn.style.display, 'inline-flex');
        assert.strictEqual(target.classList.contains('pulse'), true);
    });
});

test('handleReadGridClick and newReadChallenge transitions without ReferenceError', async (t) => {
    await t.test('resets readState.isAnimating after win so newReadChallenge loads next puzzle', async () => {
        const window = setupDOM();
        const document = window.document;

        const grid = document.createElement('div');
        grid.id = 'read-grid';
        const targetCell = document.createElement('div');
        targetCell.className = 'bot-cell';
        targetCell.dataset.row = '0';
        targetCell.dataset.col = '1';
        grid.appendChild(targetCell);

        const robot = document.createElement('div');
        robot.id = 'read-robot';
        const strip = document.createElement('div');
        strip.id = 'read-program';
        const inst = document.createElement('div');
        inst.id = 'read-instruction';
        const scoreEl = document.createElement('span');
        scoreEl.id = 'read-global-score';
        const streakEl = document.createElement('span');
        streakEl.id = 'read-global-streak';
        const nextBtn = document.createElement('button');
        nextBtn.id = 'btn-next-read';
        nextBtn.style.display = 'none';
        document.body.append(grid, robot, strip, inst, scoreEl, streakEl, nextBtn);

        window.activeTab = 'read';
        window.ScoreManager = {
            stats: {},
            addSuccess: () => false,
            addMistake: () => {}
        };
        window.handleStreakCelebration = () => {};
        window.sleep = () => Promise.resolve();
        window.moveRobot = (state) => ({ robotRow: state.robotRow, robotCol: state.robotCol + 1, robotDir: state.robotDir, blocked: false });
        window.renderRobot = () => {};
        window.TrailManager = { clear: () => {}, captureInitialState: () => {}, addSegment: () => {} };
        Object.assign(window.simState, { consecutiveMistakes: 0 });
        Object.assign(window.readState, {
            isAnimating: false,
            locked: false,
            type: 'destination',
            difficulty: 'easy',
            robotRow: 0,
            robotCol: 0,
            robotDir: 1,
            targetRow: 0,
            targetCol: 1,
            obstacles: [],
            mistakes: 0,
            program: ['forward']
        });

        await window.handleReadGridClick(0, 1);

        assert.strictEqual(window.readState.isAnimating, false, 'isAnimating must reset cleanly after winning');
        assert.strictEqual(nextBtn.style.display, 'inline-flex', '#btn-next-read must become visible');
        assert.strictEqual(scoreEl.textContent, '1');

        window.newReadChallenge();
        assert.strictEqual(window.readState.locked, false, 'newReadChallenge must unlock readState');
        assert.strictEqual(nextBtn.style.display, 'none', '#btn-next-read must hide after advancing');
    });
});
