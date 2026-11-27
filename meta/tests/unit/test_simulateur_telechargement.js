/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const filePath = path.resolve(__dirname, '../../../webapps/simulateur_telechargement.html');

function setupDOM() {
    const html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/webapps/simulateur_telechargement.html'
    });
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    return dom.window;
}

test('Simulateur de téléchargement - Fichier et Structure', async (t) => {
    assert.ok(fs.existsSync(filePath), 'Le fichier simulateur_telechargement.html doit exister');
    const html = fs.readFileSync(filePath, 'utf8');

    await t.test('Contient les métadonnées et le badge 7-8H (production)', () => {
        assert.match(html, /<title>.*Simulateur de téléchargement.*<\/title>/i);
        assert.ok(!html.includes('badge-alpha'), 'Ne doit plus avoir le badge Alpha en production');
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

    await t.test('Le background utilise un dégradé moderne de style Tailwind CSS', () => {
        assert.match(html, /linear-gradient\(135deg, #f1f5f9 0%, #eef2ff 35%, #fdf4ff 70%, #f0fdf4 100%\)/i);
    });

    await t.test('Les lettres A, B, C, D ne figurent plus sur les cartes de référence', () => {
        assert.ok(!html.includes('media-badge-letter'), 'Aucun badge lettre ne doit exister');
    });

    await t.test('Le bouton Mélanger a été supprimé au profit d un mélange par défaut', () => {
        assert.ok(!html.includes('id="btnShuffle"'), 'Le bouton btnShuffle ne doit pas exister');
    });

    await t.test('Le Défi des 4 médias ne contient aucune mention de Débit', () => {
        const window = setupDOM();
        const viewDefi = window.document.getElementById('viewDefi');
        assert.ok(!/Débit/i.test(viewDefi.textContent), 'Le Défi des 4 médias ne doit pas afficher de référence au débit');
        window.close();
    });

    await t.test('Header buttons : TNI/TBI et Thème conformes, aucun bouton son ni bouton aide séparé', () => {
        assert.ok(html.includes('id="projection-toggle-btn"'), 'Le bouton projection-toggle-btn doit exister');
        assert.ok(html.includes('id="icon-proj-expand"'), 'L icône expand doit exister');
        assert.ok(html.includes('id="icon-proj-compress"'), 'L icône compress doit exister');
        assert.ok(html.includes('id="theme-toggle-btn"'), 'Le bouton theme-toggle-btn doit exister pour theme.js');
        assert.ok(html.includes('id="icon-sun"'), 'L icône sun doit exister');
        assert.ok(html.includes('id="icon-moon"'), 'L icône moon doit exister');
        assert.ok(html.includes('id="reset-cache-btn"'), 'Le bouton reset-cache-btn doit exister comme sur time_timer et qrcode');
        assert.ok(!html.includes('id="audio-toggle-btn"'), 'Le bouton son doit avoir été retiré');
        assert.ok(!html.includes('id="helpToggleBtn"'), 'Le bouton consigne dans le header doit avoir été retiré');
    });

    await t.test('Respecte les éléments visuels standard : canvas confettis, balise main et onglets .tabs', () => {
        assert.ok(html.includes('id="confetti-canvas"'), 'Le canvas de confettis doit exister pour les célébrations');
        assert.ok(html.includes('<main>'), 'La balise sémantique main doit envelopper le contenu');
        assert.ok(html.includes('class="tabs"'), 'Les onglets doivent utiliser la classe standard .tabs');
    });

    await t.test('Consigne accordéon intégrée exclusivement dans le Défi des 4 médias', () => {
        const window = setupDOM();
        const viewDefi = window.document.getElementById('viewDefi');
        const viewLab = window.document.getElementById('viewLab');
        const consigneInDefi = viewDefi.querySelector('#consigneBox');
        const consigneInLab = viewLab.querySelector('#consigneBox');

        assert.ok(consigneInDefi, 'La consigne consigneBox doit être située dans viewDefi');
        assert.strictEqual(consigneInDefi.tagName.toLowerCase(), 'details', 'La consigne doit être un élément details');
        assert.ok(!consigneInLab, 'La consigne ne doit pas être présente dans le Laboratoire');
        window.close();
    });

    await t.test('La jauge de progression est fine (10px)', () => {
        assert.match(html, /\.progress-track\s*\{[^}]*height:\s*10px;/i);
    });

    await t.test('Le laboratoire simule uniquement en temps réel sans accélérateur', () => {
        assert.ok(!html.includes('lab-mult-btn'), 'Aucun bouton accélérateur ne doit exister dans le laboratoire');
        assert.ok(!html.includes('labMultiplier'), 'Aucune variable labMultiplier ne doit exister');
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

    await t.test('Le bouton de simulation démarre puis peut annuler en temps réel', () => {
        const doc = window.document;
        const simBtn = doc.getElementById('simBtn-poemes');
        assert.ok(simBtn, 'Bouton de simulation du poème doit exister');
        simBtn.click();

        assert.ok(simBtn.classList.contains('btn-cancel'), 'Le bouton doit passer en mode Annuler');
        assert.match(simBtn.textContent, /Annuler/i);

        // Annuler le téléchargement
        simBtn.click();
        assert.ok(!simBtn.classList.contains('btn-cancel'), 'Le bouton doit repasser en mode normal après annulation');
    });

    await t.test('Le clic sur un média valide immédiatement l hypothèse de l élève', () => {
        const doc = window.document;
        const card1 = doc.getElementById('canalCard-1');
        const btnTexte = card1.querySelector('[data-guess="texte"]');
        assert.ok(btnTexte, 'Bouton Texte doit exister sur le canal 1');
        btnTexte.click();

        // Le canal doit être révélé immédiatement
        assert.ok(card1.classList.contains('revealed'), 'Le canal doit avoir la classe revealed immédiatement');
        assert.ok(btnTexte.disabled, 'Les boutons de prédiction doivent être désactivés après validation');
        const isCorrectOrWrong = btnTexte.classList.contains('guess-btn-correct') || btnTexte.classList.contains('guess-btn-wrong');
        assert.ok(isCorrectOrWrong, 'Le bouton cliqué doit afficher le style correct ou erroné');

        const pill = doc.getElementById('revealedPill-1');
        assert.ok(pill && pill.style.display !== 'none', 'La pastille de verdict doit être visible');
    });

    await t.test('Le label de progression affiche les tailles dans des unités adaptées (Ko, Mo, Go) puis révèle le total après', () => {
        const doc = window.document;
        const engine = window.SimTelechargementEngine;
        const sizeLabel1 = doc.getElementById('sizeLabel-1');
        const timeLabel1 = doc.getElementById('timeLabel-1');
        assert.ok(sizeLabel1, 'sizeLabel-1 doit exister');
        assert.ok(timeLabel1, 'timeLabel-1 doit exister');
        assert.strictEqual(sizeLabel1.textContent.trim(), '0 Ko');
        assert.strictEqual(timeLabel1.textContent.trim(), '0,0 s');

        // Vérifier le formatage adaptatif des unités avec équivalence en Ko
        assert.strictEqual(engine.formatCanalSize(0), '0 Ko');
        assert.strictEqual(engine.formatCanalSize(500), '500 Ko');
        assert.strictEqual(engine.formatCanalSize(1800), "1,8 Mo (= 1'800 Ko)");
        assert.strictEqual(engine.formatCanalSize(700000), "700 Mo (= 700'000 Ko)");
        assert.strictEqual(engine.formatCanalSize(1500000), "1,50 Go (= 1'500'000 Ko)");

        // Après hypothèse, le total et le pourcentage sont révélés dans l unité du média
        const card1 = doc.getElementById('canalCard-1');
        card1.querySelector('[data-guess="texte"]').click();
        assert.match(sizeLabel1.textContent, /^0 Ko \/ (?:500 Ko|1,8 Mo|4 Mo|700 Mo)$/);
        assert.match(timeLabel1.textContent, /^0,0 s \(0%\)$/);

        // À la fin d un canal vidéo, l affichage conserve l équivalence en Ko jusqu à la fin
        const videoCanal = engine.state.canals.find(c => c.mediaKey === 'video');
        assert.ok(videoCanal, 'Un canal vidéo doit exister');
        engine.finishCanal(videoCanal);
        assert.strictEqual(doc.getElementById(`sizeLabel-${videoCanal.id}`).textContent.trim(), "700 Mo (= 700'000 Ko)");
        engine.revealCanal(videoCanal.id);
        assert.strictEqual(doc.getElementById(`sizeLabel-${videoCanal.id}`).textContent.trim(), "700 Mo (= 700'000 Ko) / 700 Mo");
    });

    await t.test('formatDuration gère sans "60 s" les arrondis à la borne (119.8 s -> 2 min)', () => {
        const engine = window.SimTelechargementEngine;
        assert.ok(engine, 'SimTelechargementEngine doit être exposé');
        assert.strictEqual(engine.formatDuration(119.8), '2 min');
        assert.strictEqual(engine.formatDuration(59.96), '1 min');
    });

    await t.test('finishCanal resynchronise le bouton Tout lancer lorsque tous les canaux sont terminés', () => {
        const doc = window.document;
        const engine = window.SimTelechargementEngine;
        doc.getElementById('btnLaunchAll').click();
        assert.match(doc.getElementById('btnLaunchAll').textContent, /Tout suspendre/i);

        engine.state.canals.forEach(c => engine.finishCanal(c));
        assert.match(doc.getElementById('btnLaunchAll').textContent, /Tout lancer/i);
        assert.strictEqual(doc.getElementById('btnLaunchAll').disabled, true);
    });

    await t.test('Le bouton Tout lancer du laboratoire démarre tous les téléchargements', () => {
        const doc = window.document;
        const btnLabLaunchAll = doc.getElementById('btnLabLaunchAll');
        assert.ok(btnLabLaunchAll, 'Le bouton Tout lancer du laboratoire doit exister');
        btnLabLaunchAll.click();

        // Vérifier qu'au moins un bouton est passé en mode Annuler
        const btnPoemes = doc.getElementById('simBtn-poemes');
        assert.ok(btnPoemes.classList.contains('btn-cancel'), 'Le téléchargement du poème doit être démarré');

        // Annuler tout
        btnLabLaunchAll.click();
        assert.ok(!btnPoemes.classList.contains('btn-cancel'), 'Le téléchargement doit être arrêté après ré-appui');
    });

    await t.test('Le bouton TBI bascule le mode TBI sans déclencher le fullscreen navigateur', () => {
        const localWin = setupDOM();
        const doc = localWin.document;
        const projBtn = doc.getElementById('projection-toggle-btn');
        assert.ok(projBtn, 'Le bouton projection-toggle-btn doit être cliquable');

        projBtn.click();
        assert.ok(doc.body.classList.contains('mode-tbi'), 'Le body doit avoir la classe mode-tbi après le clic');
        assert.ok(doc.body.classList.contains('projection'), 'Le body doit aussi avoir la classe standard projection');

        const iconExpand = doc.getElementById('icon-proj-expand');
        const iconCompress = doc.getElementById('icon-proj-compress');
        assert.strictEqual(iconExpand.style.display, 'none');
        assert.strictEqual(iconCompress.style.display, 'inline-block');

        // Deuxième clic pour désactiver
        projBtn.click();
        assert.ok(!doc.body.classList.contains('mode-tbi'), 'Le mode-tbi doit être désactivé');
        assert.strictEqual(iconExpand.style.display, 'inline-block');
        assert.strictEqual(iconCompress.style.display, 'none');
        localWin.close();
    });
});
