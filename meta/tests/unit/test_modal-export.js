const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const { JSDOM } = require('jsdom');

function setupDOM(html = '<!DOCTYPE html><html><head><link rel="root" href="./"></head><body></body></html>') {
    const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' });
    const window = dom.window;

    // Load modal-export.js
    const src = fs.readFileSync('assets/js/modal-export.js', 'utf8');
    window.eval(src);

    return window;
}

test('modal-export.js - Student name persistence and extraction', async (t) => {
    await t.test('saves and retrieves student name from localStorage', () => {
        const window = setupDOM();
        const ModalExporter = window.ModalExporter;

        assert.strictEqual(ModalExporter.getStudentName(), '');
        ModalExporter.saveStudentName('Camille Dupont');
        assert.strictEqual(ModalExporter.getStudentName(), 'Camille Dupont');
        assert.strictEqual(window.localStorage.getItem('c2_student_name'), 'Camille Dupont');
    });

    await t.test('extracts student name from container input if populated', () => {
        const window = setupDOM();
        const ModalExporter = window.ModalExporter;

        const container = window.document.createElement('div');
        const input = window.document.createElement('input');
        input.id = 'dactyloStudentName';
        input.value = 'Lucas Martin';
        container.appendChild(input);
        window.document.body.appendChild(container);

        assert.strictEqual(ModalExporter.getStudentName(container), 'Lucas Martin');
    });

    await t.test('extracts student name from score-student-name input if populated', () => {
        const window = setupDOM();
        const ModalExporter = window.ModalExporter;

        const container = window.document.createElement('div');
        const input = window.document.createElement('input');
        input.id = 'score-student-name';
        input.value = 'Sophie Vuissoz';
        container.appendChild(input);
        window.document.body.appendChild(container);

        assert.strictEqual(ModalExporter.getStudentName(container), 'Sophie Vuissoz');
    });
});

test('modal-export.js - Clean modal decoration (no redundant top-right buttons)', async (t) => {
    await t.test('decorateModal does not inject redundant floating top-right buttons', () => {
        const window = setupDOM();
        const ModalExporter = window.ModalExporter;

        const modal = window.document.createElement('div');
        modal.className = 'ui-modal-content';
        window.document.body.appendChild(modal);

        ModalExporter.decorateModal(modal);

        const btn = modal.querySelector('.ui-btn-export-modal');
        assert.strictEqual(btn, null, 'No top-right floating button should be injected');
    });

    await t.test('scanAndDecorateAllModals does not inject redundant floating buttons', () => {
        const window = setupDOM();
        const ModalExporter = window.ModalExporter;

        const m1 = window.document.createElement('div');
        m1.className = 'ui-modal-content';
        const m2 = window.document.createElement('div');
        m2.className = 'winner-card';

        window.document.body.appendChild(m1);
        window.document.body.appendChild(m2);

        ModalExporter.scanAndDecorateAllModals();

        assert.strictEqual(m1.querySelector('.ui-btn-export-modal'), null);
        assert.strictEqual(m2.querySelector('.ui-btn-export-modal'), null);
    });
});

test('modal-export.js - Auto-sync student name on input event', async (t) => {
    await t.test('input event on .modal-student-input saves name to storage', () => {
        const window = setupDOM();
        const ModalExporter = window.ModalExporter;
        ModalExporter.initAutoExport();

        const input = window.document.createElement('input');
        input.className = 'modal-student-input';
        window.document.body.appendChild(input);

        input.value = 'Élève Test';
        input.dispatchEvent(new window.Event('input', { bubbles: true }));

        assert.strictEqual(window.localStorage.getItem('c2_student_name'), 'Élève Test');
    });
});
