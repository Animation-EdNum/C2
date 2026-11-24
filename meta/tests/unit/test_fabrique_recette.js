const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupFabriqueRecetteDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/fabrique_recette.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/fabrique_recette.html',
        beforeParse(window) {
            window.playSound = () => {};
            window.handleStreakCelebration = () => {};
        }
    });
    return dom.window;
}

test('fabrique_recette.html - DOM Structure & Engine', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupFabriqueRecetteDOM();
    });

    t.afterEach(() => {
        if (window) {
            window.close();
        }
    });

    await t.test('1. Core DOM elements exist', () => {
        const doc = window.document;
        assert.ok(doc.getElementById('recipe-track'), '#recipe-track must exist');
        assert.ok(doc.getElementById('btn-run-recipe'), '#btn-run-recipe must exist');
        assert.ok(doc.getElementById('btn-step-recipe'), '#btn-step-recipe must exist');
        assert.ok(doc.getElementById('btn-clear-recipe'), '#btn-clear-recipe must exist');
        assert.ok(doc.getElementById('cooking-stage'), '#cooking-stage must exist');
        assert.ok(doc.getElementById('pizza-svg'), '#pizza-svg must exist');
        assert.ok(doc.getElementById('eval-card'), '#eval-card must exist');
        assert.ok(doc.getElementById('customer-name-display'), '#customer-name-display must exist');
        assert.ok(doc.getElementById('tab-defis'), '#tab-defis must exist');
        assert.ok(doc.getElementById('tab-creatif'), '#tab-creatif must exist');
    });

    await t.test('2. Palette has actions, conditions and loops', () => {
        const doc = window.document;
        const actionBlocks = doc.querySelectorAll('.code-block-btn.block-action');
        const condBlocks = doc.querySelectorAll('.code-block-btn.block-condition');
        const loopBlocks = doc.querySelectorAll('.code-block-btn.block-loop');

        assert.ok(actionBlocks.length >= 8, 'Must have at least 8 action blocks');
        assert.ok(condBlocks.length >= 3, 'Must have at least 3 condition blocks');
        assert.ok(loopBlocks.length >= 3, 'Must have at least 3 loop blocks');
    });

    await t.test('3. Clicking blocks appends them to the recipe ribbon', () => {
        const doc = window.document;
        const doughBtn = doc.querySelector('[data-action="dough"]');
        const sauceBtn = doc.querySelector('[data-action="sauce"]');

        assert.ok(doughBtn, 'Dough button exists');
        assert.ok(sauceBtn, 'Sauce button exists');

        doughBtn.click();
        sauceBtn.click();

        const stepItems = doc.querySelectorAll('.recipe-step-item');
        assert.equal(stepItems.length, 2, 'Two steps must be present in the recipe tape');
    });

    await t.test('4. Clearing the ribbon removes all steps', () => {
        const doc = window.document;
        const doughBtn = doc.querySelector('[data-action="dough"]');
        const clearBtn = doc.getElementById('btn-clear-recipe');

        doughBtn.click();
        assert.equal(doc.querySelectorAll('.recipe-step-item').length, 1);

        clearBtn.click();
        assert.equal(doc.querySelectorAll('.recipe-step-item').length, 0);
        assert.ok(doc.getElementById('recipe-empty-state'), 'Empty state must be shown');
    });

    await t.test('5. Mode switching between Défis and Libre updates UI', () => {
        const doc = window.document;
        const tabDefis = doc.getElementById('tab-defis');
        const tabCreatif = doc.getElementById('tab-creatif');
        const challengeCard = doc.getElementById('challenge-card');
        const creativeCard = doc.getElementById('creative-card');

        tabCreatif.click();
        assert.ok(tabCreatif.classList.contains('active'), 'Creative tab must be active');
        assert.equal(challengeCard.style.display, 'none', 'Challenge card must be hidden in creative mode');
        assert.ok(creativeCard.classList.contains('show'), 'Creative card must be visible');

        tabDefis.click();
        assert.ok(tabDefis.classList.contains('active'), 'Defis tab must be active');
        assert.equal(challengeCard.style.display, 'flex', 'Challenge card must be visible in defis mode');
    });

    await t.test('6. window.__onResetApp resets state cleanly', () => {
        const win = window;
        const doc = win.document;

        assert.equal(typeof win.__onResetApp, 'function', '__onResetApp must be a global function');
        win.__onResetApp();

        const activeLevel = doc.querySelector('.level-chip.active');
        assert.ok(activeLevel, 'An active level chip must exist');
        assert.ok(activeLevel.textContent.includes('Niveau 1'), 'Must reset to Niveau 1');
    });
});
