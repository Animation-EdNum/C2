const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const skinsSrc = fs.readFileSync('assets/js/automate/automate-skins.js', 'utf-8');
const engineSrc = fs.readFileSync('assets/js/automate/automate-engine.js', 'utf-8');

function setupDOM() {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: 'dangerously', url: 'http://localhost/' });
    const window = dom.window;

    // Define globals needed by skins/engine
    window.GRID_ROWS = 6;
    window.GRID_COLS = 6;
    window.eval('let GRID_ROWS = 6; let GRID_COLS = 6;');

    window.eval(engineSrc);
    window.eval(skinsSrc);
    return window;
}

const window = setupDOM();
const shuffleArray = window.shuffleArray;

test('shuffleArray', async (t) => {
    await t.test('returns an empty array when input is empty', () => {
        const input = [];
        const output = shuffleArray(input);
        assert.ok(Array.isArray(output), 'Output should be an array');
        assert.strictEqual(output.length, 0, 'Output length should be 0');
        assert.notStrictEqual(output, input, 'Output should be a new array instance');
    });

    await t.test('returns the same element for a single-element array', () => {
        const input = [42];
        const output = shuffleArray(input);
        assert.strictEqual(output.length, 1, 'Output length should be 1');
        assert.strictEqual(output[0], 42, 'Output element should be 42');
        assert.notStrictEqual(output, input, 'Output should be a new array instance');
    });

    await t.test('does not modify the original array', () => {
        const input = [1, 2, 3, 4, 5];
        const inputCopy = [...input];
        shuffleArray(input);
        assert.deepStrictEqual(input, inputCopy, 'Original array should not be modified');
    });

    await t.test('contains all elements from the original array (integrity)', () => {
        const input = [1, 2, 3, 4, 5];
        const output = shuffleArray(input);
        assert.strictEqual(output.length, input.length, 'Output length should match input length');

        const sortedInput = [...input].sort((a, b) => a - b);
        const sortedOutput = [...output].sort((a, b) => a - b);
        assert.deepStrictEqual(sortedOutput, sortedInput, 'Output should be a permutation of the input');
    });

    await t.test('shuffles elements (statistical check)', () => {
        const input = Array.from({ length: 100 }, (_, i) => i);
        const output = shuffleArray(input);

        let matches = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] === output[i]) matches++;
        }

        // It's statistically very unlikely (1/100!) that a 100-element array stays exactly the same.
        assert.ok(matches < input.length, "Array was not shuffled at all");
    });

    await t.test('throws an error if input is null or undefined', () => {
        assert.throws(() => shuffleArray(null), { name: 'TypeError' });
        assert.throws(() => shuffleArray(undefined), { name: 'TypeError' });
    });
});
