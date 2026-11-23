const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function setupSimulateurReseauDOM() {
    const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/simulateur_reseau_dns.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://localhost/alpha/webapps/simulateur_reseau_dns.html',
        beforeParse(window) {
            window.playSound = () => {};
            window.confetti = { fire: () => {} };
        }
    });
    return dom.window;
}

test('simulateur_reseau_dns.html - DOM Structure & Engine', async (t) => {
    let window;

    t.beforeEach(() => {
        window = setupSimulateurReseauDOM();
    });

    t.afterEach(() => {
        if (window) window.close();
    });

    await t.test('1. Core DOM elements and stations exist', () => {
        const doc = window.document;
        assert.ok(doc.getElementById('urlInput'), '#urlInput must exist');
        assert.ok(doc.getElementById('btnLaunchReq'), '#btnLaunchReq must exist');
        assert.ok(doc.getElementById('nodeClient'), '#nodeClient must exist');
        assert.ok(doc.getElementById('nodeRouter'), '#nodeRouter must exist');
        assert.ok(doc.getElementById('nodeDns'), '#nodeDns must exist');
        assert.ok(doc.getElementById('nodeWeb'), '#nodeWeb must exist');
        assert.ok(doc.getElementById('packetToken'), '#packetToken must exist');
        assert.ok(doc.getElementById('stepBadge'), '#stepBadge must exist');
        assert.ok(doc.getElementById('stepMessage'), '#stepMessage must exist');
        assert.ok(doc.getElementById('btnViewDnsTable'), '#btnViewDnsTable must exist');
        assert.ok(doc.getElementById('btnViewCache'), '#btnViewCache must exist');
    });

    await t.test('2. buildSimulationSteps produces 4 steps for uncached known domain (DNS + Web)', () => {
        const engine = window.SimulateurReseauEngine;
        assert.ok(engine, 'SimulateurReseauEngine must be exported');

        engine.setLocalCache({});
        engine.setDnsFail(false);

        const { steps, site } = engine.buildSimulationSteps('hepvs.ch');
        assert.ok(site, 'Site data must be found for hepvs.ch');
        assert.strictEqual(site.ip, '193.134.12.5');
        assert.strictEqual(steps.length, 4, 'Must have 4 steps for complete uncached resolution');
        assert.ok(steps[0].msg.includes('Requête DNS'), 'Step 1 should be DNS request');
        assert.ok(steps[1].msg.includes('Réponse DNS'), 'Step 2 should be DNS response');
        assert.ok(steps[2].msg.includes('Requête HTTP'), 'Step 3 should be HTTP request');
        assert.ok(steps[3].msg.includes('Réponse HTTP'), 'Step 4 should be HTTP response');
    });

    await t.test('3. buildSimulationSteps skips DNS step when domain is cached', () => {
        const engine = window.SimulateurReseauEngine;
        engine.setLocalCache({ 'hepvs.ch': '193.134.12.5' });

        const { steps } = engine.buildSimulationSteps('hepvs.ch');
        assert.strictEqual(steps.length, 3, 'Must have 3 steps when cached (1 cache hit + 2 HTTP steps)');
        assert.ok(steps[0].msg.includes('Cache DNS'), 'Step 1 should be DNS Cache hit');
    });

    await t.test('4. Direct IP input bypasses DNS resolution entirely', () => {
        const engine = window.SimulateurReseauEngine;
        engine.setLocalCache({});
        engine.setDnsFail(false);

        const { steps } = engine.buildSimulationSteps('194.230.79.10');
        assert.ok(steps[0].msg.includes('Connexion directe par IP'), 'Step 1 should be direct IP connection');
        assert.strictEqual(steps[steps.length - 1].result.directIp, '194.230.79.10');
    });

    await t.test('5. DNS server failure stops resolution when uncached', () => {
        const engine = window.SimulateurReseauEngine;
        engine.setLocalCache({});
        engine.setDnsFail(true);

        const { steps } = engine.buildSimulationSteps('rts.ch');
        assert.strictEqual(steps.length, 2, 'Should fail at step 2 when DNS is down');
        assert.ok(steps[1].msg.includes('Panne Réseau'), 'Step 2 should report DNS failure');
        assert.strictEqual(steps[1].result.success, false);
    });

    await t.test('6. Missions mode contains 4 progressive challenges', () => {
        const engine = window.SimulateurReseauEngine;
        const missions = engine.getMissions();
        assert.strictEqual(missions.length, 4, 'Must have 4 missions');
        assert.ok(missions[0].title.includes('Mission 1'));
        assert.ok(missions[1].title.includes('Mission 2'));
        assert.ok(missions[2].title.includes('Mission 3'));
        assert.ok(missions[3].title.includes('Mission 4'));
    });
});
