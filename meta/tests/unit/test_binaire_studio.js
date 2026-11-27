/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const htmlPath = path.resolve(__dirname, '../../../webapps/binaire_studio.html');
const htmlSrc = fs.readFileSync(htmlPath, 'utf8');

function setupEnv(query = '', seededUnlock = false) {
    const dom = new JSDOM(htmlSrc, {
        runScripts: 'dangerously',
        url: `http://localhost/webapps/binaire_studio.html${query}`,
        beforeParse(window) {
            if (seededUnlock) {
                window.localStorage.setItem('pixelStudio_editorUnlocked', '1');
            }
            window.ScoreManager = {
                init: () => {},
                addSuccess: () => {},
                addMistake: () => {},
                clearCurrentAppStats: () => {}
            };
            window.playSound = () => {};
            window.handleStreakCelebration = () => {};
            window.showToast = () => {};
        }
    });
    return dom.window;
}

test('binaire_studio.html - decode grid, encode validation, editor persistence & reset', async (t) => {
    let win;

    t.afterEach(() => {
        if (win) {
            win.__onResetApp?.();
            win.close();
        }
    });

    await t.test('renders .grid-cell elements and toggles .on state on mousedown', () => {
        win = setupEnv();
        const { document } = win;
        const cells = document.querySelectorAll('#grid-decode .grid-cell');
        assert.ok(cells.length >= 25, 'Decode grid should build grid cells');
        const firstCell = cells[0];
        const wasOn = firstCell.classList.contains('on');
        firstCell.dispatchEvent(new win.MouseEvent('mousedown', { bubbles: true }));
        win.document.dispatchEvent(new win.MouseEvent('mouseup', { bubbles: true }));
        assert.strictEqual(firstCell.classList.contains('on'), !wasOn, 'Mousedown on a decode cell must toggle .on state');
    });

    await t.test('editor unlock persists in localStorage and is cleared by __onResetApp', () => {
        win = setupEnv('', true);
        const { document, localStorage } = win;
        const editorTab = document.getElementById('tab-editor');
        assert.strictEqual(editorTab.disabled, false, 'Unlocked editor flag in localStorage must enable #tab-editor on load');
        assert.strictEqual(editorTab.classList.contains('locked-tab'), false, 'locked-tab should be removed when unlocked');

        win.__onResetApp();
        assert.strictEqual(localStorage.getItem('pixelStudio_editorUnlocked'), null, '__onResetApp must clear editor unlock key');
        assert.strictEqual(editorTab.disabled, true, '__onResetApp must re-lock #tab-editor');
    });

    await t.test('encode tab renders row inputs and switches cleanly', () => {
        win = setupEnv();
        const { document } = win;
        document.getElementById('tab-encode').click();
        const encodePanel = document.getElementById('mode-encode');
        assert.ok(encodePanel.classList.contains('active'), '#mode-encode should become active');
        const inputs = document.querySelectorAll('#encode-inputs input');
        assert.ok(inputs.length >= 5, 'Encode mode must generate row inputs');
        inputs[0].value = 'abc01!';
        inputs[0].dispatchEvent(new win.Event('input'));
        assert.strictEqual(inputs[0].value, '01', 'Non-binary characters must be stripped from encode input');
    });
});
