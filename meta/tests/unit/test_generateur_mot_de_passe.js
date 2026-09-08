const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const htmlSrc = fs.readFileSync('webapps/generateur_mot_de_passe.html', 'utf-8');
const jsSrc = fs.readFileSync('assets/js/generateur_mot_de_passe.js', 'utf-8');

function setupDOM() {
    const dom = new JSDOM(htmlSrc, {
        runScripts: "dangerously",
        url: "http://localhost/"
    });

    const testableSrc = jsSrc.replace(
        '})();',
        'window.generatePedagogicalPassword = generatePedagogicalPassword;\n})();'
    );

    dom.window.eval(testableSrc);

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dom.window);
        }, 100);
    });
}

test('generateur_mot_de_passe.js - generatePedagogicalPassword', async (t) => {
    let window;

    t.beforeEach(async () => {
        window = await setupDOM();
    });

    await t.test('Returns empty result for word shorter than 4 chars', () => {
        const res = window.generatePedagogicalPassword('cat', '123', 'google', '!', ['word', 'number', 'service'], 12);
        // Using assert.deepEqual instead of deepStrictEqual due to prototype differences between Node and JSDOM
        assert.deepEqual(res, { password: "", parts: null });
    });

    await t.test('Capitalizes first letter if all lowercase', () => {
        const res = window.generatePedagogicalPassword('lapin', '123', 'google', '!', ['word', 'number', 'service'], 12);
        assert.strictEqual(res.parts.word, 'Lapin');
        assert.strictEqual(res.password, 'Lapin123!goo');
    });

    await t.test('Capitalizes first letter if all uppercase', () => {
        const res = window.generatePedagogicalPassword('LAPIN', '123', 'google', '!', ['word', 'number', 'service'], 12);
        assert.strictEqual(res.parts.word, 'Lapin');
        assert.strictEqual(res.password, 'Lapin123!goo');
    });

    await t.test('Leaves case unchanged if mixed case', () => {
        const res = window.generatePedagogicalPassword('laPin', '123', 'google', '!', ['word', 'number', 'service'], 12);
        assert.strictEqual(res.parts.word, 'laPin');
        assert.strictEqual(res.password, 'laPin123!goo');
    });

    await t.test('Repeats word to meet minLength', () => {
        const res = window.generatePedagogicalPassword('lapin', '123', 'google', '!', ['word', 'number', 'service'], 16);
        assert.strictEqual(res.parts.word, 'LapinLapin');
        assert.strictEqual(res.password, 'LapinLapin123!goo');
    });

    await t.test('Handles missing service correctly', () => {
        const res = window.generatePedagogicalPassword('lapin', '123', '', '!', ['word', 'number', 'service'], 12);
        assert.strictEqual(res.parts.service, '!');
        assert.strictEqual(res.parts.word, 'LapinLapin');
        assert.strictEqual(res.password, 'LapinLapin123!');
    });

    await t.test('Respects element order with bound character/site', () => {
        const res = window.generatePedagogicalPassword('lapin', '123', 'google', '!', ['service', 'word', 'number'], 12);
        assert.strictEqual(res.parts.service, '!goo');
        assert.strictEqual(res.password, '!gooLapin123');
    });

    await t.test('Binds character to 3-letter site edu.vs.ch (!edu)', () => {
        const res = window.generatePedagogicalPassword('saPin', '2026', 'edu.vs.ch', '!', ['word', 'number', 'service'], 12);
        assert.strictEqual(res.parts.word, 'saPin');
        assert.strictEqual(res.parts.number, '2026');
        assert.strictEqual(res.parts.service, '!edu');
        assert.strictEqual(res.password, 'saPin2026!edu');
    });

    await t.test('Binds character alone when site is empty (!), repeats base word for minLength 12', () => {
        const res = window.generatePedagogicalPassword('saPin', '2026', '', '!', ['word', 'number', 'service'], 12);
        assert.strictEqual(res.parts.word, 'saPinsaPin');
        assert.strictEqual(res.parts.service, '!');
        assert.strictEqual(res.password, 'saPinsaPin2026!');
    });

    await t.test('Supports instagram as site (uses 3 letters ins, bound to character: !ins)', () => {
        const res = window.generatePedagogicalPassword('saPin', '2026', 'instagram', '!', ['word', 'number', 'service'], 12);
        assert.strictEqual(res.parts.service, '!ins');
        assert.strictEqual(res.password, 'saPin2026!ins');
    });

    await t.test('Sanitizes block 2 to only allow numbers', () => {
        const numInput = window.document.getElementById('generator-number');
        numInput.value = '20ab26xyz';
        numInput.dispatchEvent(new window.Event('input'));
        assert.strictEqual(numInput.value, '2026');
    });

    await t.test('Sanitizes special char block to only allow special characters', () => {
        const specInput = window.document.getElementById('generator-special-char');
        specInput.value = 'a';
        specInput.dispatchEvent(new window.Event('input'));
        assert.strictEqual(specInput.value, '');

        specInput.value = '9';
        specInput.dispatchEvent(new window.Event('input'));
        assert.strictEqual(specInput.value, '');

        specInput.value = ' ';
        specInput.dispatchEvent(new window.Event('input'));
        assert.strictEqual(specInput.value, '');

        specInput.value = '!';
        specInput.dispatchEvent(new window.Event('input'));
        assert.strictEqual(specInput.value, '!');

        specInput.value = 'abc@123';
        specInput.dispatchEvent(new window.Event('input'));
        assert.strictEqual(specInput.value, '@');
    });

    await t.test('HTML badge indicates 5H-10CO', () => {
        const badge = window.document.querySelector('.badge-level');
        assert.strictEqual(badge.textContent.trim(), '5H-10CO');
    });
});

