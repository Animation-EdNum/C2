const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const htmlSrc = fs.readFileSync('webapps/binaire_codage.html', 'utf-8');

function setupDOM() {
    // Add missing dependencies to HTML before parsing to prevent early errors during initialization
    const modifiedHtml = htmlSrc.replace(
        '<script src="../assets/js/theme.js"></script>',
        `<script>
            window.ScoreManager = {
                init: () => {},
                addSuccess: () => {},
                addMistake: () => {},
                _escapeHtml: (str) => str
            };
            window.playSound = () => {};
            window.handleStreakCelebration = () => {};
        </script>
        <script src="../assets/js/theme.js"></script>`
    );

    const dom = new JSDOM(modifiedHtml, {
        runScripts: "dangerously",
        url: "http://localhost/"
    });

    return new Promise(resolve => {
        // Wait for DOMContentLoaded and initialization scripts to run
        setTimeout(() => {
            resolve(dom.window);
        }, 100);
    });
}

test('binaire_codage.html - checkBinToDec', async (t) => {
    let window;

    t.beforeEach(async () => {
        window = await setupDOM();
    });

    await t.test('Correctly identifies a valid input', () => {
        window.eval(`
            currentBinString = '1010';
            currentBits = 4;
            binDecLocked = false;
            binDecMistakes = 0;
            document.getElementById('binDec-input').value = '10';
            document.getElementById('binDec-check-btn').disabled = false;

            // Re-mock these inside eval in case they were overridden
            ScoreManager = {
                init: () => {},
                addSuccess: () => {},
                addMistake: () => {},
                _escapeHtml: (str) => str
            };
            playSound = () => {};
            handleStreakCelebration = () => {};

            checkBinToDec();
        `);

        const fb = window.document.getElementById('binDec-feedback');
        assert.ok(fb.innerHTML.includes('✅ Exact'), `Expected success feedback, got: ${fb.innerHTML}`);
    });

    await t.test('Correctly identifies an invalid input', () => {
        window.eval(`
            currentBinString = '1010';
            currentBits = 4;
            binDecLocked = false;
            binDecMistakes = 0;
            document.getElementById('binDec-input').value = '5';
            document.getElementById('binDec-check-btn').disabled = false;

            ScoreManager = {
                init: () => {},
                addSuccess: () => {},
                addMistake: () => {},
                _escapeHtml: (str) => str
            };
            playSound = () => {};
            handleStreakCelebration = () => {};

            checkBinToDec();
        `);

        const fb = window.document.getElementById('binDec-feedback');
        assert.ok(fb.innerHTML.includes('❌ Faux'), `Expected failure feedback, got: ${fb.innerHTML}`);
    });

    await t.test('Handles empty input (NaN) correctly', () => {
        window.eval(`
            currentBinString = '1010';
            binDecLocked = false;
            document.getElementById('binDec-input').value = '';
            document.getElementById('binDec-check-btn').disabled = false;

            checkBinToDec();
        `);

        const fb = window.document.getElementById('binDec-feedback');
        assert.ok(fb.innerHTML.includes('Tape un nombre !'), `Expected NaN feedback, got: ${fb.innerHTML}`);
        assert.strictEqual(fb.className, 'feedback error');
    });
});
