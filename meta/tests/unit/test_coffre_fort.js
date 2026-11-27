/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupCoffreFortDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/coffre_fort.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const calls = { success: [], mistake: [], fire: 0 };
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/coffre_fort.html',
        beforeParse(window) {
            window.playSound = () => {};
            window.launchConfetti = () => {};
            window.launchFire = () => { calls.fire++; };
            window.showToast = () => {};
            window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
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
    return { window: dom.window, calls };
}

test('coffre_fort.html - Sorting & Scenario Engine', async (t) => {
    let window;
    let calls;

    t.beforeEach(() => {
        ({ window, calls } = setupCoffreFortDOM());
    });

    t.afterEach(() => {
        if (window) {
            if (typeof window.__onResetApp === 'function') window.__onResetApp();
            window.close();
        }
    });

    await t.test('1. Core DOM structure, tabs, safes and restart button exist', () => {
        const doc = window.document;
        assert.ok(doc.getElementById('tab-sort'), '#tab-sort must exist');
        assert.ok(doc.getElementById('tab-scenarios'), '#tab-scenarios must exist');
        assert.ok(doc.getElementById('safe-private'), '#safe-private must exist');
        assert.ok(doc.getElementById('safe-public'), '#safe-public must exist');
        assert.ok(doc.getElementById('items-deck'), '#items-deck must exist');
        assert.ok(doc.getElementById('sort-restart-btn'), '#sort-restart-btn must exist');
        assert.ok(doc.querySelectorAll('#items-deck .data-card').length >= 4, 'Initial deck should have cards');
    });

    await t.test('2. Wrong safe logs mistake; sorting all cards into right safes triggers completion', async () => {
        const doc = window.document;
        const firstCard = doc.querySelector('#items-deck .data-card');
        assert.ok(firstCard, 'First data card should exist');
        const wrongSafe = firstCard.dataset.type === 'private'
            ? doc.getElementById('safe-public')
            : doc.getElementById('safe-private');

        firstCard.click();
        wrongSafe.click();
        assert.strictEqual(calls.mistake.length, 1, 'Wrong safe click must record 1 mistake');
        assert.strictEqual(doc.getElementById('sort-streak').textContent, '0');
        await new Promise(r => setTimeout(r, 450));

        const cards = Array.from(doc.querySelectorAll('#items-deck .data-card'));
        for (const card of cards) {
            const targetSafe = doc.getElementById(card.dataset.type === 'private' ? 'safe-private' : 'safe-public');
            card.click();
            targetSafe.click();
        }

        assert.strictEqual(doc.querySelectorAll('#items-deck .data-card').length, 0, 'Deck should be empty after sorting all cards');
        assert.strictEqual(calls.success.length, 1, 'ScoreManager.addSuccess must be called once per round');
        assert.strictEqual(calls.success[0].mistakes, 1, 'Should report 1 mistake for round');
        assert.ok(calls.fire >= 1, 'launchFire should trigger upon completing all cards');
    });

    await t.test('3. Switching to Scenarios renders prompt, options and validates answer', () => {
        const doc = window.document;
        doc.getElementById('tab-scenarios').click();
        assert.ok(doc.getElementById('mode-scenarios').classList.contains('active'));
        const prompt = doc.getElementById('sc-prompt').textContent;
        assert.ok(prompt.length > 5, 'Scenario prompt must be populated');

        const optionBtns = Array.from(doc.querySelectorAll('#sc-options button'));
        assert.ok(optionBtns.length >= 2, 'Scenario must present at least 2 option buttons');
        optionBtns[0].click();
        assert.strictEqual(doc.getElementById('sc-feedback').style.display, 'block', 'Feedback panel should become visible');
    });

    await t.test('4. App reset via window.__onResetApp resets scores and deck', () => {
        const doc = window.document;
        const card = doc.querySelector('#items-deck .data-card');
        const targetSafe = doc.getElementById(card.dataset.type === 'private' ? 'safe-private' : 'safe-public');
        card.click();
        targetSafe.click();
        assert.strictEqual(doc.getElementById('sort-correct').textContent, '1');

        window.__onResetApp();
        assert.strictEqual(doc.getElementById('sort-correct').textContent, '0');
        assert.strictEqual(doc.getElementById('sort-streak').textContent, '0');
        assert.ok(doc.querySelectorAll('#items-deck .data-card').length >= 4, 'Deck should be rebuilt on reset');
    });
});
