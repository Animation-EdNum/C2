const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const scoresSrc = fs.readFileSync('assets/js/scores.js', 'utf-8');

function setupDOM(initialHtml = '', initialLocalStorage = {}) {
    const defaultHtml = `<!DOCTYPE html>
    <html>
    <body>
        ${initialHtml}
    </body>
    </html>`;

    const dom = new JSDOM(defaultHtml, { runScripts: "dangerously", url: "http://localhost/" });
    const window = dom.window;

    for (const key in initialLocalStorage) {
        window.localStorage.setItem(key, initialLocalStorage[key]);
    }

    window.confirm = () => true;
    window.eval(scoresSrc + '\nwindow.ScoreManager = ScoreManager;');
    return window;
}

test('ScoreManager - Utility methods', async (t) => {
    await t.test('_diffKey returns difficulty string or _nodiff_', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;

        assert.strictEqual(sm._diffKey('easy'), 'easy');
        assert.strictEqual(sm._diffKey(4), '4');
        assert.strictEqual(sm._diffKey(null), sm._NO_DIFF);
        assert.strictEqual(sm._diffKey(undefined), sm._NO_DIFF);
    });

    await t.test('_escapeHtml escapes properly', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;

        assert.strictEqual(sm._escapeHtml(null), '');
        assert.strictEqual(sm._escapeHtml(undefined), '');
        assert.strictEqual(sm._escapeHtml('<script>'), '&lt;script&gt;');
        assert.strictEqual(sm._escapeHtml('&'), '&amp;');
        assert.strictEqual(sm._escapeHtml('"'), '&quot;');
        assert.strictEqual(sm._escapeHtml("'"), '&#039;');
    });
});

test('ScoreManager - State management', async (t) => {
    await t.test('init loads stats and injects HTML', () => {
        const window = setupDOM('', { 'c2_stats_testapp': JSON.stringify({ mode1: { 'easy': { totalAttempts: 1, totalSuccess: 1, firstTrySuccess: 1, mistakes: 0 } } }) });
        const sm = window.ScoreManager;
        const document = window.document;

        sm.init('testapp');
        assert.strictEqual(sm.appId, 'testapp');
        assert.deepStrictEqual(JSON.parse(JSON.stringify(sm.stats)), { mode1: { 'easy': { totalAttempts: 1, totalSuccess: 1, firstTrySuccess: 1, mistakes: 0 } } });

        const modal = document.getElementById('score-details-modal');
        assert.ok(modal, 'Modal should be injected');
    });

    await t.test('loadStats handles corrupted JSON', () => {
        const window = setupDOM('', { 'c2_stats_testapp': '{ invalid json }' });
        const sm = window.ScoreManager;
        sm.appId = 'testapp';
        sm.loadStats();

        assert.deepStrictEqual(JSON.parse(JSON.stringify(sm.stats)), {});
    });

    await t.test('loadStats cleans up password property', () => {
        const window = setupDOM('', { 'c2_stats_testapp': JSON.stringify({ password: '123', mode1: {} }) });
        const sm = window.ScoreManager;
        sm.appId = 'testapp';
        sm.loadStats();

        assert.deepStrictEqual(JSON.parse(JSON.stringify(sm.stats)), { mode1: {} });
        assert.strictEqual(window.localStorage.getItem('c2_stats_testapp'), '{"mode1":{}}');
    });

    await t.test('loadStats heals totalAttempts', () => {
        const window = setupDOM('', { 'c2_stats_testapp': JSON.stringify({ mode1: { easy: { totalAttempts: 0, totalSuccess: 2, mistakes: 3 } } }) });
        const sm = window.ScoreManager;
        sm.appId = 'testapp';
        sm.loadStats();

        assert.strictEqual(sm.stats.mode1.easy.totalAttempts, 5);
    });

    await t.test('saveStats persists to localStorage', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        sm.appId = 'testapp';
        sm.stats = { mode1: { easy: { totalAttempts: 1 } } };
        sm.saveStats();

        assert.strictEqual(window.localStorage.getItem('c2_stats_testapp'), JSON.stringify({ mode1: { easy: { totalAttempts: 1 } } }));
    });

    await t.test('resetScores clears stats', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        sm.appId = 'testapp';
        sm.stats = { mode1: { easy: { totalAttempts: 1 } } };

        let confirmCalled = false;
        window.confirm = () => { confirmCalled = true; return true; };

        sm.resetScores();
        assert.ok(confirmCalled);
        assert.deepStrictEqual(JSON.parse(JSON.stringify(sm.stats)), {});
        assert.strictEqual(window.localStorage.getItem('c2_stats_testapp'), '{}');
    });
});

