const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const urlParamsSrc = fs.readFileSync('assets/js/url-params.js', 'utf-8');

function setupDOM(initialHtml = '') {
    const defaultHtml = `<!DOCTYPE html>
    <html>
    <body>
        ${initialHtml}
    </body>
    </html>`;

    const dom = new JSDOM(defaultHtml, { runScripts: "dangerously", url: "http://localhost/" });
    const window = dom.window;

    window.eval(urlParamsSrc);
    return window;
}

test('resetAllCheckboxes logic', async (t) => {
    await t.test('sets all checkboxes checked state to false', () => {
        const window = setupDOM(`
            <div id="btn-share"></div>
            <div id="share-modal-overlay">
                 <button id="btn-close-share"></button>
                 <div class="share-toggle"><input type="checkbox" checked id="opt-1"></div>
                 <div class="share-toggle"><input type="checkbox" id="opt-2"></div>
                 <div class="share-toggle"><input type="checkbox" checked id="opt-3"></div>
            </div>
            <button id="btn-preset-mission"></button>
        `);

        const document = window.document;

        // Ensure checkboxes are tracked by dispatching DOMContentLoaded
        const event = document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        window.document.dispatchEvent(event);

        const cb1 = document.getElementById('opt-1');
        const cb2 = document.getElementById('opt-2');
        const cb3 = document.getElementById('opt-3');

        // Confirm initial state
        assert.strictEqual(cb1.checked, true);
        assert.strictEqual(cb2.checked, false);
        assert.strictEqual(cb3.checked, true);

        const btnMission = document.getElementById('btn-preset-mission');

        // Mock updateShareUrl and showToast to avoid errors during preset application
        window.updateShareUrl = () => {};
        window.showToast = () => {};

        btnMission.click();

        // Checkboxes that are not part of the mission preset should be false
        assert.strictEqual(cb1.checked, false);
        assert.strictEqual(cb2.checked, false);
        assert.strictEqual(cb3.checked, false);
    });

    await t.test('handles empty checkbox NodeList gracefully', () => {
        const window = setupDOM(`
            <div id="btn-share"></div>
            <div id="share-modal-overlay">
                 <button id="btn-close-share"></button>
            </div>
            <button id="btn-preset-mission"></button>
        `);

        const document = window.document;

        const event = document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        window.document.dispatchEvent(event);

        const btnMission = document.getElementById('btn-preset-mission');

        window.updateShareUrl = () => {};
        window.showToast = () => {};

        assert.doesNotThrow(() => {
            btnMission.click();
        }, "Should not throw if there are no checkboxes");
    });
});
