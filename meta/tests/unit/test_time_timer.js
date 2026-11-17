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

    await t.test('DOM elements for rainbow theme and mascot exist and removed options are absent', () => {
        const rainbowSwatch = window.document.querySelector('.rainbow-swatch');
        const rainbowGroup = window.document.getElementById('rainbowGroup');
        const rainbowCloud = window.document.getElementById('rainbowCloud');
        const timerDiskClipPath = window.document.getElementById('timerDiskClipPath');
        const checkRainbowCloud = window.document.getElementById('checkRainbowCloud');
        const checkTicking = window.document.getElementById('checkTicking');

        assert.ok(rainbowSwatch, '.rainbow-swatch button should exist in options panel');
        assert.ok(rainbowGroup, '#rainbowGroup should exist in SVG clock dial');
        assert.ok(rainbowCloud, '#rainbowCloud mascot should exist in SVG');
        assert.ok(timerDiskClipPath, '#timerDiskClipPath clipPath should exist');
        assert.strictEqual(checkRainbowCloud, null, '#checkRainbowCloud option must be removed from options');
        assert.strictEqual(checkTicking, null, '#checkTicking option must be removed from options');
        assert.strictEqual(rainbowGroup.children.length, 6, '#rainbowGroup should have 6 concentric circles');
    });

    await t.test('clicking rainbow swatch activates rainbow mode, colorful dial and mascot automatically', () => {
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

        // 5. Cloud mascot is automatically displayed and positioned along the edge without checkbox
        assert.strictEqual(rainbowCloud.style.display, 'block', 'rainbowCloud should be automatically displayed in rainbow mode');
        const transform = rainbowCloud.getAttribute('transform');
        assert.ok(transform && transform.includes('translate('), 'rainbowCloud should have a valid transform attribute');
    });

    await t.test('cloud mascot is always present in rainbow mode across minute adjustments', () => {
        const rainbowSwatch = window.document.querySelector('.rainbow-swatch');
        const rainbowCloud = window.document.getElementById('rainbowCloud');

        // Activate rainbow mode
        rainbowSwatch.click();
        assert.strictEqual(rainbowCloud.style.display, 'block', 'cloud should be visible initially in rainbow mode');

        // Adjust minutes
        const engine = window.TimeTimerEngine;
        engine.setTimeMinutes(25, false);
        assert.strictEqual(rainbowCloud.style.display, 'block', 'cloud should remain visible after changing time');
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

    await t.test('6. Celebration modal auto-closes after 60 seconds (1 minute)', (t) => {
        const engine = window.TimeTimerEngine;
        const celebration = window.document.getElementById('celebrationOverlay');

        engine.showCelebration();
        assert.strictEqual(celebration.classList.contains('hidden'), false, 'Celebration overlay should be open');

        // Advance fake clock or trigger setTimeout
        return new Promise((resolve) => {
            const originalSetTimeout = window.setTimeout;
            let capturedCallback = null;
            let capturedDelay = null;

            window.setTimeout = (cb, delay) => {
                capturedCallback = cb;
                capturedDelay = delay;
                return 999;
            };

            try {
                engine.showCelebration();
                assert.strictEqual(capturedDelay, 60000, 'Auto-close timeout should be set to exactly 60000ms (1 min)');
                assert.ok(typeof capturedCallback === 'function', 'A callback should be registered');

                // Execute the callback
                capturedCallback();
                assert.strictEqual(celebration.classList.contains('hidden'), true, 'Celebration overlay must be hidden after 1 min');
                resolve();
            } finally {
                window.setTimeout = originalSetTimeout;
            }
        });
    });

    await t.test('7. Compensation timer (MCD / Tiers-temps) DOM elements exist', () => {
        const compensationDisk = window.document.getElementById('compensationDisk');
        const compensationDisplay = window.document.getElementById('compensationDisplay');
        const compensationDigits = window.document.getElementById('compensationDigits');
        const compensationBarFill = window.document.getElementById('compensationBarFill');
        const checkCompensation = window.document.getElementById('checkCompensation');
        const compensationModeSelect = window.document.getElementById('compensationModeSelect');
        const compensationRatioSelect = window.document.getElementById('compensationRatioSelect');
        const compensationFixedMinutesInput = window.document.getElementById('compensationFixedMinutesInput');
        const compensationPreviewText = window.document.getElementById('compensationPreviewText');

        assert.ok(compensationDisk, '#compensationDisk path should exist in SVG clock dial');
        assert.ok(compensationDisplay, '#compensationDisplay should exist in DOM');
        assert.ok(compensationDigits, '#compensationDigits should exist');
        assert.ok(compensationBarFill, '#compensationBarFill should exist');
        assert.ok(checkCompensation, '#checkCompensation checkbox should exist');
        assert.ok(compensationModeSelect, '#compensationModeSelect should exist');
        assert.ok(compensationRatioSelect, '#compensationRatioSelect should exist');
        assert.ok(compensationFixedMinutesInput, '#compensationFixedMinutesInput should exist');
        assert.ok(compensationPreviewText, '#compensationPreviewText should exist');
    });

    await t.test('8. Exact calculations for compensation timer (both ratio and fixed modes)', () => {
        const engine = window.TimeTimerEngine;

        // Enabled with ratio +1/3 (default tiers-temps)
        engine.setCompensation(true, 'ratio', 1 / 3, 5);

        // 10 min -> 600s + 200s = 800s (13 min 20 s)
        assert.strictEqual(engine.getCompensationSeconds(600), 800);

        // 15 min -> 900s + 300s = 1200s (20 min 00 s)
        assert.strictEqual(engine.getCompensationSeconds(900), 1200);

        // 30 min -> 1800s + 600s = 2400s (40 min 00 s)
        assert.strictEqual(engine.getCompensationSeconds(1800), 2400);

        // 45 min -> 2700s + 900s = 3600s (60 min 00 s)
        assert.strictEqual(engine.getCompensationSeconds(2700), 3600);

        // 60 min -> 3600s + 1200s = 4800s (80 min 00 s)
        assert.strictEqual(engine.getCompensationSeconds(3600), 4800);

        // 1 min -> 60s + 20s = 80s (1 min 20 s)
        assert.strictEqual(engine.getCompensationSeconds(60), 80);

        // 2 min -> 120s + 40s = 160s (2 min 40 s)
        assert.strictEqual(engine.getCompensationSeconds(120), 160);

        // 5 min -> 300s + 100s = 400s (6 min 40 s)
        assert.strictEqual(engine.getCompensationSeconds(300), 400);

        // Ratio +1/4 (+25%)
        engine.setCompensation(true, 'ratio', 0.25, 5);
        assert.strictEqual(engine.getCompensationSeconds(600), 750); // 10 min -> 12 min 30 s

        // Ratio +1/2 (+50%)
        engine.setCompensation(true, 'ratio', 0.5, 5);
        assert.strictEqual(engine.getCompensationSeconds(600), 900); // 10 min -> 15 min 00 s

        // Ratio +100% (double)
        engine.setCompensation(true, 'ratio', 1.0, 5);
        assert.strictEqual(engine.getCompensationSeconds(600), 1200); // 10 min -> 20 min 00 s

        // Fixed mode +5 min
        engine.setCompensation(true, 'fixed', 1 / 3, 5);
        assert.strictEqual(engine.getCompensationSeconds(600), 900); // 600s + 300s = 900s
        assert.strictEqual(engine.getCompensationSeconds(1200), 1500); // 20 min + 5 min = 25 min

        // Disabled compensation returns original duration
        engine.setCompensation(false, 'ratio', 1 / 3, 5);
        assert.strictEqual(engine.getCompensationSeconds(600), 600);
    });

    await t.test('9. Toggling checkCompensation displays UI panel and SVG compensation disk', () => {
        const checkCompensation = window.document.getElementById('checkCompensation');
        const compensationDisplay = window.document.getElementById('compensationDisplay');
        const compensationDisk = window.document.getElementById('compensationDisk');

        // Initially disabled
        assert.strictEqual(compensationDisplay.style.display, 'none');
        assert.strictEqual(compensationDisk.style.display, 'none');

        // Check the box
        checkCompensation.checked = true;
        checkCompensation.dispatchEvent(new window.Event('change'));

        assert.strictEqual(compensationDisplay.style.display, 'block', 'compensationDisplay should be visible');
        assert.strictEqual(compensationDisk.style.display, 'block', 'compensationDisk SVG wedge should be visible');
        assert.ok(compensationDisk.getAttribute('d').includes('M 250 250'), 'compensationDisk should have valid SVG arc path');

        // Digits reflect 10 min + 1/3 = 13:20
        const compensationDigits = window.document.getElementById('compensationDigits');
        assert.strictEqual(compensationDigits.textContent, '13:20');

        // Uncheck the box
        checkCompensation.checked = false;
        checkCompensation.dispatchEvent(new window.Event('change'));

        assert.strictEqual(compensationDisplay.style.display, 'none', 'compensationDisplay should be hidden');
        assert.strictEqual(compensationDisk.style.display, 'none', 'compensationDisk should be hidden');
    });

    await t.test('10. Compensation timer continues running when main timer reaches 0', () => {
        const engine = window.TimeTimerEngine;
        engine.setTimeMinutes(1, false); // 1 min (60s)
        engine.setCompensation(true, 'ratio', 1 / 3, 5); // +20s = 80s

        let state = engine.getState();
        assert.strictEqual(state.remainingSeconds, 60);
        assert.strictEqual(state.compensationRemainingSeconds, 80);

        engine.startTimer(false);
        state = engine.getState();
        assert.strictEqual(state.isRunning, true);

        // Advance wall clock past the main 60s, to 70s elapsed (10s left on compensation)
        const originalNow = window.Date.now;
        try {
            window.Date.now = () => state.compensationTargetEndTime - (10 * 1000);
            engine.tick();

            const intermediateState = engine.getState();
            assert.strictEqual(intermediateState.remainingSeconds, 0, 'Main timer must be at 0');
            assert.strictEqual(intermediateState.compensationRemainingSeconds, 10, 'Compensation timer must have 10s remaining');
            assert.strictEqual(intermediateState.isRunning, true, 'Timer must still be running for compensation');

            const compensationStatusLabel = window.document.getElementById('compensationStatusLabel');
            assert.strictEqual(compensationStatusLabel.textContent, 'Tiers-temps en cours');

            // Advance wall clock past the compensation duration (85s elapsed)
            window.Date.now = () => state.compensationTargetEndTime + 5000;
            engine.tick();

            const finalState = engine.getState();
            assert.strictEqual(finalState.remainingSeconds, 0);
            assert.strictEqual(finalState.compensationRemainingSeconds, 0);
            assert.strictEqual(finalState.isRunning, false, 'Timer stops completely once compensation has finished');
            assert.strictEqual(compensationStatusLabel.textContent, 'Tiers-temps terminé');
        } finally {
            window.Date.now = originalNow;
            engine.stopTimer();
        }
    });
});
