const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

// Load portal.js source code
const portalSrc = fs.readFileSync('assets/js/portal.js', 'utf-8');

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
        const profTexts = ['Évaluation', 'Gestion de classe', 'Animation', 'Outils libres', 'Ressources'];

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
        mockPromptEvent.preventDefault = () => {};
        mockPromptEvent.prompt = () => { promptCalled = true; };
        mockPromptEvent.userChoice = Promise.resolve({ outcome: 'accepted' });

        window.dispatchEvent(mockPromptEvent);
        assert.strictEqual(btn.style.display, 'flex', 'Button should be displayed after beforeinstallprompt');

        // Clicking button triggers prompt()
        btn.click();
        assert.strictEqual(promptCalled, true, 'Native prompt() should be called on Chromium');
    });
});

