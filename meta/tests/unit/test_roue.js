/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../../../webapps/teacher/roue_de_la_chance.html');

const activeTimers = new Set();

function setupDOM() {
    activeTimers.clear();
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(htmlContent, {
        runScripts: 'dangerously',
        url: 'http://localhost/'
    });
    dom.window.requestAnimationFrame = (cb) => {
        const id = setTimeout(() => {
            activeTimers.delete(id);
            try {
                if (dom.window && dom.window.document) {
                    cb(Date.now());
                }
            } catch (e) { }
        }, 16);
        activeTimers.add(id);
        return id;
    };
    dom.window.cancelAnimationFrame = (id) => {
        clearTimeout(id);
        activeTimers.delete(id);
    };
    return dom.window;
}

test('roue_de_la_chance.html - Roue de la chance tests', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupDOM();
    });

    t.afterEach(() => {
        for (const id of activeTimers) {
            clearTimeout(id);
        }
        activeTimers.clear();
        if (window) {
            window.close();
        }
    });

    await t.test('DOM elements and accessibility attributes exist', () => {
        const canvas = window.document.getElementById('wheelCanvas');
        assert.ok(canvas, '#wheelCanvas should exist');
        assert.strictEqual(canvas.getAttribute('role'), 'img', 'Canvas should have role="img"');
        assert.ok(canvas.getAttribute('aria-label'), 'Canvas should have descriptive aria-label');

        const liveAnnounce = window.document.getElementById('wheelLiveAnnounce');
        assert.ok(liveAnnounce, '#wheelLiveAnnounce element should exist');
        assert.strictEqual(liveAnnounce.getAttribute('aria-live'), 'polite', 'Live announce must have aria-live="polite"');
    });

    await t.test('Suppression d\'un gagnant doublon ne retire qu\'un seul exemplaire du tableau', () => {
        const engine = window.RoueEngine;
        assert.ok(engine, 'RoueEngine should be exposed');

        // Setup with 2 tickets for Lucas, 1 for Emma
        engine.state.originalItems = ['Lucas', 'Lucas', 'Emma'];
        engine.state.activeItems = ['Lucas', 'Lucas', 'Emma'];
        engine.state.autoRemove = true;

        // Trigger winner Lucas
        engine.onWheelWinner('Lucas');

        // Only ONE Lucas should be removed, leaving 1 Lucas and 1 Emma
        assert.strictEqual(engine.state.activeItems.length, 2, 'Should remain 2 items in activeItems');
        assert.strictEqual(engine.state.activeItems.filter(x => x === 'Lucas').length, 1, 'Exactly one Lucas should remain');
        assert.strictEqual(engine.state.activeItems.filter(x => x === 'Emma').length, 1, 'Emma should still be present');

        // Live announce should announce the winner
        const liveAnnounce = window.document.getElementById('wheelLiveAnnounce');
        assert.ok(liveAnnounce.textContent.includes('Lucas'), 'Screen reader should announce the winner');
    });

    await t.test('Clôture complète d\'un tour sans remise conserve l\'historique et la liste originale lors du rechargement', () => {
        const engine = window.RoueEngine;
        engine.state.originalItems = ['Choix A', 'Choix B', 'Choix C'];
        engine.state.activeItems = []; // All drawn
        engine.state.history = ['Choix C', 'Choix B', 'Choix A'];
        engine.saveState();

        // Simulate reload by calling loadState
        engine.state.originalItems = [];
        engine.state.activeItems = [];
        engine.loadState();

        assert.strictEqual(engine.state.activeItems.length, 0, 'activeItems should remain 0');
        assert.deepStrictEqual(Array.from(engine.state.originalItems), ['Choix A', 'Choix B', 'Choix C'], 'originalItems must NOT revert to presets');
        assert.strictEqual(engine.state.history.length, 3, 'History must be preserved');
    });

    await t.test('Verrouillage pendant la rotation : resetWheel est ignoré pendant que isSpinning est actif', () => {
        const engine = window.RoueEngine;
        engine.state.activeItems = ['A', 'B', 'C', 'D'];
        engine.state.originalItems = ['A', 'B', 'C', 'D'];

        // Trigger spin
        engine.spinWheel();
        assert.strictEqual(engine.isSpinning(), true, 'Wheel should be spinning');

        // Modify activeItems and try resetting while spinning
        engine.state.activeItems = ['X', 'Y'];
        engine.resetWheel();

        // resetWheel should be ignored during spin
        assert.deepStrictEqual(Array.from(engine.state.activeItems), ['X', 'Y'], 'activeItems should not be reset during active spin');
    });

    await t.test('Confetti et annonce du gagnant se déclenchent sans erreur', () => {
        const engine = window.RoueEngine;
        let confettiCalled = false;
        window.launchConfetti = () => {
            confettiCalled = true;
        };

        engine.state.activeItems = ['Gagnant 1', 'Gagnant 2'];
        engine.onWheelWinner('Gagnant 1');

        assert.strictEqual(confettiCalled, true, 'launchConfetti should be called on winner');
        assert.strictEqual(engine.state.history[0], 'Gagnant 1', 'History should record the winner');
    });
});