test('ScoreManager - Game logic', async (t) => {
    await t.test('ensurePath creates path if missing', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        sm.ensurePath('mode1', 'easy');

        assert.ok(sm.stats.mode1);
        assert.ok(sm.stats.mode1.easy);
        assert.strictEqual(sm.stats.mode1.easy.totalAttempts, 0);
    });

    await t.test('addSuccess on first try', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        sm.appId = 'testapp';

        sm.addSuccess('mode1', 'easy', 0);

        const st = sm.stats.mode1.easy;
        assert.strictEqual(st.totalAttempts, 1);
        assert.strictEqual(st.totalSuccess, 1);
        assert.strictEqual(st.firstTrySuccess, 1);
        assert.strictEqual(st.streak, 1);
    });

    await t.test('addSuccess with mistakes', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        sm.appId = 'testapp';

        sm.stats = { mode1: { easy: { totalAttempts: 1, totalSuccess: 1, firstTrySuccess: 1, mistakes: 0, streak: 2 } } };
        sm.addSuccess('mode1', 'easy', 1);

        const st = sm.stats.mode1.easy;
        assert.strictEqual(st.totalAttempts, 2);
        assert.strictEqual(st.totalSuccess, 2);
        assert.strictEqual(st.firstTrySuccess, 1);
        assert.strictEqual(st.streak, 0);
    });

    await t.test('addMistake resets streak', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        sm.appId = 'testapp';

        sm.stats = { mode1: { easy: { totalAttempts: 1, totalSuccess: 1, firstTrySuccess: 1, mistakes: 0, streak: 2 } } };
        sm.addMistake('mode1', 'easy');

        const st = sm.stats.mode1.easy;
        assert.strictEqual(st.totalAttempts, 2);
        assert.strictEqual(st.mistakes, 1);
        assert.strictEqual(st.streak, 0);
    });

    await t.test('checkAdaptiveDifficulty triggers upgrade if streak is 3 and difficulty supported', () => {
        const initialHtml = `<div id="diff-medium" data-diff="medium"></div>`;
        const window = setupDOM(initialHtml);
        const sm = window.ScoreManager;
        const document = window.document;
        sm.appId = 'testapp';

        sm.stats = { mode1: { easy: { totalAttempts: 2, totalSuccess: 2, firstTrySuccess: 2, mistakes: 0, streak: 2 } } };

        // This will trigger checkAdaptiveDifficulty because streak becomes 3
        sm.addSuccess('mode1', 'easy', 0);

        const popup = document.getElementById('adaptive-difficulty-popup');
        assert.ok(popup, 'Popup should be created');

        const nextLabel = document.getElementById('adaptive-next-label');
        assert.strictEqual(nextLabel.textContent, sm.DIFF_LABELS['medium']);
    });
});

