/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const calcScriptSrc = fs.readFileSync('assets/js/calculatrice_binaire.js', 'utf-8');

function setupDOM() {
    const dom = new JSDOM(`<!DOCTYPE html><html><body>
        <table id="calc-table"></table>
        <div id="calc-result-area"></div>
        <input type="number" id="dec-input" value="0">
        <input type="text" id="bin-input" value="0000 0000">
        <span id="rep-bin-val"></span>
        <span id="rep-dec-val"></span>
        <button id="reset-calc-btn"></button>
        <button id="btn-copy-bin"></button>
        <button id="btn-copy-dec"></button>
    </body></html>`, { runScripts: "dangerously" });

    const window = dom.window;
    window.eval(calcScriptSrc);
    if (window.CalculatriceBinaire && typeof window.CalculatriceBinaire.init === 'function') {
        window.CalculatriceBinaire.init();
    }
    return window;
}

test('Calculatrice binaire - initial state and DOM structure', async (t) => {
    await t.test('initializes with 8 bits set to 0 and sum = 0 with row order: bits, powers, values', () => {
        const window = setupDOM();
        const api = window.CalculatriceBinaire;

        assert.ok(api, 'window.CalculatriceBinaire should be defined');
        assert.deepEqual(Array.from(api.getState()), [0, 0, 0, 0, 0, 0, 0, 0]);
        assert.strictEqual(api.calculateSum(), 0);

        const table = window.document.getElementById('calc-table');
        const rows = table.querySelectorAll('tr');
        assert.strictEqual(rows.length, 3, 'Table should have 3 rows (bits, powers, values)');
        assert.strictEqual(rows[0].querySelectorAll('.calc-bit').length, 8, 'Row 0 must contain 8 bit buttons');
        assert.strictEqual(rows[1].querySelectorAll('.calc-power-cell').length, 8, 'Row 1 must contain 8 power cells');
        assert.strictEqual(rows[2].querySelectorAll('.calc-box').length, 8, 'Row 2 must contain 8 decimal boxes');

        const decInput = window.document.getElementById('dec-input');
        assert.strictEqual(decInput.value, '0');

        const binVal = window.document.getElementById('rep-bin-val');
        assert.strictEqual(binVal.textContent, '0000 0000');
    });
});

test('Calculatrice binaire - toggling bits and operations', async (t) => {
    await t.test('toggling individual bits updates sum and classes', () => {
        const window = setupDOM();
        const api = window.CalculatriceBinaire;

        // Toggle MSB (index 0 = 128)
        api.toggleBit(0);
        assert.strictEqual(api.calculateSum(), 128);
        assert.deepEqual(Array.from(api.getState()), [1, 0, 0, 0, 0, 0, 0, 0]);

        const bit0 = window.document.getElementById('calc-bit-0');
        const box0 = window.document.getElementById('calc-box-0');
        assert.strictEqual(bit0.textContent, '1');
        assert.ok(bit0.classList.contains('active'));
        assert.ok(box0.classList.contains('selected'));

        // Toggle LSB (index 7 = 1) -> 128 + 1 = 129
        api.toggleBit(7);
        assert.strictEqual(api.calculateSum(), 129);
        assert.deepEqual(Array.from(api.getState()), [1, 0, 0, 0, 0, 0, 0, 1]);

        const decInput = window.document.getElementById('dec-input');
        assert.strictEqual(decInput.value, '129');

        const binVal = window.document.getElementById('rep-bin-val');
        assert.strictEqual(binVal.textContent, '1000 0001');

        const resultArea = window.document.getElementById('calc-result-area');
        assert.ok(resultArea.textContent.includes('128 + 1 = 129'));

        // Toggle MSB back to 0 -> sum = 1
        api.toggleBit(0);
        assert.strictEqual(api.calculateSum(), 1);
        assert.deepEqual(Array.from(api.getState()), [0, 0, 0, 0, 0, 0, 0, 1]);
        assert.strictEqual(bit0.textContent, '0');
        assert.strictEqual(bit0.classList.contains('active'), false);
    });
});

