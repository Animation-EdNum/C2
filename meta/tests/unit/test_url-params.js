const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const urlParamsSrc = fs.readFileSync('assets/js/url-params.js', 'utf-8');

function setupDOM(urlSearch = '') {
    const defaultHtml = `<!DOCTYPE html>
    <html>
    <body>
        <div class="tabs"></div>
        <a href="index.html" title="Home" aria-label="Home">Home</a>
        <div class="settings-dropdown"></div>
        <button id="audio-toggle-btn"></button>
        <button id="colored-cmds-toggle-btn"></button>
        <button id="colored-weights-toggle-btn"></button>
        <div class="instructions"></div>
        <div class="chal-instruction"></div>
        <span id="projectionToggleText"></span>
        <button class="diff-btn"></button>
        <select id="difficulty-select"></select>
        <button id="btn-open-mats"></button>
        <button id="btn-open-skins"></button>
        <button id="btn-speed"></button>
        <button id="speed-toggle-btn"></button>
        <button id="tab-explore"></button>
        <div class="icon-action-btn" id="btn-hide-grid"></div>
        <div class="icon-action-btn" id="btn-cycle-mat"></div>
        <div class="icon-action-btn" id="btn-toggle-speed"></div>
        <div id="explore-grid"></div>
        <div id="explore-robot"></div>
        <div id="explore-target"></div>
    </body>
    </html>`;

    const dom = new JSDOM(defaultHtml, {
        url: `http://localhost/${urlSearch}`,
        runScripts: 'dangerously'
    });

    const window = dom.window;

    // Evaluate the code
    window.eval(urlParamsSrc);

    // Call the function manually since DOMContentLoaded already fired in JSDOM or wouldn't trigger correctly
    window.applyUrlParameters();

    return window;
}

test('url-params.js - Initialization', async (t) => {
    await t.test('applies spellMode and memoryMode to localStorage', () => {
        const window = setupDOM('?spellMode=1&memoryMode=1');
        assert.strictEqual(window.localStorage.getItem('at_spell_mode'), 'true');
        assert.strictEqual(window.localStorage.getItem('at_memory_mode'), 'true');
    });

    await t.test('applies highContrast mode', () => {
        const window = setupDOM('?highContrast=1');
        assert.strictEqual(window.localStorage.getItem('global_theme'), 'high-contrast');
        assert.strictEqual(window.document.body.classList.contains('high-contrast'), true);
    });

    await t.test('handles interface and navigation hiding', () => {
        const window = setupDOM('?only=1&noHome=1&noSettings=1&noAudio=1&coloredCmds=1&coloredWeights=1&noInstructions=1');
        const doc = window.document;

        assert.strictEqual(doc.querySelector('.tabs').style.display, 'none');

        const homeBtn = doc.querySelector('a.unlinked');
        assert.ok(homeBtn);
        assert.strictEqual(homeBtn.hasAttribute('href'), false);

        assert.strictEqual(doc.querySelector('.settings-dropdown').style.display, 'none');
        assert.strictEqual(doc.getElementById('audio-toggle-btn').style.display, 'none');

        assert.strictEqual(doc.body.classList.contains('colored-cmds'), true);
        assert.strictEqual(doc.getElementById('colored-cmds-toggle-btn').style.display, 'none');

        assert.strictEqual(doc.getElementById('colored-weights-toggle-btn').style.display, 'none');

        doc.querySelectorAll('.instructions, .chal-instruction').forEach(el => {
            assert.strictEqual(el.style.display, 'none');
        });
    });

    await t.test('handles TBI / projection mode', () => {
        const window = setupDOM('?mode=tbi');
        assert.strictEqual(window.document.body.classList.contains('projection'), true);
        assert.strictEqual(window.document.getElementById('projectionToggleText').textContent, 'Mode normal');
    });

    await t.test('handles locks (lockDiff, forceMat, lockMat, lockSkin, unlockAllSkins, lockSpeed)', () => {
        const window = setupDOM('?lockDiff=1&forceMat=mat1&lockMat=1&lockSkin=1&unlockAllSkins=1&lockSpeed=3');
        const doc = window.document;

        const diffBtn = doc.querySelector('.diff-btn');
        assert.strictEqual(diffBtn.classList.contains('locked'), true);
        assert.strictEqual(diffBtn.disabled, true);

        assert.strictEqual(window.localStorage.getItem('at_active_mat'), 'mat1');

        assert.strictEqual(doc.getElementById('btn-open-mats').style.display, 'none');
        assert.strictEqual(doc.getElementById('btn-open-skins').style.display, 'none');

        assert.strictEqual(window.isSkinUnlockDisabled, true);
        assert.strictEqual(window.unlockAllSkins, true);

        assert.strictEqual(doc.getElementById('btn-speed').style.display, 'none');
        assert.strictEqual(doc.getElementById('speed-toggle-btn').style.display, 'none');
    });

    await t.test('handles logic toggles (noCmdToggle, blindcode, noDrag)', () => {
        const window = setupDOM('?noCmdToggle=1&blindcode=1&noDrag=1');
        assert.strictEqual(window.cmdsHiddenByDefault, true);
        assert.strictEqual(window.forceBlindcode, true);
        assert.strictEqual(window.noDragParam, true);
    });

    await t.test('handles hiding grid toolbar buttons', () => {
        const window = setupDOM('?lockMat=1&lockSpeed=1&hideGrid=1');
        const doc = window.document;
        assert.strictEqual(doc.getElementById('btn-cycle-mat').style.display, 'none');
        assert.strictEqual(doc.getElementById('btn-toggle-speed').style.display, 'none');
        assert.strictEqual(doc.getElementById('btn-hide-grid').style.display, 'none');
    });

    await t.test('handles grid sharing parameters (rows, cols, robot, obstacles, target)', async () => {
        const window = setupDOM('?rows=5&cols=5&obstacles=1,2;3,4&robot=0,0,1&target=4,4');

        // Define global variables expected by applyUrlParameters
        window.GRID_ROWS = 3;
        window.GRID_COLS = 3;
        window.exploreState = { obstacles: [] };
        window.buildGrid = () => {};
        window.renderRobot = () => {};
        window.renderTarget = () => {};

        // Trigger function to parse values
        window.applyUrlParameters();

        // Check if shared grid flags are set correctly
        assert.strictEqual(window.hasSharedGrid, true);
        assert.strictEqual(window.GRID_ROWS, 5);
        assert.strictEqual(window.GRID_COLS, 5);

        // Timeout needed to wait for setTimeout inside applyUrlParameters to update exploreState
        await new Promise(r => setTimeout(r, 150));

        assert.deepEqual(window.exploreState.obstacles, [{r: 1, c: 2}, {r: 3, c: 4}]);
        assert.strictEqual(window.exploreState.robotRow, 0);
        assert.strictEqual(window.exploreState.robotCol, 0);
        assert.strictEqual(window.exploreState.robotDir, 1);
        assert.strictEqual(window.exploreState.targetRow, 4);
        assert.strictEqual(window.exploreState.targetCol, 4);
    });
});
