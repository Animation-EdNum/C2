const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

// Load portal.js source code
const portalSrc = fs.readFileSync('assets/js/portal.js', 'utf-8');
const indexMainSrc = fs.readFileSync('assets/js/index-main.js', 'utf-8');

function setupDOM() {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: "dangerously" });
    const window = dom.window;

    // Evaluate portal.js into the jsdom window environment
    window.eval(portalSrc);

    return window;
}

test('renderIndexCard', async (t) => {

    await t.test('renders minimal object correctly', () => {
        const window = setupDOM();
        const html = window.renderIndexCard({
            href: '/test.html',
            title: 'Test App'
        });

        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const aElement = tempDiv.querySelector('a');

        assert.ok(aElement, 'Should render an anchor element');
        assert.strictEqual(aElement.getAttribute('href'), '/test.html', 'Should have correct href attribute');
        assert.strictEqual(aElement.className.trim(), 'card', 'Should only have "card" class');

        const titleDiv = aElement.querySelector('.card-title');
        assert.ok(titleDiv, 'Should render card-title div');
        assert.ok(titleDiv.textContent.includes('Test App'), 'Title should be present');

        assert.strictEqual(aElement.hasAttribute('target'), false, 'Should not have target');
        assert.strictEqual(aElement.hasAttribute('rel'), false, 'Should not have rel');
        assert.strictEqual(aElement.hasAttribute('data-id'), false, 'Should not have data-id');
        assert.strictEqual(aElement.hasAttribute('style'), false, 'Should not have style attribute by default');
        assert.strictEqual(aElement.querySelector('.card-desc'), null, 'Should not have card-desc');
        assert.strictEqual(aElement.querySelector('.card-ref'), null, 'Should not have card-ref');
    });

    await t.test('adds alpha-app class if isAlpha is true', () => {
        const window = setupDOM();
        const html = window.renderIndexCard({ href: '#', title: 'Test', isAlpha: true });
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const aElement = tempDiv.querySelector('a');

        assert.ok(aElement.classList.contains('alpha-app'), 'Should contain "alpha-app" class');
    });

    await t.test('adds alpha-app and hidden-app classes if isHidden is true', () => {
        const window = setupDOM();
        const html = window.renderIndexCard({ href: '#', title: 'Test', isHidden: true });
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const aElement = tempDiv.querySelector('a');

        assert.ok(aElement.classList.contains('alpha-app'), 'Should contain "alpha-app" class');
        assert.ok(aElement.classList.contains('hidden-app'), 'Should contain "hidden-app" class');

        const extHtml = window.renderExternalCard({ href: '#', title: 'Ext', isHidden: true });
        const extDiv = window.document.createElement('div');
        extDiv.innerHTML = extHtml;
        const extA = extDiv.querySelector('a');
        assert.ok(extA.classList.contains('alpha-app'), 'External card should contain "alpha-app" class');
        assert.ok(extA.classList.contains('hidden-app'), 'External card should contain "hidden-app" class');
    });

    await t.test('adds external class if isExternal is true', () => {
        const window = setupDOM();
        const html = window.renderIndexCard({ href: '#', title: 'Test', isExternal: true });
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const aElement = tempDiv.querySelector('a');

        assert.ok(aElement.classList.contains('external'), 'Should contain "external" class');
    });

    await t.test('adds teacher class if isTeacher is true', () => {
        const window = setupDOM();
        const html = window.renderIndexCard({ href: '#', title: 'Test', isTeacher: true });
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const aElement = tempDiv.querySelector('a');

        assert.ok(aElement.classList.contains('teacher'), 'Should contain "teacher" class');
    });

    await t.test('injects display: none; for specific hidden IDs', () => {
        const window = setupDOM();

        let html = window.renderIndexCard({ href: '#', title: 'Test', id: 'app-reseau-tri' });
        let tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        let aElement = tempDiv.querySelector('a');
        assert.strictEqual(aElement.style.display, 'none', 'Should hide app-reseau-tri');

        html = window.renderIndexCard({ href: '#', title: 'Test', id: 'app-jeu-grue' });
        tempDiv.innerHTML = html;
        aElement = tempDiv.querySelector('a');
        assert.strictEqual(aElement.style.display, 'none', 'Should hide app-jeu-grue');
    });

    await t.test('populates link attributes correctly', () => {
        const window = setupDOM();
        const html = window.renderIndexCard({
            href: '#',
            title: 'Test',
            target: '_blank',
            rel: 'noopener',
            dataLevel: 'easy',
            id: 'test-app'
        });
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const aElement = tempDiv.querySelector('a');

        assert.strictEqual(aElement.getAttribute('target'), '_blank', 'Should have correct target');
        assert.strictEqual(aElement.getAttribute('rel'), 'noopener', 'Should have correct rel');
        assert.strictEqual(aElement.getAttribute('data-level'), 'easy', 'Should have correct data-level');
        assert.strictEqual(aElement.getAttribute('data-id'), 'test-app', 'Should have correct data-id');
    });

    await t.test('renders optional content correctly', () => {
        const window = setupDOM();
        const html = window.renderIndexCard({
            href: '#',
            title: 'Test Title',
            icon: 'star',
            iconStyle: 'color: red;',
            desc: 'Test description',
            ref: 'Ref 123',
            badges: [{ text: 'New', grey: false }],
            tags: ['robotics']
        });
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const aElement = tempDiv.querySelector('a');

        // Check icon
        const iconElement = aElement.querySelector('.card-title i');
        assert.ok(iconElement, 'Should render icon');
        assert.strictEqual(iconElement.getAttribute('data-fa'), 'star', 'Should have correct data-fa attribute');
        assert.strictEqual(iconElement.getAttribute('style'), 'color: red;', 'Should have correct icon style');

        // Check description
        const descElement = aElement.querySelector('.card-desc');
        assert.ok(descElement, 'Should render desc div');
        assert.strictEqual(descElement.textContent, 'Test description', 'Should have correct description');

        // Check ref
        const refElement = aElement.querySelector('.card-ref');
        assert.ok(refElement, 'Should render ref div');
        assert.ok(refElement.textContent.includes('Ref 123'), 'Should contain ref text');
        assert.ok(refElement.querySelector('i[data-fa="book-open-reader"]'), 'Should have book icon for ref');

        // Check badges
        const badgesWrapper = aElement.querySelector('.badges-wrapper');
        assert.ok(badgesWrapper, 'Should render badges wrapper');
        const badgeSpan = badgesWrapper.querySelector('.badge');
        assert.ok(badgeSpan, 'Should render badge span');
        assert.strictEqual(badgeSpan.textContent, 'New', 'Should contain badge text');

        // Check tags
        const tagsWrapper = aElement.querySelector('.card-tags');
        assert.ok(tagsWrapper, 'Should render tags wrapper');
        const tagSpan = tagsWrapper.querySelector('.tag');
        assert.ok(tagSpan, 'Should render tag span');
        assert.strictEqual(tagSpan.textContent, 'robotics', 'Should contain tag text');
    });
});

