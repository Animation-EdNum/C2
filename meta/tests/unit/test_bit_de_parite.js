/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const htmlPath = path.resolve(__dirname, '../../../webapps/bit_de_parite.html');
const htmlSrc = fs.readFileSync(htmlPath, 'utf8');

function setupEnv() {
    const scoreCalls = { success: [], mistake: [] };
    const dom = new JSDOM(htmlSrc, {
        runScripts: 'dangerously',
        url: 'http://localhost/webapps/bit_de_parite.html',
        beforeParse(window) {
            window.ScoreManager = {
                init: () => {},
                addSuccess: (mode, diff, mistakes) => scoreCalls.success.push({ mode, diff, mistakes }),
                addMistake: (mode, diff) => scoreCalls.mistake.push({ mode, diff }),
                clearCurrentAppStats: () => {}
            };
            window.playSound = () => {};
            window.handleStreakCelebration = () => {};
            window.showToast = () => {};
        }
    });
    return { win: dom.window, scoreCalls };
}

test('bit_de_parite.html - grid sizes, parity calculation, detect mode & reset', async (t) => {
    let env;

    t.afterEach(() => {
        if (env && env.win) {
            env.win.__onResetApp?.();
            env.win.close();
        }
    });

    await t.test('difficulty buttons resize train grid accurately using #diff- IDs', () => {
        env = setupEnv();
        const { win } = env;
        const { document } = win;

        assert.ok(document.getElementById('diff-medium').classList.contains('active'), 'Medium is active initially');
        assert.strictEqual(document.querySelectorAll('#train-grid .cell').length, 36, 'Medium mode renders 6x6 cells (5 data + 1 parity)');

        win.setDifficulty('easy');
        assert.ok(document.getElementById('diff-easy').classList.contains('active'));
        assert.strictEqual(document.querySelectorAll('#train-grid .cell').length, 25, 'Easy mode renders 5x5 cells');

        win.setDifficulty('hard');
        assert.ok(document.getElementById('diff-hard').classList.contains('active'));
        assert.strictEqual(document.querySelectorAll('#train-grid .cell').length, 49, 'Hard mode renders 7x7 cells');
    });

    await t.test('train mode solves even parity accurately and validates all zeros/ones', () => {
        env = setupEnv();
        const { win, scoreCalls } = env;
        const { document } = win;

        win.setDifficulty('easy'); // 5x5 grid (4x4 data + 1 parity border)
        const totalSize = 5;
        const clickCell = (r, c) => {
            document.querySelectorAll('#train-grid .cell')[r * totalSize + c].click();
        };
        const dataBit = (r, c) =>
            parseInt(document.querySelectorAll('#train-grid .cell')[r * totalSize + c].textContent.trim(), 10) || 0;

        // Note: parity cells start as null; 1st click sets 1, 2nd click sets 0
        const setParityBit = (r, c, bit) => {
            if (bit === 1) {
                clickCell(r, c);
            } else {
                clickCell(r, c);
                clickCell(r, c);
            }
        };

        let parityColSum = 0;
        for (let r = 0; r < 4; r++) {
            const sum = [0, 1, 2, 3].reduce((acc, c) => acc + dataBit(r, c), 0);
            const pBit = sum % 2;
            parityColSum += pBit;
            setParityBit(r, 4, pBit);
        }
        for (let c = 0; c < 4; c++) {
            const sum = [0, 1, 2, 3].reduce((acc, r) => acc + dataBit(r, c), 0);
            setParityBit(4, c, sum % 2);
        }
        setParityBit(4, 4, parityColSum % 2);

        document.getElementById('verifyBtn').click();
        assert.strictEqual(scoreCalls.success.length, 1, 'Valid even parity table must pass verification');
    });

    await t.test('detect mode creates exactly 1 corrupted row and 1 corrupted column intersecting on a .cell.data', () => {
        env = setupEnv();
        const { win } = env;
        const { document } = win;

        document.getElementById('tab-detect').click();
        const cells = document.querySelectorAll('#detect-grid .cell');
        assert.strictEqual(cells.length, 36, 'Detect grid is always 6x6');

        const badRows = [0, 1, 2, 3, 4].filter(r => !win.isRowOk(r));
        const badCols = [0, 1, 2, 3, 4].filter(c => !win.isColOk(c));
        assert.strictEqual(badRows.length, 1, 'Exactly one data row must violate even parity');
        assert.strictEqual(badCols.length, 1, 'Exactly one data column must violate even parity');

        const errCell = cells[badRows[0] * 6 + badCols[0]];
        assert.ok(errCell.classList.contains('data'), 'Corrupted intersection must be a data cell');
    });
});
