/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const XLSX = require('../../../assets/js/vendor/xlsx.full.min.js');
const RosterImport = require('../../../assets/js/roster-import.js');

const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/teacher/createur_groupes.html');
const htmlSrc = fs.readFileSync(htmlPath, 'utf-8');

function setupDOM() {
    const dom = new JSDOM(htmlSrc, {
        runScripts: "dangerously",
        url: "http://localhost/"
    });

    dom.window.XLSX = XLSX;
    dom.window.RosterImport = RosterImport;
    dom.window.URL.createObjectURL = () => 'blob:mock-download-url';
    dom.window.URL.revokeObjectURL = () => { };
    if (!dom.window.navigator.clipboard) {
        dom.window.navigator.clipboard = {
            writeText: async () => Promise.resolve()
        };
    }

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dom.window);
        }, 80);
    });
}

test('createur_groupes.html - structure, algorithms and UI features', async (t) => {
    let window;
    let engine;

    t.beforeEach(async () => {
        window = await setupDOM();
        engine = window.GroupCreatorEngine;
        assert.ok(engine, 'GroupCreatorEngine should be exposed on window');
    });

    t.afterEach(() => {
        if (window) {
            window.close();
        }
    });

    await t.test('1. Header structure & teacher return link', () => {
        const backBtn = window.document.querySelector('.header-back-btn');
        assert.ok(backBtn, 'Back button must exist in header');
        assert.strictEqual(backBtn.getAttribute('href'), '../../index.html#teachers');

        const title = window.document.querySelector('h1');
        assert.ok(title.textContent.includes('Créateur de Groupes'));
        assert.ok(title.textContent.includes('Outil Enseignant'));
        assert.ok(title.textContent.includes('Alpha'));
    });

    await t.test('2. Sample class loading (20 students)', () => {
        const loadSampleBtn = window.document.getElementById('loadSampleBtn');
        assert.ok(loadSampleBtn, 'Load sample class button must exist');

        loadSampleBtn.click();
        assert.strictEqual(engine.state.students.length, 20);

        const girls = engine.state.students.filter(s => s.gender === 'F').length;
        const boys = engine.state.students.filter(s => s.gender === 'M').length;
        assert.strictEqual(girls, 10, 'Should have exactly 10 girls');
        assert.strictEqual(boys, 10, 'Should have exactly 10 boys');

        // Check badge text
        const badge = window.document.getElementById('badgeTotalStudents');
        assert.strictEqual(badge.textContent, '20 élèves');
    });

    await t.test('3. Text input parser with gender suffix detection', () => {
        const textarea = window.document.getElementById('rosterTextInput');
        const importBtn = window.document.getElementById('importTextBtn');

        textarea.value = "Alice Martin (F)\nBob Voirol (M)\nCamille Rey, F\nDavid Fournier, M\nÉlève Neutre";
        importBtn.click();

        assert.strictEqual(engine.state.students.length, 5);
        const alice = engine.state.students.find(s => s.name === 'Alice Martin');
        assert.ok(alice);
        assert.strictEqual(alice.gender, 'F');

        const bob = engine.state.students.find(s => s.name === 'Bob Voirol');
        assert.ok(bob);
        assert.strictEqual(bob.gender, 'M');

        const camille = engine.state.students.find(s => s.name === 'Camille Rey');
        assert.ok(camille);
        assert.strictEqual(camille.gender, 'F');

        const neutre = engine.state.students.find(s => s.name === 'Élève Neutre');
        assert.ok(neutre);
        assert.strictEqual(neutre.gender, 'U');
    });

    await t.test('4. Group generation by count (4 teams of 5 from 20 students)', () => {
        window.document.getElementById('loadSampleBtn').click();
        window.document.getElementById('stepperInput').value = '4';
        engine.state.targetCount = 4;
        engine.state.mode = 'teamsCount';

        const success = engine.generateTeamsAlgorithm();
        assert.strictEqual(success, true);
        assert.strictEqual(engine.state.teams.length, 4);

        let totalAssigned = 0;
        engine.state.teams.forEach(team => {
            assert.strictEqual(team.members.length, 5, 'Each team should have 5 members');
            totalAssigned += team.members.length;
        });
        assert.strictEqual(totalAssigned, 20);
    });

    await t.test('5. Group generation by team size (teams of 3 students)', () => {
        window.document.getElementById('loadSampleBtn').click();
        window.document.getElementById('modeBySizeBtn').click();
        window.document.getElementById('stepperInput').value = '3';
        engine.state.targetCount = 3;

        const success = engine.generateTeamsAlgorithm();
        assert.strictEqual(success, true);

        // 20 / 3 gives ~7 teams (six teams of 3 and one team of 2, or similar)
        let totalAssigned = 0;
        engine.state.teams.forEach(team => {
            assert.ok(team.members.length >= 2 && team.members.length <= 4);
            totalAssigned += team.members.length;
        });
        assert.strictEqual(totalAssigned, 20);
    });

    await t.test('6. Gender balancing constraint', () => {
        window.document.getElementById('loadSampleBtn').click();
        window.document.getElementById('balanceGenderToggle').checked = true;
        engine.state.balanceGender = true;
        engine.state.targetCount = 4;
        engine.state.mode = 'teamsCount';

        engine.generateTeamsAlgorithm();

        engine.state.teams.forEach(team => {
            const girls = team.members.filter(m => m.gender === 'F').length;
            const boys = team.members.filter(m => m.gender === 'M').length;
            // For 5 students per team, disparity between F and M should be at most 1 (either 2F+3M or 3F+2M)
            assert.ok(Math.abs(girls - boys) <= 1, `Team ${team.name} should be balanced: got ${girls}F, ${boys}M`);
        });
    });

    await t.test('7. Separation rule constraint (Noah and Lucas must not be together)', () => {
        window.document.getElementById('loadSampleBtn').click();
        const noah = engine.state.students.find(s => s.name === 'Noah Fournier');
        const lucas = engine.state.students.find(s => s.name === 'Lucas Rey');
        assert.ok(noah && lucas);

        engine.state.rules = [
            { id: 'sep1', type: 'separate', studentAId: noah.id, studentBId: lucas.id }
        ];
        engine.state.targetCount = 4;

        engine.generateTeamsAlgorithm();

        engine.state.teams.forEach(team => {
            const hasNoah = team.members.some(m => m.id === noah.id);
            const hasLucas = team.members.some(m => m.id === lucas.id);
            assert.ok(!(hasNoah && hasLucas), `Team ${team.name} must not contain both separated students`);
        });
    });

    await t.test('8. Association rule constraint (Chloe and Zoe must be together)', () => {
        window.document.getElementById('loadSampleBtn').click();
        const chloe = engine.state.students.find(s => s.name === 'Chloé Martin');
        const zoe = engine.state.students.find(s => s.name === 'Zoé Favre');
        assert.ok(chloe && zoe);

        engine.state.rules = [
            { id: 'assoc1', type: 'associate', studentAId: chloe.id, studentBId: zoe.id }
        ];
        engine.state.targetCount = 4;

        engine.generateTeamsAlgorithm();

        const teamWithChloe = engine.state.teams.find(t => t.members.some(m => m.id === chloe.id));
        assert.ok(teamWithChloe, 'Chloe should be in a team');
        const hasZoe = teamWithChloe.members.some(m => m.id === zoe.id);
        assert.ok(hasZoe, 'Zoe must be in the exact same team as Chloe');
    });

    await t.test('9. Moving / transferring a student between teams', () => {
        window.document.getElementById('loadSampleBtn').click();
        engine.generateTeamsAlgorithm();

        const team0 = engine.state.teams[0];
        const team1 = engine.state.teams[1];
        const studentToMove = team0.members[0];

        const initialTeam0Count = team0.members.length;
        const initialTeam1Count = team1.members.length;

        engine.moveStudentToTeam(studentToMove.id, 1);

        assert.strictEqual(team0.members.length, initialTeam0Count - 1);
        assert.strictEqual(team1.members.length, initialTeam1Count + 1);
        assert.ok(team1.members.some(m => m.id === studentToMove.id));
    });

    await t.test('10. App reset lifecycle via window.__onResetApp', () => {
        window.document.getElementById('loadSampleBtn').click();
        engine.generateTeamsAlgorithm();
        assert.ok(engine.state.students.length > 0);
        assert.ok(engine.state.teams.length > 0);

        window.__onResetApp();

        assert.strictEqual(engine.state.students.length, 0);
        assert.strictEqual(engine.state.rules.length, 0);
        assert.strictEqual(engine.state.teams.length, 0);
        assert.strictEqual(window.document.getElementById('badgeTotalStudents').textContent, '0 élève');
    });
});
