/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../../../webapps/teacher/roue_de_la_chance.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

function setupDOM() {
    const dom = new JSDOM(htmlContent, {
        runScripts: 'dangerously',
        url: 'http://localhost/'
    });
    return dom.window;
}

test('roue_de_la_chance.html - presets, number generator & personal list', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupDOM();
    });

    await t.test('production version does not contain alpha badge and links to teacher space', () => {
        const badge = window.document.querySelector('.badge-alpha');
        assert.strictEqual(badge, null, 'Alpha badge should be removed in production');
        const backBtn = window.document.querySelector('.header-back-btn');
        assert.ok(backBtn, 'Back button should exist');
        assert.strictEqual(backBtn.getAttribute('href'), '../../index.html#teachers', 'Back button should link to teacher space');
    });

    await t.test('metiers preset has Distribution du matériel (2) and no Facteur·trice', () => {
        const scriptMatch = htmlContent.match(/metiers:\s*\[([\s\S]*?)\]/);
        assert.ok(scriptMatch, 'Should find metiers in script');
        const metiers = eval(`[${scriptMatch[1]}]`);

        assert.ok(!metiers.includes('Facteur·trice'), 'Facteur·trice must be removed');
        const idxMat1 = metiers.indexOf('Distribution du matériel');
        const idxMat2 = metiers.indexOf('Distribution du matériel (2)');
        assert.ok(idxMat1 !== -1, 'Distribution du matériel must be present');
        assert.ok(idxMat2 !== -1, 'Distribution du matériel (2) must be present');
        assert.strictEqual(idxMat2, idxMat1 + 1, 'Distribution du matériel (2) must be right after Distribution du matériel');
    });

    await t.test('privileges preset contains the curated 10 privileges', () => {
        const scriptMatch = htmlContent.match(/privileges:\s*\[([\s\S]*?)\]/);
        assert.ok(scriptMatch, 'Should find privileges in script');
        const privileges = eval(`[${scriptMatch[1]}]`);

        const expected = [
            "Travailler au bureau de la maîtresse",
            "Choisir un jeu à la gym",
            "Travailler à côté d'un copain ou d'une copine",
            "Avoir 15 minutes de plus de récréation (à l'intérieur)",
            "Emprunter un jeu de la classe pour la maison",
            "Choisir d'écouter une musique en classe",
            "Choisir sa place pour la journée",
            "Premier ou première au rang",
            "5 minutes de temps libre bonus",
            "Écrire au stylo de son choix"
        ];

        assert.strictEqual(privileges.length, 10, 'Should have exactly 10 privileges');
        for (const item of expected) {
            assert.ok(privileges.includes(item), `Privileges should include "${item}"`);
        }
    });

    await t.test('questions_ednum preset has curated 10 questions', () => {
        const scriptMatch = htmlContent.match(/questions_ednum:\s*\[([\s\S]*?)\]/);
        assert.ok(scriptMatch, 'Should find questions_ednum in script');
        const questions = eval(`[${scriptMatch[1]}]`);

        assert.strictEqual(questions.length, 10, 'Should have 10 educational questions');
        assert.ok(questions.some(q => q.includes('donnée personnelle')), 'Should have personal data question');
        assert.ok(questions.some(q => q.includes('cadenas dans le navigateur')), 'Should have lock/security question');
        assert.ok(questions.some(q => q.includes('fausse information') || q.includes('fake news')), 'Should have fake news question');
    });

    await t.test('setup-card has widened max-width for single-line display on large screens', () => {
        const cardCssMatch = htmlContent.match(/\.setup-card\s*\{([^}]+)\}/);
        assert.ok(cardCssMatch, 'Should find .setup-card CSS rule');
        const cssContent = cardCssMatch[1];
        const maxWidthMatch = cssContent.match(/max-width:\s*(\d+)px/);
        assert.ok(maxWidthMatch, 'Should find max-width in .setup-card rule');
        const maxWidth = parseInt(maxWidthMatch[1], 10);
        assert.ok(maxWidth >= 860, `max-width (${maxWidth}px) should be at least 860px to fit all presets on one line`);
    });

    await t.test('custom number generator creates 1 to N choices', () => {
        const input = window.document.getElementById('presetMaxNumberInput');
        const btn = window.document.getElementById('presetNumbersBtn');
        const applyBtn = window.document.getElementById('applyNumbersBtn');
        const choicesInput = window.document.getElementById('choicesInput');

        assert.ok(input, 'presetMaxNumberInput element should exist');
        assert.ok(btn, 'presetNumbersBtn element should exist');
        assert.ok(applyBtn, 'applyNumbersBtn element should exist');

        // Test default 1 to 10
        btn.click();
        let items = choicesInput.value.trim().split('\n');
        assert.strictEqual(items.length, 10, 'Default should generate 10 items');
        assert.strictEqual(items[0], '1');
        assert.strictEqual(items[9], '10');

        // Test 1 to 50
        input.value = '50';
        applyBtn.click();
        items = choicesInput.value.trim().split('\n');
        assert.strictEqual(items.length, 50, 'Should generate 50 items when max is 50');
        assert.strictEqual(items[0], '1');
        assert.strictEqual(items[49], '50');

        // Test Enter key on input
        input.value = '25';
        const enterEvent = new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        input.dispatchEvent(enterEvent);
        items = choicesInput.value.trim().split('\n');
        assert.strictEqual(items.length, 25, 'Should generate 25 items on Enter');
        assert.strictEqual(items[24], '25');
    });

    await t.test('personal custom list can be saved and loaded', () => {
        const saveBtn = window.document.getElementById('saveCustomListBtn');
        const loadBtn = window.document.getElementById('presetCustomBtn');
        const choicesInput = window.document.getElementById('choicesInput');

        assert.ok(saveBtn, 'saveCustomListBtn should exist');
        assert.ok(loadBtn, 'presetCustomBtn should exist');

        // Input custom list
        const myStudents = ['Emma', 'Lucas', 'Noah', 'Léa', 'Gabriel'];
        choicesInput.value = myStudents.join('\n');

        // Save
        saveBtn.click();

        // Check localStorage
        const stored = window.localStorage.getItem('ednum_roue_custom_list');
        assert.ok(stored, 'Personal list should be saved in localStorage');
        const parsed = JSON.parse(stored);
        assert.deepStrictEqual(parsed, myStudents, 'Saved list should match input items');
        assert.ok(loadBtn.classList.contains('has-saved-list'), 'Preset button should have has-saved-list class');

        // Overwrite choicesInput with something else
        choicesInput.value = 'Different 1\nDifferent 2';

        // Load custom list
        loadBtn.click();
        assert.strictEqual(choicesInput.value, myStudents.join('\n'), 'choicesInput should be restored with personal list');
    });
});
