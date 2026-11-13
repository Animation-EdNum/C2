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

test('scores.js - Adaptive Difficulty Popup and Switching', async (t) => {
    await t.test('triggers popup and switches difficulty on "Oui, allons-y !" for jeu_de_la_grue', () => {
        const window = setupDOM();
        const document = window.document;
        const ScoreManager = window.ScoreManager;

        // Add difficulty buttons like in jeu_de_la_grue.html
        document.body.innerHTML = `
            <button id="diff-easy" class="diff-btn active">Facile</button>
            <button id="diff-medium" class="diff-btn">Moyen</button>
            <button id="diff-hard" class="diff-btn">Difficile</button>
        `;

        let changedDiff = null;
        let changedMode = null;
        window.addEventListener('c2_change_difficulty', (e) => {
            changedDiff = e.detail.difficulty;
            changedMode = e.detail.mode;
            if (changedDiff === 'medium' || changedDiff === '6') {
                document.getElementById('diff-easy').classList.remove('active');
                document.getElementById('diff-medium').classList.add('active');
            }
        });

        ScoreManager.init('jeu_de_la_grue');
        ScoreManager.checkAdaptiveDifficulty('jeu_de_la_grue', 'easy');

        const popup = document.getElementById('adaptive-difficulty-popup');
        assert.ok(popup, 'Popup was injected into DOM');
        assert.strictEqual(document.getElementById('adaptive-next-label').textContent, 'Moyen');

        const btnYes = document.getElementById('btn-adaptive-yes');
        btnYes.click();

        assert.strictEqual(changedDiff, 'medium');
        assert.strictEqual(changedMode, 'jeu_de_la_grue');
        assert.ok(document.getElementById('diff-medium').classList.contains('active'), 'diff-medium is now active');
    });

    await t.test('DOM fallback automatically clicks target button if listener is absent', () => {
        const window = setupDOM();
        const document = window.document;
        const ScoreManager = window.ScoreManager;

        let mediumClicked = false;
        document.body.innerHTML = `
            <button id="diff-easy" class="diff-btn active">Facile</button>
            <button id="diff-medium" class="diff-btn">Moyen</button>
        `;
        document.getElementById('diff-medium').addEventListener('click', () => {
            mediumClicked = true;
            document.getElementById('diff-medium').classList.add('active');
        });

        ScoreManager.init('generic_app');
        ScoreManager.checkAdaptiveDifficulty('generic_app', 'easy');

        const btnYes = document.getElementById('btn-adaptive-yes');
        btnYes.click();

        assert.strictEqual(mediumClicked, true, 'Fallback clicked diff-medium');
    });

    await t.test('supports diff-btn-* IDs and data-diff attributes (compresseur_magique)', () => {
        const window = setupDOM();
        const document = window.document;
        const ScoreManager = window.ScoreManager;

        document.body.innerHTML = `
            <button id="diff-btn-easy" class="diff-btn" data-diff="easy">Facile</button>
            <button id="diff-btn-medium" class="diff-btn active" data-diff="medium">Moyen</button>
            <button id="diff-btn-hard" class="diff-btn" data-diff="hard">Difficile</button>
        `;

        ScoreManager.init('compresseur_magique');
        assert.strictEqual(ScoreManager.isDifficultySupported('hard', 'decode'), true);
        assert.strictEqual(ScoreManager.isDifficultySupported('easy', 'decode'), true);
    });

    await t.test('coffre_fort sort mode upgrades from easy directly to hard', () => {
        const window = setupDOM();
        const document = window.document;
        const ScoreManager = window.ScoreManager;

        document.body.innerHTML = `
            <button id="diff-easy" class="diff-btn active">Facile</button>
            <button id="diff-hard" class="diff-btn">Difficile</button>
        `;

        let changedDiff = null;
        window.addEventListener('c2_change_difficulty', (e) => {
            changedDiff = e.detail.difficulty;
        });

        ScoreManager.init('coffre_fort');
        ScoreManager.checkAdaptiveDifficulty('sort', 'easy');

        const label = document.getElementById('adaptive-next-label').textContent;
        assert.strictEqual(label, 'Difficile');

        const btnYes = document.getElementById('btn-adaptive-yes');
        btnYes.click();
        assert.strictEqual(changedDiff, 'hard');
    });

    await t.test('btn-reset-scores-action resets scores when confirmed', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;
        const document = window.document;

        ScoreManager.init('jeu_de_la_grue');
        ScoreManager.addSuccess('jeu_de_la_grue', 'easy', 0);
        assert.strictEqual(ScoreManager.stats.jeu_de_la_grue.easy.totalSuccess, 1);

        // Mock confirm -> true
        window.confirm = () => true;

        ScoreManager.showModal();
        const resetBtn = document.getElementById('btn-reset-scores-action');
        assert.ok(resetBtn, 'Reset scores button must exist in modal');

        resetBtn.click();

        assert.strictEqual(Object.keys(ScoreManager.stats).length, 0);
        assert.strictEqual(window.localStorage.getItem('c2_stats_jeu_de_la_grue'), '{}');
        const emptyMsg = document.querySelector('.stat-empty-state');
        assert.ok(emptyMsg, 'Empty stats message should be shown after reset');
    });

    await t.test('btn-reset-scores-action keeps scores when cancelled', () => {
        const window = setupDOM();
        const ScoreManager = window.ScoreManager;
        const document = window.document;

        ScoreManager.init('jeu_de_la_grue');
        ScoreManager.addSuccess('jeu_de_la_grue', 'easy', 0);
        assert.strictEqual(ScoreManager.stats.jeu_de_la_grue.easy.totalSuccess, 1);

        // Mock confirm -> false
        window.confirm = () => false;

        ScoreManager.showModal();
        const resetBtn = document.getElementById('btn-reset-scores-action');
        resetBtn.click();

        assert.strictEqual(ScoreManager.stats.jeu_de_la_grue.easy.totalSuccess, 1);
        const stored = JSON.parse(window.localStorage.getItem('c2_stats_jeu_de_la_grue'));
        assert.strictEqual(stored.jeu_de_la_grue.easy.totalSuccess, 1);
    });
});
