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

    await t.test('automatically posts skipWaiting when registration.waiting is already present on portal', async () => {
        let skipWaitingCalled = false;
        const mockWorker = {
            postMessage: (msg) => {
                if (msg === 'skipWaiting') skipWaitingCalled = true;
            }
        };

        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
            runScripts: 'dangerously',
            url: 'http://localhost/index.html'
        });
        const window = dom.window;

        window.navigator.serviceWorker = {
            controller: { state: 'activated' },
            addEventListener: () => {},
            register: () => Promise.resolve({
                waiting: mockWorker,
                addEventListener: () => {},
                update: () => Promise.resolve()
            })
        };

        try {
            window.eval(pwaSrc);
            window.dispatchEvent(new window.Event('load'));
            // Wait microtask for register().then()
            await new Promise(r => setTimeout(r, 10));

            assert.strictEqual(skipWaitingCalled, true, 'skipWaiting should be sent immediately to waiting worker');
        } finally {
            dom.window.close();
        }
    });

    await t.test('automatically posts skipWaiting on portal when newWorker becomes installed', async () => {
        let skipWaitingCalled = false;
        let updatefoundCb = null;
        let statechangeCb = null;

        const mockInstallingWorker = {
            state: 'installing',
            addEventListener: (evt, cb) => {
                if (evt === 'statechange') statechangeCb = cb;
            },
            postMessage: (msg) => {
                if (msg === 'skipWaiting') skipWaitingCalled = true;
            }
        };

        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
            runScripts: 'dangerously',
            url: 'http://localhost/index.html'
        });
        const window = dom.window;

        window.navigator.serviceWorker = {
            controller: { state: 'activated' },
            addEventListener: () => {},
            register: () => Promise.resolve({
                waiting: null,
                installing: mockInstallingWorker,
                addEventListener: (evt, cb) => {
                    if (evt === 'updatefound') updatefoundCb = cb;
                },
                update: () => Promise.resolve()
            })
        };

        try {
            window.eval(pwaSrc);
            window.dispatchEvent(new window.Event('load'));
            await new Promise(r => setTimeout(r, 10));

            // Simulate updatefound and worker installation
            assert.ok(updatefoundCb, 'updatefound listener should be registered');
            updatefoundCb();

            mockInstallingWorker.state = 'installed';
            assert.ok(statechangeCb, 'statechange listener should be registered');
            statechangeCb();

            assert.strictEqual(skipWaitingCalled, true, 'skipWaiting should be sent to newly installed worker on portal');
        } finally {
            dom.window.close();
        }
    });

    await t.test('controllerchange triggers window.location.reload when controller existed', async () => {
        let reloadCalled = false;
        let controllerChangeCb = null;

        const { VirtualConsole } = require('jsdom');
        const virtualConsole = new VirtualConsole();
        virtualConsole.on('jsdomError', (err) => {
            if (err.message && err.message.includes('navigation to another Document')) {
                reloadCalled = true;
            }
        });

        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
            runScripts: 'dangerously',
            url: 'http://localhost/index.html',
            virtualConsole
        });
        const window = dom.window;

        window.navigator.serviceWorker = {
            controller: { state: 'activated' },
            addEventListener: (evt, cb) => {
                if (evt === 'controllerchange') controllerChangeCb = cb;
            },
            register: () => Promise.resolve({
                waiting: null,
                addEventListener: () => {},
                update: () => Promise.resolve()
            })
        };

        try {
            window.eval(pwaSrc);
            window.dispatchEvent(new window.Event('load'));
            await new Promise(r => setTimeout(r, 10));

            assert.ok(controllerChangeCb, 'controllerchange listener should be registered');
            controllerChangeCb();

            assert.strictEqual(reloadCalled, true, 'window.location.reload should be called on controller change');
        } finally {
            dom.window.close();
        }
    });
});