test('renderExternalCard', async (t) => {
    await t.test('renders external card with target, rel, badges, title and search tags', () => {
        const window = setupDOM();
        const html = window.renderExternalCard({
            id: 'ext-test',
            href: 'https://example.com/app',
            target: '_blank',
            rel: 'noopener noreferrer',
            isExternal: true,
            title: 'Test External',
            desc: 'A description',
            icon: 'sparkles',
            badges: [{ text: '7H-10CO', grey: false }],
            tags: ['#EspritCritique', '#Medias']
        });

        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const a = tempDiv.querySelector('a');

        assert.ok(a, 'Should render anchor element');
        assert.strictEqual(a.getAttribute('href'), 'https://example.com/app');
        assert.strictEqual(a.getAttribute('target'), '_blank');
        assert.strictEqual(a.getAttribute('rel'), 'noopener noreferrer');
        assert.ok(a.classList.contains('card-compact'));
        assert.ok(a.classList.contains('external'));
        assert.strictEqual(a.querySelector('.card-title span').textContent, 'Test External');
        assert.strictEqual(a.querySelector('.card-desc').textContent, 'A description');
        assert.ok(a.querySelector('.badges-wrapper .badge'));
        assert.strictEqual(a.querySelector('.badges-wrapper .badge').textContent, '7H-10CO');
        assert.ok(a.querySelector('.tag-search-hidden'));
        assert.strictEqual(a.querySelector('.tag-search-hidden').textContent, '#EspritCritique #Medias');
    });

    await t.test('switches href and badge text dynamically in German locale', () => {
        const window = setupDOM();
        window.I18N = { locale: 'de' };

        const html = window.renderExternalCard({
            id: 'ext-totem',
            href: 'https://example.com/fr',
            target: '_blank',
            rel: 'noopener noreferrer',
            isExternal: true,
            title: 'Totem FR',
            desc: 'Desc FR',
            badges: [{ text: '7H-10CO', grey: false }],
            i18n: {
                de: {
                    title: 'Totem DE',
                    href: 'https://example.com/de',
                    desc: 'Desc DE',
                    badges: [{ text: '7. Primar - 10. OS', grey: false }]
                }
            }
        });

        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const a = tempDiv.querySelector('a');

        assert.strictEqual(a.getAttribute('href'), 'https://example.com/de');
        assert.strictEqual(a.querySelector('.card-title span').textContent, 'Totem DE');
        assert.strictEqual(a.querySelector('.card-desc').textContent, 'Desc DE');
        assert.strictEqual(a.querySelector('.badges-wrapper .badge').textContent, '7. Primar - 10. OS');
    });
});

