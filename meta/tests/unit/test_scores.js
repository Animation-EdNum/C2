const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const scoresSrc = fs.readFileSync('assets/js/scores.js', 'utf-8');

function setupDOM() {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
        url: "http://localhost/",
        runScripts: "dangerously"
    });
    const window = dom.window;

    // Evaluate scores.js into the jsdom window environment
    window.eval(scoresSrc);

    return window;
}

test('ScoreManager.loadStats', async (t) => {
    await t.test('handles valid JSON data', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;

        window.localStorage.setItem('c2_stats_testapp', JSON.stringify({ mode1: { 'easy': { totalAttempts: 5 } } }));
        ScoreManager.appId = 'testapp';
        ScoreManager.loadStats();

        assert.deepEqual(ScoreManager.stats, { mode1: { 'easy': { totalAttempts: 5 } } });
    });

    await t.test('handles invalid JSON gracefully', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;

        window.localStorage.setItem('c2_stats_testapp', 'invalid-json');
        ScoreManager.appId = 'testapp';
        ScoreManager.loadStats();

        assert.deepEqual(ScoreManager.stats, {});
    });

    await t.test('cleans up obsolete password scores and saves', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;

        window.localStorage.setItem('c2_stats_testapp', JSON.stringify({
            password: { level1: { totalAttempts: 10 } },
            mode1: { 'easy': { totalAttempts: 5 } }
        }));

        ScoreManager.appId = 'testapp';
        ScoreManager.loadStats();

        assert.deepEqual(ScoreManager.stats, { mode1: { 'easy': { totalAttempts: 5 } } });

        const savedData = JSON.parse(window.localStorage.getItem('c2_stats_testapp'));
        assert.deepEqual(savedData, { mode1: { 'easy': { totalAttempts: 5 } } });
    });

    await t.test('initializes empty stats when localStorage has no data', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;

        window.localStorage.removeItem('c2_stats_testapp');
        ScoreManager.appId = 'testapp';
        ScoreManager.loadStats();

        assert.deepEqual(ScoreManager.stats, {});
    });
});
