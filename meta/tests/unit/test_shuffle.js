const test = require('node:test');
const assert = require('node:assert');

/**
 * Isolated copy of shuffleArray from assets/js/automate/automate-skins.js
 * This function is kept here to allow standalone unit testing in Node.js
 * without environmental side-effects from the browser-based source file.
 */
function shuffleArray(array) {
    let newArr = [...array];
    let currentIndex = newArr.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArr[currentIndex], newArr[randomIndex]] = [newArr[randomIndex], newArr[currentIndex]];
    }
    return newArr;
}

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
        assert.throws(() => shuffleArray(null), TypeError);
        assert.throws(() => shuffleArray(undefined), TypeError);
    });
});
