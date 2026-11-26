/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/crediter_image.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/crediter_image.html',
        beforeParse(window) {
            window.playSound = () => {};
            window.handleStreakCelebration = () => {};
            window.showToast = () => {};
        }
    });
    return dom.window;
}

test('crediter_image.html - Structure, Modes 7H/8H, TASL & Creative Commons', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupDOM();
    });

    t.afterEach(() => {
        if (window) {
            window.close();
        }
    });

    await t.test('1. Structure DOM conforme au Design System Suite EdNum', () => {
        const doc = window.document;
        assert.ok(doc.getElementById('main-content').classList.contains('container'), '#main-content has .container');
        assert.ok(doc.querySelector('.app-header'), '.app-header exists');
        assert.strictEqual(doc.querySelector('.header-back-btn')?.getAttribute('href'), '../../index.html');
        assert.strictEqual(doc.querySelector('.badge-level')?.textContent.trim(), '7-8H');
        assert.strictEqual(doc.querySelector('.badge-alpha')?.textContent.trim(), 'Alpha');
        assert.ok(doc.querySelector('.settings-dropdown-content'), '.settings-dropdown-content exists');
        assert.ok(doc.getElementById('confetti-canvas'), '#confetti-canvas exists');
        const footer = doc.querySelector('footer.no-print');
        assert.ok(footer, 'footer.no-print exists');
        assert.ok(footer.textContent.includes('Vivian Epiney'), 'Footer mentions author');
        assert.ok(footer.querySelector('a[href="../../merci.html"]'), 'Footer links to ../../merci.html');
    });

    await t.test('2. Mode 7H valide Auteur + Source et rejette les pièges courants', () => {
        const engine = window.CrediterImageEngine;
        assert.ok(engine, 'CrediterImageEngine exposed');
        const salamandre = engine.getChallenges()[0];

        // Valid 7H without Title and License
        const okRes = engine.evaluateSubmission('7H', salamandre, {
            author: 'Paligui',
            source: salamandre.url,
            title: '',
            license: ''
        });
        assert.strictEqual(okRes.ok, true, '7H accepts Author + Source without Title/License');

        // Rejects Google Images as Source
        const googleRes = engine.evaluateSubmission('7H', salamandre, {
            author: 'Paligui',
            source: 'Google Images'
        });
        assert.strictEqual(googleRes.ok, false);
        assert.ok(googleRes.issues.some((m) => m.includes('Google Images')));

        // Rejects camera model as Author
        const camRes = engine.evaluateSubmission('7H', salamandre, {
            author: 'Nikon D5300',
            source: salamandre.url
        });
        assert.strictEqual(camRes.ok, false);
        assert.ok(camRes.issues.some((m) => m.includes('appareil photo')));
    });

    await t.test('3. Mode 8H exige TASL complet (Titre + Auteur + Source + Licence précise)', () => {
        const engine = window.CrediterImageEngine;
        const bresis = engine.getChallenges()[1];

        // Rejects generic "CC" license
        const genericCc = engine.evaluateSubmission('8H', bresis, {
            title: 'Ruines du château-fort de Brésis',
            author: 'Dominique Robert',
            source: bresis.url,
            license: 'CC'
        });
        assert.strictEqual(genericCc.ok, false);
        assert.ok(genericCc.issues.some((m) => m.includes('ne suffit pas')));

        // Rejects raw filename extension in Title
        const rawTitle = engine.evaluateSubmission('8H', bresis, {
            title: 'Chateau.jpg',
            author: 'Dominique Robert',
            source: bresis.url,
            license: 'CC BY-SA 4.0'
        });
        assert.strictEqual(rawTitle.ok, false);

        // Accepts complete TASL
        const valid8h = engine.evaluateSubmission('8H', bresis, {
            title: 'Ruines du château-fort de Brésis',
            author: 'Dominique Robert',
            source: bresis.url,
            license: 'CC BY-SA 4.0'
        });
        assert.strictEqual(valid8h.ok, true, '8H accepts valid full TASL credit');
    });

    await t.test('4. Décrypteur Creative Commons calcule correctement les droits', () => {
        const engine = window.CrediterImageEngine;

        const cc0 = engine.computeCcRights({ isCC0: true });
        assert.strictEqual(cc0.modify.status, 'yes');
        assert.strictEqual(cc0.commercial.status, 'yes');
        assert.strictEqual(cc0.citeAuthor.status, 'no');

        const byNd = engine.computeCcRights({ BY: true, ND: true, NC: false, SA: false, isCC0: false });
        assert.strictEqual(byNd.code, 'CC BY-ND');
        assert.strictEqual(byNd.modify.status, 'no');
        assert.strictEqual(byNd.commercial.status, 'yes');

        const byNcSa = engine.computeCcRights({ BY: true, NC: true, SA: true, ND: false, isCC0: false });
        assert.strictEqual(byNcSa.code, 'CC BY-NC-SA');
        assert.strictEqual(byNcSa.commercial.status, 'no');
        assert.strictEqual(byNcSa.shareAlike.status, 'req');
    });

    await t.test('5. Navigation par onglets, champs Wikimedia cliquables et Reset', () => {
        const engine = window.CrediterImageEngine;
        const doc = window.document;

        // Default 7H hides Title and License inputs
        assert.strictEqual(doc.getElementById('group-input-title').style.display, 'none');
        assert.strictEqual(doc.getElementById('group-input-license').style.display, 'none');

        // Switch to 8H reveals Title and License inputs
        engine.switchTab('mode8h');
        assert.strictEqual(doc.getElementById('group-input-title').style.display, 'flex');
        assert.strictEqual(doc.getElementById('group-input-license').style.display, 'flex');

        // Clicking simulated Wikimedia elements fills inputs
        doc.getElementById('wiki-field-author').click();
        doc.getElementById('wiki-url-btn').click();
        assert.strictEqual(doc.getElementById('input-author').value, 'Paligui');
        assert.ok(doc.getElementById('input-source').value.includes('commons.wikimedia.org'));

        // Reset clears fields
        window.__onResetApp();
        assert.strictEqual(doc.getElementById('input-author').value, '');
        assert.strictEqual(doc.getElementById('input-source').value, '');
    });
});
