/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/teacher/sim_dyslexie.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

function setupDOM() {
    const dom = new JSDOM(htmlContent, {
        runScripts: 'dangerously',
        url: 'http://localhost/'
    });
    return dom.window;
}

test('sim_dyslexie.html - Améliorations DYS (Valdois, fluence, pastel, TTS)', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupDOM();
    });

    t.afterEach(() => {
        if (window) {
            window.close();
        }
    });

    await t.test('Profil visuo-attentionnelle renommé selon les travaux de S. Valdois', () => {
        const visuoBtn = window.document.querySelector('.profile-btn[data-profile="visuo"]');
        assert.ok(visuoBtn, 'Le bouton profil visuo doit exister');
        assert.ok(visuoBtn.textContent.includes('Dyslexie visuo-attentionnelle'), 'Le libellé doit être "Dyslexie visuo-attentionnelle"');
        assert.ok(!visuoBtn.textContent.includes('visuo-spatiale'), 'Le terme visuo-spatiale ne doit plus apparaître dans le bouton');
    });

    await t.test('Profil début de lecture coche la coloration des graphèmes et non le découpage syllabique', () => {
        const debutBtn = window.document.querySelector('.profile-btn[data-profile="debut"]');
        assert.ok(debutBtn, 'Le bouton profil début de lecture doit exister');
        debutBtn.click();

        const compGraphemes = window.document.getElementById('compGraphemes');
        const compSyllables = window.document.getElementById('compSyllables');
        assert.strictEqual(compGraphemes.checked, true, 'Le profil début de lecture doit cocher la coloration des graphèmes');
        assert.strictEqual(compSyllables.checked, false, 'Le profil début de lecture ne doit pas cocher le découpage syllabique');
    });

    await t.test('Bandeau pédagogique sur la complémentarité code et fluence présent dans l\'adaptateur', () => {
        const adapterView = window.document.getElementById('viewAdapter');
        assert.ok(adapterView, 'La vue adaptateur doit exister');
        const infoBanners = adapterView.querySelectorAll('.info-banner');
        assert.ok(infoBanners.length >= 1, 'Un bandeau d\'information pédagogique doit être présent dans l\'adaptateur');
        const bannerText = Array.from(infoBanners).map(b => b.textContent).join(' ');
        assert.ok(bannerText.includes('correspondances graphèmes-phonèmes'), 'Le bandeau doit mentionner le code graphèmes-phonèmes');
        assert.ok(bannerText.includes('fluence de lecture'), 'Le bandeau doit mentionner la fluence de lecture');
    });

    await t.test('Mention de préférence personnelle pour le fond pastel', () => {
        const pastelLabel = window.document.querySelector('label[for="compPastel"]');
        assert.ok(pastelLabel, 'Le label compPastel doit exister');
        assert.ok(pastelLabel.textContent.includes('sensibilité personnelle') || pastelLabel.textContent.includes('préférence personnelle'),
            'La description du fond pastel doit mentionner la sensibilité ou préférence personnelle de l\'élève');
    });

    await t.test('Boutons de synthèse vocale (TTS) présents dans les vues simulateur et adaptateur', () => {
        const btnTtsSim = window.document.getElementById('btnTtsSim');
        const btnTtsAdapter = window.document.getElementById('btnTtsAdapter');
        assert.ok(btnTtsSim, 'Le bouton TTS du simulateur doit exister');
        assert.ok(btnTtsAdapter, 'Le bouton TTS de l\'adaptateur doit exister');
        assert.ok(btnTtsSim.textContent.includes('Lecture audio'), 'Le bouton simulateur doit afficher "Lecture audio"');
        assert.ok(btnTtsAdapter.textContent.includes('Lecture audio'), 'Le bouton adaptateur doit afficher "Lecture audio"');
    });

    await t.test('Option règle de lecture dynamique retirée du DOM', () => {
        const compRuler = window.document.getElementById('compRuler');
        assert.strictEqual(compRuler, null, 'Le checkbox compRuler ne doit plus exister dans le DOM');
        const readingRuler = window.document.getElementById('readingRuler');
        assert.strictEqual(readingRuler, null, 'L\'élément readingRuler ne doit plus exister dans le DOM');
    });

    await t.test('Option coloration des graphèmes (sons) présente au-dessus du découpage syllabique', () => {
        const compGraphemes = window.document.getElementById('compGraphemes');
        const compSyllables = window.document.getElementById('compSyllables');
        assert.ok(compGraphemes, 'Le checkbox compGraphemes doit exister dans le DOM');
        assert.ok(compSyllables, 'Le checkbox compSyllables doit exister dans le DOM');

        const graphemesLabel = window.document.querySelector('label[for="compGraphemes"]');
        assert.ok(graphemesLabel, 'Le label compGraphemes doit exister');
        assert.ok(graphemesLabel.textContent.includes('graphèmes'), 'Le label doit mentionner les graphèmes');
        assert.ok(graphemesLabel.textContent.includes('CERAS'), 'Le label doit faire référence au code CERAS');

        // Vérification de la position relative dans le DOM (compGraphemes précède compSyllables)
        const order = graphemesLabel.compareDocumentPosition(compSyllables.closest('label'));
        assert.ok(order & window.Node.DOCUMENT_POSITION_FOLLOWING, 'compGraphemes doit être positionné avant compSyllables dans le DOM');
    });

    await t.test('Légendes de sons-couleurs CERAS présentes et dynamiques', () => {
        const miniLegend = window.document.getElementById('cerasMiniLegend');
        const worksheetLegend = window.document.getElementById('cerasWorksheetLegend');
        assert.ok(miniLegend, 'La mini-légende CERAS dans le panneau de contrôle doit exister');
        assert.ok(worksheetLegend, 'La légende CERAS sur la fiche élève doit exister');

        // Initialement masquées
        assert.strictEqual(miniLegend.style.display, 'none');
        assert.strictEqual(worksheetLegend.style.display, 'none');

        // Activation de compGraphemes
        const compGraphemes = window.document.getElementById('compGraphemes');
        compGraphemes.checked = true;
        compGraphemes.dispatchEvent(new window.Event('change'));

        assert.strictEqual(miniLegend.style.display, 'flex', 'La mini-légende doit s\'afficher quand compGraphemes est coché');
        assert.strictEqual(worksheetLegend.style.display, 'block', 'La légende de la fiche doit s\'afficher quand compGraphemes est coché');
    });

    await t.test('Coloration exacte des graphèmes selon les règles CERAS sur la fiche adaptée', () => {
        const compGraphemes = window.document.getElementById('compGraphemes');
        compGraphemes.checked = true;
        compGraphemes.dispatchEvent(new window.Event('change'));

        // Passage à l'onglet adaptateur
        const tabAdapterBtn = window.document.querySelector('.tab-btn[data-tab="adapter"]');
        tabAdapterBtn.click();

        const worksheetText = window.document.getElementById('adapterWorksheetText');
        const html = worksheetText.innerHTML;

        // Vérification de la présence des différentes classes CERAS
        assert.ok(html.includes('class="graph-'), 'Des balises de graphèmes doivent être générées');
        assert.ok(html.includes('graph-o') || html.includes('graph-an') || html.includes('graph-in'), 'Des classes phonèmes doivent être présentes');

        // Vérification des styles CSS spécifiques demandés : oi en blanc sur fond noir, un souligné, on marron sans fond
        const styleText = window.document.querySelector('style').textContent;
        assert.ok(styleText.includes('.graph-oi'), 'La classe .graph-oi doit être définie');
        assert.ok(styleText.includes('.graph-un'), 'La classe .graph-un doit être définie');
        assert.ok(styleText.includes('.graph-on'), 'La classe .graph-on doit être définie');
        assert.ok(styleText.includes('text-decoration: underline') && styleText.includes('.graph-un'), '.graph-un doit être souligné');
    });

    await t.test('Fonction window.__onResetApp présente pour réinitialisation globale', () => {
        assert.strictEqual(typeof window.__onResetApp, 'function', 'window.__onResetApp doit être une fonction');
    });
});

