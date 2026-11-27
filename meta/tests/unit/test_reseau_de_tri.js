/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupReseauDeTriDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/reseau_de_tri.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const calls = { success: [], mistake: [] };
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/reseau_de_tri.html',
        beforeParse(window) {
            window.playSound = () => {};
            window.launchConfetti = () => {};
            window.handleStreakCelebration = () => {};
            window.showToast = () => {};
            window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
            window.HTMLElement.prototype.scrollIntoView = () => {};
            window.ScoreManager = {
                MODE_LABELS: {},
                isAdaptivePopupOpen: false,
                init() {},
                addSuccess(mode, diff, mistakes) {
                    calls.success.push({ mode, diff, mistakes });
                    return false;
                },
                addMistake(mode, diff) {
                    calls.mistake.push({ mode, diff });
                }
            };
        }
    });
    return new Promise(resolve => {
        dom.window.addEventListener('load', () => setTimeout(() => resolve({ window: dom.window, calls }), 20));
        setTimeout(() => resolve({ window: dom.window, calls }), 150);
    });
}

test('reseau_de_tri.html - Sorting Network & Parallel Race', async (t) => {
    let window;
    let calls;

    t.beforeEach(async () => {
        ({ window, calls } = await setupReseauDeTriDOM());
    });

    t.afterEach(() => {
        if (window) {
            if (typeof window.__onResetApp === 'function') window.__onResetApp();
            window.close();
        }
    });

    await t.test('1. Core DOM controls and accessible comparator buttons exist', () => {
        const doc = window.document;
        assert.ok(doc.getElementById('tab-nombres'), '#tab-nombres must exist');
        assert.ok(doc.getElementById('tab-lettres'), '#tab-lettres must exist');
        assert.ok(doc.getElementById('diff-easy'), '#diff-easy must exist');
        assert.ok(doc.getElementById('diff-medium'), '#diff-medium must exist');
        assert.ok(doc.getElementById('diff-hard'), '#diff-hard must exist');
        assert.ok(doc.getElementById('btn-next-step'), '#btn-next-step must exist');

        const compBtns = doc.querySelectorAll('.comparator-btn');
        assert.ok(compBtns.length >= 4, 'Easy 4-wire network should draw comparator buttons');
        compBtns.forEach(b => assert.strictEqual(b.tagName, 'BUTTON', 'Comparators must be <button> elements'));
    });

    await t.test('2. Completing all sorting stages clears mistakes only when needed and reveals race button', async () => {
        const doc = window.document;
        const compBtns = Array.from(doc.querySelectorAll('.comparator-btn'));
        const maxStage = 6;

        for (let guard = 0; guard < maxStage; guard++) {
            const activeStageBtns = compBtns.filter(b => b.classList.contains('active'));
            if (activeStageBtns.length === 0) break;

            // Evaluate values on wire nodes by checking element dataset or clicking until next step validates
            // Wait: if unsorted, #btn-next-step highlights .comp-error on those exact stages — or simply inspect active items
            // Better: sort via clicking each active comparator if top > bottom
            for (const btn of activeStageBtns) {
                btn.click();
            }
            doc.getElementById('btn-next-step').click();
            if (doc.querySelector('.comp-error')) {
                // Toggle back any comparator with .comp-error if needed; try subsets deterministically (at most 2 active comps in 4-wire)
                for (let mask = 0; mask < (1 << activeStageBtns.length); mask++) {
                    for (let i = 0; i < activeStageBtns.length; i++) {
                        if ((mask >> i) & 1) activeStageBtns[i].click();
                    }
                    doc.getElementById('btn-next-step').click();
                    if (!doc.querySelector('.comp-error')) break;
                }
            }
        }

        await new Promise(r => setTimeout(r, 80));
        assert.strictEqual(doc.getElementById('btn-start-race').style.display, 'inline-flex', 'Race button should appear after completing network');
        assert.strictEqual(calls.success.length, 1, 'ScoreManager.addSuccess must be recorded on completion');
    });

    await t.test('3. Switching to Letters mode and changing difficulty updates axis and wires', () => {
        const doc = window.document;
        doc.getElementById('tab-lettres').click();
        assert.strictEqual(doc.getElementById('axis-top-label').textContent, 'A — début');
        assert.strictEqual(doc.getElementById('axis-bottom-label').textContent, 'Z — fin');

        doc.getElementById('diff-hard').click();
        assert.strictEqual(doc.querySelectorAll('#network-grid .element').length, 5, 'Hard mode should create 5 wires');
    });

    await t.test('4. App reset via window.__onResetApp resets global score and UI', () => {
        const doc = window.document;
        window.__onResetApp();
        assert.strictEqual(doc.getElementById('global-correct').textContent, '0');
        assert.strictEqual(doc.getElementById('global-streak').textContent, '0');
    });
});
