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

    // Mock confirm
    window.confirm = () => true;

    // Evaluate scores.js
    window.eval(scoresSrc);

    return window;
}

function getPlainObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

test('scores.js - loadStats', async (t) => {
    await t.test('initializes with empty stats if localStorage is empty', () => {
        const window = setupDOM();

        window.ScoreManager.appId = 'test_app';
        window.ScoreManager.loadStats();

        assert.deepStrictEqual(getPlainObject(window.ScoreManager.stats), {});
    });

    await t.test('loads valid JSON stats from localStorage', () => {
        const validData = {
            mode1: {
                easy: { totalAttempts: 5, totalSuccess: 3, firstTrySuccess: 1, mistakes: 2, streak: 0 }
            }
        };
        const window = setupDOM('', { 'c2_stats_test_app': JSON.stringify(validData) });

        window.ScoreManager.appId = 'test_app';
        window.ScoreManager.loadStats();

        assert.deepStrictEqual(getPlainObject(window.ScoreManager.stats), validData);
    });

    await t.test('recovers from invalid JSON in localStorage', () => {
        const window = setupDOM('', { 'c2_stats_test_app': '{invalid_json:]' });

        window.ScoreManager.appId = 'test_app';
        window.ScoreManager.loadStats();

        // The error path in loadStats is tested here!
        assert.deepStrictEqual(getPlainObject(window.ScoreManager.stats), {});
    });

    await t.test('cleans up obsolete password scores if present', () => {
        const dataWithPassword = {
            password: { some_data: 1 },
            mode1: {
                easy: { totalAttempts: 5, totalSuccess: 5, mistakes: 0 }
            }
        };
        const window = setupDOM('', { 'c2_stats_test_app': JSON.stringify(dataWithPassword) });

        window.ScoreManager.appId = 'test_app';
        window.ScoreManager.loadStats();

        const expectedData = {
            mode1: {
                easy: { totalAttempts: 5, totalSuccess: 5, mistakes: 0 }
            }
        };
        assert.deepStrictEqual(getPlainObject(window.ScoreManager.stats), expectedData);
        // Verify it was saved back to localStorage without password
        assert.strictEqual(window.localStorage.getItem('c2_stats_test_app'), JSON.stringify(expectedData));
    });

    await t.test('heals totalAttempts if needed', () => {
        const dataToHeal = {
            mode1: {
                easy: { totalAttempts: 2, totalSuccess: 2, mistakes: 1 } // minAttempts should be 3
            }
        };
        const window = setupDOM('', { 'c2_stats_test_app': JSON.stringify(dataToHeal) });

        window.ScoreManager.appId = 'test_app';
        window.ScoreManager.loadStats();

        const expectedData = {
            mode1: {
                easy: { totalAttempts: 3, totalSuccess: 2, mistakes: 1 }
            }
        };
        assert.deepStrictEqual(getPlainObject(window.ScoreManager.stats), expectedData);
    });
});
