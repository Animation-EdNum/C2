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

    await t.test('translates simulateur_automate toasts correctly in fr and de', () => {
        const winFr = setupI18nDOM({ url: 'http://localhost/?lang=fr' });
        assert.strictEqual(winFr.I18N.t('simulateur_automate.toast_finished', 'Exécution terminée !'), 'Exécution terminée !');
        assert.strictEqual(winFr.I18N.t('simulateur_automate.toast_finished'), 'Exécution terminée !');
        assert.strictEqual(winFr.I18N.getLang(), 'fr');

        const winDe = setupI18nDOM({ url: 'http://localhost/?lang=de' });
        assert.strictEqual(winDe.I18N.t('simulateur_automate.toast_finished', 'Exécution terminée !'), 'Ausführung beendet!');
        assert.strictEqual(winDe.I18N.t('simulateur_automate.toast_finished'), 'Ausführung beendet!');
        assert.strictEqual(winDe.I18N.getLang(), 'de');
    });

    await t.test('translates machine_a_trier and jeu_de_la_grue toasts correctly in fr and de without raw key leaks', () => {
        const winFr = setupI18nDOM({ url: 'http://localhost/?lang=fr' });
        assert.strictEqual(winFr.I18N.t('machine_a_trier.toast_correct', 'Bravo !'), 'Bravo !');
        assert.strictEqual(winFr.I18N.t('machine_a_trier.toast_correct'), 'Bravo !');
        assert.strictEqual(winFr.I18N.t('jeu_de_la_grue.toast_success', 'Bien joué ! Défi réussi.'), 'Bien joué ! Défi réussi.');
        assert.strictEqual(winFr.I18N.t('jeu_de_la_grue.toast_left_wall'), 'Mur à gauche !');

        const winDe = setupI18nDOM({ url: 'http://localhost/?lang=de' });
        assert.strictEqual(winDe.I18N.t('machine_a_trier.toast_correct', 'Bravo !'), 'Bravo! Richtig einsortiert!');
        assert.strictEqual(winDe.I18N.t('machine_a_trier.toast_correct'), 'Bravo! Richtig einsortiert!');
        assert.strictEqual(winDe.I18N.t('jeu_de_la_grue.toast_success', 'Bien joué ! Défi réussi.'), 'Gut gemacht! Ziel erreicht!');
        assert.strictEqual(winDe.I18N.t('jeu_de_la_grue.toast_left_wall'), 'Mauer links!');
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

    await t.test('translates legal pages correctly in de mode', () => {
        const merciHtml = fs.readFileSync('merci.html', 'utf8');
        const win = setupI18nDOM({ html: merciHtml, url: 'http://localhost/?lang=de' });
        const doc = win.document;
        win.I18N.apply(doc);

        const title = doc.querySelector('h1[data-i18n="merci.title"]');
        assert.ok(title, 'Title element found');
        assert.strictEqual(title.textContent, 'Danksagung');

        const heroH2 = doc.querySelector('h2[data-i18n="merci.hero_title"]');
        assert.strictEqual(heroH2.textContent, 'Die Wand der Heldinnen und Helden');
    });

    await t.test('translates routage_reseau, generateur_mot_de_passe and all 6 teacher apps in ?lang=de DOM', () => {
        const cases = [
            {
                file: 'webapps/routage_reseau.html',
                checks: [
                    ['span[data-i18n="routage_reseau.title"]', 'Netzwerk-Routing'],
                    ['#diff-medium', 'Mittel']
                ]
            },
            {
                file: 'webapps/generateur_mot_de_passe.html',
                checks: [
                    ['span[data-i18n="generateur_mot_de_passe.title"]', 'Passwort-Generator'],
                    ['#crit-length span[data-i18n="generateur_mot_de_passe.rule_length"]', 'Mindestens 12 Zeichen']
                ]
            },
            {
                file: 'webapps/teacher/bareme.html',
                checks: [
                    ['h1[data-i18n="bareme.title"]', 'Notenskala-Generator'],
                    ['label[for="totalPoints"]', 'Maximale Punktzahl']
                ]
            },
            {
                file: 'webapps/teacher/qrcode.html',
                checks: [
                    ['h1[data-i18n="qrcode.title"]', 'QR-Code-Ersteller'],
                    ['button[data-type="wifi"]', 'WLAN']
                ]
            },
            {
                file: 'webapps/teacher/tirage.html',
                checks: [
                    ['h1[data-i18n="tirage.title"]', 'Zufallsauslosung'],
                    ['button[data-mode="names"]', 'Namen']
                ]
            },
            {
                file: 'webapps/teacher/roue_de_la_chance.html',
                checks: [
                    ['h1[data-i18n="roue_de_la_chance.title"]', 'Glücksrad'],
                    ['button[data-preset="oui_non"]', 'Ja / Nein']
                ]
            },
            {
                file: 'webapps/teacher/time_timer.html',
                checks: [
                    ['h1[data-i18n="time_timer.title"]', 'Visueller Timer'],
                    ['#playBtnText', 'Starten']
                ]
            },
            {
                file: 'webapps/teacher/sim_dyslexie.html',
                checks: [
                    ['h1[data-i18n="sim_dyslexie.title"]', 'DYS-Adapter & Simulator'],
                    ['label[for="inputProfileName"]', 'Name der Schülerin / des Schülers oder Profilname:']
                ]
            }
        ];

        for (const item of cases) {
            const rawHtml = fs.readFileSync(item.file, 'utf8');
            const staticHtml = rawHtml.replace(/<script\b[\s\S]*?<\/script>/gi, '');
            const win = setupI18nDOM({ html: staticHtml, url: 'http://localhost/?lang=de' });
            win.I18N.apply(win.document);
            for (const [selector, expected] of item.checks) {
                const el = win.document.querySelector(selector);
                assert.ok(el, `${item.file}: missing selector ${selector}`);
                assert.strictEqual(el.textContent.trim(), expected, `${item.file}: unexpected translation for ${selector}`);
            }
        }
    });

    await t.test('initLangToggle inserts safely inside .action-buttons even when .header-actions precedes it', () => {
        const html = `<!DOCTYPE html><html><head></head><body>
            <header>
                <div class="header-actions"><button id="otherBtn">Action</button></div>
                <div class="action-buttons"><button id="theme-toggle-btn">Theme</button></div>
            </header>
        </body></html>`;
        const win = setupI18nDOM({ html, url: 'http://localhost/?lang=de' });
        assert.doesNotThrow(() => win.I18N.initLangToggle());
        const langBtn = win.document.getElementById('lang-toggle-btn');
        assert.ok(langBtn, 'lang-toggle-btn should be inserted');
        assert.strictEqual(langBtn.parentElement.className, 'action-buttons');
        assert.strictEqual(langBtn.nextElementSibling.id, 'theme-toggle-btn');
    });
});

