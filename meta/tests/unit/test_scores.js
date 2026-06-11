const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

// Load scores.js source code
const scoresSrc = fs.readFileSync('assets/js/scores.js', 'utf-8');

function setupDOM() {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: "dangerously", url: "http://localhost/" });
    const window = dom.window;

    // Evaluate scores.js into the jsdom window environment
    window.eval(scoresSrc);

    return window;
}

test('ScoreManager.ensurePath', async (t) => {
    await t.test('creates the mode and diff path if it does not exist', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;

        ScoreManager.stats = {}; // Ensure clean state
        ScoreManager.ensurePath('test_mode', 'easy');

        assert.ok(ScoreManager.stats['test_mode'], 'Should create the mode object');
        assert.ok(ScoreManager.stats['test_mode']['easy'], 'Should create the difficulty object');

        // Use JSON.stringify for deep equal to avoid object reference type mismatches across JSDOM context
        const actual = JSON.parse(JSON.stringify(ScoreManager.stats['test_mode']['easy']));
        const expected = {
            totalAttempts: 0,
            totalSuccess: 0,
            firstTrySuccess: 0,
            mistakes: 0,
            streak: 0
        };
        assert.deepStrictEqual(actual, expected, 'Should initialize stats correctly');
    });

    await t.test('does not overwrite existing path data', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;

        ScoreManager.stats = {
            'test_mode': {
                'easy': {
                    totalAttempts: 5,
                    totalSuccess: 3,
                    firstTrySuccess: 2,
                    mistakes: 1,
                    streak: 1
                }
            }
        };

        ScoreManager.ensurePath('test_mode', 'easy');

        const actual = JSON.parse(JSON.stringify(ScoreManager.stats['test_mode']['easy']));
        const expected = {
            totalAttempts: 5,
            totalSuccess: 3,
            firstTrySuccess: 2,
            mistakes: 1,
            streak: 1
        };
        assert.deepStrictEqual(actual, expected, 'Should not overwrite existing stats');
    });

    await t.test('handles null/undefined difficulty using _NO_DIFF', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;

        ScoreManager.stats = {}; // Clean state

        ScoreManager.ensurePath('test_mode', null);
        assert.ok(ScoreManager.stats['test_mode'][ScoreManager._NO_DIFF], 'Should create the _NO_DIFF object for null');

        ScoreManager.ensurePath('test_mode_2', undefined);
        assert.ok(ScoreManager.stats['test_mode_2'][ScoreManager._NO_DIFF], 'Should create the _NO_DIFF object for undefined');
    });
});
