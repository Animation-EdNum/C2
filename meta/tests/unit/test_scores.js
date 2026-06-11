const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

// Load scores.js source code
const scoresSrc = fs.readFileSync('assets/js/scores.js', 'utf-8');

function setupDOM(storage = {}) {
    const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="score-modal"></div></body></html>`, {
        runScripts: "dangerously",
        url: "http://localhost/"
    });
    const window = dom.window;

    // Use JSdom's native localStorage by ensuring it has a URL
    window.localStorage.clear();
    for (const key in storage) {
        window.localStorage.setItem(key, storage[key]);
    }

    // Evaluate scores.js directly
    const scriptEl = window.document.createElement('script');
    scriptEl.textContent = scoresSrc;
    window.document.body.appendChild(scriptEl);

    // Mock injectModalHtml as it might cause DOM issues in jsdom environment without full setup
    window.ScoreManager.injectModalHtml = () => {};

    return window;
}

// Convert objects from different contexts to be comparable by deepStrictEqual
function toPlainObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

test('ScoreManager.loadStats', async (t) => {
    await t.test('initializes with empty stats if localStorage is empty', () => {
        const window = setupDOM();
        window.ScoreManager.appId = 'test_app';
        window.ScoreManager.loadStats();
        assert.deepStrictEqual(toPlainObject(window.ScoreManager.stats), {}, 'stats should be empty');
    });

    await t.test('loads stats correctly from localStorage', () => {
        const mockStats = { mode1: { easy: { totalAttempts: 1 } } };
        const window = setupDOM({ 'c2_stats_test_app': JSON.stringify(mockStats) });
        window.ScoreManager.appId = 'test_app';
        window.ScoreManager.loadStats();
        assert.deepStrictEqual(toPlainObject(window.ScoreManager.stats), mockStats, 'stats should match localStorage');
    });

    await t.test('removes obsolete password scores and saves', () => {
        const mockStats = { password: { dummy: 1 }, mode1: { easy: { totalAttempts: 1 } } };
        const expectedStats = { mode1: { easy: { totalAttempts: 1 } } };
        const window = setupDOM({ 'c2_stats_test_app': JSON.stringify(mockStats) });
        window.ScoreManager.appId = 'test_app';
        window.ScoreManager.loadStats();

        assert.deepStrictEqual(toPlainObject(window.ScoreManager.stats), expectedStats, 'password key should be removed');
        assert.strictEqual(window.localStorage.getItem('c2_stats_test_app'), JSON.stringify(expectedStats), 'localStorage should be updated without password key');
    });

    await t.test('handles invalid JSON gracefully', () => {
        const window = setupDOM({ 'c2_stats_test_app': 'invalid json' });
        window.ScoreManager.appId = 'test_app';
        window.ScoreManager.loadStats();
        assert.deepStrictEqual(toPlainObject(window.ScoreManager.stats), {}, 'stats should be empty when JSON is invalid');
    });
});
