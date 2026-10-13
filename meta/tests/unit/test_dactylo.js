const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupDactyloDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/dactylo.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/'
    });
    return dom.window;
}

test('dactylo.html - Visual keyboard guidance & non-clickable keys', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupDactyloDOM();
    });

    t.afterEach(() => {
        if (window) {
            window.close();
        }
    });

    await t.test('visual keyboard is hidden by default on level load', () => {
        const keyboardSection = window.document.getElementById('keyboardSection');
        assert.ok(keyboardSection, 'keyboardSection element should exist in DOM');
        assert.strictEqual(
            keyboardSection.classList.contains('visible'),
            false,
            'keyboardSection should not have visible class on startup'
        );
    });

    await t.test('clicking virtual keys does not advance or input characters', () => {
        const textDisplay = window.document.getElementById('textDisplay');
        const firstCharBefore = textDisplay.querySelector('.char-current')?.textContent;

        const firstKey = window.document.querySelector('.key:not(.special)');
        assert.ok(firstKey, 'At least one key element should exist in keyboard');

        // Click the virtual key
        firstKey.click();

        // Target char should not have advanced
        const firstCharAfter = textDisplay.querySelector('.char-current')?.textContent;
        assert.strictEqual(firstCharAfter, firstCharBefore, 'Virtual key clicks must not trigger text input');
    });

    await t.test('physical key error triggers virtual keyboard appearance with target key highlighted', () => {
        const keyboardSection = window.document.getElementById('keyboardSection');
        const expectedSpan = window.document.getElementById('char-0');
        const expectedChar = expectedSpan?.textContent;

        // Press a wrong key (not matching expectedChar)
        const wrongKey = expectedChar === 'x' ? 'y' : 'x';
        const keydownEvent = new window.KeyboardEvent('keydown', {
            key: wrongKey,
            bubbles: true,
            cancelable: true
        });
        window.dispatchEvent(keydownEvent);

        // Keyboard must become visible
        assert.strictEqual(
            keyboardSection.classList.contains('visible'),
            true,
            'keyboardSection must have visible class after an error'
        );

        // Expected key must have target highlight
        const targetKey = window.document.querySelector('.key.target');
        assert.ok(targetKey, 'A key with class target must be highlighted on the visual keyboard');

        // Error banner must be visible
        const errorBanner = window.document.getElementById('errorBanner');
        assert.strictEqual(errorBanner.style.display, 'flex', 'errorBanner should be shown');
    });

    await t.test('typing the expected key hides the virtual keyboard and advances text', () => {
        const keyboardSection = window.document.getElementById('keyboardSection');
        const initialSpan = window.document.getElementById('char-0');
        const expectedChar = initialSpan?.textContent;

        // Trigger error first to make keyboard visible
        const wrongKey = expectedChar === 'x' ? 'y' : 'x';
        window.dispatchEvent(new window.KeyboardEvent('keydown', {
            key: wrongKey,
            bubbles: true,
            cancelable: true
        }));
        assert.strictEqual(keyboardSection.classList.contains('visible'), true);

        // Press the correct key
        window.dispatchEvent(new window.KeyboardEvent('keydown', {
            key: expectedChar,
            bubbles: true,
            cancelable: true
        }));

        // Keyboard must now be hidden again
        assert.strictEqual(
            keyboardSection.classList.contains('visible'),
            false,
            'keyboardSection must hide again after typing the correct key'
        );

        // Re-query char-0 after renderText()
        const updatedSpan = window.document.getElementById('char-0');
        assert.strictEqual(
            updatedSpan.classList.contains('char-correct'),
            true,
            'First char must have char-correct class'
        );

        // Second char (char-1) must now be char-current
        const nextSpan = window.document.getElementById('char-1');
        assert.strictEqual(
            nextSpan.classList.contains('char-current'),
            true,
            'Next char must be char-current'
        );
    });
});