test('renderC1Card', async (t) => {
    await t.test('renders card with title, icon, and c1Badge', () => {
        const window = setupDOM();
        const html = window.renderC1Card({
            href: 'webapps/machine_a_trier.html',
            title: 'Machine à trier',
            c1Icon: 'dt-shapes',
            c1SmallIcons: ['check'],
            c1Badge: '1-2H (TNI) · 3-4H'
        });
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const a = tempDiv.querySelector('a');
        assert.ok(a);
        assert.strictEqual(a.getAttribute('href'), 'webapps/machine_a_trier.html');
        assert.ok(a.querySelector('.badge-pill-c1'));
        assert.strictEqual(a.querySelector('.badge-pill-c1').textContent, '1-2H (TNI) · 3-4H');
        assert.ok(a.querySelector('.card-title').textContent.includes('Machine à trier'));
    });

    await t.test('renders card with fallback to dataLevel if c1Badge not present', () => {
        const window = setupDOM();
        const html = window.renderC1Card({
            href: 'webapps/jeu_de_la_grue.html',
            title: 'Jeu de la grue',
            dataLevel: '3-4H'
        });
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const a = tempDiv.querySelector('a');
        assert.ok(a);
        assert.ok(a.querySelector('.badge-pill-c1'));
        assert.strictEqual(a.querySelector('.badge-pill-c1').textContent, '3-4H');
    });
});

