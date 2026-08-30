const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const scoresSrc = fs.readFileSync('assets/js/scores.js', 'utf-8');

function setupDOM() {
    const html = `<!DOCTYPE html><html><body></body></html>`;
    const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/" });
    const window = dom.window;

    // Execute the scores.js source in the JSDOM environment
    window.eval(scoresSrc);

    return { window, ScoreManager: window.ScoreManager };
}

test('ScoreManager', async (t) => {

    await t.test('_diffKey handles null and undefined', () => {
        const { ScoreManager } = setupDOM();
        assert.strictEqual(ScoreManager._diffKey(null), ScoreManager._NO_DIFF);
        assert.strictEqual(ScoreManager._diffKey(undefined), ScoreManager._NO_DIFF);
    });

    await t.test('_diffKey stringifies other values', () => {
        const { ScoreManager } = setupDOM();
        assert.strictEqual(ScoreManager._diffKey('easy'), 'easy');
        assert.strictEqual(ScoreManager._diffKey('medium'), 'medium');
        assert.strictEqual(ScoreManager._diffKey(4), '4');
        assert.strictEqual(ScoreManager._diffKey(0), '0');
        assert.strictEqual(ScoreManager._diffKey(false), 'false');
        assert.strictEqual(ScoreManager._diffKey(true), 'true');
    });

});
