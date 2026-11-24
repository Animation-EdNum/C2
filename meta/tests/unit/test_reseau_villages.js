/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const HTML_PATH = path.resolve(__dirname, '../../..', 'alpha/webapps/reseau_villages.html');

test('reseau_villages.html - Structure & Design System Verification', async (t) => {
    assert.ok(fs.existsSync(HTML_PATH), 'reseau_villages.html must exist');
    const content = fs.readFileSync(HTML_PATH, 'utf8');

    await t.test('License and Title', () => {
        assert.ok(content.includes('SPDX-License-Identifier: AGPL-3.0') || content.includes('GNU Affero General Public License'), 'Must include AGPL-3.0 header');
        assert.ok(content.includes('Le Réseau des Villages'), 'Must contain app title');
        assert.ok(content.includes('badge-level'), 'Must contain badge-level');
        assert.ok(content.includes('badge-alpha'), 'Must contain badge-alpha');
    });

    await t.test('Stylesheets order in <head>', () => {
        const tokensIdx = content.indexOf('tokens.css');
        const baseIdx = content.indexOf('base.css');
        const componentsIdx = content.indexOf('components.css');
        const utilitiesIdx = content.indexOf('utilities.css');

        assert.ok(tokensIdx > 0, 'tokens.css present');
        assert.ok(baseIdx > tokensIdx, 'base.css loaded after tokens.css');
        assert.ok(componentsIdx > baseIdx, 'components.css loaded after base.css');
        assert.ok(utilitiesIdx > componentsIdx, 'utilities.css loaded after components.css');
    });

    await t.test('Scripts in <head> and <body>', () => {
        assert.ok(content.includes('i18n.js'), 'i18n.js in head');
        assert.ok(content.includes('i18n/de.js'), 'i18n/de.js in head');
        assert.ok(content.includes('audio.js'), 'audio.js in head');
        assert.ok(content.includes('fa-subset.js'), 'fa-subset.js in head');
        assert.ok(content.includes('toast.js'), 'toast.js at bottom');
        assert.ok(content.includes('theme.js'), 'theme.js at bottom');
        assert.ok(content.includes('confetti.js'), 'confetti.js at bottom');
    });

    await t.test('App Header and Options dropdown structure', () => {
        assert.ok(content.includes('data-fa="arrow-left"'), 'Must have back arrow');
        assert.ok(content.includes('data-fa="network-wired"'), 'Must have network-wired icon');
        assert.ok(content.includes('id="theme-toggle-btn"'), 'Must have theme toggle');
        assert.ok(content.includes('id="audio-toggle-btn"'), 'Must have audio toggle');
        assert.ok(content.includes('id="reset-cache-btn"'), 'Must have reset button');
        assert.ok(content.includes('id="confetti-canvas"'), 'Must have confetti canvas');
    });
});

