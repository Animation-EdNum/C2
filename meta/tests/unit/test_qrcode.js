/**
 * @file test_qrcode.js
 * @description Unit & DOM integration tests for the QR Code generator (qrcode.html).
 * Covers UTF-8 byte encoding (mojibake prevention), Wi-Fi MECARD escaping,
 * batch URL detection vs plain text with dots, color reset sync, and vector SVG generation.
 * @license AGPL-3.0-or-later
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

// Setup headless DOM environment globals required by QRious UMD module
const baseDom = new JSDOM('<!DOCTYPE html><html><body><canvas></canvas></body></html>');
global.window = baseDom.window;
global.document = baseDom.window.document;
global.HTMLCanvasElement = baseDom.window.HTMLCanvasElement;
global.HTMLImageElement = baseDom.window.HTMLImageElement;

const mockContext = {
    lineWidth: 1,
    fillStyle: '',
    globalAlpha: 1,
    fillRect: () => {},
    clearRect: () => {},
    drawImage: () => {},
    fillText: () => {},
    measureText: (txt) => ({ width: (txt || '').length * 8 }),
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    quadraticCurveTo: () => {},
    stroke: () => {},
    fill: () => {},
    getImageData: (x, y, w, h) => ({
        data: new Uint8ClampedArray(w * h * 4)
    }),
    toDataURL: () => 'data:image/png;base64,mock'
};
baseDom.window.HTMLCanvasElement.prototype.getContext = () => mockContext;

const QRious = require('../../../assets/js/vendor/qrious.min.js');

describe('qrcode.html - QR engine & protocol encoders', () => {
    const filePath = path.resolve(__dirname, '../../../webapps/teacher/qrcode.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    function createEnv() {
        const dom = new JSDOM(htmlContent, {
            runScripts: 'dangerously',
            url: 'http://localhost/webapps/teacher/qrcode.html'
        });
        dom.window.HTMLCanvasElement.prototype.getContext = () => mockContext;
        dom.window.QRious = QRious;

        if (dom.window.updateQR) {
            dom.window.updateQR();
        }

        return { dom, window: dom.window, document: dom.window.document };
    }

    test('1. UTF-8 byte encoding correctly converts accents, ligatures, and emojis for QRious byte mode', () => {
        const { window } = createEnv();
        const input = "Élève à Genève : été, cœur & fête 🎉";
        const byteStr = window.toUtf8ByteString(input);

        assert.ok(byteStr, 'Byte string must not be empty');
        // 'É' in UTF-8 is 0xC3 0x89
        assert.ok(byteStr.includes('\xC3\x89'), 'É must be encoded as UTF-8 bytes 0xC3 0x89');
        // 'é' in UTF-8 is 0xC3 0xA9 (codes 195, 169)
        assert.ok(byteStr.includes('\xC3\xA9'), 'é must be encoded as UTF-8 bytes 0xC3 0xA9');
        // 'œ' in UTF-8 is 0xC5 0x93 (codes 197, 147)
        assert.ok(byteStr.includes('\xC5\x93'), 'œ ligature must be encoded as UTF-8 bytes 0xC5 0x93');
        // '🎉' in UTF-8 is 0xF0 0x9F 0x8E 0x89
        assert.ok(byteStr.includes('\xF0\x9F\x8E\x89'), 'Party popper emoji must be encoded as 4 UTF-8 bytes');
    });

    test('2. Wi-Fi payload escaping conforms to MECARD standard (\\ ; , : ")', () => {
        const { window } = createEnv();
        const escaped = window.escapeWifiField('SSID;Ecole:5H,Salle\\"A"');
        assert.strictEqual(escaped, 'SSID\\;Ecole\\:5H\\,Salle\\\\\\"A\\"', 'Reserved characters must be backslash-escaped');

        // Test full wifi QR value generation
        const ssidInput = window.document.getElementById('wifiSsid');
        const passInput = window.document.getElementById('wifiPassword');
        const typeSelect = window.document.getElementById('wifiType');

        window.state.type = 'wifi';
        ssidInput.value = 'Ecole;Valais';
        passInput.value = 'Secret:Pass;123';
        typeSelect.value = 'WPA';

        const qrVal = window.getQRValue();
        assert.strictEqual(qrVal, 'WIFI:S:Ecole\\;Valais;T:WPA;P:Secret\\:Pass\\;123;;', 'Wi-Fi QR payload must escape reserved characters in SSID and password');
    });

    test('3. Open Wi-Fi network (nopass) does not emit password field P:;', () => {
        const { window } = createEnv();
        const ssidInput = window.document.getElementById('wifiSsid');
        const typeSelect = window.document.getElementById('wifiType');

        window.state.type = 'wifi';
        ssidInput.value = 'Wifi_Visiteurs';
        typeSelect.value = 'nopass';

        const qrVal = window.getQRValue();
        assert.strictEqual(qrVal, 'WIFI:S:Wifi_Visiteurs;T:nopass;;', 'Open Wi-Fi must specify T:nopass and omit P: field');

        const subtext = window.getSubtextDisplay();
        assert.ok(subtext.includes('(Réseau ouvert)'), 'Subtext must indicate open network');
        assert.ok(!subtext.includes('Clé :'), 'Subtext must not display empty password key');
    });

    test('4. Batch formatting distinguishes plain text with dots from real web domains', () => {
        const { window } = createEnv();
        // Plain texts with numbers or abbreviations containing dots
        assert.strictEqual(window.formatBatchValue('Réponse: 3.5 cm'), 'Réponse: 3.5 cm', 'Dimensions with decimal dot must NOT become a URL');
        assert.strictEqual(window.formatBatchValue('Consigne: ex. 2'), 'Consigne: ex. 2', 'Abbreviations with dot must NOT become a URL');
        assert.strictEqual(window.formatBatchValue('Bravo. Tu as gagné !'), 'Bravo. Tu as gagné !', 'Sentences with full stop must NOT become a URL');

        // Real URLs and domains
        assert.strictEqual(window.formatBatchValue('learningapps.org'), 'https://learningapps.org', 'Domain without scheme should get https:// prefix');
        assert.strictEqual(window.formatBatchValue('www.ednum.ch/alpha'), 'https://www.ednum.ch/alpha', 'www domain should get https:// prefix');
        assert.strictEqual(window.formatBatchValue('https://scratch.mit.edu'), 'https://scratch.mit.edu', 'Already qualified URL remains unchanged');
    });

    test('5. Reset function correctly targets .color-chip and synchronizes active chip', () => {
        const { window, document } = createEnv();
        // Select red chip
        const redChip = document.querySelector('.color-chip[data-color="#ef4444"]');
        if (redChip) {
            redChip.click();
            assert.strictEqual(redChip.classList.contains('active'), true, 'Red chip should be active after click');
        }

        // Trigger reset
        window.resetAll();

        const blackChip = document.querySelector('.color-chip[data-color="#000000"]');
        assert.ok(blackChip, 'Black chip must exist');
        assert.strictEqual(blackChip.classList.contains('active'), true, 'Black color chip must be active after reset');
        if (redChip) {
            assert.strictEqual(redChip.classList.contains('active'), false, 'Red color chip must no longer be active');
        }
    });

    test('6. UTF-8 byte length calculation correctly counts multi-byte characters', () => {
        const { window } = createEnv();
        assert.strictEqual(window.getUtf8ByteLength('abc'), 3, 'ASCII characters are 1 byte each');
        assert.strictEqual(window.getUtf8ByteLength('é'), 2, 'é is 2 bytes in UTF-8');
        assert.strictEqual(window.getUtf8ByteLength('🎉'), 4, 'Emoji is 4 bytes in UTF-8');
    });

    test('7. SVG generation produces valid vector XML document', () => {
        const { window } = createEnv();
        const svg = window.generateSvgFromQR('https://ednum.org', 'M', '#000000', '#ffffff');
        assert.ok(svg.includes('<svg'), 'Generated output must contain <svg tag');
        assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"'), 'Must contain SVG namespace');
        assert.ok(svg.includes('viewBox="'), 'Must contain viewBox attribute for scalability');
    });
});
