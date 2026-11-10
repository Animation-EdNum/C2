/**
 * @file test_bareme.js
 * @description Unit & DOM integration tests for the grading scale generator (bareme.html).
 * Covers mathematical accuracy, rounding stability, decimal totals, DOM interaction,
 * print lifecycle, and URL sharing parameters.
 * @license AGPL-3.0-or-later
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

describe('bareme.html - mathematical engine & DOM interactions', () => {
    const filePath = path.resolve(__dirname, '../../../webapps/teacher/bareme.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    function createEnv() {
        const dom = new JSDOM(htmlContent, {
            runScripts: 'dangerously',
            url: 'http://localhost/webapps/teacher/bareme.html'
        });
        return { dom, window: dom.window, document: dom.window.document };
    }

    test('1. Quarter rounding (0.25) preserves .25 and .75 without truncating to tenth', () => {
        const { window } = createEnv();
        // 13 / 20 with total 20, no double bareme, step 0.5, round 0.25 -> (5*13/20)+1 = 4.25
        const data = window.generateData(20, null, 0.5, 0.25);
        const item13 = data.find(d => d.points === 13);
        assert.ok(item13, 'Point 13 must exist in generated table');
        assert.strictEqual(item13.grade, 4.25, '13/20 with round 0.25 must be 4.25, never truncated to 4.3');

        // 11 / 20 -> 5*(11/20) + 1 = 3.75
        const item11 = data.find(d => d.points === 11);
        assert.ok(item11, 'Point 11 must exist in generated table');
        assert.strictEqual(item11.grade, 3.75, '11/20 with round 0.25 must be 3.75');
    });

    test('2. Float noise precision symmetry on rounding to tenth (0.1)', () => {
        const { window } = createEnv();
        // 81/100 -> 5*(81/100)+1 = 5.05. Due to IEEE-754 (5.05/0.1 = 50.49999999999999),
        // anti-float epsilon must ensure it rounds symmetrically to 5.1
        const data100 = window.generateData(100, null, 1, 0.1);
        const item81 = data100.find(d => d.points === 81);
        const item83 = data100.find(d => d.points === 83);

        assert.ok(item81 && item83, 'Points 81 and 83 must exist');
        assert.strictEqual(item81.grade, 5.1, '81/100 must round up to 5.1');
        assert.strictEqual(item83.grade, 5.2, '83/100 must round up to 5.2');
    });

    test('3. Double-barème threshold boundary precision', () => {
        const { window } = createEnv();
        // Total 11, pointsFor4 = 10, points = 9.5 -> 1 + 3*(9.5/10) = 3.85 -> rounds to 3.9
        const dataDouble = window.generateData(11, 10, 0.5, 0.1);
        const item9_5 = dataDouble.find(d => d.points === 9.5);
        assert.ok(item9_5, 'Point 9.5 must exist in double bareme table');
        assert.strictEqual(item9_5.grade, 3.9, '9.5/11 with threshold 10 must round to 3.9');
    });

    test('4. Decimal totals always include the maximum total as the first row', () => {
        const { window } = createEnv();
        // Total 20.3 with step 0.5: must NOT start at 20.0, but at 20.3 / 6.0
        const data = window.generateData(20.3, null, 0.5, 0.1);
        assert.ok(data.length > 0, 'Data array must not be empty');
        assert.strictEqual(data[0].points, 20.3, 'First row must be exact total 20.3');
        assert.strictEqual(data[0].grade, 6, 'Grade for maximum points must be 6.0');
        assert.strictEqual(data[1].points, 20.0, 'Second row should be closest multiple 20.0');
    });

    test('5. Print cycle cleanup: afterprint event restores print layout without throwing', () => {
        const { window, document } = createEnv();
        const printBtn = document.getElementById('printBtn');
        assert.ok(printBtn, 'Print button must exist');

        // Trigger print handler which sets up afterprint listener
        printBtn.click();
        assert.strictEqual(document.body.classList.contains('printing'), true, 'handlePrint should add .printing class');

        // Dispatch afterprint event
        assert.doesNotThrow(() => {
            window.dispatchEvent(new window.Event('afterprint'));
        }, 'afterprint must not throw ReferenceError for calculate()');

        assert.strictEqual(document.body.classList.contains('printing'), false, '.printing class must be removed on afterprint');
    });

    test('6. Print header does not display threshold when threshold is invalid or ignored', () => {
        const { window, document } = createEnv();
        // Case: pointsFor4 = 25 while totalPoints = 20 (invalid double bareme)
        document.getElementById('totalPoints').value = '20';
        document.getElementById('pointsFor4').value = '25';
        window.updateAll();

        const printPass = document.getElementById('printPass');
        assert.ok(!printPass.textContent.includes('25 pts'), 'Print pass must NOT say 25 pts when threshold is invalid');
        assert.ok(printPass.textContent.includes('standard'), 'Print pass must indicate standard pass mark');
    });

    test('7. Advanced options toggle button is keyboard accessible and toggles aria-expanded', () => {
        const { document } = createEnv();
        const advToggle = document.getElementById('advancedToggle');
        assert.ok(advToggle, 'advancedToggle must exist');
        assert.strictEqual(advToggle.tagName, 'BUTTON', 'advancedToggle must be an accessible BUTTON element');

        const initialExpanded = advToggle.getAttribute('aria-expanded');
        advToggle.click();
        const nextExpanded = advToggle.getAttribute('aria-expanded');
        assert.notStrictEqual(initialExpanded, nextExpanded, 'Clicking must toggle aria-expanded attribute');
    });

    test('8. Projection mode toggles .projection class and updates icons', () => {
        const { window, document } = createEnv();
        const projBtn = document.getElementById('projection-toggle-btn');
        assert.ok(projBtn, 'projection-toggle-btn must exist in DOM');

        const wasProj = document.body.classList.contains('projection');
        projBtn.click();
        assert.strictEqual(document.body.classList.contains('projection'), !wasProj, 'Clicking projBtn must toggle .projection on body');

        // Pressing Escape exits projection mode
        if (document.body.classList.contains('projection')) {
            window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
            assert.strictEqual(document.body.classList.contains('projection'), false, 'Escape key must exit projection mode');
        }
    });

    test('9. Share URL generator builds valid URL containing current settings', () => {
        const { window, document } = createEnv();
        document.getElementById('totalPoints').value = '35';
        document.getElementById('pointsFor4').value = '21';
        document.getElementById('increment').value = '0.5';
        document.getElementById('rounding').value = '0.25';
        document.getElementById('titleInput').value = 'Épreuve Histoire';
        document.getElementById('showMistakes').checked = true;

        const shareUrl = window.getShareUrl();
        assert.ok(shareUrl.includes('total=35'), 'URL must include total=35');
        assert.ok(shareUrl.includes('p4=21'), 'URL must include p4=21');
        assert.ok(shareUrl.includes('round=0.25'), 'URL must include round=0.25');
        assert.ok(shareUrl.includes('mistakes=1'), 'URL must include mistakes=1');
    });
});
