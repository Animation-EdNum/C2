const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const themeSrc = fs.readFileSync('assets/js/theme.js', 'utf-8');


function setupDOM(initialHtml = '', initialLocalStorage = {}) {
    const defaultHtml = `<!DOCTYPE html>
    <html>
    <body>
        <button id="theme-toggle-btn"></button>
        <svg id="icon-sun" style="display: none;"></svg>
        <svg id="icon-moon" style="display: none;"></svg>
        <span id="themeToggleText"></span>
        <button id="options-menu-btn"></button>
        <div class="settings-dropdown">
            <div class="settings-dropdown-content"></div>
        </div>
        <button id="reset-cache-btn"></button>
        ${initialHtml}
    </body>
    </html>`;

    const dom = new JSDOM(defaultHtml, { runScripts: "dangerously", url: "http://localhost/" });
    const window = dom.window;

    for (const key in initialLocalStorage) {
        window.localStorage.setItem(key, initialLocalStorage[key]);
    }

    // Mock confirm
    window.confirm = () => true;

    // Evaluate theme.js
    window.eval(themeSrc);

    return window;
}


test('theme.js - Initialization', async (t) => {
    await t.test('initializes with light theme if localStorage is empty', () => {
        const window = setupDOM();
        const document = window.document;

        assert.strictEqual(window.localStorage.getItem('global_theme'), 'light', 'Should save light to localStorage');
        assert.strictEqual(document.body.classList.contains('dark'), false, 'Should not have dark class');
        assert.strictEqual(document.body.classList.contains('high-contrast'), false, 'Should not have high-contrast class');

        const iconSun = document.getElementById('icon-sun');
        const iconMoon = document.getElementById('icon-moon');
        assert.strictEqual(iconSun.style.display, 'none', 'Sun icon should be hidden');
        assert.strictEqual(iconMoon.style.display, 'block', 'Moon icon should be visible');

        const themeToggleText = document.getElementById('themeToggleText');
        assert.strictEqual(themeToggleText.textContent, 'Sombre', 'Text should suggest toggling to Sombre');
    });

    await t.test('initializes with dark theme if localStorage has dark', () => {
        const window = setupDOM('', { global_theme: 'dark' });
        const document = window.document;

        assert.strictEqual(window.localStorage.getItem('global_theme'), 'dark', 'Should keep dark in localStorage');
        assert.strictEqual(document.body.classList.contains('dark'), true, 'Should have dark class');
        assert.strictEqual(document.body.classList.contains('high-contrast'), false, 'Should not have high-contrast class');

        const iconSun = document.getElementById('icon-sun');
        const iconMoon = document.getElementById('icon-moon');
        assert.strictEqual(iconSun.style.display, 'block', 'Sun icon should be visible');
        assert.strictEqual(iconMoon.style.display, 'none', 'Moon icon should be hidden');

        const themeToggleText = document.getElementById('themeToggleText');
        assert.strictEqual(themeToggleText.textContent, 'Clair', 'Text should suggest toggling to Clair');
    });

    await t.test('initializes with high-contrast theme if localStorage has high-contrast', () => {
        const window = setupDOM('', { global_theme: 'high-contrast' });
        const document = window.document;

        assert.strictEqual(window.localStorage.getItem('global_theme'), 'high-contrast', 'Should keep high-contrast in localStorage');
        assert.strictEqual(document.body.classList.contains('dark'), false, 'Should not have dark class');
        assert.strictEqual(document.body.classList.contains('high-contrast'), true, 'Should have high-contrast class');

        const iconSun = document.getElementById('icon-sun');
        const iconMoon = document.getElementById('icon-moon');
        assert.strictEqual(iconSun.style.display, 'none', 'Sun icon should be hidden');
        assert.strictEqual(iconMoon.style.display, 'none', 'Moon icon should be hidden');

        const themeToggleText = document.getElementById('themeToggleText');
        assert.strictEqual(themeToggleText.textContent, 'Sombre', 'Text should suggest toggling to Sombre');
    });
});

