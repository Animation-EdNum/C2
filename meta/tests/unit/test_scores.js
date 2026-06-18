const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const scoresSrc = fs.readFileSync('assets/js/scores.js', 'utf-8');

function setupDOM() {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
        runScripts: "dangerously",
        url: "http://localhost/"
    });
    const window = dom.window;

    window.eval(scoresSrc);

    return window;
}

test('ScoreManager.ensurePath', async (t) => {

    await t.test('creates mode and difficulty path if they do not exist', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;

        ScoreManager.stats = {};
        ScoreManager.ensurePath('mode1', 'easy');

        assert.ok(ScoreManager.stats['mode1'], 'Should create mode1 object');
        assert.ok(ScoreManager.stats['mode1']['easy'], 'Should create easy object inside mode1');

        const stats = ScoreManager.stats['mode1']['easy'];
        assert.strictEqual(stats.totalAttempts, 0);
        assert.strictEqual(stats.totalSuccess, 0);
        assert.strictEqual(stats.firstTrySuccess, 0);
        assert.strictEqual(stats.mistakes, 0);
        assert.strictEqual(stats.streak, 0);
    });

    await t.test('handles missing difficulty using _NO_DIFF', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;

        ScoreManager.stats = {};
        ScoreManager.ensurePath('mode2');

        assert.ok(ScoreManager.stats['mode2'], 'Should create mode2 object');
        assert.ok(ScoreManager.stats['mode2'][ScoreManager._NO_DIFF], 'Should create _NO_DIFF object inside mode2');
    });

    await t.test('does not overwrite existing path data', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;

        ScoreManager.stats = {
            'mode3': {
                'hard': {
                    totalAttempts: 5,
                    totalSuccess: 3,
                    firstTrySuccess: 1,
                    mistakes: 2,
                    streak: 2
                }
            }
        };

        ScoreManager.ensurePath('mode3', 'hard');

        assert.strictEqual(ScoreManager.stats['mode3']['hard'].totalAttempts, 5, 'Should not overwrite existing totalAttempts');
        assert.strictEqual(ScoreManager.stats['mode3']['hard'].streak, 2, 'Should not overwrite existing streak');
    });

    await t.test('creates difficulty path even if mode exists', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;

        ScoreManager.stats = {
            'mode4': {
                'easy': {
                    totalAttempts: 1,
                    totalSuccess: 1,
                    firstTrySuccess: 1,
                    mistakes: 0,
                    streak: 1
                }
            }
        };

        ScoreManager.ensurePath('mode4', 'medium');

        assert.ok(ScoreManager.stats['mode4']['medium'], 'Should create medium object inside mode4');
        assert.strictEqual(ScoreManager.stats['mode4']['easy'].totalAttempts, 1, 'Should not touch existing easy stats');
    });

});
