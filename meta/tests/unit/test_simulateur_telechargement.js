/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const filePath = path.resolve(__dirname, '../../../alpha/webapps/simulateur_telechargement.html');

function setupDOM() {
    const html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/simulateur_telechargement.html'
    });
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    return dom.window;
}

test('Simulateur de téléchargement - Fichier et Structure', async (t) => {
    assert.ok(fs.existsSync(filePath), 'Le fichier simulateur_telechargement.html doit exister');
    const html = fs.readFileSync(filePath, 'utf8');

    await t.test('Contient les métadonnées et le badge Alpha 7-8H', () => {
        assert.match(html, /<title>.*Simulateur de téléchargement.*<\/title>/i);
        assert.match(html, /class="badge-alpha"/i);
        assert.match(html, /class="badge-level"/i);
        assert.match(html, /7-8H/);
    });

    await t.test('Respecte la politique CSP stricte', () => {
        assert.match(html, /http-equiv="Content-Security-Policy"/i);
        assert.match(html, /default-src 'self'/i);
    });

    await t.test('Contient les deux onglets : Défi et Laboratoire', () => {
        assert.match(html, /id="tabDefiBtn"/i);
        assert.match(html, /id="tabLabBtn"/i);
        assert.match(html, /id="viewDefi"/i);
        assert.match(html, /id="viewLab"/i);
    });

    await t.test('Contient la modale descriptive des médias', () => {
        assert.match(html, /id="mediaModal"/i);
        assert.match(html, /id="modalTitle"/i);
        assert.match(html, /id="modalIllustration"/i);
    });
});

test('Simulateur de téléchargement - Logique DOM & Métier (JSDOM)', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupDOM();
    });

    t.afterEach(() => {
        if (window) window.close();
    });

    await t.test('Les 4 canaux sont correctement instanciés dans le DOM', () => {
        const doc = window.document;
        const canal1 = doc.getElementById('canalCard-1');
        const canal2 = doc.getElementById('canalCard-2');
        const canal3 = doc.getElementById('canalCard-3');
        const canal4 = doc.getElementById('canalCard-4');

        assert.ok(canal1, 'Canal 1 doit être présent');
        assert.ok(canal2, 'Canal 2 doit être présent');
        assert.ok(canal3, 'Canal 3 doit être présent');
        assert.ok(canal4, 'Canal 4 doit être présent');
    });

    await t.test('Chaque canal dispose de ses boutons d hypothèse de média', () => {
        const doc = window.document;
        const guessBlock = doc.getElementById('guessBlock-1');
        assert.ok(guessBlock, 'Le bloc de prédiction doit exister');
        const btns = guessBlock.querySelectorAll('.guess-btn');
        assert.strictEqual(btns.length, 4, 'Il doit y avoir 4 boutons de prédiction par canal');
    });

    await t.test('La grille des objets de la Fiche 2 est initialisée avec 9 objets', () => {
        const doc = window.document;
        const gridKo = doc.getElementById('gridKo');
        const gridMo = doc.getElementById('gridMo');
        const gridGo = doc.getElementById('gridGo');

        assert.ok(gridKo, 'Grille Ko doit exister');
        assert.ok(gridMo, 'Grille Mo doit exister');
        assert.ok(gridGo, 'Grille Go doit exister');

        const totalObjects = gridKo.children.length + gridMo.children.length + gridGo.children.length;
        assert.strictEqual(totalObjects, 9, 'La Fiche 2 doit contenir exactement 9 objets');
    });

    await t.test('Changement de vitesse de connexion dans le laboratoire', () => {
        const doc = window.document;
        const speed56kBtn = doc.querySelector('[data-speed="56k"]');
        assert.ok(speed56kBtn, 'Bouton modem 56k doit exister');
        speed56kBtn.click();

        const etaRoman = doc.getElementById('eta-roman');
        assert.ok(etaRoman, 'L ETA du roman doit exister');
        assert.ok(etaRoman.textContent.length > 0);
    });

    await t.test('La sélection d une prédiction par l élève met à jour son choix', () => {
        const doc = window.document;
        const card1 = doc.getElementById('canalCard-1');
        const btnTexte = card1.querySelector('[data-guess="texte"]');
        assert.ok(btnTexte, 'Bouton Texte doit exister sur le canal 1');
        btnTexte.click();

        assert.ok(btnTexte.classList.contains('selected-text'), 'Le bouton doit avoir la classe active sélectionnée');
    });
});
