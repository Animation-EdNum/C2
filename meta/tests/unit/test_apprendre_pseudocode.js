/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupApprendrePseudocodeDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/apprendre_pseudocode.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const calls = { success: [], mistake: [] };
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/apprendre_pseudocode.html',
        beforeParse(window) {
            window.playSound = () => {};
            window.launchConfetti = () => {};
            window.showToast = () => {};
            window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
            window.HTMLElement.prototype.scrollIntoView = () => {};
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
        dom.window.addEventListener('load', () => setTimeout(() => resolve({ window: dom.window, calls }), 20));
        setTimeout(() => resolve({ window: dom.window, calls }), 150);
    });
}

test('apprendre_pseudocode.html - Pseudocode Execution & Hardware Scenarios', async (t) => {
    let window;
    let calls;

    t.beforeEach(async () => {
        ({ window, calls } = await setupApprendrePseudocodeDOM());
    });

    t.afterEach(() => {
        if (window) {
            if (typeof window.__onResetApp === 'function') window.__onResetApp();
            window.close();
        }
    });

    await t.test('1. Core DOM controls and difficulty bar are visible and initialized', () => {
        const doc = window.document;
        assert.ok(doc.getElementById('tab-pseudo_var'), '#tab-pseudo_var must exist');
        assert.ok(doc.getElementById('tab-pseudo_cond'), '#tab-pseudo_cond must exist');
        assert.ok(doc.getElementById('tab-pseudo_loop'), '#tab-pseudo_loop must exist');
        assert.ok(doc.getElementById('tab-pseudo_while'), '#tab-pseudo_while must exist');
        assert.ok(doc.getElementById('tab-pseudo_bug'), '#tab-pseudo_bug must exist');
        assert.ok(doc.getElementById('diff-easy'), '#diff-easy must exist');
        assert.ok(doc.getElementById('diff-medium'), '#diff-medium must exist');
        assert.ok(doc.getElementById('diff-hard'), '#diff-hard must exist');
        assert.notStrictEqual(doc.querySelector('.difficulty-bar').style.display, 'none', 'Difficulty bar must be visible');
    });

    await t.test('2. Step-by-step execution updates variables and does not double-score on Replay', () => {
        const doc = window.document;
        // Easy variable level: select choices so target is met or just step through to finishExecution
        const selects = doc.querySelectorAll('#editor-lines select');
        if (selects.length >= 2) {
            selects[0].value = selects[0].options[0].value;
            selects[0].dispatchEvent(new window.Event('change'));
        }
        const btnStep = doc.getElementById('btn-step');
        for (let i = 0; i < 15; i++) {
            btnStep.click();
            if (doc.getElementById('btn-play').textContent.includes('Rejouer')) break;
        }
        assert.ok(doc.getElementById('vars-container').textContent.length > 0, 'Variable inspector must populate');
        assert.ok(calls.success.length + calls.mistake.length >= 1, 'Finishing execution records attempt once');
        const beforePlayAgain = calls.success.length + calls.mistake.length;
        doc.getElementById('btn-play').click(); // Should reset + start without immediate double-score
        assert.strictEqual(calls.success.length + calls.mistake.length, beforePlayAgain, 'Clicking Rejouer resets rather than double-scoring');
    });

    await t.test('3. Hard swap (TEMP <- A), Hard Sinon-Si and Hard While levels render cleanly', () => {
        const doc = window.document;
        doc.getElementById('diff-hard').click();
        const codeText = doc.getElementById('editor-lines').textContent;
        assert.ok(codeText.includes('TEMP') || codeText.includes('Échange') || codeText.includes('RÉSOLUTION'), 'Hard variables level should render');

        doc.getElementById('tab-pseudo_cond').click();
        doc.getElementById('diff-hard').click();
        assert.ok(doc.getElementById('editor-lines').textContent.includes('Sinon Si'), 'Hard condition level should include Sinon Si');

        doc.getElementById('tab-pseudo_while').click();
        doc.getElementById('diff-hard').click();
        assert.ok(doc.getElementById('editor-lines').textContent.includes('Tant que'), 'Hard while level should render Tant que');
    });

    await t.test('4. Hardware ticket machine & reset lifecycle work cleanly', () => {
        const doc = window.document;
        doc.getElementById('tab-pseudo_bug').click();
        doc.getElementById('diff-easy').click();
        assert.ok(doc.getElementById('btn-adulte'), 'Ticket machine adulte button must exist');
        assert.ok(doc.getElementById('btn-coin'), 'Ticket machine coin button must exist');

        window.__onResetApp();
        assert.strictEqual(doc.getElementById('global-correct').textContent, '0');
        assert.strictEqual(doc.getElementById('global-streak').textContent, '0');
    });
});
