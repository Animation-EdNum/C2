const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

// Load confetti.js source code
const confettiSrc = fs.readFileSync('assets/js/confetti.js', 'utf-8');

function setupDOM() {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: "dangerously" });
    const window = dom.window;

    // Evaluate confetti.js into the jsdom window environment
    window.eval(confettiSrc);

    // Override setTimeout to run callbacks immediately and synchronously
    window.setTimeout = (cb) => {
        cb();
    };

    return window;
}

test('handleStreakCelebration', async (t) => {

    await t.test('Case 1: Mega-party (streak = 10, wasNewRecord = true)', () => {
        const window = setupDOM();

        let confettiCalls = 0;
        let fireCalls = 0;

        window.launchConfetti = () => { confettiCalls++; };
        window.launchFire = () => { fireCalls++; };

        window.handleStreakCelebration(10, false, true);

        assert.strictEqual(confettiCalls, 3, 'Should call launchConfetti 3 times');
        assert.strictEqual(fireCalls, 2, 'Should call launchFire 2 times');
    });

    await t.test('Case 2: Serious record (streak = 6, wasNewRecord = true)', () => {
        const window = setupDOM();

        let confettiCalls = 0;
        let fireCalls = 0;

        window.launchConfetti = () => { confettiCalls++; };
        window.launchFire = () => { fireCalls++; };

        window.handleStreakCelebration(6, false, true);

        assert.strictEqual(confettiCalls, 2, 'Should call launchConfetti 2 times');
        assert.strictEqual(fireCalls, 1, 'Should call launchFire 1 time');
    });

    await t.test('Case 3: Extreme mode (streak = 2, isExtreme = true)', () => {
        const window = setupDOM();

        let confettiCalls = 0;
        let fireCalls = 0;

        window.launchConfetti = () => { confettiCalls++; };
        window.launchFire = () => { fireCalls++; };

        window.handleStreakCelebration(2, true, false);

        assert.strictEqual(confettiCalls, 1, 'Should call launchConfetti 1 time');
        assert.strictEqual(fireCalls, 1, 'Should call launchFire 1 time');
    });

    await t.test('Case 4: Streak of 3 (streak = 3)', () => {
        const window = setupDOM();

        let confettiCalls = 0;
        let fireCalls = 0;

        window.launchConfetti = () => { confettiCalls++; };
        window.launchFire = () => { fireCalls++; };

        window.handleStreakCelebration(3, false, false);

        assert.strictEqual(confettiCalls, 1, 'Should call launchConfetti 1 time');
        assert.strictEqual(fireCalls, 1, 'Should call launchFire 1 time');
    });

    await t.test('Case 5: Default (streak = 1)', () => {
        const window = setupDOM();

        let confettiCalls = 0;
        let fireCalls = 0;

        window.launchConfetti = () => { confettiCalls++; };
        window.launchFire = () => { fireCalls++; };

        window.handleStreakCelebration(1, false, false);

        assert.strictEqual(confettiCalls, 1, 'Should call launchConfetti 1 time');
        assert.strictEqual(fireCalls, 0, 'Should call launchFire 0 times');
    });

});
