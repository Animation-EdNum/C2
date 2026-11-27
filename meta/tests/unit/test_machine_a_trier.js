/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const htmlPath = path.resolve(__dirname, '../../../webapps/machine_a_trier.html');
const htmlSrc = fs.readFileSync(htmlPath, 'utf8');

function setupEnv() {
    const scoreCalls = { success: [], mistake: [] };
    const dom = new JSDOM(htmlSrc, {
        runScripts: 'dangerously',
        url: 'http://localhost/webapps/machine_a_trier.html',
        beforeParse(window) {
            window.requestAnimationFrame = () => 1;
            window.cancelAnimationFrame = () => {};
            window.ScoreManager = {
                init: () => {},
                addSuccess: (mode, diff, mistakes) => scoreCalls.success.push({ mode, diff, mistakes }),
                addMistake: (mode, diff) => scoreCalls.mistake.push({ mode, diff }),
                clearCurrentAppStats: () => {}
            };
            window.playSound = () => {};
            window.handleStreakCelebration = () => {};
            window.showToast = () => {};
        }
    });
    const win = dom.window;
    win.dispatchEvent(new win.Event('load'));
    return { win, scoreCalls };
}

test('machine_a_trier.html - difficulty, playstyle, size-mode uniformity, and mistake tracking', async (t) => {
    let env;

    t.afterEach(() => {
        if (env && env.win) {
            env.win.__onResetApp?.();
            env.win.close();
        }
    });

    await t.test('defaults to easy difficulty and separate playstyle buttons', () => {
        env = setupEnv();
        const { document } = env.win;
        const diffEasy = document.getElementById('diff-easy');
        const diffMedium = document.getElementById('diff-medium');
        const psClassic = document.getElementById('playstyle-classic');
        const psFactory = document.getElementById('playstyle-factory');

        assert.ok(diffEasy.classList.contains('diff-btn'), 'diff-easy should use diff-btn');
        assert.ok(diffEasy.classList.contains('active'), 'diff-easy should be active on startup');
        assert.ok(!diffMedium.classList.contains('active'), 'diff-medium should not be active initially');
        assert.ok(psClassic.classList.contains('playstyle-btn'), 'playstyle-classic uses playstyle-btn');
        assert.ok(!psClassic.classList.contains('diff-btn'), 'playstyle button must not share diff-btn class');
        assert.ok(psClassic.classList.contains('active'), 'classic playstyle should be active initially');
        assert.ok(!psFactory.classList.contains('active'), 'factory playstyle should not be active initially');
    });

    await t.test('touch drag CSS rule uses touch-action: none and size mode uses uniform shape per round', () => {
        env = setupEnv();
        const { document } = env.win;
        assert.match(htmlSrc, /\.item\s*\{[^}]*touch-action:\s*none;/s, '.item should enforce touch-action: none');

        env.win.setMode('size');
        const items = Array.from(document.querySelectorAll('#items-container .item'));
        assert.ok(items.length >= 2, 'size mode should render items');
        const shapeKeys = items.map(el => el.querySelector('.shape-icon')?.getAttribute('data-fa') || '');
        assert.ok(shapeKeys.every(k => k && k === shapeKeys[0]), `All items in size mode must share the same shape, got: ${shapeKeys.join(',')}`);
    });

    await t.test('passes mistakesInCurrentLevel to ScoreManager.addSuccess on level completion', () => {
        env = setupEnv();
        const { win, scoreCalls } = env;
        const { document } = win;

        const firstItem = document.querySelector('#items-container .item');
        assert.ok(firstItem, 'An item should be generated in classic mode');

        const bins = Array.from(document.querySelectorAll('#bins-container .bin'));
        const wrongBin = bins.find(b => b.dataset.accept !== firstItem.dataset.type);
        assert.ok(wrongBin, 'Should find a wrong bin to simulate a mistake');
        win.handleDrop(firstItem, wrongBin);
        assert.ok(scoreCalls.mistake.length >= 1, 'Wrong drop should call ScoreManager.addMistake');

        // Place remaining items into matching bins to complete the round
        const remaining = Array.from(document.querySelectorAll('#items-container .item'));
        for (const it of remaining) {
            const rightBin = bins.find(b => b.dataset.accept === it.dataset.type);
            assert.ok(rightBin, `Matching bin should exist for ${it.dataset.type}`);
            win.handleDrop(it, rightBin);
        }

        assert.ok(scoreCalls.success.length >= 1, 'Dropping remaining items invokes addSuccess');
        assert.ok(scoreCalls.success[0].mistakes >= 1, `Expected mistakes >= 1 forwarded to ScoreManager, got ${scoreCalls.success[0].mistakes}`);
    });

    await t.test('__onResetApp restores easy/classic state cleanly', () => {
        env = setupEnv();
        const { win } = env;
        const { document } = win;

        win.setDifficulty('hard');
        win.setPlaystyle('factory');
        assert.ok(document.getElementById('diff-hard').classList.contains('active'));
        assert.ok(document.getElementById('playstyle-factory').classList.contains('active'));

        win.__onResetApp();
        assert.ok(document.getElementById('diff-easy').classList.contains('active'), 'Reset restores easy difficulty');
        assert.ok(document.getElementById('playstyle-classic').classList.contains('active'), 'Reset restores classic playstyle');
    });
});
