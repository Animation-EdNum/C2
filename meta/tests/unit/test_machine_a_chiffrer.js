/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const filePath = path.resolve(__dirname, '../../../webapps/machine_a_chiffrer.html');

function setupDOM() {
    const html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/webapps/machine_a_chiffrer.html'
    });
    dom.window.playSound = () => {};
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    dom.window.dispatchEvent(new dom.window.Event('load'));
    return dom.window;
}

test('Machine à chiffrer - Fichier et Structure (Production)', async (t) => {
    assert.ok(fs.existsSync(filePath), 'Le fichier webapps/machine_a_chiffrer.html doit exister');
    const html = fs.readFileSync(filePath, 'utf8');

    await t.test('Métadonnées et badges conformes (production)', () => {
        assert.match(html, /<title>.*Machine à chiffrer.*<\/title>/i);
        assert.ok(!html.includes('badge-alpha'), 'Ne doit plus avoir le badge Alpha en production');
        assert.match(html, /class="badge-level"/i);
        assert.match(html, /7-8H/);
    });

    await t.test('Respecte la politique CSP stricte', () => {
        assert.match(html, /http-equiv="Content-Security-Policy"/i);
        assert.match(html, /default-src 'self'/i);
    });

    await t.test('Contient les 5 onglets cryptographiques', () => {
        assert.match(html, /id="tab-cesar"/i);
        assert.match(html, /id="tab-vigenere"/i);
        assert.match(html, /id="tab-atbash"/i);
        assert.match(html, /id="tab-morse"/i);
        assert.match(html, /id="tab-hacker"/i);
    });

    await t.test('Contient la roue de César et les deux zones de texte', () => {
        assert.match(html, /id="caesar-wheel"/i);
        assert.match(html, /id="input-clear"/i);
        assert.match(html, /id="input-cipher"/i);
    });
});

test('Machine à chiffrer - Logique cryptographique & Interactivité (JSDOM)', async (t) => {
    await t.test('Chiffrement César avec décalage de 3 (A -> D, Z -> C)', () => {
        const window = setupDOM();
        const inputClear = window.document.getElementById('input-clear');
        const inputCipher = window.document.getElementById('input-cipher');
        const offsetSlider = window.document.getElementById('offset');

        offsetSlider.value = 3;
        offsetSlider.dispatchEvent(new window.Event('input'));

        inputClear.value = 'BONJOUR';
        inputClear.dispatchEvent(new window.Event('input'));

        assert.strictEqual(inputCipher.value, 'ERQMRXU');
        window.close();
    });

    await t.test('Déchiffrement César (saisie dans le texte chiffré)', () => {
        const window = setupDOM();
        const inputClear = window.document.getElementById('input-clear');
        const inputCipher = window.document.getElementById('input-cipher');
        const offsetSlider = window.document.getElementById('offset');

        offsetSlider.value = 3;
        offsetSlider.dispatchEvent(new window.Event('input'));

        inputCipher.value = 'ERQMRXU';
        inputCipher.dispatchEvent(new window.Event('input'));

        assert.strictEqual(inputClear.value, 'BONJOUR');
        window.close();
    });

    await t.test('Chiffrement Atbash (A <-> Z, B <-> Y)', () => {
        const window = setupDOM();
        const tabAtbash = window.document.getElementById('tab-atbash');
        const inputClear = window.document.getElementById('input-clear');
        const inputCipher = window.document.getElementById('input-cipher');

        tabAtbash.click();

        inputClear.value = 'AZ';
        inputClear.dispatchEvent(new window.Event('input'));

        assert.strictEqual(inputCipher.value, 'ZA');
        window.close();
    });

    await t.test('Chiffrement Vigenère avec clé', () => {
        const window = setupDOM();
        const tabVigenere = window.document.getElementById('tab-vigenere');
        const inputClear = window.document.getElementById('input-clear');
        const inputCipher = window.document.getElementById('input-cipher');
        const keywordInput = window.document.getElementById('keyword');

        tabVigenere.click();
        keywordInput.value = 'CLE';
        keywordInput.dispatchEvent(new window.Event('input'));

        inputClear.value = 'TEST';
        inputClear.dispatchEvent(new window.Event('input'));

        // T+C(2)=V, E+L(11)=P, S+E(4)=W, T+C(2)=V => VPWV
        assert.strictEqual(inputCipher.value, 'VPWV');
        window.close();
    });

    await t.test('Traduction Morse (SOS -> ... --- ...)', () => {
        const window = setupDOM();
        const tabMorse = window.document.getElementById('tab-morse');
        const inputClear = window.document.getElementById('input-clear');
        const inputCipher = window.document.getElementById('input-cipher');

        tabMorse.click();

        inputClear.value = 'SOS';
        inputClear.dispatchEvent(new window.Event('input'));

        assert.strictEqual(inputCipher.value, '... --- ...');
        window.close();
    });

    await t.test('Bouton effacer réinitialise les zones de texte', () => {
        const window = setupDOM();
        const inputClear = window.document.getElementById('input-clear');
        const inputCipher = window.document.getElementById('input-cipher');
        const btnClear = window.document.getElementById('btn-clear-clear');

        inputClear.value = 'HELLO';
        inputClear.dispatchEvent(new window.Event('input'));
        assert.ok(inputCipher.value.length > 0);

        btnClear.click();
        assert.strictEqual(inputClear.value, '');
        assert.strictEqual(inputCipher.value, '');
        window.close();
    });
});
