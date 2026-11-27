/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const htmlPath = path.resolve(__dirname, '../../../webapps/binaire_message.html');
const htmlSrc = fs.readFileSync(htmlPath, 'utf8');

function setupEnv() {
    const scoreCalls = { success: [], mistake: [] };
    const toasts = [];
    const dom = new JSDOM(htmlSrc, {
        runScripts: 'dangerously',
        url: 'http://localhost/webapps/binaire_message.html',
        beforeParse(window) {
            window.ScoreManager = {
                init: () => {},
                addSuccess: (mode, diff, mistakes) => scoreCalls.success.push({ mode, diff, mistakes }),
                addMistake: (mode, diff) => scoreCalls.mistake.push({ mode, diff }),
                clearCurrentAppStats: () => {}
            };
            window.playSound = () => {};
            window.handleStreakCelebration = () => {};
            window.showToast = (msg, type) => toasts.push({ msg, type });
        }
    });
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    return { win: dom.window, scoreCalls, toasts };
}

test('binaire_message.html - binary encoding, validated decoding, double-submit lock & mistakes', async (t) => {
    let env;

    t.afterEach(() => {
        if (env && env.win) {
            env.win.__onResetApp?.();
            env.win.close();
        }
    });

    await t.test('encodes text to 5-bit binary including space delimiter', () => {
        env = setupEnv();
        const { document } = env.win;
        const encInput = document.getElementById('creator-input');
        const binOutput = document.getElementById('creator-output');
        assert.ok(encInput && binOutput, 'Creator inputs must exist');

        encInput.value = 'AB C';
        env.win.translateToBinary();
        assert.ok(binOutput.value.includes('00001'), 'A encodes to 00001');
        assert.ok(binOutput.value.includes('00010'), 'B encodes to 00010');
        assert.ok(binOutput.value.includes('.....'), 'Space encodes to .....');
        assert.ok(binOutput.value.includes('00011'), 'C encodes to 00011');
    });

    await t.test('rejects out-of-range 5-bit chunks like 00000 and 11011 in decoder and accepts spaces', () => {
        env = setupEnv();
        const { win, toasts } = env;
        const { document } = win;

        document.getElementById('tab-create').click();
        const decInput = document.getElementById('decoder-input');
        const btnStart = document.getElementById('btn-start-decode');
        const workspace = document.getElementById('decoder-workspace');

        decInput.value = '00000';
        win.prepareDecode();
        btnStart.click();
        assert.strictEqual(workspace.style.display, 'none', '00000 (rank 0) must not start decoder workspace');

        decInput.value = '11011'; // rank 27 > 26
        win.prepareDecode();
        btnStart.click();
        assert.strictEqual(workspace.style.display, 'none', '11011 (rank 27) must not start decoder workspace');
        assert.ok(toasts.some(x => x.type === 'warning' || x.type === 'error') || workspace.style.display === 'none');

        decInput.value = '00001 ..... 00010';
        win.prepareDecode();
        btnStart.click();
        assert.strictEqual(workspace.style.display, 'block', 'Valid chunks + space delimiter must open workspace');
    });

    await t.test('tracks encode mistakes and passes count to ScoreManager.addSuccess', () => {
        env = setupEnv();
        const { win, scoreCalls } = env;
        const { document } = win;

        const targetText = document.querySelector('#encode-info strong').textContent.trim().toUpperCase();
        const rank = targetText.charCodeAt(0) - 64;
        assert.ok(rank >= 1 && rank <= 26, `Expected A-Z target letter, got ${targetText}`);

        // Initial bits are 0 -> check causes mistake and triggers validation cooldown
        const checkBtn = document.getElementById('encode-check');
        checkBtn.click();
        assert.strictEqual(scoreCalls.mistake.length, 1, 'Wrong binary value records a mistake');
        assert.strictEqual(checkBtn.disabled, true, 'Validation cooldown disables #encode-check briefly after wrong answer');
        win.resetValidationCooldown('encode-check');

        // Set exact 5 bits for target letter
        const bits = rank.toString(2).padStart(5, '0');
        for (let i = 0; i < 5; i++) {
            const btn = document.getElementById(`encode-bit-${i}`);
            const isSet = btn.classList.contains('active') || btn.textContent.trim() === '1';
            if ((bits[i] === '1') !== isSet) {
                btn.click();
            }
        }
        checkBtn.click();

        assert.strictEqual(scoreCalls.success.length, 1, 'Correct binary value calls addSuccess');
        assert.strictEqual(scoreCalls.success[0].mistakes, 1, 'Encode mistakes count (1) must be forwarded to addSuccess');
    });
});