test('ScoreManager - UI and rendering', async (t) => {
    await t.test('injectModalHtml creates modal if not exists', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        const document = window.document;

        sm.injectModalHtml();

        const modal = document.getElementById('score-details-modal');
        assert.ok(modal);
        assert.ok(document.getElementById('btn-close-score-modal'));
        assert.ok(document.getElementById('btn-reset-scores-action'));
    });

    await t.test('showModal and closeModal', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        const document = window.document;

        sm.injectModalHtml();
        sm.showModal();

        const modal = document.getElementById('score-details-modal');
        assert.strictEqual(modal.classList.contains('active'), true);
        assert.strictEqual(modal.getAttribute('aria-hidden'), 'false');

        sm.closeModal();
        assert.strictEqual(modal.classList.contains('active'), false);
        assert.strictEqual(modal.getAttribute('aria-hidden'), 'true');
    });

    await t.test('renderModalContent handles empty stats', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        const document = window.document;

        sm.injectModalHtml();
        sm.stats = {};
        sm.renderModalContent();

        const body = document.getElementById('score-modal-body');
        assert.strictEqual(body.children.length, 1);
        assert.strictEqual(body.children[0].tagName, 'P');
        assert.strictEqual(body.children[0].textContent, 'Aucune statistique enregistrée pour le moment.');
    });

    await t.test('renderModalContent handles populated stats', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        const document = window.document;

        sm.appId = 'testapp';
        sm.injectModalHtml();
        sm.stats = {
            dec_to_bin: {
                easy: { totalAttempts: 10, totalSuccess: 8, firstTrySuccess: 5, mistakes: 2, streak: 0 }
            }
        };

        sm.renderModalContent();

        const body = document.getElementById('score-modal-body');
        const modeContainers = body.querySelectorAll('.stat-mode-container');
        assert.strictEqual(modeContainers.length, 1, 'Should create one container per mode');

        const title = modeContainers[0].querySelector('.stat-mode-title');
        assert.strictEqual(title.textContent, sm.MODE_LABELS['dec_to_bin'], 'Should use mode label');

        const chartWrapper = modeContainers[0].querySelector('.stat-chart-wrapper');
        assert.ok(chartWrapper, 'Should render chart');

        const tableWrapper = modeContainers[0].querySelector('.stat-table-wrapper');
        assert.ok(tableWrapper, 'Should render table for modes with difficulty');
    });

    await t.test('renderModalContent handles _NO_DIFF (no difficulty levels)', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        const document = window.document;

        sm.appId = 'testapp';
        sm.injectModalHtml();
        sm.stats = {
            train: {
                _nodiff_: { totalAttempts: 5, totalSuccess: 5, firstTrySuccess: 4, mistakes: 0, streak: 0 }
            }
        };

        sm.renderModalContent();

        const body = document.getElementById('score-modal-body');
        const modeContainers = body.querySelectorAll('.stat-mode-container');

        const tableWrapper = modeContainers[0].querySelector('.stat-table-wrapper');
        assert.strictEqual(tableWrapper, null, 'Should not render table if no difficulty levels');
    });

    await t.test('generateDonutChart creates empty state', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        const donut = sm.generateDonutChart(0, 0, 0);

        assert.strictEqual(donut.tagName, 'DIV');
        assert.strictEqual(donut.textContent, 'Aucune donnée');
    });

    await t.test('generateDonutChart creates SVG chart', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        const donut = sm.generateDonutChart(5, 3, 2);

        assert.strictEqual(donut.tagName, 'DIV');
        const svg = donut.querySelector('svg');
        assert.ok(svg);
        assert.strictEqual(svg.getAttribute('viewBox'), '0 0 140 140');

        const circles = svg.querySelectorAll('circle');
        // 1 bg + 3 data circles
        assert.strictEqual(circles.length, 4);
    });

    await t.test('generateDonutChart for machine_a_trier omits s2 circle', () => {
        const window = setupDOM();
        const sm = window.ScoreManager;
        sm.appId = 'machine_a_trier';

        const donut = sm.generateDonutChart(5, 0, 2);
        const svg = donut.querySelector('svg');
        const circles = svg.querySelectorAll('circle');
        // 1 bg + 2 data circles (success, mistakes)
        assert.strictEqual(circles.length, 3);
    });
});