test('theme.js - toggleTheme and setTheme functionality', async (t) => {
    await t.test('toggles from light to dark', () => {
        const window = setupDOM('', { global_theme: 'light' });
        const document = window.document;

        window.toggleTheme();

        assert.strictEqual(window.localStorage.getItem('global_theme'), 'dark', 'Should save dark to localStorage');
        assert.strictEqual(document.body.classList.contains('dark'), true, 'Should add dark class');
        assert.strictEqual(document.body.classList.contains('high-contrast'), false, 'Should remove high-contrast class if present');

        const iconSun = document.getElementById('icon-sun');
        const iconMoon = document.getElementById('icon-moon');
        assert.strictEqual(iconSun.style.display, 'block', 'Sun icon should be visible');
        assert.strictEqual(iconMoon.style.display, 'none', 'Moon icon should be hidden');

        const themeToggleText = document.getElementById('themeToggleText');
        assert.strictEqual(themeToggleText.textContent, 'Clair', 'Text should suggest toggling to Clair');
    });

    await t.test('toggles from dark to light', () => {
        const window = setupDOM('', { global_theme: 'dark' });
        const document = window.document;

        window.toggleTheme();

        assert.strictEqual(window.localStorage.getItem('global_theme'), 'light', 'Should save light to localStorage');
        assert.strictEqual(document.body.classList.contains('dark'), false, 'Should remove dark class');
        assert.strictEqual(document.body.classList.contains('high-contrast'), false, 'Should remove high-contrast class');

        const iconSun = document.getElementById('icon-sun');
        const iconMoon = document.getElementById('icon-moon');
        assert.strictEqual(iconSun.style.display, 'none', 'Sun icon should be hidden');
        assert.strictEqual(iconMoon.style.display, 'block', 'Moon icon should be visible');

        const themeToggleText = document.getElementById('themeToggleText');
        assert.strictEqual(themeToggleText.textContent, 'Sombre', 'Text should suggest toggling to Sombre');
    });

    await t.test('toggles from high-contrast to light', () => {
        const window = setupDOM('', { global_theme: 'high-contrast' });
        const document = window.document;

        window.toggleTheme();

        assert.strictEqual(window.localStorage.getItem('global_theme'), 'light', 'Should save light to localStorage');
        assert.strictEqual(document.body.classList.contains('dark'), false, 'Should not have dark class');
        assert.strictEqual(document.body.classList.contains('high-contrast'), false, 'Should remove high-contrast class');

        const themeToggleText = document.getElementById('themeToggleText');
        assert.strictEqual(themeToggleText.textContent, 'Sombre', 'Text should suggest toggling to Sombre');
    });

    await t.test('calls window.__onThemeChange when defined', () => {
        const window = setupDOM('', { global_theme: 'light' });
        let calledTheme = null;
        window.__onThemeChange = (theme) => {
            calledTheme = theme;
        };

        window.toggleTheme();
        assert.strictEqual(calledTheme, 'dark', 'Should call __onThemeChange with dark theme');

        window.toggleTheme();
        assert.strictEqual(calledTheme, 'light', 'Should call __onThemeChange with light theme');
    });
});

test('theme.js - Event Listeners', async (t) => {
    await t.test('theme-toggle-btn toggles theme on click', () => {
        const window = setupDOM('', { global_theme: 'light' });
        const document = window.document;

        // Wait for DOMContentLoaded trigger
        document.dispatchEvent(new window.Event('DOMContentLoaded'));

        const btn = document.getElementById('theme-toggle-btn');
        btn.dispatchEvent(new window.MouseEvent('click'));

        assert.strictEqual(window.localStorage.getItem('global_theme'), 'dark', 'Click should toggle theme to dark');
    });

    await t.test('options-menu-btn toggles settings-dropdown-content show class on click', () => {
        const window = setupDOM();
        const document = window.document;

        document.dispatchEvent(new window.Event('DOMContentLoaded'));

        const btn = document.getElementById('options-menu-btn');
        const content = document.querySelector('.settings-dropdown-content');

        assert.strictEqual(content.classList.contains('show'), false, 'Should not have show class initially');

        btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

        assert.strictEqual(content.classList.contains('show'), true, 'Should have show class after click');
    });

    await t.test('clicking elsewhere removes show class from settings-dropdown-content', () => {
        const window = setupDOM();
        const document = window.document;

        document.dispatchEvent(new window.Event('DOMContentLoaded'));

        const btn = document.getElementById('options-menu-btn');
        const content = document.querySelector('.settings-dropdown-content');

        // Open dropdown
        btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
        assert.strictEqual(content.classList.contains('show'), true, 'Should have show class');

        // Click elsewhere
        document.body.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

        assert.strictEqual(content.classList.contains('show'), false, 'Should lose show class after clicking outside');
    });

    await t.test('reset-cache-btn clears storage on click', async () => {
        const window = setupDOM('', { global_theme: 'dark' });
        const document = window.document;

        document.dispatchEvent(new window.Event('DOMContentLoaded'));

        const btn = document.getElementById('reset-cache-btn');

        // We mocked window.confirm to return true, and window.location.reload to do nothing (it will throw in jsdom but we can ignore it or we just check before it reloads since there's a timeout)
        window.location = { reload: () => {} };

        window.sessionStorage.setItem('test', 'value');

        // Fire click event
        btn.dispatchEvent(new window.MouseEvent('click'));

        // Wait briefly for async functions in the click handler (even though the timeout is 100ms, the clearing is synchronous)
        await new Promise(r => setTimeout(r, 50));

        assert.strictEqual(window.localStorage.length, 0, 'localStorage should be empty');
        assert.strictEqual(window.sessionStorage.length, 0, 'sessionStorage should be empty');
    });
});
