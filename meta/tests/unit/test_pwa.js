/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const pwaSrc = fs.readFileSync('assets/js/pwa.js', 'utf-8');

function setupDOM(userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', rootHref = null) {
    const rootTag = rootHref ? `<link rel="root" href="${rootHref}">` : '';
    const html = `<!DOCTYPE html><html><head>${rootTag}</head><body></body></html>`;

    let registeredPath = null;
    let registerCalled = false;

    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/'
    });

    const window = dom.window;

    Object.defineProperty(window.navigator, 'userAgent', {
        value: userAgent,
        configurable: true
    });

    // Mock navigator.serviceWorker
    window.navigator.serviceWorker = {
        controller: null,
        addEventListener: () => {},
        register: (swPath) => {
            registerCalled = true;
            registeredPath = swPath;
            return Promise.resolve({
                addEventListener: () => {},
                update: () => {}
            });
        }
    };

    return {
        dom,
        window,
        evalPwa: () => window.eval(pwaSrc),
        getRegisteredPath: () => registeredPath,
        isRegisterCalled: () => registerCalled
    };
}

test('pwa.js - Service Worker Registration and Crawler Bypass', async (t) => {
    await t.test('registers service worker for normal browser user agent', () => {
        const { dom, window, evalPwa, getRegisteredPath, isRegisterCalled } = setupDOM();
        try {
            evalPwa();
            window.dispatchEvent(new window.Event('load'));

            assert.strictEqual(isRegisterCalled(), true, 'Service worker should be registered for normal browsers');
            assert.strictEqual(getRegisteredPath(), './sw.js', 'Default relative root should be ./sw.js');
        } finally {
            dom.window.close();
        }
    });

    await t.test('resolves relative path correctly with link rel="root"', () => {
        const { dom, window, evalPwa, getRegisteredPath, isRegisterCalled } = setupDOM(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            '../../'
        );
        try {
            evalPwa();
            window.dispatchEvent(new window.Event('load'));

            assert.strictEqual(isRegisterCalled(), true);
            assert.strictEqual(getRegisteredPath(), '../../sw.js', 'Should append sw.js to root href');
        } finally {
            dom.window.close();
        }
    });

    await t.test('bypasses service worker registration for search crawlers (Googlebot)', () => {
        const { dom, window, evalPwa, isRegisterCalled } = setupDOM(
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        );
        try {
            evalPwa();
            window.dispatchEvent(new window.Event('load'));

            assert.strictEqual(isRegisterCalled(), false, 'Googlebot should not register service worker');
        } finally {
            dom.window.close();
        }
    });

    await t.test('bypasses service worker registration for bingbot', () => {
        const { dom, window, evalPwa, isRegisterCalled } = setupDOM(
            'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
        );
        try {
            evalPwa();
            window.dispatchEvent(new window.Event('load'));

            assert.strictEqual(isRegisterCalled(), false, 'bingbot should not register service worker');
        } finally {
            dom.window.close();
        }
    });
});
