/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/teacher/sim_dyslexie.html');

function setupDOM() {
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(htmlContent, {
        runScripts: 'dangerously',
        url: 'http://localhost/'
    });
    return dom.window;
}

test('sim_dyslexie.html - Adaptateur & Simulateur DYS (Valdois, fluence, pastel, TTS, polices, sons muets)', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupDOM();
    });

    t.afterEach(() => {
        if (window) {
            window.close();
        }
    });

    await t.test('Titre de l\'outil renommé en Adaptateur & Simulateur DYS', () => {
        const title = window.document.querySelector('title').textContent;
        const h1 = window.document.querySelector('h1').textContent;
        assert.ok(title.includes('Adaptateur & Simulateur DYS'), 'Le titre HTML doit être "Adaptateur & Simulateur DYS"');
        assert.ok(h1.includes('Adaptateur & Simulateur DYS'), 'Le titre H1 doit être "Adaptateur & Simulateur DYS"');
    });

    await t.test('Arrivée par défaut sur l\'adaptateur DYS et non sur le simulateur', () => {
        const adapterTab = window.document.querySelector('.tab-btn[data-tab="adapter"]');
        const simTab = window.document.querySelector('.tab-btn[data-tab="simulation"]');
        assert.ok(adapterTab.classList.contains('active'), 'L\'onglet adaptateur doit être actif par défaut');
        assert.ok(!simTab.classList.contains('active'), 'L\'onglet simulateur ne doit pas être actif par défaut');

        const adapterView = window.document.getElementById('viewAdapter');
        const simView = window.document.getElementById('viewSimulation');
        assert.strictEqual(adapterView.style.display, 'flex', 'La vue adaptateur doit être affichée par défaut');
        assert.strictEqual(simView.style.display, 'none', 'La vue simulateur doit être masquée par défaut');
    });

    await t.test('Ordre des onglets : Adaptateur DYS, Éditer texte, Simulateur', () => {
        const tabs = Array.from(window.document.querySelectorAll('.tabs .tab-btn'));
        const tabKeys = tabs.map(tab => tab.dataset.tab);
        assert.deepStrictEqual(tabKeys, ['adapter', 'edit', 'simulation'], 'L\'ordre des onglets doit être adaptateur - éditer - simulateur');
    });

    await t.test('Textes d\'exemple affichés uniquement dans l\'onglet éditer texte, avec aménagements masqués', () => {
        const sectionPresets = window.document.getElementById('sectionPresets');
        const sectionAccommodations = window.document.getElementById('sectionAccommodations');
        const sectionSimControls = window.document.getElementById('sectionSimControls');

        // Initialement (sur l'adaptateur) : aménagements visibles, presets et sim masqués
        assert.strictEqual(sectionAccommodations.style.display, 'block');
        assert.strictEqual(sectionPresets.style.display, 'none');
        assert.strictEqual(sectionSimControls.style.display, 'none');

        // Bascule sur l'onglet "Éditer texte"
        const editTab = window.document.querySelector('.tab-btn[data-tab="edit"]');
        editTab.click();

        assert.strictEqual(sectionAccommodations.style.display, 'none', 'Les aménagements doivent être masqués sous éditer texte');
        assert.strictEqual(sectionSimControls.style.display, 'none', 'Les perturbations DYS doivent être masquées sous éditer texte');
        assert.strictEqual(sectionPresets.style.display, 'block', 'Les textes d\'exemple doivent être visibles sous éditer texte');

        // Bascule sur l'onglet "Simulateur"
        const simTab = window.document.querySelector('.tab-btn[data-tab="simulation"]');
        simTab.click();

        assert.strictEqual(sectionAccommodations.style.display, 'block', 'Les aménagements doivent être visibles sur le simulateur');
        assert.strictEqual(sectionSimControls.style.display, 'block', 'Les perturbations DYS doivent être visibles sur le simulateur');
        assert.strictEqual(sectionPresets.style.display, 'none', 'Les textes d\'exemple doivent être masqués sur le simulateur');
    });

    await t.test('Sélecteur de 4 polices présent (Outfit, Century Gothic, OpenDyslexic, Verdana) sans Arial', () => {
        const fontSelect = window.document.getElementById('compFontSelect');
        assert.ok(fontSelect, 'Le sélecteur de police compFontSelect doit exister');
        const options = Array.from(fontSelect.querySelectorAll('option')).map(o => o.value);
        assert.ok(options.includes('outfit'), 'Option Outfit présente');
        assert.ok(options.includes('century-gothic'), 'Option Century Gothic présente');
        assert.ok(options.includes('opendyslexic'), 'Option OpenDyslexic présente');
        assert.ok(!options.includes('arial'), 'Option Arial doit avoir été supprimée');
        assert.ok(options.includes('verdana'), 'Option Verdana présente');
        assert.strictEqual(fontSelect.value, 'outfit', 'Outfit doit être sélectionné par défaut');
    });

    await t.test('Option pour griser les sons et lettres muettes du français présente dans le DOM', () => {
        const compSilent = window.document.getElementById('compSilentLetters');
        assert.ok(compSilent, 'Le checkbox compSilentLetters doit exister');
        const label = window.document.querySelector('label[for="compSilentLetters"]');
        assert.ok(label.textContent.includes('muettes'), 'Le label doit mentionner les lettres muettes');
    });

    await t.test('Profil "Confort visuel" retiré des profils d\'adaptation rapide', () => {
        const visualBtn = window.document.querySelector('.profile-btn[data-profile="visuel"]');
        assert.strictEqual(visualBtn, null, 'Le bouton profil "Confort visuel" ne doit plus exister');
    });

    await t.test('Intitulés pédagogiques et renommages (Obstacles artificiels, Type de perturbation simulée, Adapter pour un élève, sous-titre)', () => {
        const simSectionTitle = window.document.querySelector('#sectionSimControls .panel-section-title').textContent;
        assert.ok(simSectionTitle.includes('Obstacles artificiels de lecture'), 'Titre doit être "Obstacles artificiels de lecture"');

        const simControls = window.document.getElementById('sectionSimControls');
        assert.ok(simControls.textContent.includes('Type de perturbation simulée'), 'Doit contenir "Type de perturbation simulée"');

        const compSubtitle = window.document.querySelector('#sectionAccommodations p').textContent;
        assert.ok(compSubtitle.includes('Il n’existe pas de réglage universel : testez les aides avec l’élève et conservez celles qui lui sont réellement utiles.'), 'Le sous-titre des aménagements doit correspondre exactement');

        const btnGoAdapter = window.document.getElementById('btnGoAdapter');
        assert.ok(btnGoAdapter.textContent.includes('Adapter pour un élève'), 'Le bouton doit être "Adapter pour un élève"');
    });

    await t.test('Profil début de lecture active la police Century Gothic et les lettres muettes grisées', () => {
        const debutBtn = window.document.querySelector('.profile-btn[data-profile="debut"]');
        assert.ok(debutBtn, 'Le bouton profil début de lecture doit exister');
        debutBtn.click();

        const fontSelect = window.document.getElementById('compFontSelect');
        const compSilent = window.document.getElementById('compSilentLetters');
        const compGraphemes = window.document.getElementById('compGraphemes');
        const compSyllables = window.document.getElementById('compSyllables');

        assert.strictEqual(fontSelect.value, 'century-gothic', 'Le profil début de lecture doit sélectionner Century Gothic');
        assert.strictEqual(compSilent.checked, true, 'Le profil début de lecture doit activer les lettres muettes');
        assert.strictEqual(compGraphemes.checked, true, 'Le profil début de lecture doit activer la coloration des graphèmes CERAS');
        assert.strictEqual(compSyllables.checked, false, 'Le profil début de lecture ne doit pas cocher le découpage syllabique');

        const worksheetText = window.document.getElementById('adapterWorksheetText');
        assert.ok(worksheetText.classList.contains('font-century-gothic'), 'La classe font-century-gothic doit être appliquée à la fiche');
        assert.ok(worksheetText.innerHTML.includes('class="silent-letter"'), 'Des lettres muettes grisées doivent être générées');
    });

    await t.test('Profil visuo-attentionnelle sélectionne la police OpenDyslexic selon les travaux de S. Valdois', () => {
        const visuoBtn = window.document.querySelector('.profile-btn[data-profile="visuo"]');
        assert.ok(visuoBtn, 'Le bouton profil visuo doit exister');
        assert.ok(visuoBtn.textContent.includes('Dyslexie visuo-attentionnelle'), 'Le libellé doit être "Dyslexie visuo-attentionnelle"');
        visuoBtn.click();

        const fontSelect = window.document.getElementById('compFontSelect');
        const compSilent = window.document.getElementById('compSilentLetters');
        assert.strictEqual(fontSelect.value, 'opendyslexic', 'Le profil visuo-attentionnelle doit sélectionner OpenDyslexic');
        assert.strictEqual(compSilent.checked, false, 'Les lettres muettes ne doivent pas être actives par défaut sur le profil visuo');

        const worksheetText = window.document.getElementById('adapterWorksheetText');
        assert.ok(worksheetText.classList.contains('font-opendyslexic'), 'La classe font-opendyslexic doit être appliquée à la fiche');
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

    await t.test('Bouton de synthèse vocale (TTS) présent dans l\'adaptateur et retiré du simulateur', () => {
        const btnTtsSim = window.document.getElementById('btnTtsSim');
        const btnTtsAdapter = window.document.getElementById('btnTtsAdapter');
        assert.strictEqual(btnTtsSim, null, 'Le bouton TTS du simulateur doit avoir été supprimé');
        assert.ok(btnTtsAdapter, 'Le bouton TTS de l\'adaptateur doit exister');
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

        const order = graphemesLabel.compareDocumentPosition(compSyllables.closest('label'));
        assert.ok(order & window.Node.DOCUMENT_POSITION_FOLLOWING, 'compGraphemes doit être positionné avant compSyllables dans le DOM');
    });

    await t.test('Légendes de sons-couleurs CERAS présentes et dynamiques', () => {
        const miniLegend = window.document.getElementById('cerasMiniLegend');
        const worksheetLegend = window.document.getElementById('cerasWorksheetLegend');
        assert.ok(miniLegend, 'La mini-légende CERAS dans le panneau de contrôle doit exister');
        assert.ok(worksheetLegend, 'La légende CERAS sur la fiche élève doit exister');

        assert.strictEqual(miniLegend.style.display, 'none');
        assert.strictEqual(worksheetLegend.style.display, 'none');

        const compGraphemes = window.document.getElementById('compGraphemes');
        compGraphemes.checked = true;
        compGraphemes.dispatchEvent(new window.Event('change'));

        assert.strictEqual(miniLegend.style.display, 'flex', 'La mini-légende doit s\'afficher quand compGraphemes est coché');
        assert.strictEqual(worksheetLegend.style.display, 'block', 'La légende de la fiche doit s\'afficher quand compGraphemes est coché');
    });

    await t.test('Coloration exacte des graphèmes et détection des lettres muettes sans conflit', () => {
        const compGraphemes = window.document.getElementById('compGraphemes');
        const compSilent = window.document.getElementById('compSilentLetters');
        compGraphemes.checked = true;
        compGraphemes.dispatchEvent(new window.Event('change'));
        compSilent.checked = true;
        compSilent.dispatchEvent(new window.Event('change'));

        const worksheetText = window.document.getElementById('adapterWorksheetText');
        const html = worksheetText.innerHTML;

        assert.ok(html.includes('class="graph-'), 'Des balises de graphèmes doivent être générées');
        assert.ok(html.includes('class="silent-letter"'), 'Des balises de lettres muettes doivent être générées');

        const styleText = window.document.querySelector('style').textContent;
        assert.ok(styleText.includes('.silent-letter'), 'La classe .silent-letter doit être stylisée');
        assert.ok(styleText.includes('.font-century-gothic'), 'La classe .font-century-gothic doit être définie');
        assert.ok(styleText.includes('.font-opendyslexic'), 'La classe .font-opendyslexic doit être définie');
    });

    await t.test('Option Mode Focus retirée du DOM', () => {
        const inputFocusMode = window.document.getElementById('inputFocusMode');
        const focusSpeedContainer = window.document.getElementById('focusSpeedContainer');
        assert.strictEqual(inputFocusMode, null, 'Le checkbox inputFocusMode ne doit plus exister dans le DOM');
        assert.strictEqual(focusSpeedContainer, null, 'Le conteneur focusSpeedContainer ne doit plus exister dans le DOM');
    });

    await t.test('Fonction window.__onResetApp présente pour réinitialisation globale', () => {
        assert.strictEqual(typeof window.__onResetApp, 'function', 'window.__onResetApp doit être une fonction');
    });
});