test('loadRegistry', async (t) => {
    await t.test('returns empty array when window.REGISTRY is undefined', async () => {
        const window = setupDOM();
        delete window.REGISTRY;
        const result = await window.loadRegistry();
        assert.strictEqual(Array.isArray(result), true, 'Should return an array');
        assert.strictEqual(result.length, 0, 'Should return an empty array');
    });

    await t.test('returns the populated array when window.REGISTRY is defined', async () => {
        const window = setupDOM();
        const mockRegistry = [{ id: 'app1' }, { id: 'app2' }];
        window.REGISTRY = mockRegistry;
        const result = await window.loadRegistry();
        assert.strictEqual(result, mockRegistry, 'Should return the exact same registry reference');
    });

    await t.test('registry.js contains expected badge configurations for app-automate and app-mot-de-passe', () => {
        const registryContent = fs.readFileSync('assets/js/registry.js', 'utf-8');
        const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: "dangerously" });
        dom.window.eval(registryContent);
        const registry = dom.window.REGISTRY;
        const appAutomate = registry.find(a => a.id === 'app-automate');
        const appMotDePasse = registry.find(a => a.id === 'app-mot-de-passe');
        const appMachineTrier = registry.find(a => a.id === 'app-machine-trier');
        const appJeuGrue = registry.find(a => a.id === 'app-jeu-grue');

        assert.ok(appMachineTrier, 'app-machine-trier should exist in registry');
        assert.strictEqual(appMachineTrier.ref, 'DÉ>CODAGE 1-2 · Activité 3 — La machine à trier & DÉ>CODAGE 3-4 · Activité 3 — La machine à trier');
        assert.strictEqual(appMachineTrier.i18n.de.ref, 'DÉ>CODAGE 1-2 · Aktivität 3 — Die Sortiermaschine & DÉ>CODAGE 3-4 · Aktivität 3 — Die Sortiermaschine');

        assert.ok(appJeuGrue, 'app-jeu-grue should exist in registry');
        assert.strictEqual(appJeuGrue.ref, 'DÉ>CODAGE 1-2 · Activité 2 — Le jeu de la grue & DÉ>CODAGE 3-4 · Activité 2 — Le jeu de la grue');
        assert.strictEqual(appJeuGrue.i18n.de.ref, 'DÉ>CODAGE 1-2 · Aktivität 2 — Das Kranspiel & DÉ>CODAGE 3-4 · Aktivität 2 — Das Kranspiel');
        assert.strictEqual(appJeuGrue.dataLevel, '1-2H, 3-4H');
        assert.deepEqual(appJeuGrue.badges, [
            { text: '1-2H', grey: true },
            { text: '3-4H', grey: false }
        ]);
        assert.deepEqual(appJeuGrue.i18n.de.badges, [
            { text: '1.-2. Primar', grey: true },
            { text: '3.-4. Primar', grey: false }
        ]);

        assert.ok(appAutomate, 'app-automate should exist in registry');
        assert.deepEqual(appAutomate.badges, [
            { text: '3-4H', grey: false },
            { text: '5-8H', grey: true }
        ]);

        assert.ok(appMotDePasse, 'app-mot-de-passe should exist in registry');
        assert.strictEqual(appMotDePasse.dataLevel, '5H-10CO');
        assert.deepEqual(appMotDePasse.badges, [
            { text: '5H-10CO', grey: false }
        ]);

        const extTotem = registry.find(a => a.id === 'ext-totem');
        assert.ok(extTotem, 'ext-totem should exist in registry');
        assert.strictEqual(extTotem.category, 'students_external');
        assert.strictEqual(extTotem.inIndex, true);
        assert.strictEqual(extTotem.isExternal, true);
        assert.strictEqual(extTotem.target, '_blank');
        assert.strictEqual(extTotem.href, 'https://guillaumetschupp.com/outils/totem/app.html?lang=fr');
        assert.strictEqual(extTotem.i18n.de.href, 'https://guillaumetschupp.com/outils/totem/app.html#de');
        assert.strictEqual(JSON.stringify(extTotem).includes('ß'), false, 'ext-totem must strictly use ss and no ß');

        const extDico = registry.find(a => a.id === 'ext-ledicodesecoles');
        assert.ok(extDico, 'ext-ledicodesecoles should exist in registry');
        assert.strictEqual(extDico.category, 'students_external');
        assert.strictEqual(extDico.inIndex, true);
        assert.strictEqual(extDico.isExternal, true);
        assert.strictEqual(extDico.isAlpha, true);
        assert.strictEqual(extDico.isHidden, true);
        assert.strictEqual(extDico.target, '_blank');
        assert.strictEqual(extDico.href, 'https://ledicodesecoles.fr/');
        assert.strictEqual(JSON.stringify(extDico).includes('ß'), false, 'ext-ledicodesecoles must strictly use ss and no ß');

        const extDicoApi = registry.find(a => a.id === 'ext-dicoapi');
        assert.ok(extDicoApi, 'ext-dicoapi should exist in registry');
        assert.strictEqual(extDicoApi.category, 'students_external');
        assert.strictEqual(extDicoApi.inIndex, true);
        assert.strictEqual(extDicoApi.isExternal, true);
        assert.strictEqual(extDicoApi.isAlpha, true);
        assert.strictEqual(extDicoApi.isHidden, true);
        assert.strictEqual(extDicoApi.target, '_blank');
        assert.strictEqual(extDicoApi.href, 'https://dicoapi.ch/');
        assert.strictEqual(JSON.stringify(extDicoApi).includes('ß'), false, 'ext-dicoapi must strictly use ss and no ß');

        const hiddenIds = ['ext-vikidia', 'ext-monkeytype', 'ext-autodraw', 'ext-geogebra-students', 'ext-ledicodesecoles', 'ext-dicoapi'];
        for (const hId of hiddenIds) {
            const item = registry.find(a => a.id === hId);
            assert.ok(item, `${hId} should exist in registry`);
            assert.strictEqual(item.inIndex, true, `${hId} should have inIndex: true so it enters portal DOM`);
            assert.strictEqual(item.isAlpha, true, `${hId} should have isAlpha: true for alpha search reveal`);
            assert.strictEqual(item.isHidden, true, `${hId} should have isHidden: true`);
        }
    });

    await t.test('students_activities are ordered strictly by pedagogical grade progression (1H to 10CO)', () => {
        const registryContent = fs.readFileSync('assets/js/registry.js', 'utf-8');
        const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: "dangerously" });
        dom.window.eval(registryContent);
        const activities = dom.window.REGISTRY.filter(a => a.category === 'students_activities');

        const expectedIds = [
            'app-machine-trier',         // 1-2H, 3-4H (1-4H)
            'app-jeu-grue',              // 1-2H, 3-4H (1-4H)
            'app-coffre-fort',           // 3-4H, 5-6H (3-6H)
            'app-automate',              // 3-4H, 5-8H (3-8H)
            'app-pixel',                 // 5-6H
            'app-reseau-tri',            // 5-6H
            'app-dactylo',               // 5-8H, 9-11CO
            'app-mot-de-passe',          // 5H-10CO
            'app-binaire',               // 7-8H
            'app-mots',                  // 7-8H
            'app-routage',               // 7-8H
            'app-parite',                // 7-8H
            'app-machine-chiffrer',      // 7-8H
            'app-detective-ia',          // 7-8H
            'app-compresseur-magique',   // 7-8H
            'app-dresseur-neurones',     // 7-8H
            'app-apprendre-pseudocode',  // 9CO
            'app-tri-insertion'          // 10CO
        ];

        assert.deepEqual(activities.map(a => a.id), expectedIds, 'Activities must follow pedagogical grade progression');
    });
});

