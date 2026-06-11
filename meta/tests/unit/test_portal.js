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
        const aElement = window.renderIndexCard({
            href: '/test.html',
            title: 'Test App'
        });

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
        const aElement = window.renderIndexCard({ href: '#', title: 'Test', isAlpha: true });

        assert.ok(aElement.classList.contains('alpha-app'), 'Should contain "alpha-app" class');
    });

    await t.test('adds external class if isExternal is true', () => {
        const window = setupDOM();
        const aElement = window.renderIndexCard({ href: '#', title: 'Test', isExternal: true });

        assert.ok(aElement.classList.contains('external'), 'Should contain "external" class');
    });

    await t.test('adds teacher class if isTeacher is true', () => {
        const window = setupDOM();
        const aElement = window.renderIndexCard({ href: '#', title: 'Test', isTeacher: true });

        assert.ok(aElement.classList.contains('teacher'), 'Should contain "teacher" class');
    });

    await t.test('injects display: none; for specific hidden IDs', () => {
        const window = setupDOM();

        let aElement = window.renderIndexCard({ href: '#', title: 'Test', id: 'app-reseau-tri' });
        assert.strictEqual(aElement.style.display, 'none', 'Should hide app-reseau-tri');

        aElement = window.renderIndexCard({ href: '#', title: 'Test', id: 'app-jeu-grue' });
        assert.strictEqual(aElement.style.display, 'none', 'Should hide app-jeu-grue');
    });

    await t.test('populates link attributes correctly', () => {
        const window = setupDOM();
        const aElement = window.renderIndexCard({
            href: '#',
            title: 'Test',
            target: '_blank',
            rel: 'noopener',
            dataLevel: 'easy',
            id: 'test-app'
        });

        assert.strictEqual(aElement.getAttribute('target'), '_blank', 'Should have correct target');
        assert.strictEqual(aElement.getAttribute('rel'), 'noopener', 'Should have correct rel');
        assert.strictEqual(aElement.getAttribute('data-level'), 'easy', 'Should have correct data-level');
        assert.strictEqual(aElement.getAttribute('data-id'), 'test-app', 'Should have correct data-id');
    });

    await t.test('renders optional content correctly', () => {
        const window = setupDOM();
        const aElement = window.renderIndexCard({
            href: '#',
            title: 'Test Title',
            icon: 'star',
            iconStyle: 'color: red;',
            desc: 'Test description',
            ref: 'Ref 123',
            badges: [{ text: 'New', grey: false }],
            tags: ['robotics']
        });

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
        assert.strictEqual(window.renderBadges(null), null, 'Should return null for null input');
        assert.strictEqual(window.renderBadges(undefined), null, 'Should return null for undefined input');
    });

    await t.test('returns wrapper with no badges for empty array', () => {
        const window = setupDOM();
        const wrapper = window.renderBadges(null);
        assert.strictEqual(wrapper, null, 'Should return null for null input');
    });

    await t.test('renders standard text badge', () => {
        const window = setupDOM();
        const wrapper = window.renderBadges([{ text: 'Standard' }]);
        assert.ok(wrapper, 'Wrapper should exist');

        const badge = wrapper.querySelector('.badge');
        assert.ok(badge, 'Badge should exist');
        assert.strictEqual(badge.textContent, 'Standard', 'Should have correct text');
        assert.strictEqual(badge.className.trim(), 'badge', 'Should only have "badge" class');
    });

    await t.test('renders grey badge', () => {
        const window = setupDOM();
        const wrapper = window.renderBadges([{ text: 'Old', grey: true }]);
        const badge = wrapper.querySelector('.badge');

        assert.ok(badge.classList.contains('grey'), 'Should contain "grey" class');
    });

    await t.test('renders prof badge for specific texts', () => {
        const window = setupDOM();
        const profTexts = ['Évaluation', 'Gestion de classe', 'Animation', 'Outils libres', 'Ressources'];

        for (const text of profTexts) {
            const wrapper = window.renderBadges([{ text }]);
            const badge = wrapper.querySelector('.badge');

            assert.ok(badge.classList.contains('prof'), `Should contain "prof" class for text "${text}"`);
        }
    });

    await t.test('renders combination of grey and prof classes', () => {
        const window = setupDOM();
        const wrapper = window.renderBadges([{ text: 'Ressources', grey: true }]);
        const badge = wrapper.querySelector('.badge');

        assert.ok(badge.classList.contains('grey'), 'Should contain "grey" class');
        assert.ok(badge.classList.contains('prof'), 'Should contain "prof" class');
    });

    await t.test('does not render prof badge for normal texts', () => {
        const window = setupDOM();
        const wrapper = window.renderBadges([{ text: 'Not Prof' }]);
        const badge = wrapper.querySelector('.badge');

        assert.strictEqual(badge.classList.contains('prof'), false, 'Should not contain "prof" class');
    });

    await t.test('renders multiple badges correctly', () => {
        const window = setupDOM();
        const wrapper = window.renderBadges([
            { text: 'First' },
            { text: 'Second', grey: true },
            { text: 'Animation' }
        ]);
        const badges = wrapper.querySelectorAll('.badge');

        assert.strictEqual(badges.length, 3, 'Should render 3 badges');
        assert.strictEqual(badges[0].textContent, 'First', 'First badge text correct');
        assert.strictEqual(badges[0].className.trim(), 'badge', 'First badge class correct');

        assert.strictEqual(badges[1].textContent, 'Second', 'Second badge text correct');
        assert.strictEqual(badges[1].className.trim(), 'badge grey', 'Second badge class correct');

        assert.strictEqual(badges[2].textContent, 'Animation', 'Third badge text correct');
        assert.strictEqual(badges[2].className.trim(), 'badge prof', 'Third badge class correct');
    });
});
