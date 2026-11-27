/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupRenduMonnaieDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/rendu_monnaie.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/rendu_monnaie.html',
        beforeParse(window) {
            window.playSound = () => {};
            window.launchConfetti = () => {};
            window.showToast = () => {};
            window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
        }
    });
    return dom.window;
}

test('rendu_monnaie.html - Greedy vs Optimal Algorithm & Cash Register UI', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupRenduMonnaieDOM();
    });

    t.afterEach(() => {
        if (window) {
            if (typeof window.__onResetApp === 'function') window.__onResetApp();
            window.close();
        }
    });

    await t.test('1. Core DOM controls and tabs exist', () => {
        const doc = window.document;
        assert.ok(doc.getElementById('tab-btn-chf'), '#tab-btn-chf must exist');
        assert.ok(doc.getElementById('tab-btn-fantasy'), '#tab-btn-fantasy must exist');
        assert.ok(doc.getElementById('tab-btn-theory'), '#tab-btn-theory must exist');
        assert.ok(doc.getElementById('drawer-container'), '#drawer-container must exist');
        assert.ok(doc.getElementById('btn-validate'), '#btn-validate must exist');
        assert.ok(doc.getElementById('btn-auto-solve'), '#btn-auto-solve must exist');
        assert.ok(doc.querySelectorAll('#drawer-container button').length >= 7, 'Swiss coin drawer should render coins');
    });

    await t.test('2. Optimal coin selection completes CHF transaction using minimal coins', () => {
        const doc = window.document;
        const targetText = doc.getElementById('disp-target-amount').textContent;
        const match = targetText.match(/([\d.]+)/);
        assert.ok(match, 'Target amount should display numeric value');
        let remainingCents = Math.round(parseFloat(match[1]) * 100);
        const coins = [500, 200, 100, 50, 20, 10, 5];

        const btnByValue = new Map();
        doc.querySelectorAll('#drawer-container .coin-btn').forEach(btn => {
            const val = parseInt(btn.dataset.value, 10);
            if (!Number.isNaN(val)) btnByValue.set(val, btn);
        });

        for (const c of coins) {
            while (remainingCents >= c && btnByValue.has(c)) {
                btnByValue.get(c).click();
                remainingCents -= c;
            }
        }
        assert.strictEqual(remainingCents, 0, 'Greedy Swiss coins must reach exact cents');

        doc.getElementById('btn-validate').click();
        assert.strictEqual(doc.getElementById('stat-optimal').textContent, '1', 'Exact greedy CHF change must count as optimal');
        assert.strictEqual(doc.getElementById('stat-streak').textContent, '1', 'Optimal validation must advance streak');
    });

    await t.test('3. Fantasy system [4, 3, 1] exposes non-greedy optimal (3 + 3 = 6)', () => {
        const doc = window.document;
        doc.getElementById('tab-btn-fantasy').click();
        assert.ok(!doc.getElementById('view-fantasy').hidden, '#view-fantasy should be visible');
        assert.ok(doc.getElementById('fantasy-btn-3'), 'Coin 3 button must exist');
        assert.ok(doc.getElementById('fantasy-btn-4'), 'Coin 4 button must exist');
        assert.ok(doc.getElementById('fantasy-btn-1'), 'Coin 1 button must exist');

        doc.getElementById('fantasy-btn-3').click();
        doc.getElementById('fantasy-btn-3').click();
        assert.strictEqual(doc.getElementById('disp-fantasy-user-total').textContent.trim(), '6');
        assert.strictEqual(doc.getElementById('disp-fantasy-user-count').textContent.trim(), '2');

        doc.getElementById('btn-fantasy-check').click();
        const verdictText = doc.getElementById('fantasy-verdict').textContent.toLowerCase();
        assert.ok(verdictText.includes('optimal') || verdictText.includes('bravo') || verdictText.includes('2'),
            `Verdict should confirm optimal solution (got "${verdictText}")`);
    });

    await t.test('4. App reset via window.__onResetApp clears tray and stats', () => {
        const doc = window.document;
        const btn = doc.querySelector('#drawer-container .coin-btn');
        btn.click();
        assert.ok(parseInt(doc.getElementById('disp-tray-count').textContent, 10) >= 1);

        window.__onResetApp();
        assert.strictEqual(doc.getElementById('disp-tray-count').textContent.trim(), '0');
        assert.strictEqual(doc.getElementById('stat-optimal').textContent.trim(), '0');
        assert.strictEqual(doc.getElementById('stat-streak').textContent.trim(), '0');
    });
});