test('renderBadges', async (t) => {
    await t.test('returns empty string for null/undefined badges', () => {
        const window = setupDOM();
        assert.strictEqual(window.renderBadges(null), '', 'Should return empty string for null');
        assert.strictEqual(window.renderBadges(undefined), '', 'Should return empty string for undefined');
    });

    await t.test('returns wrapper with no badges for empty array', () => {
        const window = setupDOM();
        const html = window.renderBadges([]);
        assert.strictEqual(html, '<div class="badges-wrapper"></div>', 'Should return empty wrapper');
    });

    await t.test('renders standard text badge', () => {
        const window = setupDOM();
        const html = window.renderBadges([{ text: 'Standard' }]);
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const wrapper = tempDiv.querySelector('.badges-wrapper');
        assert.ok(wrapper, 'Wrapper should exist');

        const badge = wrapper.querySelector('.badge');
        assert.ok(badge, 'Badge should exist');
        assert.strictEqual(badge.textContent, 'Standard', 'Should have correct text');
        assert.strictEqual(badge.className.trim(), 'badge', 'Should only have "badge" class');
    });

    await t.test('renders grey badge', () => {
        const window = setupDOM();
        const html = window.renderBadges([{ text: 'Old', grey: true }]);
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const badge = tempDiv.querySelector('.badge');

        assert.ok(badge.classList.contains('grey'), 'Should contain "grey" class');
    });

    await t.test('renders prof badge for specific texts', () => {
        const window = setupDOM();
        const profTexts = ['Évaluation', 'Gestion de classe', 'Animation', 'Outils libres', 'Outil', 'Ressources', 'Exercices'];

        for (const text of profTexts) {
            const html = window.renderBadges([{ text }]);
            const tempDiv = window.document.createElement('div');
            tempDiv.innerHTML = html;
            const badge = tempDiv.querySelector('.badge');

            assert.ok(badge.classList.contains('prof'), `Should contain "prof" class for text "${text}"`);
        }
    });

    await t.test('renders combination of grey and prof classes', () => {
        const window = setupDOM();
        const html = window.renderBadges([{ text: 'Ressources', grey: true }]);
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const badge = tempDiv.querySelector('.badge');

        assert.ok(badge.classList.contains('grey'), 'Should contain "grey" class');
        assert.ok(badge.classList.contains('prof'), 'Should contain "prof" class');
    });

    await t.test('does not render prof badge for normal texts', () => {
        const window = setupDOM();
        const html = window.renderBadges([{ text: 'Not Prof' }]);
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const badge = tempDiv.querySelector('.badge');

        assert.strictEqual(badge.classList.contains('prof'), false, 'Should not contain "prof" class');
    });

    await t.test('renders multiple badges correctly', () => {
        const window = setupDOM();
        const html = window.renderBadges([
            { text: 'First' },
            { text: 'Second', grey: true },
            { text: 'Animation' }
        ]);
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = html;
        const badges = tempDiv.querySelectorAll('.badge');

        assert.strictEqual(badges.length, 3, 'Should render 3 badges');
        assert.strictEqual(badges[0].textContent, 'First', 'First badge text correct');
        assert.strictEqual(badges[0].className.trim(), 'badge', 'First badge class correct');

        assert.strictEqual(badges[1].textContent, 'Second', 'Second badge text correct');
        assert.strictEqual(badges[1].className.trim(), 'badge grey', 'Second badge class correct');

        assert.strictEqual(badges[2].textContent, 'Animation', 'Third badge text correct');
        assert.strictEqual(badges[2].className.trim(), 'badge prof', 'Third badge class correct');
    });
});

