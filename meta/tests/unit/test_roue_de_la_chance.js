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

    await t.test('oui_non preset contains Oui and Non and button loads them', () => {
        const scriptMatch = htmlContent.match(/oui_non:\s*\[([\s\S]*?)\]/);
        assert.ok(scriptMatch, 'Should find oui_non in script');
        const ouiNon = eval(`[${scriptMatch[1]}]`);

        assert.deepStrictEqual(ouiNon, ['Oui', 'Non'], 'Should contain exactly Oui and Non');

        const btn = window.document.querySelector('[data-preset="oui_non"]');
        assert.ok(btn, 'Preset button for oui_non should exist');
        btn.click();
        const choicesInput = window.document.getElementById('choicesInput');
        assert.strictEqual(choicesInput.value, 'Oui\nNon', 'choicesInput should be set to Oui and Non');
    });

    await t.test('alphabet preset contains 26 letters from A to Z and button loads them', () => {
        const scriptMatch = htmlContent.match(/alphabet:\s*\[([\s\S]*?)\]/);
        assert.ok(scriptMatch, 'Should find alphabet in script');
        const alphabet = eval(`[${scriptMatch[1]}]`);

        assert.strictEqual(alphabet.length, 26, 'Should contain 26 letters');
        assert.strictEqual(alphabet[0], 'A', 'First letter should be A');
        assert.strictEqual(alphabet[25], 'Z', 'Last letter should be Z');

        const btn = window.document.querySelector('[data-preset="alphabet"]');
        assert.ok(btn, 'Preset button for alphabet should exist');
        btn.click();
        const choicesInput = window.document.getElementById('choicesInput');
        assert.strictEqual(choicesInput.value, alphabet.join('\n'), 'choicesInput should be set to full alphabet');
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
