const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const { JSDOM } = require('jsdom');

function setupDOM() {
    const html = '<!DOCTYPE html><html><body></body></html>';
    const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' });
    const window = dom.window;

    const scoresSrc = fs.readFileSync('assets/js/scores.js', 'utf8');
    window.eval(scoresSrc);

    return window;
}

test('scores.js - ScoreManager._escapeHtml', async (t) => {
    const window = setupDOM();
    const ScoreManager = window.ScoreManager;

    await t.test('escapes & character', () => {
        assert.strictEqual(ScoreManager._escapeHtml('a & b'), 'a &amp; b');
    });

    await t.test('escapes < and > characters', () => {
        assert.strictEqual(ScoreManager._escapeHtml('<script>'), '&lt;script&gt;');
    });

    await t.test('escapes " character', () => {
        assert.strictEqual(ScoreManager._escapeHtml('"hello"'), '&quot;hello&quot;');
    });

    await t.test('escapes \' character', () => {
        assert.strictEqual(ScoreManager._escapeHtml("'world'"), '&#039;world&#039;');
    });

    await t.test('escapes all special characters in a single string', () => {
        const input = `<script>alert("hello & 'world'")</script>`;
        const expected = `&lt;script&gt;alert(&quot;hello &amp; &#039;world&#039;&quot;)&lt;/script&gt;`;
        assert.strictEqual(ScoreManager._escapeHtml(input), expected);
    });

    await t.test('returns an empty string for null and undefined', () => {
        assert.strictEqual(ScoreManager._escapeHtml(null), '');
        assert.strictEqual(ScoreManager._escapeHtml(undefined), '');
    });

    await t.test('does not modify strings without special characters', () => {
        assert.strictEqual(ScoreManager._escapeHtml('hello world'), 'hello world');
    });

    await t.test('coerces numbers to strings', () => {
        assert.strictEqual(ScoreManager._escapeHtml(123), '123');
        assert.strictEqual(ScoreManager._escapeHtml(0), '0');
    });
});