test('PWA Installation & Guidance', async (t) => {

    await t.test('isPWAStandalone returns false by default and true when standalone', () => {
        const window = setupDOM();
        assert.strictEqual(window.isPWAStandalone(), false, 'Should be false in normal browser context');

        window.navigator.standalone = true;
        assert.strictEqual(window.isPWAStandalone(), true, 'Should be true when window.navigator.standalone is true');

        delete window.navigator.standalone;
        window.matchMedia = (query) => ({
            matches: query.includes('standalone')
        });
        assert.strictEqual(window.isPWAStandalone(), true, 'Should be true when matchMedia standalone is true');
    });

    await t.test('detectClientPlatform detects iOS, Mac Safari, and Desktop', () => {
        const window = setupDOM();

        // Test iPhone UserAgent
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
            configurable: true
        });
        assert.strictEqual(window.detectClientPlatform(), 'ios', 'Should detect iOS for iPhone');

        // Test iPad (MacIntel + touch)
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)',
            configurable: true
        });
        Object.defineProperty(window.navigator, 'platform', {
            value: 'MacIntel',
            configurable: true
        });
        Object.defineProperty(window.navigator, 'maxTouchPoints', {
            value: 5,
            configurable: true
        });
        assert.strictEqual(window.detectClientPlatform(), 'ios', 'Should detect iOS for iPad with touch points');

        // Test macOS Safari (MacIntel + 0 touch + Safari UA)
        Object.defineProperty(window.navigator, 'maxTouchPoints', {
            value: 0,
            configurable: true
        });
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
            configurable: true
        });
        assert.strictEqual(window.detectClientPlatform(), 'mac', 'Should detect mac for Mac Safari');

        // Test Desktop Chrome on Windows
        Object.defineProperty(window.navigator, 'platform', {
            value: 'Win32',
            configurable: true
        });
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            configurable: true
        });
        assert.strictEqual(window.detectClientPlatform(), 'desktop', 'Should detect desktop for Chrome Windows');
    });

    await t.test('showPWAInstallInstructions creates and manages modal in DOM', () => {
        const window = setupDOM();

        assert.strictEqual(window.document.getElementById('pwa-install-modal-overlay'), null, 'Modal should not exist initially');

        window.showPWAInstallInstructions('ios');
        const modal = window.document.getElementById('pwa-install-modal-overlay');
        assert.ok(modal, 'Modal should be injected into DOM');
        assert.ok(modal.classList.contains('active'), 'Modal should be active');

        const iosTab = modal.querySelector('#pwa-tab-ios');
        const macTab = modal.querySelector('#pwa-tab-mac');
        const iosPanel = modal.querySelector('#pwa-panel-ios');
        const macPanel = modal.querySelector('#pwa-panel-mac');

        assert.ok(iosTab.classList.contains('active'), 'iOS tab should be active');
        assert.ok(iosPanel.classList.contains('active'), 'iOS panel should be active');
        assert.strictEqual(macTab.classList.contains('active'), false, 'Mac tab should not be active');

        // Switch to Mac tab
        macTab.click();
        assert.ok(macTab.classList.contains('active'), 'Mac tab should be active after click');
        assert.ok(macPanel.classList.contains('active'), 'Mac panel should be active after click');
        assert.strictEqual(iosTab.classList.contains('active'), false, 'iOS tab should be inactive');

        // Close via close button
        const closeBtn = modal.querySelector('#pwa-modal-close');
        closeBtn.click();
        assert.strictEqual(modal.classList.contains('active'), false, 'Modal should be closed');

        // Reopen and close via Escape
        window.showPWAInstallInstructions('mac');
        assert.ok(modal.classList.contains('active'), 'Modal should be active again');
        const escEvent = new window.KeyboardEvent('keydown', { key: 'Escape' });
        window.document.dispatchEvent(escEvent);
        assert.strictEqual(modal.classList.contains('active'), false, 'Modal should close on Escape key');
    });

    await t.test('initPWAInstall shows button immediately on iOS and opens modal on click', () => {
        const window = setupDOM();

        // Setup DOM with installBtn
        const btn = window.document.createElement('button');
        btn.id = 'installBtn';
        btn.style.display = 'none';
        window.document.body.appendChild(btn);

        // Configure iOS user agent
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
            configurable: true
        });

        window.initPWAInstall();

        assert.strictEqual(btn.style.display, 'flex', 'Button should be displayed on iOS');

        // Click on button opens instructions modal
        btn.click();
        const modal = window.document.getElementById('pwa-install-modal-overlay');
        assert.ok(modal, 'Instructions modal should be created and opened');
        assert.ok(modal.classList.contains('active'), 'Instructions modal should be active');
    });

    await t.test('initPWAInstall supports standard Chromium beforeinstallprompt', () => {
        const window = setupDOM();

        const btn = window.document.createElement('button');
        btn.id = 'installBtn';
        btn.style.display = 'none';
        window.document.body.appendChild(btn);

        // Configure Desktop Chrome
        Object.defineProperty(window.navigator, 'platform', { value: 'Win32', configurable: true });
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
            configurable: true
        });

        window.initPWAInstall();
        assert.strictEqual(btn.style.display, 'none', 'Button should stay hidden before prompt on Chrome desktop');

        // Dispatch simulated beforeinstallprompt event
        let promptCalled = false;
        const mockPromptEvent = new window.Event('beforeinstallprompt');
        mockPromptEvent.preventDefault = () => { };
        mockPromptEvent.prompt = () => { promptCalled = true; };
        mockPromptEvent.userChoice = Promise.resolve({ outcome: 'accepted' });

        window.dispatchEvent(mockPromptEvent);
        assert.strictEqual(btn.style.display, 'flex', 'Button should be displayed after beforeinstallprompt');

        // Clicking button triggers prompt()
        btn.click();
        assert.strictEqual(promptCalled, true, 'Native prompt() should be called on Chromium');
    });
});

