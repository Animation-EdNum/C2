const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const htmlSrc = fs.readFileSync('alpha/webapps/bulle_filtres.html', 'utf-8');

function setupDOM() {
    const dom = new JSDOM(htmlSrc, {
        runScripts: 'dangerously',
        url: 'http://localhost/'
    });

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dom.window);
        }, 150);
    });
}

test('bulle_filtres.html - Structure and Requirements', async (t) => {
    let window;

    t.beforeEach(async () => {
        window = await setupDOM();
    });

    await t.test('Page structure adheres to Design System & standards', () => {
        const doc = window.document;

        // Skip link
        const skipLink = doc.querySelector('.skip-link');
        assert.ok(skipLink, 'Skip link exists');
        assert.strictEqual(skipLink.getAttribute('href'), '#main-content');

        // Container
        const container = doc.getElementById('main-content');
        assert.ok(container, '#main-content container exists');
        assert.ok(container.classList.contains('container'), 'Has .container class');

        // Header and back button
        const backBtn = doc.querySelector('.header-back-btn');
        assert.ok(backBtn, 'Header back button exists');
        assert.strictEqual(backBtn.getAttribute('href'), '../../index.html');

        // Badges
        const levelBadge = doc.querySelector('.badge-level');
        assert.ok(levelBadge, 'badge-level exists');
        assert.strictEqual(levelBadge.textContent.trim(), '8H-11CO');

        const alphaBadge = doc.querySelector('.badge-alpha');
        assert.ok(alphaBadge, 'badge-alpha exists');
        assert.strictEqual(alphaBadge.textContent.trim(), 'Alpha');

        // Icon bullseye
        const headerIcon = doc.querySelector('.header-icon i[data-fa="bullseye"]');
        assert.ok(headerIcon, 'Header icon bullseye exists');

        // Settings dropdown
        assert.ok(doc.getElementById('options-menu-btn'), 'Options menu btn exists');
        assert.ok(doc.getElementById('theme-toggle-btn'), 'Theme toggle btn exists');
        assert.ok(doc.getElementById('audio-toggle-btn'), 'Audio toggle btn exists');
        assert.ok(doc.getElementById('reset-cache-btn'), 'Reset cache btn exists');

        // Canvas confetti
        assert.ok(doc.getElementById('confetti-canvas'), 'Confetti canvas exists');

        // Flat legal footer
        const footer = doc.querySelector('footer.no-print');
        assert.ok(footer, 'Footer exists');
        assert.ok(footer.textContent.includes('Vivian Epiney'), 'Footer mentions author');
        assert.ok(footer.textContent.includes('AP EdNum, HEP-VS'), 'Footer mentions HEP-VS');
        assert.ok(footer.querySelector('a[href="../../merci.html"]'), 'Merci link has correct relative path');
    });

    await t.test('Interactive Feed: buttons and reactions update state', () => {
        const doc = window.document;

        const btnLike = doc.getElementById('btn-like');
        const btnWatch = doc.getElementById('btn-watch');
        const btnPass = doc.getElementById('btn-pass');

        assert.ok(btnLike, 'Like button exists');
        assert.ok(btnWatch, 'Watch button exists');
        assert.ok(btnPass, 'Pass button exists');

        const initialCounterText = doc.getElementById('phone-post-counter').textContent;
        assert.strictEqual(initialCounterText, 'Post #1');

        // Click like
        btnLike.click();
        assert.strictEqual(doc.getElementById('phone-post-counter').textContent, 'Post #2');

        // Diversity should still be a valid percentage
        const diversityText = doc.getElementById('diversity-val-display').textContent;
        assert.ok(diversityText.includes('%'), 'Diversity displays %');
        const diversityNum = parseInt(diversityText, 10);
        assert.ok(diversityNum >= 0 && diversityNum <= 100, 'Diversity is in [0, 100]');
    });

    await t.test('Visual Bubble SVG updates according to diversity', () => {
        const doc = window.document;

        const bubbleSvg = doc.getElementById('bubble-svg');
        assert.ok(bubbleSvg, 'SVG bubble exists');

        const bubbleCircle = doc.getElementById('filter-bubble-circle');
        assert.ok(bubbleCircle, 'Circle element for bubble exists');

        // 6 theme nodes in SVG
        const themes = ['science', 'gaming', 'sport', 'animals', 'fashion', 'conspiracy'];
        themes.forEach(th => {
            const node = doc.getElementById('node-' + th);
            assert.ok(node, `Theme node for ${th} exists in SVG`);
        });
    });

    await t.test('Challenge Mode: initializes with high bias and 10 actions', () => {
        const doc = window.document;
        const tabChallenge = doc.getElementById('tab-challenge');
        assert.ok(tabChallenge, 'Challenge tab exists');

        tabChallenge.click();

        // Challenge banner visible
        const banner = doc.getElementById('challenge-banner');
        assert.strictEqual(banner.style.display, 'flex');

        const actionsLeft = doc.getElementById('challenge-actions-left').textContent;
        assert.strictEqual(actionsLeft, '10');

        // Initial diversity should be low (under 30%)
        const divText = doc.getElementById('challenge-diversity-val').textContent;
        const divNum = parseInt(divText, 10);
        assert.ok(divNum < 35, `Challenge initial diversity (${divNum}%) is low and represents a filter bubble`);
    });

    await t.test('Global Reset Hook (window.__onResetApp)', () => {
        assert.strictEqual(typeof window.__onResetApp, 'function', 'window.__onResetApp hook is defined');

        // Trigger reset
        window.__onResetApp();

        const doc = window.document;
        assert.strictEqual(doc.getElementById('phone-post-counter').textContent, 'Post #1');
        assert.strictEqual(doc.getElementById('diversity-val-display').textContent, '100%');
    });

    await t.test('Pedagogy panel toggles correctly', () => {
        const doc = window.document;
        const tabPedagogy = doc.getElementById('tab-pedagogy');
        const pedagogyPanel = doc.getElementById('pedagogy-panel');
        const arenaGrid = doc.getElementById('arena-grid');

        assert.ok(tabPedagogy, 'Pedagogy tab exists');
        tabPedagogy.click();

        assert.strictEqual(pedagogyPanel.style.display, 'block');
        assert.strictEqual(arenaGrid.style.display, 'none');

        // Back to exploration
        doc.getElementById('tab-exploration').click();
        assert.strictEqual(pedagogyPanel.style.display, 'none');
        assert.strictEqual(arenaGrid.style.display, 'grid');
    });
});
