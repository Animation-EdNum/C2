const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupTimeTimerDOM() {
    const htmlPath = path.resolve(__dirname, '../../../webapps/teacher/time_timer.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/'
    });
    return dom.window;
}

test('time_timer.html - Rainbow customization, concentric disk & smiling cloud mascot', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupTimeTimerDOM();
    });

    t.afterEach(() => {
        if (window) {
            window.close();
        }
    });

    await t.test('DOM elements for rainbow theme and mascot exist', () => {
        const rainbowSwatch = window.document.querySelector('.rainbow-swatch');
        const rainbowGroup = window.document.getElementById('rainbowGroup');
        const rainbowCloud = window.document.getElementById('rainbowCloud');
        const timerDiskClipPath = window.document.getElementById('timerDiskClipPath');
        const checkRainbowCloud = window.document.getElementById('checkRainbowCloud');

        assert.ok(rainbowSwatch, '.rainbow-swatch button should exist in options panel');
        assert.ok(rainbowGroup, '#rainbowGroup should exist in SVG clock dial');
        assert.ok(rainbowCloud, '#rainbowCloud mascot should exist in SVG');
        assert.ok(timerDiskClipPath, '#timerDiskClipPath clipPath should exist');
        assert.ok(checkRainbowCloud, '#checkRainbowCloud checkbox should exist');
        assert.strictEqual(rainbowGroup.children.length, 6, '#rainbowGroup should have 6 concentric circles');
    });

    await t.test('clicking rainbow swatch activates rainbow mode, colorful dial and mascot', () => {
        const rainbowSwatch = window.document.querySelector('.rainbow-swatch');
        const rainbowGroup = window.document.getElementById('rainbowGroup');
        const rainbowCloud = window.document.getElementById('rainbowCloud');
        const timerDiskClipPath = window.document.getElementById('timerDiskClipPath');
        const dialNumbers = window.document.querySelectorAll('#dialNumbersGroup text');

        // Click the rainbow swatch
        rainbowSwatch.click();

        // 1. theme-rainbow class on body
        assert.ok(window.document.body.classList.contains('theme-rainbow'), 'body should have theme-rainbow class');

        // 2. Swatch is marked active
        assert.ok(rainbowSwatch.classList.contains('active'), 'rainbow-swatch should be active');

        // 3. Dial numbers have vibrant rainbow fills instead of default var(--clock-num)
        const updatedDialNumbers = window.document.querySelectorAll('#dialNumbersGroup text');
        const fills = Array.from(updatedDialNumbers).map(el => el.getAttribute('fill'));
        assert.ok(fills.some(f => f.startsWith('#')), 'dial numbers should have colored fills in rainbow mode');
        assert.strictEqual(updatedDialNumbers[0].getAttribute('fill'), '#ef4444', '0 minute mark should be red (#ef4444)');

        // 4. Concentric rainbow disk is visible and clipped
        assert.strictEqual(rainbowGroup.style.display, 'block', 'rainbowGroup should be displayed');
        assert.ok(timerDiskClipPath.getAttribute('d').includes('M 250 250'), 'timerDiskClipPath should contain wedge path');

        // 5. Cloud mascot is displayed and positioned along the edge
        assert.strictEqual(rainbowCloud.style.display, 'block', 'rainbowCloud should be displayed');
        const transform = rainbowCloud.getAttribute('transform');
        assert.ok(transform && transform.includes('translate('), 'rainbowCloud should have a valid transform attribute');
    });

    await t.test('toggling checkRainbowCloud hides and shows the cloud mascot', () => {
        const rainbowSwatch = window.document.querySelector('.rainbow-swatch');
        const rainbowCloud = window.document.getElementById('rainbowCloud');
        const checkRainbowCloud = window.document.getElementById('checkRainbowCloud');

        // Activate rainbow mode
        rainbowSwatch.click();
        assert.strictEqual(rainbowCloud.style.display, 'block', 'cloud should be visible initially');

        // Uncheck cloud mascot
        checkRainbowCloud.checked = false;
        checkRainbowCloud.dispatchEvent(new window.Event('change'));
        assert.strictEqual(rainbowCloud.style.display, 'none', 'cloud should be hidden when unchecked');

        // Re-check cloud mascot
        checkRainbowCloud.checked = true;
        checkRainbowCloud.dispatchEvent(new window.Event('change'));
        assert.strictEqual(rainbowCloud.style.display, 'block', 'cloud should be visible again when rechecked');
    });

    await t.test('switching back to standard color swatch disables rainbow mode and cloud mascot', () => {
        const rainbowSwatch = window.document.querySelector('.rainbow-swatch');
        const redSwatch = window.document.querySelector('.color-swatch[data-color="#ef4444"]');
        const rainbowGroup = window.document.getElementById('rainbowGroup');
        const rainbowCloud = window.document.getElementById('rainbowCloud');
        const timerDisk = window.document.getElementById('timerDisk');

        // Activate rainbow
        rainbowSwatch.click();
        assert.ok(window.document.body.classList.contains('theme-rainbow'));

        // Switch to red swatch
        redSwatch.click();
        assert.strictEqual(window.document.body.classList.contains('theme-rainbow'), false, 'theme-rainbow class should be removed');
        assert.strictEqual(rainbowGroup.style.display, 'none', 'rainbowGroup should be hidden');
        assert.strictEqual(rainbowCloud.style.display, 'none', 'rainbowCloud should be hidden');
        assert.ok(timerDisk.getAttribute('d').includes('M 250 250'), 'timerDisk should display standard solid wedge');

        // Numbers should revert to var(--clock-num)
        const dialNumbers = window.document.querySelectorAll('#dialNumbersGroup text');
        assert.strictEqual(dialNumbers[0].getAttribute('fill'), 'var(--clock-num)', 'dial numbers should revert to var(--clock-num)');
    });

    await t.test('preset buttons update the rainbow wedge and mascot position accordingly', () => {
        const rainbowSwatch = window.document.querySelector('.rainbow-swatch');
        const rainbowCloud = window.document.getElementById('rainbowCloud');
        rainbowSwatch.click();

        const chip20 = window.document.querySelector('.preset-chip[data-min="20"]');
        assert.ok(chip20, '20 min preset chip should exist');

        chip20.click();

        // Cloud should be rendered with updated coordinates
        assert.strictEqual(rainbowCloud.style.display, 'block');
        const transform = rainbowCloud.getAttribute('transform');
        assert.ok(transform.includes('translate('), 'Cloud should have updated transform at 20 min');
    });

    await t.test('1. Real-clock absolute timing recalculates remaining seconds without drift on time jump', () => {
        const engine = window.TimeTimerEngine;
        assert.ok(engine, 'TimeTimerEngine should be exported on window');

        // Configure timer to 10 minutes (600s)
        engine.setTimeMinutes(10, false);
        engine.startTimer(false);

        let state = engine.getState();
        assert.strictEqual(state.isRunning, true);
        assert.ok(state.targetEndTime > Date.now(), 'targetEndTime should be set in future');

        // Simulate a 120-second wall clock jump (e.g. background tab or lag)
        const originalNow = window.Date.now;
        try {
            window.Date.now = () => state.targetEndTime - (480 * 1000); // 480s remaining
            engine.tick();
            state = engine.getState();
            assert.strictEqual(state.remainingSeconds, 480, 'Remaining seconds must be exactly 480s (8 min) after time jump');
        } finally {
            window.Date.now = originalNow;
            engine.stopTimer();
        }
    });

    await t.test('2. Synchronous ending trigger at 00:00 without 1-second lag', () => {
        const engine = window.TimeTimerEngine;
        engine.setTimeMinutes(1, false);
        engine.startTimer(false);

        const celebration = window.document.getElementById('celebrationOverlay');
        assert.ok(celebration.classList.contains('hidden'), 'Celebration should be hidden initially');

        // Simulate reaching targetEndTime
        const state = engine.getState();
        const originalNow = window.Date.now;
        try {
            window.Date.now = () => state.targetEndTime + 10; // 0s remaining
            engine.tick();

            const finalState = engine.getState();
            assert.strictEqual(finalState.remainingSeconds, 0, 'Remaining seconds should be 0');
            assert.strictEqual(finalState.isRunning, false, 'Timer must stop synchronously on reaching 0');
            assert.ok(!celebration.classList.contains('hidden'), 'Celebration modal must be displayed immediately');
        } finally {
            window.Date.now = originalNow;
            engine.stopTimer();
        }
    });

    await t.test('3. Keyboard modifiers (Ctrl+R, Ctrl+F, Alt, Meta) do NOT trigger timer actions', () => {
        const engine = window.TimeTimerEngine;
        engine.setTimeMinutes(10, false);
        engine.adjustSeconds(120); // 12 min (720s)

        let state = engine.getState();
        assert.strictEqual(state.remainingSeconds, 720);

        // Press Ctrl+R (should NOT reset timer to 10 min)
        const ctrlREvent = new window.KeyboardEvent('keydown', { key: 'r', ctrlKey: true, bubbles: true });
        window.dispatchEvent(ctrlREvent);
        assert.strictEqual(engine.getState().remainingSeconds, 720, 'Ctrl+R must not trigger reset');

        // Press Ctrl+Space (should NOT toggle timer)
        const ctrlSpaceEvent = new window.KeyboardEvent('keydown', { code: 'Space', ctrlKey: true, bubbles: true });
        window.dispatchEvent(ctrlSpaceEvent);
        assert.strictEqual(engine.getState().isRunning, false, 'Ctrl+Space must not start timer');

        // Press plain 'r' (should reset timer to 10 min baseline)
        const plainREvent = new window.KeyboardEvent('keydown', { key: 'r', ctrlKey: false, metaKey: false, altKey: false, bubbles: true });
        window.dispatchEvent(plainREvent);
        assert.strictEqual(engine.getState().remainingSeconds, 600, 'Plain r should reset timer to base duration');
    });

    await t.test('4. Delta adjustments (+1 min, +5 min) do NOT alter the baseline reset duration', () => {
        const engine = window.TimeTimerEngine;
        engine.setTimeMinutes(5, false); // Base = 300s

        assert.strictEqual(engine.getState().remainingSeconds, 300);
        assert.strictEqual(engine.getState().baseTotalSeconds, 300);

        // Click +1 min button
        const btnAdd1 = window.document.getElementById('btnAdd1');
        btnAdd1.click();
        assert.strictEqual(engine.getState().remainingSeconds, 360, 'Remaining seconds should now be 360s (6 min)');

        // Click Reset
        const btnReset = window.document.getElementById('btnReset');
        btnReset.click();
        assert.strictEqual(engine.getState().remainingSeconds, 300, 'Reset must restore the initial 5 min (300s) baseline');
    });

    await t.test('5. Preset buttons (1, 2, 3, 60 min) reset to exact duration even if clicked while running', () => {
        const engine = window.TimeTimerEngine;
        const chip1 = window.document.querySelector('.preset-chip[data-min="1"]');
        const chip60 = window.document.querySelector('.preset-chip[data-min="60"]');

        assert.ok(chip1, '1 min preset chip should exist in DOM');
        assert.ok(chip60, '60 min preset chip should exist in DOM');

        // Start timer at 10 min
        engine.setTimeMinutes(10, false);
        engine.startTimer(false);
        assert.strictEqual(engine.getState().isRunning, true);

        // Click 1 min preset chip
        chip1.click();
        assert.strictEqual(engine.getState().totalSeconds, 60, 'totalSeconds should be exactly 60s');
        assert.strictEqual(engine.getState().remainingSeconds, 60, 'remainingSeconds should be exactly 60s without premature tick decrement');

        // Click 60 min preset chip
        chip60.click();
        assert.strictEqual(engine.getState().totalSeconds, 3600, 'totalSeconds should be exactly 3600s');
        assert.strictEqual(engine.getState().remainingSeconds, 3600, 'remainingSeconds should be exactly 3600s');
    });
});