test('reseau_villages.html - Algorithmic and Interactive Engine (JSDOM)', async (t) => {
    const htmlContent = fs.readFileSync(HTML_PATH, 'utf8');

    // Create a mock DOM environment
    const dom = new JSDOM(htmlContent, {
        runScripts: 'dangerously',
        resources: 'usable',
        url: 'http://localhost/alpha/webapps/reseau_villages.html'
    });

    const { window } = dom;
    const { document } = window;

    // Wait for DOM to initialize
    await new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('DOMContentLoaded', resolve);
        }
    });

    function clickElement(el) {
        if (typeof el.click === 'function') {
            el.click();
        } else {
            el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
        }
    }

    await t.test('Initial level renders 4 villages and candidate edges', () => {
        const svg = document.getElementById('network-svg');
        assert.ok(svg, 'SVG canvas must exist');

        const villages = svg.querySelectorAll('.village-group');
        assert.strictEqual(villages.length, 4, 'Challenge 1 must have 4 villages');

        const edges = svg.querySelectorAll('.edge-group');
        assert.strictEqual(edges.length, 5, 'Challenge 1 must have 5 candidate edges');

        const costEl = document.getElementById('stat-current-cost');
        assert.strictEqual(costEl.textContent, '0', 'Initial cost should be 0');
    });

    await t.test('Selecting non-cyclic edges connects villages and increments cost', () => {
        const svg = document.getElementById('network-svg');
        const edge1 = svg.querySelector('#edge-e1'); // sion - nendaz, cost 8
        assert.ok(edge1, 'Edge e1 must exist');

        clickElement(edge1);
        assert.ok(edge1.classList.contains('selected'), 'Edge e1 should be selected');

        const costEl = document.getElementById('stat-current-cost');
        assert.strictEqual(costEl.textContent, '8', 'Cost should be 8 km');

        const cablesCount = document.getElementById('stat-cables-count');
        assert.strictEqual(cablesCount.textContent, '1', '1 cable connected');
    });

    await t.test('Cycle detection blocks redundant edge when block-cycles is enabled', () => {
        const svg = document.getElementById('network-svg');
        // Current: e1 (sion-nendaz, cost 8) selected.
        // Connect e3 (nendaz-evolene, cost 11).
        const edge3 = svg.querySelector('#edge-e3');
        assert.ok(edge3, 'Edge e3 exists');
        clickElement(edge3);

        // Now Sion, Nendaz, Evolène are connected.
        // Attempting e2 (sion-evolene, cost 14) would create a cycle (Sion-Nendaz-Evolène).
        const edge2 = svg.querySelector('#edge-e2');
        assert.ok(edge2, 'Edge e2 exists');
        clickElement(edge2);

        // Edge 2 must NOT be selected because it forms a cycle and chk-block-cycles is on!
        assert.strictEqual(edge2.classList.contains('selected'), false, 'Edge e2 should be blocked as cycle');

        const banner = document.getElementById('live-banner');
        assert.ok(banner.textContent.includes('boucle inutile'), 'Banner must warn about redundant loop');
    });

    await t.test('Undo button removes last placed edge', () => {
        const undoBtn = document.getElementById('btn-undo-edge');
        assert.strictEqual(undoBtn.disabled, false, 'Undo button should be enabled');

        clickElement(undoBtn);
        const costEl = document.getElementById('stat-current-cost');
        assert.strictEqual(costEl.textContent, '8', 'Cost should decrease back to 8 km');
    });

    await t.test('Kruskal step-by-step panel toggles and advances', () => {
        const kruskalToggleBtn = document.getElementById('btn-toggle-kruskal-mode');
        const kruskalPanel = document.getElementById('kruskal-panel');

        kruskalToggleBtn.click();
        assert.strictEqual(kruskalPanel.style.display, 'flex', 'Kruskal panel should open');

        const nextStepBtn = document.getElementById('btn-kruskal-next');
        nextStepBtn.click(); // Step 1: e1 (8 km, accept)

        const stepStatus = document.getElementById('kruskal-step-status');
        assert.ok(stepStatus.textContent.includes('Étape 1'), 'Should be at step 1');

        nextStepBtn.click(); // Step 2: e4 (9 km, accept)
        nextStepBtn.click(); // Step 3: e3 (11 km, accept)
        nextStepBtn.click(); // Step 4: e2 (14 km, reject - cycle)

        const kruskalTable = document.getElementById('kruskal-table-body');
        assert.ok(kruskalTable.textContent.includes('Rejeté'), 'Table should show rejected cycle edge');
    });

    await t.test('window.__onResetApp resets graph state cleanly', () => {
        assert.strictEqual(typeof window.__onResetApp, 'function', '__onResetApp hook must be defined');
        window.__onResetApp();

        const costEl = document.getElementById('stat-current-cost');
        assert.strictEqual(costEl.textContent, '0', 'Cost reset to 0');

        const cablesCount = document.getElementById('stat-cables-count');
        assert.strictEqual(cablesCount.textContent, '0', 'Cables count reset to 0');
    });
});
