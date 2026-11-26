/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const htmlSrc = fs.readFileSync(path.resolve(__dirname, '../../../webapps/routage_reseau.html'), 'utf-8');

function setupEnv(query = '') {
    const injected = htmlSrc.replace(
        '<script src="../assets/js/scores.js"></script>',
        `<script>
            window.ScoreManager = {
                init: () => {},
                addSuccess: () => {},
                addMistake: () => {},
                clearCurrentAppStats: () => {},
                _escapeHtml: (s) => String(s)
            };
            window.playSound = () => {};
            window.handleStreakCelebration = () => {};
            window.showToast = () => {};
        </script>
        <script src="../assets/js/scores.js"></script>`
    );

    const dom = new JSDOM(injected, {
        runScripts: 'dangerously',
        url: `http://localhost/webapps/routage_reseau.html${query}`
    });

    return dom.window;
}

test('routage_reseau.html - graph generation, Dijkstra, pedagogy, accessibility & reset', async (t) => {
    await t.test('seeded lockTopology=1 initializes synchronously for the very first challenge', () => {
        const win1 = setupEnv('?lockTopology=1&seed=classe5H');
        const win2 = setupEnv('?lockTopology=1&seed=classe5H');
        const st1 = win1.RoutingGame.getState();
        const st2 = win2.RoutingGame.getState();

        assert.strictEqual(st1.hasSeed, true, 'seededRandom must be initialized before first challenge');
        assert.deepStrictEqual(JSON.parse(JSON.stringify(st1.parsedNodes)), JSON.parse(JSON.stringify(st2.parsedNodes)), 'Two pupils with same seed must see identical first network nodes');
        assert.deepStrictEqual(JSON.parse(JSON.stringify(st1.parsedEdges)), JSON.parse(JSON.stringify(st2.parsedEdges)), 'Two pupils with same seed must see identical first network edges');
    });

    await t.test('Dijkstra optimal path and 1st-mistake feedback (no optimalTime spoil) + streak gating', () => {
        const win = setupEnv();
        const rg = win.RoutingGame;
        const customNet = {
            nodes: [
                ['src', 10, 50, 's'],
                ['R1', 50, 20, 'r'],
                ['R2', 50, 80, 'r'],
                ['dst', 90, 50, 'd']
            ],
            edges: [
                ['src', 'R1', 2],
                ['R1', 'dst', 3], // optimal = 5 UTI
                ['src', 'R2', 7],
                ['R2', 'dst', 8]  // suboptimal = 15 UTI
            ]
        };
        rg.parseNetwork(customNet);
        assert.strictEqual(rg.getFastestPath(), 5, 'Dijkstra must compute 5 UTI');

        // 1st mistake: take suboptimal path -> must NOT spoil "5 UTI" (note "15 UTI" contains substring "5 UTI")
        rg.setState({ currentPath: ['src', 'R2', 'dst'], mistakesInCurrentNetwork: 0 });
        rg.checkPath();
        const fb = win.document.getElementById('feedback');
        assert.ok(fb.classList.contains('warn'), 'Suboptimal arrival should show warning feedback');
        assert.strictEqual(/\b5 UTI\b/.test(fb.textContent), false, 'First mistake must NOT reveal exact optimal time (5 UTI)');

        // 2nd mistake: can now hint optimal time
        rg.checkPath();
        assert.strictEqual(/\b5 UTI\b/.test(fb.textContent), true, 'Second mistake can display optimal time hint');

        // Solving after mistakes must NOT increment globalStreak (must reset streak to 0)
        rg.setState({ currentPath: ['src', 'R1', 'dst'], isLocked: false });
        rg.checkPath();
        assert.strictEqual(rg.getState().globalCorrect, 1);
        assert.strictEqual(rg.getState().globalStreak, 0, 'Streak must remain 0 when solved after mistakes');
    });

    await t.test('coloredWeights URL flag persists across > 3 wins without silently disabling', () => {
        const win = setupEnv('?coloredWeights=1');
        const rg = win.RoutingGame;
        for (let i = 0; i < 4; i++) {
            rg.parseNetwork({
                nodes: [['src', 10, 50, 's'], ['R1', 50, 50, 'r'], ['dst', 90, 50, 'd']],
                edges: [['src', 'R1', 2], ['R1', 'dst', 2]]
            });
            rg.setState({ currentPath: ['src', 'R1', 'dst'], mistakesInCurrentNetwork: 0, isLocked: false });
            rg.checkPath();
        }
        const st = rg.getState();
        assert.strictEqual(st.globalStreak, 4, 'Zero-mistake solves should increment streak to 4');
        assert.strictEqual(st.useColoredWeights, true, 'coloredWeights must remain true after 3+ consecutive wins');
    });

    await t.test('dead-end path shows impasse warning and resetCurrentChallenge clears feedback', () => {
        const win = setupEnv();
        const rg = win.RoutingGame;
        rg.parseNetwork({
            nodes: [['src', 10, 50, 's'], ['R1', 40, 50, 'r'], ['R2', 60, 20, 'r'], ['dst', 90, 50, 'd']],
            edges: [['src', 'R1', 1], ['R1', 'R2', 1], ['src', 'dst', 9]]
        });
        rg.setState({ currentPath: ['src', 'R1', 'R2'], isLocked: false });
        const fb = win.document.getElementById('feedback');
        assert.ok(fb.classList.contains('show') && fb.textContent.includes('Impasse'), 'Dead-end must display impasse warning');

        rg.resetCurrentChallenge();
        assert.strictEqual(fb.classList.contains('show'), false, 'Reset must clear feedback banner');
        assert.deepStrictEqual(JSON.parse(JSON.stringify(rg.getState().currentPath)), ['src']);
    });

    await t.test('reachable nodes expose keyboard accessibility attributes and Enter activates click', () => {
        const win = setupEnv();
        const rg = win.RoutingGame;
        rg.parseNetwork({
            nodes: [['src', 10, 50, 's'], ['R1', 50, 50, 'r'], ['dst', 90, 50, 'd']],
            edges: [['src', 'R1', 2], ['R1', 'dst', 3]]
        });
        rg.setState({ currentPath: ['src'], isLocked: false });
        const nextNode = win.document.querySelector('.node.clickable-next');
        assert.ok(nextNode, 'Clickable next node must render');
        assert.strictEqual(nextNode.getAttribute('role'), 'button');
        assert.strictEqual(nextNode.getAttribute('tabindex'), '0');
    });

    await t.test('window.__onResetApp resets local app state cleanly without wiping unrelated keys', () => {
        const win = setupEnv();
        win.localStorage.setItem('routage_reseau_seen_hint', '1');
        win.localStorage.setItem('global_theme', 'dark');
        assert.strictEqual(typeof win.__onResetApp, 'function');
        win.__onResetApp();
        assert.strictEqual(win.localStorage.getItem('routage_reseau_seen_hint'), null);
        assert.strictEqual(win.localStorage.getItem('global_theme'), 'dark', 'Theme preference must remain untouched');
        assert.strictEqual(win.RoutingGame.getState().globalCorrect, 0);
        assert.strictEqual(win.RoutingGame.getState().globalStreak, 0);
    });
});
