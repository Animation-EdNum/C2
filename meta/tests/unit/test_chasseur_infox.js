/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupChasseurInfoxDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/chasseur_infox.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/chasseur_infox.html',
        beforeParse(window) {
            window.playSound = () => {};
            window.launchConfetti = () => {};
            window.showToast = () => {};
        }
    });
    return dom.window;
}

test('chasseur_infox.html - DOM Structure & Engine', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupChasseurInfoxDOM();
    });

    t.afterEach(() => {
        if (window) window.close();
    });

    await t.test('1. Core DOM elements and navigation tabs exist', () => {
        const doc = window.document;
        assert.ok(doc.getElementById('main-content'), '#main-content must exist');
        assert.ok(doc.querySelector('.app-header'), '.app-header must exist');
        assert.ok(doc.getElementById('theme-toggle-btn'), '#theme-toggle-btn must exist');
        assert.ok(doc.getElementById('audio-toggle-btn'), '#audio-toggle-btn must exist');
        assert.ok(doc.getElementById('reset-cache-btn'), '#reset-cache-btn must exist');

        // 4 cases tabs
        for (let i = 0; i < 4; i++) {
            assert.ok(doc.getElementById(`tab-case-${i}`), `#tab-case-${i} must exist`);
            assert.ok(doc.getElementById(`status-case-${i}`), `#status-case-${i} must exist`);
        }

        // Tools
        assert.ok(doc.getElementById('toggle-detective-btn'), '#toggle-detective-btn must exist');
        assert.ok(doc.getElementById('open-notebook-btn'), '#open-notebook-btn must exist');
        assert.ok(doc.getElementById('open-compass-btn'), '#open-compass-btn must exist');

        // Browser mockup
        assert.ok(doc.querySelector('.browser-mockup'), '.browser-mockup must exist');
        assert.ok(doc.getElementById('clue-url-bar'), '#clue-url-bar must exist');
        assert.ok(doc.getElementById('web-viewport'), '#web-viewport must exist');

        // Modals
        assert.ok(doc.getElementById('clue-modal'), '#clue-modal must exist');
        assert.ok(doc.getElementById('notebook-modal'), '#notebook-modal must exist');
        assert.ok(doc.getElementById('compass-modal'), '#compass-modal must exist');
        assert.ok(doc.getElementById('diploma-modal'), '#diploma-modal must exist');
    });

    await t.test('2. Engine exports 4 complete investigations with 5 clues each', () => {
        const engine = window.ChasseurInfoxEngine;
        assert.ok(engine, 'ChasseurInfoxEngine must be exported');

        const cases = engine.getCases();
        assert.strictEqual(cases.length, 4, 'Must have exactly 4 cases');

        // Case 0: L'Arbre à Spaghettis
        assert.strictEqual(cases[0].title, "L'Arbre à Spaghettis récolté en Valais");
        const clues0 = Object.keys(cases[0].clues);
        assert.strictEqual(clues0.length, 5, 'Case 0 must have 5 clues');
        assert.ok(clues0.includes('url'));
        assert.ok(clues0.includes('date'));
        assert.ok(clues0.includes('source'));
        assert.ok(clues0.includes('image'));
        assert.ok(clues0.includes('tone'));

        // Case 1: Phishing
        assert.strictEqual(cases[1].title, "Alerte Sécurité Compte Élève (Phishing)");
        const clues1 = Object.keys(cases[1].clues);
        assert.strictEqual(clues1.length, 5, 'Case 1 must have 5 clues');
        assert.ok(clues1.includes('url'));
        assert.ok(clues1.includes('urgency'));
        assert.ok(clues1.includes('password'));
        assert.ok(clues1.includes('grammar'));
        assert.ok(clues1.includes('sender'));

        // Case 2: Requin volant
        assert.strictEqual(cases[2].title, "Le Requin Volant du Cervin (IA & Clickbait)");
        const clues2 = Object.keys(cases[2].clues);
        assert.strictEqual(clues2.length, 5, 'Case 2 must have 5 clues');
        assert.ok(clues2.includes('url'));
        assert.ok(clues2.includes('image'));
        assert.ok(clues2.includes('clickbait'));
        assert.ok(clues2.includes('science'));
        assert.ok(clues2.includes('legal'));

        // Case 3: Chewing-gum
        assert.strictEqual(cases[3].title, "Le Chewing-Gum Magique des Examens");
        const clues3 = Object.keys(cases[3].clues);
        assert.strictEqual(clues3.length, 5, 'Case 3 must have 5 clues');
        assert.ok(clues3.includes('url'));
        assert.ok(clues3.includes('fake_label'));
        assert.ok(clues3.includes('timer'));
        assert.ok(clues3.includes('miracle'));
        assert.ok(clues3.includes('hidden_fee'));
    });

    await t.test('3. Solving clues updates state and triggers progress', () => {
        const engine = window.ChasseurInfoxEngine;
        engine.selectCase(0);

        let state = engine.getState();
        assert.strictEqual(state.solvedClues[0].length, 0);

        // Solve clue 'url'
        engine.solveClue('url');
        state = engine.getState();
        assert.strictEqual(state.solvedClues[0].length, 1);
        assert.ok(state.solvedClues[0].includes('url'));

        // Re-solving same clue should not duplicate
        engine.solveClue('url');
        state = engine.getState();
        assert.strictEqual(state.solvedClues[0].length, 1);

        // Solve remaining clues for case 0
        ['date', 'source', 'image', 'tone'].forEach(c => engine.solveClue(c));
        state = engine.getState();
        assert.strictEqual(state.solvedClues[0].length, 5);

        const tab0 = window.document.getElementById('tab-case-0');
        assert.ok(tab0.classList.contains('solved'), 'Tab 0 should have solved class');
    });

    await t.test('4. window.__onResetApp resets progress completely', () => {
        const engine = window.ChasseurInfoxEngine;
        engine.selectCase(0);
        engine.solveClue('url');
        engine.solveClue('date');

        assert.strictEqual(engine.getState().solvedClues[0].length, 2);

        // Call reset
        window.__onResetApp();
        const state = engine.getState();
        assert.strictEqual(state.solvedClues[0].length, 0);
        assert.strictEqual(state.solvedClues[1].length, 0);
        assert.strictEqual(state.solvedClues[2].length, 0);
        assert.strictEqual(state.solvedClues[3].length, 0);
    });

    await t.test('5. Detective mode toggles body class', () => {
        const toggleBtn = window.document.getElementById('toggle-detective-btn');
        assert.ok(window.document.body.classList.contains('detective-mode-on'));

        toggleBtn.click();
        assert.ok(!window.document.body.classList.contains('detective-mode-on'));

        toggleBtn.click();
        assert.ok(window.document.body.classList.contains('detective-mode-on'));
    });
});
