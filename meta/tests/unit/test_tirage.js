/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const XLSX = require('../../../assets/js/vendor/xlsx.full.min.js');
const RosterImport = require('../../../assets/js/roster-import.js');

const htmlPath = path.resolve(__dirname, '../../../webapps/teacher/tirage.html');
const htmlSrc = fs.readFileSync(htmlPath, 'utf-8');

function setupDOM() {
    const dom = new JSDOM(htmlSrc, {
        runScripts: "dangerously",
        url: "http://localhost/"
    });

    dom.window.XLSX = XLSX;
    dom.window.RosterImport = RosterImport;
    dom.window.URL.createObjectURL = () => 'blob:mock-download-url';
    dom.window.URL.revokeObjectURL = () => {};

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dom.window);
        }, 80);
    });
}

test('tirage.html - roster import and export features', async (t) => {
    let window;
    let engine;

    t.beforeEach(async () => {
        window = await setupDOM();
        engine = window.TirageEngine;
        assert.ok(engine, 'TirageEngine should be exposed on window');
    });

    t.afterEach(() => {
        if (engine && engine.getRollTimer()) {
            clearInterval(engine.getRollTimer());
        }
        if (window) {
            window.close();
        }
    });

    await t.test('DOM elements for class roster import and export exist', () => {
        const importBtn = window.document.getElementById('importNamesBtn');
        const exportBtn = window.document.getElementById('exportNamesBtn');
        const fileInput = window.document.getElementById('namesFileInput');
        const namesList = window.document.getElementById('namesList');

        assert.ok(importBtn, '#importNamesBtn must exist in DOM');
        assert.ok(exportBtn, '#exportNamesBtn must exist in DOM');
        assert.ok(fileInput, '#namesFileInput must exist in DOM');
        assert.ok(namesList, '#namesList textarea must exist in DOM');
    });

    await t.test('parseRosterContent - parses CSV, TSV, and plain text formats correctly', () => {
        const parseRoster = engine.parseRosterContent;

        // CSV with semicolon and header
        const csv1 = `Nom;Prénom;Classe
DUPONT;Lucas;7H-A
BOVARY;Emma;7H-A
MARTIN;Noah;7H-B`;
        const res1 = Array.from(parseRoster(csv1));
        assert.deepStrictEqual(res1, ['Lucas Dupont', 'Emma Bovary', 'Noah Martin']);

        // Plain text lines
        const text = `Alice\nBob\nCharlie\nDiana`;
        const res2 = Array.from(parseRoster(text));
        assert.deepStrictEqual(res2, ['Alice', 'Bob', 'Charlie', 'Diana']);

        // TSV
        const tsv = `Nom\tPrénom\nFavre\tArthur\nRey\tCamille`;
        const res3 = Array.from(parseRoster(tsv));
        assert.deepStrictEqual(res3, ['Arthur Favre', 'Camille Rey']);
    });

    await t.test('parseRosterContent - parses Swiss ENT / ISM spreadsheet (XLS/XLSX)', () => {
        const parseRoster = engine.parseRosterContent;

        // Swiss ENT export structure
        const ws_data = [
            ['ECOLE PRIMAIRE'],
            ['LISTE DE CLASSE', '', '', '', 'Sierre, EP Muraz'],
            ['Année :', '2026-2027'],
            ['Titulaire :', 'Maitre XY'],
            ['2ème enseignant :', 'Maitre XZ'],
            ['Classe :', 'MUR fd : M. XY / Mmme ZX'],
            ['Effectif :', '8 filles, 12 garçons'],
            [],
            ['', 'Degré', 'Identifiant ISM', 'Nom et prénom', 'Date de naissance'],
            ['', 7, 'Nicolas', 'Ancora Alexandre', '[Anonyme]'],
            ['', 7, 'Juliette', 'Boichat Camille Aline Bienvenue', '[Anonyme]'],
            ['', 7, 'Antoine', 'Boichat Gabriel Aloys Céleste', '[Anonyme]'],
            ['', 7, 'Charlotte', 'Cardoso Ramalhete Tomas', '[Anonyme]'],
            ['', 7, 'Robin', 'Ciccorelli Francesca', '[Anonyme]'],
            ['', 7, 'Alice', 'da Silva Ramos Carminho', '[Anonyme]']
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, 'Liste');
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        const imported = parseRoster(buffer);
        assert.ok(Array.isArray(imported), 'Imported roster must be an array');
        assert.strictEqual(imported.length, 6, 'Should extract 6 students from the ENT table');
        assert.strictEqual(imported[0], 'Ancora Alexandre');
        assert.strictEqual(imported[1], 'Boichat Camille Aline Bienvenue');
        assert.strictEqual(imported[2], 'Boichat Gabriel Aloys Céleste');
        assert.strictEqual(imported[3], 'Cardoso Ramalhete Tomas');
        assert.strictEqual(imported[4], 'Ciccorelli Francesca');
        assert.strictEqual(imported[5], 'da Silva Ramos Carminho');
    });

    await t.test('Export button creates a .txt download file', () => {
        const exportBtn = window.document.getElementById('exportNamesBtn');
        const namesInput = window.document.getElementById('namesList');

        namesInput.value = "Lucas Dupont\nEmma Bovary\nNoah Martin";

        let createdDownloadAttr = null;
        let clicked = false;
        const origCreateElement = window.document.createElement.bind(window.document);
        window.document.createElement = function (tagName) {
            const el = origCreateElement(tagName);
            if (tagName.toLowerCase() === 'a') {
                el.click = function () {
                    clicked = true;
                    createdDownloadAttr = el.getAttribute('download') || el.download;
                };
            }
            return el;
        };

        try {
            exportBtn.click();
            assert.ok(clicked, 'Export button click should trigger a.click()');
            assert.ok(createdDownloadAttr, 'a element should have download attribute');
            assert.ok(createdDownloadAttr.endsWith('.txt'), `Download attribute "${createdDownloadAttr}" must end with .txt`);
            assert.ok(createdDownloadAttr.startsWith('liste_participants_'), 'Download filename should start with liste_participants_');
        } finally {
            window.document.createElement = origCreateElement;
        }
    });

    await t.test('Projection mode toggles .projection class and expand/compress icons', () => {
        const projBtn = window.document.getElementById('projection-toggle-btn');
        assert.ok(projBtn, '#projection-toggle-btn must exist');

        const iconExpand = window.document.getElementById('icon-proj-expand');
        const iconCompress = window.document.getElementById('icon-proj-compress');
        assert.ok(iconExpand, '#icon-proj-expand must exist');
        assert.ok(iconCompress, '#icon-proj-compress must exist');

        window.document.body.classList.remove('projection');

        projBtn.click();
        assert.ok(window.document.body.classList.contains('projection'), 'Body should have .projection class');
        assert.strictEqual(iconExpand.style.display, 'none', 'Expand icon should be hidden in projection mode');
        assert.strictEqual(iconCompress.style.display, 'inline-block', 'Compress icon should be shown in projection mode');

        projBtn.click();
        assert.ok(!window.document.body.classList.contains('projection'), 'Body should no longer have .projection class');
        assert.strictEqual(iconExpand.style.display, 'inline-block', 'Expand icon should be shown in normal mode');
        assert.strictEqual(iconCompress.style.display, 'none', 'Compress icon should be hidden in normal mode');
    });

    await t.test('Accessibility live-announce zone exists and announces draw winners', () => {
        const liveAnnounce = window.document.getElementById('drawnNumberLiveAnnounce');
        assert.ok(liveAnnounce, '#drawnNumberLiveAnnounce must exist');
        assert.strictEqual(liveAnnounce.getAttribute('aria-live'), 'polite', 'Must have aria-live="polite"');
        assert.ok(liveAnnounce.classList.contains('sr-only'), 'Must have sr-only class');

        engine.state.mode = 'names';
        engine.state.availableParticipants = ['Camille'];
        engine.finalizeDraw();

        assert.strictEqual(liveAnnounce.textContent, 'Tiré au sort : Camille');
    });

    await t.test('Reset during roulette cancels rollTimer immediately and leaves no ghost winner', async () => {
        engine.state.mode = 'names';
        engine.state.availableParticipants = ['Alice', 'Bob', 'Charlie'];
        engine.state.allParticipants = ['Alice', 'Bob', 'Charlie'];
        engine.state.drawnParticipants = [];

        engine.triggerRoulette();
        assert.strictEqual(engine.isDrawing(), true, 'Should be in drawing state');
        assert.ok(engine.getRollTimer(), 'rollTimer should be active during roulette');

        // Immediately soft-reset
        engine.softReset();
        assert.strictEqual(engine.isDrawing(), false, 'isDrawing should be false after softReset');
        assert.strictEqual(engine.getRollTimer(), null, 'rollTimer should be cleared (null)');
        assert.strictEqual(engine.state.drawnParticipants.length, 0, 'No participant should have been drawn');

        // Wait to ensure timer does not trigger after duration
        await new Promise(r => setTimeout(r, 1300));
        assert.strictEqual(engine.state.drawnParticipants.length, 0, 'Still no ghost winner drawn after timer duration');
        assert.deepStrictEqual(Array.from(engine.state.availableParticipants), ['Alice', 'Bob', 'Charlie']);
    });

    await t.test('Editing namesInput synchronizes availableParticipants without losing drawn state', () => {
        const namesInput = window.document.getElementById('namesList');
        engine.state.mode = 'names';
        engine.state.allParticipants = ['Alice', 'Bob', 'Charlie'];
        engine.state.availableParticipants = ['Bob', 'Charlie'];
        engine.state.drawnParticipants = ['Alice'];

        // Teacher edits list: removes Alice, adds David
        namesInput.value = 'Bob\nCharlie\nDavid';
        namesInput.dispatchEvent(new window.Event('input'));

        assert.deepStrictEqual(Array.from(engine.state.allParticipants), ['Bob', 'Charlie', 'David']);
        assert.deepStrictEqual(Array.from(engine.state.drawnParticipants), [], 'Alice was removed so she should not be in drawnParticipants');
        assert.deepStrictEqual(Array.from(engine.state.availableParticipants), ['Bob', 'Charlie', 'David']);

        // Teacher now draws Bob
        engine.state.drawnParticipants = ['Bob'];
        engine.state.availableParticipants = ['Charlie', 'David'];

        // Teacher edits list to keep Bob and add Eva
        namesInput.value = 'Bob\nCharlie\nDavid\nEva';
        namesInput.dispatchEvent(new window.Event('input'));

        assert.deepStrictEqual(Array.from(engine.state.drawnParticipants), ['Bob'], 'Bob was drawn and remains drawn');
        assert.deepStrictEqual(Array.from(engine.state.availableParticipants), ['Charlie', 'David', 'Eva'], 'Available must contain Charlie, David, and new Eva');
    });

    await t.test('Mixed separators (newlines and commas) are parsed correctly', () => {
        const namesInput = window.document.getElementById('namesList');
        engine.state.mode = 'names';
        namesInput.value = 'Alice, Bob\nCharlie; Diana, Emma';

        engine.initializeDraw();
        assert.deepStrictEqual(Array.from(engine.state.allParticipants), ['Alice', 'Bob', 'Charlie', 'Diana', 'Emma']);
    });

    await t.test('prefers-reduced-motion triggers immediate draw without delay', () => {
        window.matchMedia = (query) => ({
            matches: query.includes('prefers-reduced-motion'),
            media: query,
            addListener: () => {},
            removeListener: () => {}
        });

        engine.state.mode = 'names';
        engine.state.availableParticipants = ['QuickWinner'];
        engine.state.allParticipants = ['QuickWinner'];
        engine.state.drawnParticipants = [];

        engine.triggerRoulette();

        // Should finalize immediately without waiting 1200ms
        assert.strictEqual(engine.isDrawing(), false, 'isDrawing must be false immediately with reduced motion');
        assert.strictEqual(engine.getRollTimer(), null, 'rollTimer should not be set');
        assert.strictEqual(engine.state.drawnParticipants.length, 1, 'Winner should be drawn immediately');
        assert.strictEqual(engine.state.drawnParticipants[0], 'QuickWinner');
    });

    await t.test('Confetti is launched on winner draw', () => {
        let confettiFired = false;
        window.launchConfetti = () => {
            confettiFired = true;
        };

        engine.state.mode = 'names';
        engine.state.availableParticipants = ['LuckyStudent'];
        engine.state.allParticipants = ['LuckyStudent'];
        engine.state.drawnParticipants = [];

        engine.finalizeDraw();

        assert.strictEqual(confettiFired, true, 'launchConfetti should be called on winner draw');
    });
});
