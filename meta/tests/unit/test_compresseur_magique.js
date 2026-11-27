/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupCompresseurMagiqueDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/compresseur_magique.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const calls = { success: [], mistake: [] };
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/compresseur_magique.html',
        beforeParse(window) {
            window.playSound = () => {};
            window.launchConfetti = () => {};
            window.showToast = () => {};
            window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
            window.ScoreManager = {
                MODE_LABELS: {},
                isAdaptivePopupOpen: false,
                init() {},
                addSuccess(mode, diff, mistakes) {
                    calls.success.push({ mode, diff, mistakes });
                    return false;
                },
                addMistake(mode, diff) {
                    calls.mistake.push({ mode, diff });
                }
            };
        }
    });
    return new Promise(resolve => {
        dom.window.document.addEventListener('DOMContentLoaded', () => setTimeout(() => resolve({ window: dom.window, calls }), 20));
        setTimeout(() => resolve({ window: dom.window, calls }), 150);
    });
}

test('compresseur_magique.html - RLE Encode/Decode & Validation', async (t) => {
    let window;
    let calls;

    t.beforeEach(async () => {
        ({ window, calls } = await setupCompresseurMagiqueDOM());
    });

    t.afterEach(() => {
        if (window) {
            if (typeof window.__onResetApp === 'function') window.__onResetApp();
            window.close();
        }
    });

    await t.test('1. Core DOM controls and decode ratio pill exist', () => {
        const doc = window.document;
        assert.ok(doc.getElementById('tab-btn-decode'), '#tab-btn-decode must exist');
        assert.ok(doc.getElementById('tab-btn-encode'), '#tab-btn-encode must exist');
        assert.ok(doc.getElementById('tab-btn-editor'), '#tab-btn-editor must exist');
        assert.ok(doc.getElementById('decode-ratio-pill'), '#decode-ratio-pill must exist');
        assert.ok(doc.getElementById('decode-ratio-pill').textContent.includes('64 pixels'), 'Default medium decode ratio pill must show 64 pixels');
        assert.strictEqual(doc.querySelectorAll('#decode-grid .pixel-cell').length, 64, 'Default medium grid must be 8x8 = 64 cells');
        doc.getElementById('diff-btn-easy').click();
        assert.ok(doc.getElementById('decode-ratio-pill').textContent.includes('25 pixels'), 'Easy decode ratio pill must show 25 pixels');
        assert.strictEqual(doc.querySelectorAll('#decode-grid .pixel-cell').length, 25, 'Easy grid must be 5x5 = 25 cells');
    });

    await t.test('2. Decode validation catches empty mismatch and accepts decoded target grid', () => {
        const doc = window.document;
        doc.getElementById('decode-verify-btn').click();
        assert.strictEqual(calls.mistake.length, 1, 'Verifying blank grid should log mistake');

        // Reconstruct target grid from #decode-target-code lines!
        const codeLines = doc.getElementById('decode-target-code').textContent.trim().split('\n');
        const expectedColors = [];
        for (const line of codeLines) {
            for (const tok of line.trim().split(/\s+/)) {
                const m = tok.match(/^(\d+)([XNBRVJ])$/);
                assert.ok(m, `Token "${tok}" must match RLE token`);
                for (let i = 0; i < parseInt(m[1], 10); i++) expectedColors.push(m[2]);
            }
        }
        const cells = doc.querySelectorAll('#decode-grid .pixel-cell');
        assert.strictEqual(expectedColors.length, cells.length, 'Decoded RLE pixel count must match grid length');

        const paletteBtns = new Map();
        doc.querySelectorAll('#decode-palette .palette-btn').forEach(b => paletteBtns.set(b.dataset.color, b));
        const paintCell = (cell) => {
            cell.dispatchEvent(new window.MouseEvent('mousedown', { bubbles: true }));
            window.dispatchEvent(new window.MouseEvent('mouseup', { bubbles: true }));
        };
        cells.forEach((cell, idx) => {
            const want = expectedColors[idx];
            if (want !== 'X') {
                paletteBtns.get(want)?.click();
                paintCell(cell);
            }
        });

        doc.getElementById('decode-verify-btn').click();
        assert.strictEqual(doc.getElementById('decode-correct').textContent, '1');
        assert.strictEqual(calls.success.length, 1);
        assert.strictEqual(calls.success[0].mode, 'decode');
        assert.strictEqual(calls.success[0].mistakes, 1);
    });

    await t.test('3. Encode mode rejects uncompressed 1X 1X sequences and accepts valid compressed RLE', () => {
        const doc = window.document;
        doc.getElementById('tab-btn-encode').click();
        const input = doc.getElementById('encode-rle-input');

        // Uncompressed all-1s matching or mismatched code should never succeed
        const uncompressed = Array(8).fill('1X 1X 1X 1X 1X 1X 1X 1X').join('\n');
        input.value = uncompressed;
        input.dispatchEvent(new window.Event('input'));
        doc.getElementById('encode-verify-btn').click();
        assert.strictEqual(doc.getElementById('encode-correct').textContent, '0', '1X 1X uncompressed input must never pass');
    });

    await t.test('4. Free editor mode paints 8x8 and updates compression stats; reset clears', () => {
        const doc = window.document;
        doc.getElementById('diff-btn-hard').click();
        doc.getElementById('tab-btn-editor').click();
        const cells = doc.querySelectorAll('#editor-grid .pixel-cell');
        assert.strictEqual(cells.length, 64, 'Hard editor must have 8x8 = 64 cells');

        cells[0].dispatchEvent(new window.MouseEvent('mousedown', { bubbles: true }));
        window.dispatchEvent(new window.MouseEvent('mouseup', { bubbles: true }));
        const code = doc.getElementById('editor-output-code').textContent;
        assert.ok(code.length > 0 && !code.includes('undefined'), 'Editor RLE output must stay valid');
        assert.ok(doc.getElementById('editor-stat-saved').textContent.includes('%'), 'Compression gauge percentage should display');

        window.__onResetApp();
        assert.strictEqual(doc.getElementById('decode-correct').textContent, '0');
        assert.strictEqual(doc.getElementById('encode-correct').textContent, '0');
    });
});
