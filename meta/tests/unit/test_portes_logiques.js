/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupPortesLogiquesDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/portes_logiques.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/portes_logiques.html',
        beforeParse(window) {
            window.playSound = () => {};
            window.launchConfetti = () => {};
            window.showToast = () => {};
        }
    });
    return dom.window;
}

test('portes_logiques.html - Architecture & Logique Booléenne', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupPortesLogiquesDOM();
    });

    t.afterEach(() => {
        if (window) {
            window.close();
        }
    });

    await t.test('1. Structure DOM & Éléments Fondamentaux', () => {
        const doc = window.document;

        assert.ok(doc.getElementById('main-content'), '#main-content must exist');
        assert.ok(doc.querySelector('.app-header'), '.app-header must exist');
        assert.ok(doc.querySelector('.header-back-btn'), '.header-back-btn must exist');
        assert.ok(doc.querySelector('.badge-level'), '.badge-level must exist');
        assert.ok(doc.querySelector('.badge-alpha'), '.badge-alpha must exist');
        assert.ok(doc.getElementById('tab-missions'), '#tab-missions must exist');
        assert.ok(doc.getElementById('tab-sandbox'), '#tab-sandbox must exist');
        assert.ok(doc.getElementById('circuit-stage'), '#circuit-stage must exist');
        assert.ok(doc.getElementById('truth-table'), '#truth-table must exist');
        assert.ok(doc.getElementById('options-menu-btn'), '#options-menu-btn must exist');
        assert.ok(doc.getElementById('theme-toggle-btn'), '#theme-toggle-btn must exist');
        assert.ok(doc.getElementById('audio-toggle-btn'), '#audio-toggle-btn must exist');
        assert.ok(doc.getElementById('reset-cache-btn'), '#reset-cache-btn must exist');
        assert.ok(doc.getElementById('confetti-canvas'), '#confetti-canvas must exist');
    });

    await t.test('2. Évaluation des Portes Logiques Fondamentales (NON, ET, OU, XOR)', () => {
        const engine = window.PortesLogiquesEngine;
        assert.ok(engine, 'PortesLogiquesEngine must be exposed on window');

        // NON
        engine.setGateType('NOT');
        engine.setSwitchStates({ A: 0 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 1, 'NON(0) doit valoir 1');
        engine.setSwitchStates({ A: 1 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 0, 'NON(1) doit valoir 0');

        // ET
        engine.setGateType('AND');
        engine.setSwitchStates({ A: 0, B: 0 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 0, 'ET(0,0) doit valoir 0');
        engine.setSwitchStates({ A: 1, B: 0 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 0, 'ET(1,0) doit valoir 0');
        engine.setSwitchStates({ A: 0, B: 1 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 0, 'ET(0,1) doit valoir 0');
        engine.setSwitchStates({ A: 1, B: 1 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 1, 'ET(1,1) doit valoir 1');

        // OU
        engine.setGateType('OR');
        engine.setSwitchStates({ A: 0, B: 0 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 0, 'OU(0,0) doit valoir 0');
        engine.setSwitchStates({ A: 1, B: 0 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 1, 'OU(1,0) doit valoir 1');
        engine.setSwitchStates({ A: 0, B: 1 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 1, 'OU(0,1) doit valoir 1');
        engine.setSwitchStates({ A: 1, B: 1 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 1, 'OU(1,1) doit valoir 1');

        // XOR
        engine.setGateType('XOR');
        engine.setSwitchStates({ A: 0, B: 0 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 0, 'XOR(0,0) doit valoir 0');
        engine.setSwitchStates({ A: 1, B: 0 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 1, 'XOR(1,0) doit valoir 1');
        engine.setSwitchStates({ A: 0, B: 1 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 1, 'XOR(0,1) doit valoir 1');
        engine.setSwitchStates({ A: 1, B: 1 });
        assert.strictEqual(engine.evaluateCircuit().outputs.Q, 0, 'XOR(1,1) doit valoir 0');
    });

    await t.test('3. Demi-Additionneur (Half-Adder : Somme = A XOR B, Retenue = A ET B)', () => {
        const engine = window.PortesLogiquesEngine;
        engine.setGateType('HALF_ADDER');

        // 0 + 0 = 00_2
        engine.setSwitchStates({ A: 0, B: 0 });
        let res = engine.evaluateCircuit().outputs;
        assert.strictEqual(res.S, 0, 'Somme 0+0 = 0');
        assert.strictEqual(res.R, 0, 'Retenue 0+0 = 0');

        // 0 + 1 = 01_2
        engine.setSwitchStates({ A: 0, B: 1 });
        res = engine.evaluateCircuit().outputs;
        assert.strictEqual(res.S, 1, 'Somme 0+1 = 1');
        assert.strictEqual(res.R, 0, 'Retenue 0+1 = 0');

        // 1 + 0 = 01_2
        engine.setSwitchStates({ A: 1, B: 0 });
        res = engine.evaluateCircuit().outputs;
        assert.strictEqual(res.S, 1, 'Somme 1+0 = 1');
        assert.strictEqual(res.R, 0, 'Retenue 1+0 = 0');

        // 1 + 1 = 10_2 (2 en binaire)
        engine.setSwitchStates({ A: 1, B: 1 });
        res = engine.evaluateCircuit().outputs;
        assert.strictEqual(res.S, 0, 'Somme 1+1 = 0');
        assert.strictEqual(res.R, 1, 'Retenue 1+1 = 1 (Carry)');
    });

    await t.test('4. Table de Vérité dynamique & Ligne Actuelle surlignée', () => {
        const engine = window.PortesLogiquesEngine;
        const doc = window.document;

        engine.setGateType('AND');
        engine.setSwitchStates({ A: 1, B: 0 });

        const rows = doc.querySelectorAll('#truth-table-body tr');
        assert.strictEqual(rows.length, 4, 'La porte ET doit générer 4 combinaisons');

        const activeRow = doc.querySelector('#truth-table-body tr.current-active');
        assert.ok(activeRow, 'Une ligne active doit être surlignée');
        assert.strictEqual(activeRow.children[0].textContent, '1', 'Entrée A doit être 1');
        assert.strictEqual(activeRow.children[1].textContent, '0', 'Entrée B doit être 0');
        assert.strictEqual(activeRow.children[2].textContent, '0', 'Sortie Q doit être 0');

        // Clic sur une ligne de la table configure les interrupteurs
        const targetRow = rows[3]; // combinaison 1-1
        targetRow.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

        const states = engine.getSwitchStates();
        assert.strictEqual(states.A, 1, 'Clic ligne 1-1 doit basculer A sur 1');
        assert.strictEqual(states.B, 1, 'Clic ligne 1-1 doit basculer B sur 1');
    });

    await t.test('5. Les 5 Missions et validation de progression', () => {
        const engine = window.PortesLogiquesEngine;
        const doc = window.document;
        const missions = engine.getMissions();

        assert.strictEqual(missions.length, 5, 'Doit contenir exactement 5 missions');

        // Mission 1 : NON
        engine.loadMission(0);
        assert.strictEqual(doc.getElementById('mission-title').textContent, missions[0].title);

        // Mission 5 : Demi-Additionneur
        engine.loadMission(4);
        assert.strictEqual(doc.getElementById('mission-title').textContent, missions[4].title);
        assert.strictEqual(doc.getElementById('arithmetic-banner').style.display, 'flex');
    });

    await t.test('6. Réinitialisation Universelle (window.__onResetApp)', () => {
        const engine = window.PortesLogiquesEngine;
        assert.ok(typeof window.__onResetApp === 'function', '__onResetApp hook must be registered');

        engine.setSwitchStates({ A: 1, B: 1, C: 1 });
        window.__onResetApp();

        const states = engine.getSwitchStates();
        assert.strictEqual(states.A, 0, 'A doit être réinitialisé à 0');
        assert.strictEqual(states.B, 0, 'B doit être réinitialisé à 0');
    });
});