test('index-main.js - updateRoleButton and ghost teacher link', async (t) => {
    await t.test('sets ghost button to Espace enseignant·e·s on students view', () => {
        const dom = new JSDOM(`<!DOCTYPE html><html><body>
            <a href="#teachers" id="header-teachers-link"></a>
            <button id="role-toggle-btn" style="display: none;"></button>
        </body></html>`, { runScripts: "dangerously" });
        const window = dom.window;
        window.eval(indexMainSrc);

        window.updateRoleButton('students');
        const ghostBtn = window.document.getElementById('header-teachers-link');
        assert.strictEqual(ghostBtn.textContent, 'Espace enseignant·e·s');
        assert.strictEqual(ghostBtn.getAttribute('href'), '#teachers');
        assert.strictEqual(ghostBtn.getAttribute('title'), "Accéder à l'espace enseignant·e·s");
        assert.strictEqual(ghostBtn.classList.contains('active'), false);
    });

    await t.test('keeps ghost button to Espace enseignant·e·s on teachers view and marks active', () => {
        const dom = new JSDOM(`<!DOCTYPE html><html><body>
            <a href="#teachers" id="header-teachers-link"></a>
            <button id="role-toggle-btn" style="display: none;"></button>
        </body></html>`, { runScripts: "dangerously" });
        const window = dom.window;
        window.eval(indexMainSrc);

        window.updateRoleButton('teachers');
        const ghostBtn = window.document.getElementById('header-teachers-link');
        assert.strictEqual(ghostBtn.textContent, 'Espace enseignant·e·s');
        assert.strictEqual(ghostBtn.getAttribute('href'), '#teachers');
        assert.strictEqual(ghostBtn.classList.contains('active'), true);
        assert.strictEqual(ghostBtn.getAttribute('aria-current'), 'page');
    });

    await t.test('handles dual space links (students and teachers) properly', () => {
        const dom = new JSDOM(`<!DOCTYPE html><html><body>
            <a href="#students" id="header-students-link" class="ghost-space-link active"><span class="hide-mobile">Espace </span>élèves</a>
            <a href="#teachers" id="header-teachers-link" class="ghost-teacher-link"><span class="hide-mobile">Espace </span>enseignant·e·s</a>
        </body></html>`, { runScripts: "dangerously" });
        const window = dom.window;
        window.eval(indexMainSrc);

        // Switch to teachers
        window.updateRoleButton('teachers');
        const studentsBtn = window.document.getElementById('header-students-link');
        const teachersBtn = window.document.getElementById('header-teachers-link');
        assert.strictEqual(studentsBtn.classList.contains('active'), false);
        assert.strictEqual(teachersBtn.classList.contains('active'), true);
        assert.strictEqual(teachersBtn.getAttribute('aria-current'), 'page');
        assert.strictEqual(teachersBtn.textContent, 'Espace enseignant·e·s');

        // Switch back to students
        window.updateRoleButton('students');
        assert.strictEqual(studentsBtn.classList.contains('active'), true);
        assert.strictEqual(teachersBtn.classList.contains('active'), false);
        assert.strictEqual(studentsBtn.getAttribute('aria-current'), 'page');
        assert.strictEqual(teachersBtn.textContent, 'Espace enseignant·e·s');
    });
});

