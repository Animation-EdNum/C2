/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupDresseurNeuronesDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/dresseur_neurones.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const calls = { success: [], mistake: [] };
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/dresseur_neurones.html',
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
        dom.window.addEventListener('load', () => setTimeout(() => resolve({ window: dom.window, calls }), 20));
        setTimeout(() => resolve({ window: dom.window, calls }), 150);
    });
}

test('dresseur_neurones.html - Neural Training & Bias Detection', async (t) => {
    let window;

    t.beforeEach(async () => {
        ({ window } = await setupDresseurNeuronesDOM());
    });

    t.afterEach(() => {
        if (window) {
            if (typeof window.__onResetApp === 'function') window.__onResetApp();
            window.close();
        }
    });

    await t.test('1. Initial DOM requires training before opening factory', () => {
        const doc = window.document;
        assert.ok(doc.getElementById('tab-training'), '#tab-training must exist');
        assert.ok(doc.getElementById('tab-factory'), '#tab-factory must exist');
        assert.ok(doc.getElementById('robot-interactive-svg').querySelector('svg'), 'Interactive robot SVG should render');
        assert.strictEqual(doc.getElementById('tab-factory').disabled, true, 'Factory tab starts locked until 2+2 fruits');
        assert.strictEqual(doc.getElementById('btn-start-sorting').disabled, true);
    });

    await t.test('2. Feeding 2 apples and 2 pears unlocks factory and creates accessible remove buttons', async () => {
        const doc = window.document;
        const selectAndFeed = async (shapeId, colorId, feedBtnId) => {
            doc.getElementById(shapeId).click();
            doc.getElementById(colorId).click();
            doc.getElementById('btn-create-custom').click();
            doc.getElementById(feedBtnId).click();
            await new Promise(r => setTimeout(r, 90));
        };

        // Feed biased dataset: 2 red apples + 2 green pears
        await selectAndFeed('sel-shape-round', 'sel-color-red', 'feed-to-pomme');
        await selectAndFeed('sel-shape-round', 'sel-color-red', 'feed-to-pomme');
        await selectAndFeed('sel-shape-long', 'sel-color-green', 'feed-to-poire');
        await selectAndFeed('sel-shape-long', 'sel-color-green', 'feed-to-poire');

        assert.strictEqual(doc.getElementById('count-pomme').textContent.trim(), '2 / 10');
        assert.strictEqual(doc.getElementById('count-poire').textContent.trim(), '2 / 10');
        assert.strictEqual(doc.getElementById('btn-start-sorting').disabled, false, 'Start sorting unlocks at 2+2');
        assert.strictEqual(doc.getElementById('tab-factory').disabled, false, 'Factory tab unlocks at 2+2');

        const basketButtons = doc.querySelectorAll('#basket-pomme-items button.tiny-fruit');
        assert.strictEqual(basketButtons.length, 2, 'Trained basket fruits should be accessible buttons');
        basketButtons[0].click();
        assert.strictEqual(doc.getElementById('count-pomme').textContent.trim(), '1 / 10', 'Clicking basket fruit removes it');
        assert.strictEqual(doc.getElementById('tab-factory').disabled, true, 'Removing below 2 re-locks factory');
    });

    await t.test('3. Switching to Factory mode and resetting with __onResetApp restores clean state', async () => {
        const doc = window.document;
        const selectAndFeed = async (shapeId, colorId, feedBtnId) => {
            doc.getElementById(shapeId).click();
            doc.getElementById(colorId).click();
            doc.getElementById('btn-create-custom').click();
            doc.getElementById(feedBtnId).click();
            await new Promise(r => setTimeout(r, 90));
        };

        await selectAndFeed('sel-shape-round', 'sel-color-red', 'feed-to-pomme');
        await selectAndFeed('sel-shape-round', 'sel-color-green', 'feed-to-pomme');
        await selectAndFeed('sel-shape-long', 'sel-color-green', 'feed-to-poire');
        await selectAndFeed('sel-shape-long', 'sel-color-red', 'feed-to-poire');

        doc.getElementById('tab-factory').click();
        assert.ok(doc.getElementById('panel-factory').classList.contains('active'));

        window.__onResetApp();
        assert.strictEqual(doc.getElementById('count-pomme').textContent.trim(), '0 / 10');
        assert.strictEqual(doc.getElementById('count-poire').textContent.trim(), '0 / 10');
        assert.strictEqual(doc.getElementById('tab-factory').disabled, true);
        assert.ok(doc.getElementById('panel-training').classList.contains('active'));
    });
});
