const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const automateEngineSrc = fs.readFileSync('assets/js/automate/automate-engine.js', 'utf-8');

function setupDOM() {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: "dangerously" });
    const window = dom.window;

    // Evaluate automate-engine.js into the jsdom window environment
    window.eval(automateEngineSrc);

    // Override setTimeout to run callbacks synchronously for testing timer logic without actually waiting
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = (cb, delay) => {
        // Just record what was called, or execute it immediately for some tests,
        // but here we just pass it to original to let tests handle timing manually
        return originalSetTimeout(cb, delay);
    };

    return window;
}

test('handleSpeechBubbleClick', async (t) => {
    await t.test('updates skin unlock bubble state and DOM text', () => {
        const window = setupDOM();
        const document = window.document;

        // Add elements
        const wrapper = document.createElement('div');
        wrapper.classList.add('skin-speech-bubble-wrapper');
        const bubble = document.createElement('div');
        bubble.classList.add('skin-speech-bubble');
        const textDiv = document.createElement('div');
        textDiv.classList.add('skin-speech-bubble-text');
        bubble.appendChild(textDiv);
        wrapper.appendChild(bubble);
        document.body.appendChild(wrapper);

        // Initialize state
        window.skinUnlockBubbleState = { active: false, timer: null, text: '' };

        // Mock event object
        const mockEvent = {
            stopPropagation: () => {},
        };

        window.handleSpeechBubbleClick(mockEvent);

        assert.strictEqual(window.skinUnlockBubbleState.text, "Clique sur l'automate !");

        const textDivs = document.querySelectorAll('.skin-speech-bubble-text');
        assert.strictEqual(textDivs.length, 1);
        assert.strictEqual(textDivs[0].textContent, "Clique sur l'automate !");
    });

    await t.test('clears previous timer and sets a new one', async () => {
        const window = setupDOM();
        const document = window.document;

        // Add elements
        const wrapper = document.createElement('div');
        wrapper.classList.add('skin-speech-bubble-wrapper');
        const bubble = document.createElement('div');
        bubble.classList.add('skin-speech-bubble');
        const textDiv = document.createElement('div');
        textDiv.classList.add('skin-speech-bubble-text');
        bubble.appendChild(textDiv);
        wrapper.appendChild(bubble);
        document.body.appendChild(wrapper);

        let clearTimeoutCalled = false;
        let mockTimerId = 12345;

        // Mock clearTimeout
        const originalClearTimeout = window.clearTimeout;
        window.clearTimeout = (timer) => {
            if (timer === mockTimerId) clearTimeoutCalled = true;
            originalClearTimeout(timer);
        };

        // Override setTimeout to synchronous for faster test
        window.setTimeout = (cb) => { cb(); return 99999; };

        // Initialize state with an existing timer
        window.skinUnlockBubbleState = { active: true, timer: mockTimerId, text: 'old text' };

        // Mock event
        const mockEvent = { stopPropagation: () => {} };

        window.handleSpeechBubbleClick(mockEvent);

        assert.ok(clearTimeoutCalled, 'clearTimeout should be called for existing timer');
        assert.notStrictEqual(window.skinUnlockBubbleState.timer, mockTimerId, 'A new timer should be created');

        // Assert the state after the synchronous setTimeout callback execution
        assert.strictEqual(window.skinUnlockBubbleState.active, false, 'State should be inactive after timer');

        const wrappers = window.document.querySelectorAll('.skin-speech-bubble-wrapper, .skin-speech-bubble');
        assert.strictEqual(wrappers.length, 0, 'Bubbles should be removed after timer');
    });

    await t.test('calls stopPropagation on the event', () => {
        const window = setupDOM();
        let stopPropagationCalled = false;
        const mockEvent = {
            stopPropagation: () => { stopPropagationCalled = true; }
        };

        window.handleSpeechBubbleClick(mockEvent);

        assert.ok(stopPropagationCalled, 'stopPropagation should be called');
    });
});
