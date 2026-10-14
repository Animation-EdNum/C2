/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const i18nSrc = fs.readFileSync('assets/js/i18n.js', 'utf-8');
const deSrc = fs.readFileSync('assets/js/i18n/de.js', 'utf-8');

function setupI18nDOM(options = {}) {
    const {
        html = '<!DOCTYPE html><html><head></head><body></body></html>',
        url = 'http://localhost/',
        localStorage = {},
        navLang = 'fr'
    } = options;

    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url
    });
    const window = dom.window;

    // Set navigator language
    Object.defineProperty(window.navigator, 'language', {
        value: navLang,
        configurable: true
    });
    Object.defineProperty(window.navigator, 'languages', {
        value: [navLang],
        configurable: true
    });

    // Populate localStorage
    for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
            window.localStorage.setItem(key, localStorage[key]);
        }
    }

    // Evaluate i18n scripts
    window.eval(i18nSrc);
    window.eval(deSrc);

    return window;
}

test('i18n.js - Locale Detection', async (t) => {
    await t.test('defaults to fr when no param or storage exists', () => {
        const win = setupI18nDOM({ navLang: 'fr' });
        assert.strictEqual(win.I18N.locale, 'fr');
        assert.strictEqual(win.document.documentElement.lang, 'fr');
    });

    await t.test('detects ?lang=de from URL', () => {
        const win = setupI18nDOM({ url: 'http://localhost/?lang=de' });
        assert.strictEqual(win.I18N.locale, 'de');
        assert.strictEqual(win.document.documentElement.lang, 'de-CH');
        assert.strictEqual(win.localStorage.getItem('global_lang'), 'de');
    });

    await t.test('detects from localStorage when present', () => {
        const win = setupI18nDOM({ localStorage: { global_lang: 'de' } });
        assert.strictEqual(win.I18N.locale, 'de');
        assert.strictEqual(win.document.documentElement.lang, 'de-CH');
    });

    await t.test('detects German from navigator.language starting with de', () => {
        const win = setupI18nDOM({ navLang: 'de-CH' });
        assert.strictEqual(win.I18N.locale, 'de');
    });
});

test('i18n.js - Translation and Interpolation', async (t) => {
    await t.test('returns translation when locale is de', () => {
        const win = setupI18nDOM({ url: 'http://localhost/?lang=de' });
        const res = win.I18N.t('common.close', 'Fermer');
        assert.strictEqual(res, 'Schliessen');
    });

    await t.test('returns fallback in fr mode', () => {
        const win = setupI18nDOM({ url: 'http://localhost/?lang=fr' });
        const res = win.I18N.t('common.close', 'Fermer');
        assert.strictEqual(res, 'Fermer');
    });

    await t.test('interpolates {param} correctly', () => {
        const win = setupI18nDOM({ url: 'http://localhost/?lang=de' });
        const res = win.I18N.t('scores.streak', 'Série de {count}!', { count: 4 });
        assert.strictEqual(res, 'Serie von 4!');
    });

    await t.test('formats dates with de-CH and fr-CH conventions', () => {
        const winDe = setupI18nDOM({ url: 'http://localhost/?lang=de' });
        const date = new Date(2026, 9, 13); // 13 Oct 2026
        const formattedDe = winDe.I18N.formatDate(date);
        assert.ok(formattedDe.includes('13') && formattedDe.includes('10') && formattedDe.includes('2026'));

        const winFr = setupI18nDOM({ url: 'http://localhost/?lang=fr' });
        const formattedFr = winFr.I18N.formatDate(date);
        assert.ok(formattedFr.includes('13') && formattedFr.includes('10') && formattedFr.includes('2026'));
    });
});