test('Calculatrice binaire - setDecimalValue and clamping', async (t) => {
    await t.test('sets 42 correctly (00101010 = 32 + 8 + 2)', () => {
        const window = setupDOM();
        const api = window.CalculatriceBinaire;

        api.setDecimalValue(42);
        assert.strictEqual(api.calculateSum(), 42);
        // Powers: [128, 64, 32, 16, 8, 4, 2, 1] -> 32(idx 2), 8(idx 4), 2(idx 6)
        assert.deepEqual(Array.from(api.getState()), [0, 0, 1, 0, 1, 0, 1, 0]);

        const binVal = window.document.getElementById('rep-bin-val');
        assert.strictEqual(binVal.textContent, '0010 1010');
    });

    await t.test('clamps negative numbers to 0 and > 255 to 255', () => {
        const window = setupDOM();
        const api = window.CalculatriceBinaire;

        api.setDecimalValue(-10);
        assert.strictEqual(api.calculateSum(), 0);
        assert.deepEqual(Array.from(api.getState()), [0, 0, 0, 0, 0, 0, 0, 0]);

        api.setDecimalValue(999);
        assert.strictEqual(api.calculateSum(), 255);
        assert.deepEqual(Array.from(api.getState()), [1, 1, 1, 1, 1, 1, 1, 1]);
    });

    await t.test('decInput input event clamps value > 255 directly in DOM (e.g. 256 becomes 255)', () => {
        const window = setupDOM();
        const decInput = window.document.getElementById('dec-input');
        const api = window.CalculatriceBinaire;

        // Simulate typing 256
        decInput.value = '256';
        decInput.dispatchEvent(new window.Event('input'));

        assert.strictEqual(decInput.value, '255', 'Input value must be clamped to 255 in the DOM');
        assert.strictEqual(api.calculateSum(), 255);
        assert.deepEqual(Array.from(api.getState()), [1, 1, 1, 1, 1, 1, 1, 1]);

        // Simulate typing 9999
        decInput.value = '9999';
        decInput.dispatchEvent(new window.Event('input'));
        assert.strictEqual(decInput.value, '255', 'Input value must stay 255');
    });
});

test('Calculatrice binaire - manual binary input editing', async (t) => {
    await t.test('setBinaryValue sets arbitrary bit string and updates sum and decInput', () => {
        const window = setupDOM();
        const api = window.CalculatriceBinaire;
        const decInput = window.document.getElementById('dec-input');
        const binInput = window.document.getElementById('bin-input');

        api.setBinaryValue('1010');
        assert.strictEqual(api.calculateSum(), 10);
        assert.strictEqual(decInput.value, '10');
        assert.strictEqual(binInput.value, '0000 1010');

        api.setBinaryValue('0010 1010');
        assert.strictEqual(api.calculateSum(), 42);
        assert.strictEqual(decInput.value, '42');
        assert.strictEqual(binInput.value, '0010 1010');
    });

    await t.test('typing into bin-input dynamically updates state and decimal value', () => {
        const window = setupDOM();
        const api = window.CalculatriceBinaire;
        const decInput = window.document.getElementById('dec-input');
        const binInput = window.document.getElementById('bin-input');

        // User types '101' into binary field
        binInput.value = '101';
        binInput.dispatchEvent(new window.Event('input'));

        assert.strictEqual(api.calculateSum(), 5);
        assert.strictEqual(decInput.value, '5');
        assert.deepEqual(Array.from(api.getState()), [0, 0, 0, 0, 0, 1, 0, 1]);

        // On blur, binInput formats to full 8 bits with nibble space
        binInput.dispatchEvent(new window.Event('blur'));
        assert.strictEqual(binInput.value, '0000 0101');
    });
});

test('Calculatrice binaire - quick actions and app reset', async (t) => {
    await t.test('resetCalc resets all bits and sum to 0', () => {
        const window = setupDOM();
        const api = window.CalculatriceBinaire;

        api.setDecimalValue(255);
        assert.strictEqual(api.calculateSum(), 255);

        // Reset gives 0
        api.resetCalc();
        assert.strictEqual(api.calculateSum(), 0);
        assert.deepEqual(Array.from(api.getState()), [0, 0, 0, 0, 0, 0, 0, 0]);
    });

    await t.test('window.__onResetApp hook resets calculator state', () => {
        const window = setupDOM();
        const api = window.CalculatriceBinaire;

        api.setDecimalValue(100);
        assert.strictEqual(api.calculateSum(), 100);

        assert.strictEqual(typeof window.__onResetApp, 'function');
        window.__onResetApp();
        assert.strictEqual(api.calculateSum(), 0);
    });

    await t.test('quick action buttons (-1, +1, invert, all ones) update state and HTML structure has no confetti-canvas', () => {
        const htmlContent = fs.readFileSync('webapps/calculatrice_binaire.html', 'utf-8');
        const fullDom = new JSDOM(htmlContent, { runScripts: 'dangerously', url: 'http://localhost/webapps/calculatrice_binaire.html' });
        const win = fullDom.window;
        assert.strictEqual(win.document.getElementById('confetti-canvas'), null, 'Unused confetti-canvas must be removed');
        const binInput = win.document.getElementById('bin-input');
        assert.ok(parseInt(binInput.getAttribute('maxlength'), 10) >= 16, 'bin-input maxlength must allow direct editing');

        win.eval(calcScriptSrc);
        win.CalculatriceBinaire.init();

        win.document.getElementById('btn-dec-plus').click();
        assert.strictEqual(win.CalculatriceBinaire.calculateSum(), 1);
        win.document.getElementById('btn-dec-minus').click();
        assert.strictEqual(win.CalculatriceBinaire.calculateSum(), 0);
        win.document.getElementById('btn-invert-bits').click();
        assert.strictEqual(win.CalculatriceBinaire.calculateSum(), 255);
        win.document.getElementById('reset-calc-btn').click();
        assert.strictEqual(win.CalculatriceBinaire.calculateSum(), 0);
        win.document.getElementById('btn-all-ones').click();
        assert.strictEqual(win.CalculatriceBinaire.calculateSum(), 255);
    });
});
