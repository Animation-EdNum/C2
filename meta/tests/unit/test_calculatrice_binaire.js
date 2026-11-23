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
        <span id="rep-bin-val"></span>
        <span id="rep-hex-val"></span>
        <span id="rep-dec-val"></span>
        <button id="reset-calc-btn"></button>
        <button id="set-all-btn"></button>
        <button id="invert-bits-btn"></button>
        <button id="btn-copy-bin"></button>
        <button id="btn-copy-dec"></button>
        <button id="btn-copy-hex"></button>
    </body></html>`, { runScripts: "dangerously" });

    const window = dom.window;
    window.eval(calcScriptSrc);
    if (window.CalculatriceBinaire && typeof window.CalculatriceBinaire.init === 'function') {
        window.CalculatriceBinaire.init();
    }
    return window;
}

test('Calculatrice binaire - initial state and DOM structure', async (t) => {
    await t.test('initializes with 8 bits set to 0 and sum = 0', () => {
        const window = setupDOM();
        const api = window.CalculatriceBinaire;

        assert.ok(api, 'window.CalculatriceBinaire should be defined');
        assert.deepEqual(Array.from(api.getState()), [0, 0, 0, 0, 0, 0, 0, 0]);
        assert.strictEqual(api.calculateSum(), 0);

        const table = window.document.getElementById('calc-table');
        assert.strictEqual(table.querySelectorAll('tr').length, 3, 'Table should have 3 rows (powers, values, bits)');
        assert.strictEqual(table.querySelectorAll('.calc-bit').length, 8, 'Table should contain 8 bit buttons');
        assert.strictEqual(table.querySelectorAll('.calc-box').length, 8, 'Table should contain 8 decimal boxes');

        const decInput = window.document.getElementById('dec-input');
        assert.strictEqual(decInput.value, '0');

        const binVal = window.document.getElementById('rep-bin-val');
        assert.strictEqual(binVal.textContent, '0000 0000');

        const hexVal = window.document.getElementById('rep-hex-val');
        assert.strictEqual(hexVal.textContent, '0x00');
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

        const hexVal = window.document.getElementById('rep-hex-val');
        assert.strictEqual(hexVal.textContent, '0x81');

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

        const hexVal = window.document.getElementById('rep-hex-val');
        assert.strictEqual(hexVal.textContent, '0x2A');
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
});

test('Calculatrice binaire - quick actions and app reset', async (t) => {
    await t.test('setAllOnes, invertBits and resetCalc', () => {
        const window = setupDOM();
        const api = window.CalculatriceBinaire;

        api.setAllOnes();
        assert.strictEqual(api.calculateSum(), 255);
        assert.deepEqual(Array.from(api.getState()), [1, 1, 1, 1, 1, 1, 1, 1]);

        api.invertBits();
        assert.strictEqual(api.calculateSum(), 0);
        assert.deepEqual(Array.from(api.getState()), [0, 0, 0, 0, 0, 0, 0, 0]);

        // Invert from 0 gives 255
        api.invertBits();
        assert.strictEqual(api.calculateSum(), 255);

        // Reset gives 0
        api.resetCalc();
        assert.strictEqual(api.calculateSum(), 0);
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
});
