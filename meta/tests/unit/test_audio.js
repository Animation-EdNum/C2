const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

// Load audio.js source code
const audioSrc = fs.readFileSync('assets/js/audio.js', 'utf-8');

function setupDOM(storage = {}) {
    // Basic HTML matching what audio.js expects in the DOM
    const html = `
        <button id="audio-toggle-btn"></button>
        <span id="icon-vol-on"></span>
        <span id="icon-vol-off"></span>
        <span id="audioToggleText"></span>
    `;

    const dom = new JSDOM(`<!DOCTYPE html><html><body>${html}</body></html>`, {
        runScripts: "dangerously",
        url: "http://localhost/"
    });
    const window = dom.window;

    // Use JSdom's native localStorage by ensuring it has a URL
    window.localStorage.clear();
    for (const key in storage) {
        window.localStorage.setItem(key, storage[key]);
    }

    // Set globals for test isolation before script runs
    window.isMuted = undefined;
    window.audioCtx = undefined;

    // Evaluate audio.js directly
    // Then expose getters/setters via inline script
    const scriptEl = window.document.createElement('script');
    scriptEl.textContent = audioSrc + `
        window.getIsMuted = () => isMuted;
        window.getAudioCtx = () => audioCtx;
        window.playSound = playSound;
        window.updateAudioUI = updateAudioUI;
        window.toggleAudio = toggleAudio;
    `;
    window.document.body.appendChild(scriptEl);

    return window;
}

test('audio.js - Initialization', async (t) => {
    await t.test('initializes with muted state if localStorage is empty', () => {
        const window = setupDOM();
        assert.strictEqual(window.getIsMuted(), true, 'isMuted should be true if localStorage is empty');
    });

    await t.test('initializes with unmuted state if localStorage has c2_audio_muted = "false"', () => {
        const window = setupDOM({ c2_audio_muted: 'false' });
        assert.strictEqual(window.getIsMuted(), false, 'isMuted should be false if localStorage has "false"');
    });

    await t.test('initializes with muted state if localStorage has c2_audio_muted = "true"', () => {
        const window = setupDOM({ c2_audio_muted: 'true' });
        assert.strictEqual(window.getIsMuted(), true, 'isMuted should be true if localStorage has "true"');
    });
});

test('audio.js - updateAudioUI', async (t) => {
    await t.test('updates UI correctly when muted', () => {
        const window = setupDOM({ c2_audio_muted: 'true' });
        const document = window.document;

        window.updateAudioUI();

        const iconOn = document.getElementById('icon-vol-on');
        const iconOff = document.getElementById('icon-vol-off');
        const audioText = document.getElementById('audioToggleText');

        assert.strictEqual(iconOn.style.display, 'block', 'icon-vol-on should be visible when muted (to suggest enabling)');
        assert.strictEqual(iconOff.style.display, 'none', 'icon-vol-off should be hidden when muted');
        assert.strictEqual(audioText.textContent, 'Activer son', 'Text should be Activer son when muted');
    });

    await t.test('updates UI correctly when unmuted', () => {
        const window = setupDOM({ c2_audio_muted: 'false' });
        const document = window.document;

        window.updateAudioUI();

        const iconOn = document.getElementById('icon-vol-on');
        const iconOff = document.getElementById('icon-vol-off');
        const audioText = document.getElementById('audioToggleText');

        assert.strictEqual(iconOn.style.display, 'none', 'icon-vol-on should be hidden when unmuted');
        assert.strictEqual(iconOff.style.display, 'block', 'icon-vol-off should be visible when unmuted (to suggest disabling)');
        assert.strictEqual(audioText.textContent, 'Couper son', 'Text should be Couper son when unmuted');
    });
});

test('audio.js - toggleAudio', async (t) => {
    await t.test('toggles from muted to unmuted', () => {
        const window = setupDOM({ c2_audio_muted: 'true' });
        const document = window.document;

        window.toggleAudio();

        assert.strictEqual(window.getIsMuted(), false, 'isMuted should become false');
        assert.strictEqual(window.localStorage.getItem('c2_audio_muted'), 'false', 'localStorage should be updated to false');

        const audioText = document.getElementById('audioToggleText');
        assert.strictEqual(audioText.textContent, 'Couper son', 'UI should be updated to reflect unmuted state');
    });

    await t.test('toggles from unmuted to muted', () => {
        const window = setupDOM({ c2_audio_muted: 'false' });
        const document = window.document;

        window.toggleAudio();

        assert.strictEqual(window.getIsMuted(), true, 'isMuted should become true');
        assert.strictEqual(window.localStorage.getItem('c2_audio_muted'), 'true', 'localStorage should be updated to true');

        const audioText = document.getElementById('audioToggleText');
        assert.strictEqual(audioText.textContent, 'Activer son', 'UI should be updated to reflect muted state');
    });
});

test('audio.js - Event Listeners', async (t) => {
    await t.test('audio-toggle-btn toggles audio on click', () => {
        const window = setupDOM({ c2_audio_muted: 'true' });
        const document = window.document;

        document.dispatchEvent(new window.Event('DOMContentLoaded'));

        const btn = document.getElementById('audio-toggle-btn');
        btn.dispatchEvent(new window.MouseEvent('click'));

        assert.strictEqual(window.getIsMuted(), false, 'isMuted should become false after click');
        assert.strictEqual(window.localStorage.getItem('c2_audio_muted'), 'false', 'localStorage should be updated after click');
    });
});

test('audio.js - playSound', async (t) => {
    await t.test('exits early if isMuted is true', () => {
        const window = setupDOM({ c2_audio_muted: 'true' });

        let audioContextCreated = false;
        window.AudioContext = class {
            constructor() { audioContextCreated = true; }
        };

        window.playSound('click');

        assert.strictEqual(audioContextCreated, false, 'AudioContext should not be created if muted');
    });

    await t.test('initializes AudioContext if not muted and context is null', () => {
        const window = setupDOM({ c2_audio_muted: 'false' });

        let audioContextCreated = false;
        let resumed = false;

        window.AudioContext = class {
            constructor() {
                audioContextCreated = true;
                this.state = 'suspended';
                this.currentTime = 0;
                this.destination = {};
            }
            resume() { resumed = true; }
            createOscillator() {
                return {
                    connect: () => {},
                    frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
                    start: () => {},
                    stop: () => {}
                };
            }
            createGain() {
                return {
                    connect: () => {},
                    gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }
                };
            }
        };

        window.playSound('click');

        assert.strictEqual(audioContextCreated, true, 'AudioContext should be created if unmuted');
        assert.strictEqual(resumed, true, 'AudioContext should be resumed if suspended');
        assert.ok(window.getAudioCtx(), 'audioCtx should be globally set');
    });
});