test('i18n.js - DOM Application', async (t) => {
    await t.test('translates data-i18n textContent and data-i18n-attr attributes', () => {
        const sampleHtml = `<!DOCTYPE html>
        <html>
        <head></head>
        <body>
            <button id="btn" data-i18n="common.close" data-i18n-attr="title:common.close;aria-label:common.close">Fermer</button>
            <input id="search" data-i18n-attr="placeholder:portal.search_placeholder" placeholder="Rechercher…">
        </body>
        </html>`;

        const win = setupI18nDOM({ html: sampleHtml, url: 'http://localhost/?lang=de' });
        const doc = win.document;
        win.I18N.apply(doc);

        const btn = doc.getElementById('btn');
        assert.strictEqual(btn.textContent, 'Schliessen');
        assert.strictEqual(btn.getAttribute('title'), 'Schliessen');
        assert.strictEqual(btn.getAttribute('aria-label'), 'Schliessen');

        const input = doc.getElementById('search');
        assert.strictEqual(input.getAttribute('placeholder'), 'App, Thema oder Stichwort suchen…');
    });

    await t.test('translates data-i18n-html safely with allowed inline tags without raw innerHTML assignment', () => {
        const sampleHtml = `<!DOCTYPE html>
        <html>
        <head></head>
        <body>
            <p id="c1-banner" data-i18n-html="portal_c1.pedagogy_text">
                Texte initial <strong>important</strong> et <em>italique</em>.
            </p>
        </body>
        </html>`;

        const win = setupI18nDOM({ html: sampleHtml, url: 'http://localhost/?lang=de' });
        const doc = win.document;
        win.I18N.apply(doc);

        const banner = doc.getElementById('c1-banner');
        assert.ok(banner.querySelector('strong'), 'Should contain sanitized <strong> element');
        assert.ok(banner.querySelector('em'), 'Should contain sanitized <em> element');
        assert.strictEqual(banner.querySelector('strong').textContent, 'ausschliesslich ungestöpselt (ohne Bildschirme)');
        assert.strictEqual(banner.querySelector('em').textContent, 'Sortiermaschine');
    });

    await t.test('setSanitizedHtml neutralizes XSS vectors while preserving safe content', () => {
        const win = setupI18nDOM();
        const doc = win.document;
        const target = doc.createElement('div');

        // Test with XSS payloads: script tag, onclick, javascript: href, img onerror
        const maliciousHtml = 'Bonjour <strong>monde</strong>! ' +
            '<a href="javascript:alert(\'xss\')" onclick="alert(1)"><span onclick="alert(2)">Lien</span></a>' +
            '<script>alert("xss")</script><img src="x" onerror="alert(3)">';

        win.I18N.setSanitizedHtml(target, maliciousHtml);

        assert.strictEqual(target.querySelectorAll('script').length, 0, 'No script tags allowed');
        assert.strictEqual(target.querySelectorAll('img').length, 0, 'No img tags allowed');
        assert.strictEqual(target.querySelector('strong').textContent, 'monde', 'Safe strong tag preserved');

        const link = target.querySelector('a');
        assert.ok(link, 'Link tag preserved');
        assert.strictEqual(link.hasAttribute('href'), false, 'javascript: href stripped');
        assert.strictEqual(link.hasAttribute('onclick'), false, 'onclick attribute stripped');
    });
});

test('i18n.js - Dictionary completeness audit', () => {
    // Audit that de.js contains required keys and does not contain German ß
    const deDictContent = fs.readFileSync('assets/js/i18n/de.js', 'utf8');
    assert.strictEqual(deDictContent.includes('ß'), false, 'de.js must use "ss" instead of "ß" (Swiss Standard German de-CH)');

    // Ensure all critical namespace keys exist in dictionary
    const requiredKeys = [
        'common.skip_link',
        'common.back_home',
        'common.options',
        'common.close',
        'theme.light',
        'theme.dark',
        'theme.high_contrast',
        'theme.reset_confirm',
        'common.footer.free_code',
        'common.footer.legal',
        'common.footer.privacy',
        'common.footer.terms',
        'common.footer.credits',
        'scores.modal_title',
        'scores.reset_btn',
        'scores.export_btn',
        'modal_export.export_btn',
        'url_params.share_title',
        'portal.title',
        'binaire_codage.title'
    ];

    for (const key of requiredKeys) {
        assert.ok(deDictContent.includes(`'${key}':`), `Key ${key} must exist in de.js`);
    }
});