test('i18n.js - Dictionary completeness and zero-duplicate audit across entire repo', () => {
    // Audit that de.js contains required keys, has no duplicates, and does not contain German ß
    const deDictContent = fs.readFileSync('assets/js/i18n/de.js', 'utf8');
    assert.strictEqual(deDictContent.includes('\u00df'), false, 'de.js must use "ss" instead of "ß" (Swiss Standard German de-CH)');

    const rawKeys = new Set();
    const duplicates = [];
    for (const m of deDictContent.matchAll(/^\s*'([^']+)'\s*:/gm)) {
        if (rawKeys.has(m[1])) duplicates.push(m[1]);
        rawKeys.add(m[1]);
    }
    assert.deepStrictEqual(duplicates, [], `de.js must not contain duplicate keys: ${duplicates.join(', ')}`);

    let loadedDict = {};
    const win = { I18N: { register: (_lang, dict) => { loadedDict = dict; } } };
    new Function('window', deDictContent)(win);

    function walkFiles(dir) {
        let out = [];
        if (!fs.existsSync(dir)) return out;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) out = out.concat(walkFiles(full));
            else if (/\.(html|js)$/.test(entry.name) && !full.includes('vendor')) out.push(full);
        }
        return out;
    }

    const scanFiles = [
        'index.html', 'mentions-legales.html', 'confidentialite.html', 'cgu.html', 'merci.html',
        ...walkFiles('webapps'), ...walkFiles('assets/js')
    ].filter(f => fs.existsSync(f) && !f.endsWith('de.js') && !f.endsWith('i18n.js'));

    const VALID_NAMESPACES = new Set([
        'common', 'theme', 'scores', 'modal_export', 'url_params', 'portal', 'portal_c1',
        'binaire_codage', 'binaire_message', 'binaire_studio', 'bit_de_parite',
        'calculatrice_binaire', 'dactylo', 'generateur_mot_de_passe', 'jeu_de_la_grue',
        'machine_a_chiffrer', 'machine_a_trier', 'routage_reseau', 'simulateur_telechargement',
        'simulateur_automate', 'simulateur_reseau_dns', 'sim_dyslexie', 'anonymiseur',
        'bulle_filtres', 'chasseur_infox', 'createur_groupes', 'fabrique_recette',
        'portes_logiques', 'reseau_villages', 'bareme', 'qrcode', 'roue_de_la_chance',
        'time_timer', 'tirage', 'legal', 'cgu', 'mentions', 'confidentialite', 'merci'
    ]);

    const referencedKeys = new Set();
    const trackKey = (k) => {
        if (!k || !k.includes('.') || k.endsWith('.html') || k.endsWith('.')) return;
        referencedKeys.add(k);
    };
    for (const file of scanFiles) {
        const src = fs.readFileSync(file, 'utf8');
        for (const m of src.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) trackKey(m[1]);
        for (const m of src.matchAll(/data-i18n-attr="([^"]+)"/g)) {
            for (const pair of m[1].split(';')) {
                const idx = pair.indexOf(':');
                if (idx !== -1) trackKey(pair.slice(idx + 1).trim());
            }
        }
        for (const m of src.matchAll(/\b[A-Za-z0-9_.]+\(\s*['"]([a-z0-9_]+\.[a-z0-9_.]+)['"]/g)) {
            const ns = m[1].split('.')[0];
            if (VALID_NAMESPACES.has(ns)) trackKey(m[1]);
        }
    }

    const missingKeys = [...referencedKeys].filter(k => !(k in loadedDict)).sort();
    assert.deepStrictEqual(missingKeys, [], `Missing keys in de.js: ${missingKeys.join(', ')}`);

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
        'binaire_codage.title',
        'calculatrice_binaire.title',
        'cgu.page_title',
        'mentions.page_title',
        'confidentialite.page_title',
        'merci.page_title',
        'common.back',
        'legal.nav_aria',
        'bareme.title',
        'qrcode.title',
        'roue_de_la_chance.title',
        'time_timer.title',
        'tirage.title',
        'sim_dyslexie.title'
    ];

    for (const key of requiredKeys) {
        assert.ok(key in loadedDict, `Key ${key} must exist in de.js`);
    }
});
