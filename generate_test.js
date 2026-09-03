const code = `
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
        'window.generatePedagogicalPassword = generatePedagogicalPassword;\\n})();'
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
        const res = window.generatePedagogicalPassword('chat', '123', 'google', '!', ['word', 'number', 'service'], 12);
        assert.strictEqual(res.parts.word, 'Chat');
        assert.strictEqual(res.password, 'Chat123!goog');
    });

    await t.test('Capitalizes first letter if all uppercase', () => {
        const res = window.generatePedagogicalPassword('CHAT', '123', 'google', '!', ['word', 'number', 'service'], 12);
        assert.strictEqual(res.parts.word, 'Chat');
        assert.strictEqual(res.password, 'Chat123!goog');
    });

    await t.test('Leaves case unchanged if mixed case', () => {
        const res = window.generatePedagogicalPassword('cHAt', '123', 'google', '!', ['word', 'number', 'service'], 12);
        assert.strictEqual(res.parts.word, 'cHAt');
        assert.strictEqual(res.password, 'cHAt123!goog');
    });

    await t.test('Repeats word to meet minLength', () => {
        // 'chat' = 4 chars. '123' = 3 chars. '!goog' = 5 chars. Other length = 8.
        // minLength = 16. k = Math.ceil((16 - 8) / 4) = 2.
        const res = window.generatePedagogicalPassword('chat', '123', 'google', '!', ['word', 'number', 'service'], 16);
        assert.strictEqual(res.parts.word, 'ChatChat');
        assert.strictEqual(res.password, 'ChatChat123!goog');
    });

    await t.test('Handles missing service correctly', () => {
        const res = window.generatePedagogicalPassword('chat', '123', '', '!', ['word', 'number', 'service'], 12);
        assert.strictEqual(res.parts.service, '!');
        // 'chat' (4 chars) + '123' (3 chars) + '!' (1 char) = 8 chars. minLength = 12. k = Math.ceil((12-4)/4) = 2.
        // wait, otherLength = 4. minLength = 12. k = Math.ceil((12-4)/4) = 2. So word should be repeated twice. ChatChat
        assert.strictEqual(res.parts.word, 'ChatChat');
        assert.strictEqual(res.password, 'ChatChat123!');
    });

    await t.test('Respects element order', () => {
        const res = window.generatePedagogicalPassword('chat', '123', 'google', '!', ['service', 'word', 'number'], 12);
        assert.strictEqual(res.password, '!googChat123');
    });
});
`;
console.log(code);
