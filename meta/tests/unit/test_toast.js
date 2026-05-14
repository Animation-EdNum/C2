const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

// Load toast.js source code
const toastSrc = fs.readFileSync('assets/js/toast.js', 'utf-8');

function setupDOM() {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: "dangerously" });
    const window = dom.window;

    // Evaluate toast.js into the jsdom window environment
    window.eval(toastSrc);

    // Mock for window.fa to test icon creation
    window.fa = {
        createIcons: () => {}
    };

    return window;
}

test('showToast', async (t) => {

    await t.test('creates the container if it does not exist', () => {
        const window = setupDOM();
        const document = window.document;

        assert.strictEqual(document.getElementById('c2-toast-container'), null, 'Container should not exist initially');

        window.showToast('Test Message');

        const container = document.getElementById('c2-toast-container');
        assert.ok(container, 'Container should be created');
        assert.strictEqual(container.tagName, 'DIV', 'Container should be a div');
        assert.strictEqual(container.childNodes.length, 1, 'Should have one toast appended');
    });

    await t.test('reuses existing container', () => {
        const window = setupDOM();
        const document = window.document;

        const container = document.createElement('div');
        container.id = 'c2-toast-container';
        document.body.appendChild(container);

        window.showToast('Test 1');
        window.showToast('Test 2');

        const currentContainer = document.getElementById('c2-toast-container');
        assert.strictEqual(currentContainer, container, 'Should reuse the same container');
        assert.strictEqual(currentContainer.childNodes.length, 2, 'Should have two toasts appended');
    });

    await t.test('handles default success type', () => {
        const window = setupDOM();
        const document = window.document;

        window.showToast('Success Msg');

        const toast = document.querySelector('.c2-toast');
        assert.ok(toast.classList.contains('success'), 'Toast should have success class');
        assert.ok(toast.classList.contains('visible'), 'Toast should be visible');
        assert.strictEqual(toast.querySelector('span').textContent, 'Success Msg', 'Text content should match');

        const icon = toast.querySelector('i');
        assert.ok(icon, 'Should create icon');
        assert.strictEqual(icon.getAttribute('data-fa'), 'circle-check', 'Should have check icon for success');
    });

    await t.test('handles legacy boolean type: true (success)', () => {
        const window = setupDOM();
        const document = window.document;

        window.showToast('True Msg', true);

        const toast = document.querySelector('.c2-toast');
        assert.ok(toast.classList.contains('success'), 'Toast should have success class');
        assert.strictEqual(toast.querySelector('i').getAttribute('data-fa'), 'circle-check', 'Should have check icon');
    });

    await t.test('handles legacy boolean type: false (error)', () => {
        const window = setupDOM();
        const document = window.document;

        window.showToast('False Msg', false);

        const toast = document.querySelector('.c2-toast');
        assert.ok(toast.classList.contains('error'), 'Toast should have error class');
        assert.strictEqual(toast.querySelector('i').getAttribute('data-fa'), 'circle-xmark', 'Should have xmark icon');
    });

    await t.test('handles string type: error', () => {
        const window = setupDOM();
        const document = window.document;

        window.showToast('Error Msg', 'error');

        const toast = document.querySelector('.c2-toast');
        assert.ok(toast.classList.contains('error'), 'Toast should have error class');
    });

    await t.test('handles string type: warn', () => {
        const window = setupDOM();
        const document = window.document;

        window.showToast('Warn Msg', 'warn');

        const toast = document.querySelector('.c2-toast');
        assert.ok(toast.classList.contains('warn'), 'Toast should have warn class');
        assert.strictEqual(toast.querySelector('i').getAttribute('data-fa'), 'triangle-exclamation', 'Should have exclamation icon');
    });

    await t.test('handles string type: info', () => {
        const window = setupDOM();
        const document = window.document;

        window.showToast('Info Msg', 'info');

        const toast = document.querySelector('.c2-toast');
        assert.ok(toast.classList.contains('info'), 'Toast should have info class');
        assert.strictEqual(toast.querySelector('i').getAttribute('data-fa'), 'circle-info', 'Should have info icon');
    });

    await t.test('handles custom icon type', () => {
        const window = setupDOM();
        const document = window.document;

        window.showToast('Custom Msg', 'custom-icon');

        const toast = document.querySelector('.c2-toast');
        assert.ok(toast.classList.contains('custom-icon'), 'Toast should have custom-icon class');
        assert.strictEqual(toast.querySelector('i').getAttribute('data-fa'), 'custom-icon', 'Should use custom type as icon');
    });

    await t.test('handles HTMLElement as message', () => {
        const window = setupDOM();
        const document = window.document;

        const el = document.createElement('strong');
        el.textContent = 'Bold Msg';

        window.showToast(el);

        const toast = document.querySelector('.c2-toast');
        const span = toast.querySelector('span');

        assert.strictEqual(span.childNodes.length, 1, 'Should append one child to span');
        assert.strictEqual(span.childNodes[0].tagName, 'STRONG', 'Child should be the passed HTMLElement');
        assert.strictEqual(span.textContent, 'Bold Msg', 'Content should match');
    });

    await t.test('creates icon only if window.fa exists', () => {
        const window = setupDOM();
        const document = window.document;

        // Remove window.fa mock
        window.fa = undefined;

        window.showToast('No fa');

        const toast = document.querySelector('.c2-toast');
        assert.strictEqual(toast.querySelector('i'), null, 'Should not create icon if window.fa is undefined');
    });

    await t.test('calls window.fa.createIcons after appending', () => {
        const window = setupDOM();
        let called = false;
        window.fa.createIcons = () => { called = true; };

        window.showToast('Create Icons Check');

        assert.strictEqual(called, true, 'Should call createIcons');
    });

    await t.test('removes visible class and element after duration', async () => {
        const window = setupDOM();
        const document = window.document;

        window.showToast('Duration Test', 'success', 50); // Short duration

        const toast = document.querySelector('.c2-toast');
        assert.ok(toast.classList.contains('visible'), 'Initially visible');

        // Wait for duration
        await new Promise(r => setTimeout(r, 60));

        assert.strictEqual(toast.classList.contains('visible'), false, 'Should remove visible class after duration');

        // Wait for removal timeout (400ms)
        await new Promise(r => setTimeout(r, 450));

        assert.strictEqual(document.querySelector('.c2-toast'), null, 'Should remove element from DOM');
    });
});
