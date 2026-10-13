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

    await t.test('complex key recipe for circumflex "ê" highlights step 1 (^) and step 2 (e) with badges and explains recipe', () => {
        const levelSelect = window.document.getElementById('levelSelect');
        const keyboardSection = window.document.getElementById('keyboardSection');
        const errorBanner = window.document.getElementById('errorBanner');
        const errorMessage = window.document.getElementById('errorMessage');

        // Select Level 3 (id 2, index 2): "été vélo déjà mère père frère forêt..."
        levelSelect.value = "2";
        levelSelect.dispatchEvent(new window.Event('change'));

        // Advance to word "forêt", character 'ê' (index 38: "été vélo déjà mère père frère for" -> length 33, 'f'=33, 'o'=34, 'r'=35, 'ê'=36)
        // Find index of 'ê' in the current level text
        const text = "été vélo déjà mère père frère forêt fête règle café vérité élève";
        const targetIndex = text.indexOf('ê');
        assert.ok(targetIndex > 0, 'Target character ê should exist in Level 3');

        // Type all characters up to 'ê'
        for (let i = 0; i < targetIndex; i++) {
            window.dispatchEvent(new window.KeyboardEvent('keydown', { key: text[i], bubbles: true }));
        }

        // Verify we are now on 'ê'
        const currentSpan = window.document.querySelector('.char-current');
        assert.strictEqual(currentSpan?.textContent, 'ê', 'Current character should be ê');

        // Simulate wrong key press (e.g. student types 'e' instead of 'ê')
        window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'e', bubbles: true }));

        // 1. Keyboard is visible
        assert.strictEqual(keyboardSection.classList.contains('visible'), true, 'Keyboard should be visible after error');

        // 2. Step 1 (Equal / ^) has target-step-1 class and badge ❶
        const step1Key = window.document.querySelector('.key[data-key-id="Equal"]');
        assert.ok(step1Key.classList.contains('target-step-1'), 'Key Equal (^) should have target-step-1 class');
        const badge1 = step1Key.querySelector('.key-step-pill.step-1');
        assert.ok(badge1, 'Step 1 key should have ❶ badge');
        assert.strictEqual(badge1.textContent, '❶');

        // 3. Step 2 (KeyE / e) has target-step-2 class and badge ❷
        const step2Key = window.document.querySelector('.key[data-key-id="KeyE"]');
        assert.ok(step2Key.classList.contains('target-step-2'), 'Key KeyE (e) should have target-step-2 class');
        const badge2 = step2Key.querySelector('.key-step-pill.step-2');
        assert.ok(badge2, 'Step 2 key should have ❷ badge');
        assert.strictEqual(badge2.textContent, '❷');

        // 4. Error message contains detailed recipe explanation
        assert.strictEqual(errorBanner.style.display, 'flex');
        assert.ok(errorMessage.innerHTML.includes('circonflexe'), 'Error message should explain circumflex recipe');
        assert.ok(errorMessage.innerHTML.includes('^'), 'Error message should mention ^');

        // 5. When student presses dead key '^', step 1 becomes done (✓)
        window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Dead', code: 'Equal', bubbles: true }));
        assert.ok(step1Key.classList.contains('done'), 'Step 1 key should be marked done after pressing dead key');
        assert.strictEqual(step1Key.querySelector('.key-step-pill').textContent, '✓');

        // 6. When student types 'e', it successfully completes 'ê' and advances
        window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ê', code: 'KeyE', bubbles: true }));
        assert.strictEqual(keyboardSection.classList.contains('visible'), false, 'Keyboard should hide after typing correct ê');
        const nextSpan = window.document.querySelector('.char-current');
        assert.strictEqual(nextSpan?.textContent, 't', 'Next character after forêt should be t');
    });

    await t.test('btnToggleKeyboard toggles keyboard guide visibility on demand', () => {
        const btnToggleKeyboard = window.document.getElementById('btnToggleKeyboard');
        const keyboardSection = window.document.getElementById('keyboardSection');
        assert.ok(btnToggleKeyboard, 'btnToggleKeyboard should exist in DOM');

        assert.strictEqual(keyboardSection.classList.contains('visible'), false, 'Keyboard initially hidden');

        // Click to open
        btnToggleKeyboard.click();
        assert.strictEqual(keyboardSection.classList.contains('visible'), true, 'Keyboard should be visible after click');

        // Click to close
        btnToggleKeyboard.click();
        assert.strictEqual(keyboardSection.classList.contains('visible'), false, 'Keyboard should be hidden after second click');
    });
});