test('index-main.js - filterApps toggle behavior without Toutes', () => {
    const dom = new JSDOM(`<!DOCTYPE html><html><body>
        <div class="filter-bar">
            <a href="indexC1.html" class="filter-btn" id="filter-c1">Cycle 1</a>
            <button class="filter-btn" id="filter-5-6H">5-6H</button>
            <button class="filter-btn" id="filter-7-8H">7-8H</button>
        </div>
        <div id="view-students">
            <div class="searchable-grid">
                <div class="card" data-level="5-6H">App 1</div>
                <div class="card" data-level="7-8H">App 2</div>
            </div>
        </div>
        <input id="searchInput" value="">
    </body></html>`, { runScripts: "dangerously" });
    const window = dom.window;
    window.eval(indexMainSrc);

    const btn56 = window.document.getElementById('filter-5-6H');
    const btn78 = window.document.getElementById('filter-7-8H');

    // Click 5-6H -> active
    window.filterApps('5-6H');
    assert.strictEqual(btn56.classList.contains('active'), true);
    assert.strictEqual(btn78.classList.contains('active'), false);

    // Click 5-6H again -> toggle off (all apps visible, no filter active)
    window.filterApps('5-6H');
    assert.strictEqual(btn56.classList.contains('active'), false);
    assert.strictEqual(btn78.classList.contains('active'), false);
});

test('index-main.js - header logo click switches space', async (t) => {
    const dom = new JSDOM(`<!DOCTYPE html><html><body>
        <a href="#teachers" id="header-logo-link" class="header-logo-link"><svg class="header-logo"></svg></a>
        <a href="#students" id="header-students-link" class="ghost-space-link active"><span class="hide-mobile">Espace </span>élèves</a>
        <a href="#teachers" id="header-teachers-link" class="ghost-teacher-link"><span class="hide-mobile">Espace </span>enseignant·e·s</a>
        <div id="view-students" class="view active"></div>
        <div id="view-teachers" class="view"></div>
    </body></html>`, { runScripts: "dangerously", url: "http://localhost/" });
    const window = dom.window;
    window.eval(indexMainSrc);

    window.initPortalIndex();

    const logo = window.document.getElementById('header-logo-link');
    const viewStudents = window.document.getElementById('view-students');
    const viewTeachers = window.document.getElementById('view-teachers');
    const studentsBtn = window.document.getElementById('header-students-link');
    const teachersBtn = window.document.getElementById('header-teachers-link');

    // Currently on students: click on logo should send to teachers
    logo.click();
    assert.strictEqual(viewTeachers.classList.contains('active'), true, 'Teachers view should be active');
    assert.strictEqual(viewStudents.classList.contains('active'), false, 'Students view should not be active');
    assert.strictEqual(teachersBtn.classList.contains('active'), true, 'Teachers link should be active');
    assert.strictEqual(studentsBtn.classList.contains('active'), false, 'Students link should not be active');
    assert.strictEqual(teachersBtn.textContent, 'Espace enseignant·e·s');

    // Currently on teachers: click on logo should send back to students
    logo.click();
    assert.strictEqual(viewStudents.classList.contains('active'), true, 'Students view should be active');
    assert.strictEqual(viewTeachers.classList.contains('active'), false, 'Teachers view should not be active');
    assert.strictEqual(studentsBtn.classList.contains('active'), true, 'Students link should be active');
    assert.strictEqual(teachersBtn.classList.contains('active'), false, 'Teachers link should not be active');
    assert.strictEqual(teachersBtn.textContent, 'Espace enseignant·e·s');
});

