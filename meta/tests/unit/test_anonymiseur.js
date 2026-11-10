const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const XLSX = require('../../../assets/js/vendor/xlsx.full.min.js');

const htmlPath = path.resolve(__dirname, '../../../alpha/webapps/teacher/anonymiseur.html');
const htmlSrc = fs.readFileSync(htmlPath, 'utf-8');

function setupDOM() {
    const dom = new JSDOM(htmlSrc, {
        runScripts: "dangerously",
        url: "http://localhost/"
    });

    dom.window.XLSX = XLSX;
    dom.window.URL.createObjectURL = () => 'blob:mock-download-url';
    dom.window.URL.revokeObjectURL = () => {};

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(dom.window);
        }, 100);
    });
}

test('anonymiseur.html - engine & rules', async (t) => {
    let window;
    let engine;

    t.beforeEach(async () => {
        window = await setupDOM();
        engine = window.AnonymizerEngine;
        assert.ok(engine, 'AnonymizerEngine should be exposed on window');
    });

    await t.test('Anonymizes email addresses with labels mode', () => {
        const text = "Contactez le prof à pierre.durand@edu.vs.ch ou secretaire@ecole.ch pour plus d'infos.";
        engine.state.mode = 'labels';
        const result = engine.runAnonymization(text);
        assert.ok(result.cleanText.includes('[Email 1]'), 'Should contain [Email 1]');
        assert.ok(!result.cleanText.includes('pierre.durand@edu.vs.ch'), 'Original email should be redacted');
        assert.strictEqual(result.replacements.filter(m => m.type === 'email').length, 2);
    });

    await t.test('Anonymizes Swiss phone numbers', () => {
        const text = "Numéro des parents: 079 123 45 67 ou +41 27 322 11 00.";
        engine.state.mode = 'labels';
        const result = engine.runAnonymization(text);
        assert.ok(result.cleanText.includes('[Téléphone 1]'), 'Should contain [Téléphone 1]');
        assert.ok(!result.cleanText.includes('079 123 45 67'), 'Original phone should be removed');
        assert.strictEqual(result.replacements.filter(m => m.type === 'phone').length, 2);
    });

    await t.test('Anonymizes Swiss AVS number (756.xxxx.xxxx.xx)', () => {
        const text = "Dossier élève AVS: 756.1234.5678.90 transmis au secrétariat.";
        engine.state.mode = 'labels';
        const result = engine.runAnonymization(text);
        assert.ok(result.cleanText.includes('[Numéro AVS]'), 'Should detect AVS number');
        assert.ok(!result.cleanText.includes('756.1234.5678.90'), 'AVS number should be redacted');
        assert.strictEqual(result.replacements.filter(m => m.type === 'avs').length, 1);
    });

    await t.test('Anonymizes custom student roster names', () => {
        engine.state.roster = ['Emma Bovary', 'Lucas Moret'];
        const text = "Emma Bovary a bien progressé, alors que Lucas Moret a besoin d'aide.";
        engine.state.mode = 'labels';
        const result = engine.runAnonymization(text);
        assert.ok(result.cleanText.includes('[Élève 1]'), 'Should contain [Élève 1]');
        assert.ok(result.cleanText.includes('[Élève 2]'), 'Should contain [Élève 2]');
        assert.ok(!result.cleanText.includes('Emma Bovary'), 'Student name should be redacted');
        assert.ok(!result.cleanText.includes('Lucas Moret'), 'Student name should be redacted');
    });

    await t.test('Consistent pseudonymization in pseudo mode', () => {
        engine.state.roster = ['Camille Favre'];
        const text = "Camille Favre a rendu son devoir. Camille Favre aura une bonne note.";
        engine.state.mode = 'pseudo';
        const result = engine.runAnonymization(text);
        assert.ok(!result.cleanText.includes('Camille Favre'), 'Original name should be replaced');
        
        // Find what Camille Favre was replaced with
        const firstMatch = result.replacements.find(m => m.original === 'Camille Favre');
        assert.ok(firstMatch, 'Match should exist');
        
        // In pseudo mode, getOrAssignPseudo returns a replacement
        const occurrences = (result.cleanText.match(/Alexandre|Camille|Gabriel|Éléonore|Julien/g) || []).length;
        assert.ok(occurrences >= 2, 'Pseudonym should appear consistently');
    });

    await t.test('Redaction mode replaces with solid block characters', () => {
        const text = "Email: contact@edu.vs.ch et tél: 078 654 32 10.";
        engine.state.mode = 'redact';
        const result = engine.runAnonymization(text);
        assert.ok(result.cleanText.includes('████████'), 'Should include redaction block characters');
        assert.ok(!result.cleanText.includes('contact@edu.vs.ch'), 'Email should be hidden');
    });

    await t.test('Respects disabled filters', () => {
        const text = "Email: prof@ecole.ch et tél: 079 555 44 33.";
        const phonePattern = engine.state.patterns.find(p => p.id === 'phones');
        assert.ok(phonePattern, 'phones pattern should exist');
        phonePattern.enabled = false; // Disable phone filter

        engine.state.mode = 'labels';
        const result = engine.runAnonymization(text);
        assert.ok(result.cleanText.includes('[Email 1]'), 'Email should still be anonymized');
        assert.ok(result.cleanText.includes('079 555 44 33'), 'Phone should NOT be anonymized when filter disabled');
    });

    await t.test('Student numbering is strictly consistent across multiple mentions: Élève 1 always maps to the same student', () => {
        engine.state.roster = ['Lucas', 'Emma'];
        engine.state.mode = 'labels';
        const text = "Lucas a bien participé. Lucas a aidé Emma. Ensuite, Emma a félicité Lucas.";
        const result = engine.runAnonymization(text);
        
        const eleve1Matches = result.cleanText.match(/\[Élève 1\]/g) || [];
        const eleve2Matches = result.cleanText.match(/\[Élève 2\]/g) || [];
        const eleve3Matches = result.cleanText.match(/\[Élève 3\]/g) || [];

        assert.strictEqual(eleve1Matches.length, 3, 'Lucas should be replaced by [Élève 1] all 3 times');
        assert.strictEqual(eleve2Matches.length, 2, 'Emma should be replaced by [Élève 2] all 2 times');
        assert.strictEqual(eleve3Matches.length, 0, 'No [Élève 3] should exist');
    });

    await t.test('Non-roster names and civilities are labeled [Personne 1], [Personne 2], never [Élève X]', () => {
        engine.state.roster = ['Lucas'];
        engine.state.mode = 'labels';
        const text = "Lucas a rencontré Mme Sophie Dupont et M. Martin. Mme Sophie Dupont était satisfaite.";
        const result = engine.runAnonymization(text);

        assert.ok(result.cleanText.includes('[Élève 1]'), 'Lucas should be [Élève 1]');
        assert.ok(!result.cleanText.includes('[Élève 2]'), 'No [Élève 2] should exist');
        assert.ok(result.cleanText.includes('[Personne 1]'), 'First non-roster person should be [Personne 1]');
        assert.ok(result.cleanText.includes('[Personne 2]'), 'Second non-roster person should be [Personne 2]');
        
        const personne1Matches = result.cleanText.match(/\[Personne 1\]/g) || [];
        assert.strictEqual(personne1Matches.length, 2, 'Mme Sophie Dupont should consistently be [Personne 1]');
    });

    await t.test('When roster is empty, all names become [Personne 1], [Personne 2], never [Élève X]', () => {
        engine.state.roster = [];
        engine.state.mode = 'labels';
        const text = "Lucas et Emma ont discuté avec M. Martin.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('[Élève'), 'No [Élève] tag should exist when roster is empty');
        assert.ok(result.cleanText.includes('[Personne 1]'), 'Lucas should be [Personne 1]');
        assert.ok(result.cleanText.includes('[Personne 2]'), 'Emma should be [Personne 2]');
        assert.ok(result.cleanText.includes('[Personne 3]'), 'M. Martin should be [Personne 3]');
    });

    await t.test('Student entered with full name maps both full name and unique first name to the same [Élève 1]', () => {
        engine.state.roster = ['Lucas Dupont', 'Emma Bovary'];
        engine.state.mode = 'labels';
        const text = "Élève : Lucas Dupont. Lucas a fait des progrès remarquables avec Emma.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('Lucas Dupont'), 'Full name should be redacted');
        assert.ok(!result.cleanText.includes('Lucas a fait'), 'First name should be redacted');
        const eleve1Matches = result.cleanText.match(/\[Élève 1\]/g) || [];
        assert.strictEqual(eleve1Matches.length, 2, 'Both Lucas Dupont and Lucas should map to [Élève 1]');
        assert.ok(result.cleanText.includes('[Élève 2]'), 'Emma should be [Élève 2]');
    });

    await t.test('Multi-part student names: first names, middle names and last names all map to the same [Élève X]', () => {
        engine.state.roster = [
            'Moulin Sophie Leny',
            'Naibi Erfan',
            'Nichini Valentin'
        ];
        engine.state.mode = 'labels';
        const text = "Sophie, Moulin, Leny, Erfan et Valentin";
        const result = engine.runAnonymization(text);

        assert.strictEqual(
            result.cleanText,
            "[Élève 1], [Élève 1], [Élève 1], [Élève 2] et [Élève 3]",
            "Sophie, Moulin and Leny must all resolve to [Élève 1], Erfan to [Élève 2], and Valentin to [Élève 3]"
        );
    });

    await t.test('Lot 1 - Mode Révision interactive : Ignored terms remain intact in cleanText and marked chip-ignored in htmlOutput', () => {
        engine.state.roster = ['Lucas'];
        engine.state.mode = 'labels';
        engine.state.ignoredTerms.add('marie');

        const text = "Lucas discute avec Marie au sujet du devoir.";
        const result = engine.runAnonymization(text);

        // Lucas should be anonymized
        assert.ok(!result.cleanText.includes('Lucas'), 'Lucas should be anonymized');
        assert.ok(result.cleanText.includes('[Élève 1]'), 'Lucas should be replaced by [Élève 1]');

        // Marie should NOT be anonymized because it is ignored
        assert.ok(result.cleanText.includes('Marie'), 'Marie should remain intact in cleanText');
        assert.ok(!result.cleanText.includes('[Personne 1]'), 'Marie should not be masked with Personne');

        // Check HTML output formatting
        assert.ok(result.htmlOutput.includes('chip-ignored'), 'Ignored term should have chip-ignored class in HTML');
        assert.ok(result.htmlOutput.includes('data-term="marie"'), 'Should carry data-term="marie" attribute');

        // Now remove marie from ignoredTerms and verify it is re-anonymized
        engine.state.ignoredTerms.delete('marie');
        const result2 = engine.runAnonymization(text);
        assert.ok(!result2.cleanText.includes('Marie'), 'Marie should now be anonymized');
        assert.ok(result2.cleanText.includes('[Personne 1]'), 'Marie should now be [Personne 1]');
    });

    await t.test('Lot 1 - Interactive chip click in DOM toggles ignored state and updates UI', () => {
        const inputEl = window.document.getElementById('inputText');
        const outputArea = window.document.getElementById('outputArea');
        const resetBtn = window.document.getElementById('resetIgnoredBtn');

        inputEl.value = "Emma va à l'école.";
        inputEl.dispatchEvent(new window.Event('input'));

        assert.ok(outputArea.querySelector('.anonym-chip'), 'Should render anonym-chip');
        assert.strictEqual(resetBtn.style.display, 'none', 'Reset button should be hidden when no terms are ignored');

        // Click on the chip for Emma
        const chip = outputArea.querySelector('.anonym-chip');
        chip.click();

        assert.ok(engine.state.ignoredTerms.has('emma'), 'Emma should now be in ignoredTerms');
        assert.strictEqual(resetBtn.style.display, 'inline-flex', 'Reset button should be visible when terms are ignored');

        // Click reset exclusions button
        resetBtn.click();
        assert.strictEqual(engine.state.ignoredTerms.size, 0, 'ignoredTerms should be cleared');
        assert.strictEqual(resetBtn.style.display, 'none', 'Reset button should be hidden again');
    });

    await t.test('Lot 1 - AI prompt prefix is defined and copy buttons are present', () => {
        assert.ok(engine.AI_PROMPT_PREFIX, 'AI_PROMPT_PREFIX should be defined');
        assert.ok(engine.AI_PROMPT_PREFIX.includes('LPD/LIPAD'), 'Should mention LPD/LIPAD confidentiality');
        assert.ok(engine.AI_PROMPT_PREFIX.includes('[Élève X]'), 'Should mention [Élève X]');

        const copyAiBtn = window.document.getElementById('copyAiBtn');
        assert.ok(copyAiBtn, 'copyAiBtn element should exist in DOM');
        const copyBtn = window.document.getElementById('copyBtn');
        assert.ok(copyBtn, 'copyBtn element should exist in DOM');
    });

    await t.test('Lot 2.2 - Intelligent roster parsing handles CSV Nom;Prénom, headers, single column and deduplication', () => {
        const parseRoster = engine.parseRosterContent;
        assert.ok(typeof parseRoster === 'function', 'parseRosterContent must be exported');

        // Test 1: Standard Swiss/French school CSV export with header
        const csv1 = `Nom;Prénom;Classe
DUPONT;Lucas;7H-A
BOVARY;Emma;7H-A
MARTIN;Noah;7H-B
Dupont;Lucas;7H-A`; // duplicate

        const res1 = Array.from(parseRoster(csv1));
        assert.deepStrictEqual(res1, ['Lucas Dupont', 'Emma Bovary', 'Noah Martin']);

        // Test 2: Single column with line breaks and spaces
        const csv2 = `Lucas Dupont
Emma
Noah
Mia`;
        const res2 = Array.from(parseRoster(csv2));
        assert.deepStrictEqual(res2, ['Lucas Dupont', 'Emma', 'Noah', 'Mia']);

        // Test 3: Comma-separated list with header "Student Name"
        const csv3 = `Student Name,Degree
Lucas,7H
Emma,7H`;
        const res3 = Array.from(parseRoster(csv3));
        assert.deepStrictEqual(res3, ['Lucas', 'Emma']);

        // Test 4: Tab-separated table
        const csv4 = `Nom\tPrénom
Rey\tCamille
Favre\tArthur`;
        const res4 = Array.from(parseRoster(csv4));
        assert.deepStrictEqual(res4, ['Camille Rey', 'Arthur Favre']);
    });

    await t.test('ENT XLS / XLSX import - Parses Swiss ENT/ISM class roster spreadsheet structure', () => {
        const XLSX = require('../../../assets/js/vendor/xlsx.full.min.js');
        const parseRoster = engine.parseRosterContent;

        // Mock exact ENT export from user's screenshot
        const ws_data = [
            ['ECOLE PRIMAIRE'],
            ['LISTE DE CLASSE', '', '', '', 'Sierre, EP Muraz'],
            ['Année :', '2026-2027'],
            ['Titulaire :', 'Maitre XY'],
            ['2ème enseignant :', 'Maitre XZ'],
            ['Classe :', 'MUR fd : M. XY / Mmme ZX'],
            ['Effectif :', '8 filles, 12 garçons'],
            [],
            ['', 'Degré', 'Identifiant ISM', 'Nom et prénom', 'Date de naissance'],
            ['', 7, 'Nicolas', 'Ancora Alexandre', '[Anonyme]'],
            ['', 7, 'Juliette', 'Boichat Camille Aline Bienvenue', '[Anonyme]'],
            ['', 7, 'Antoine', 'Boichat Gabriel Aloys Céleste', '[Anonyme]'],
            ['', 7, 'Charlotte', 'Cardoso Ramalhete Tomas', '[Anonyme]'],
            ['', 7, 'Robin', 'Ciccorelli Francesca', '[Anonyme]'],
            ['', 7, 'Alice', 'da Silva Ramos Carminho', '[Anonyme]']
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, 'Liste');
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        const imported = parseRoster(buffer);
        assert.ok(Array.isArray(imported), 'Imported roster must be an array');
        assert.strictEqual(imported.length, 6, 'Should extract exactly the 6 students from the ENT table');
        assert.strictEqual(imported[0], 'Ancora Alexandre');
        assert.strictEqual(imported[1], 'Boichat Camille Aline Bienvenue');
        assert.strictEqual(imported[2], 'Boichat Gabriel Aloys Céleste');
        assert.strictEqual(imported[3], 'Cardoso Ramalhete Tomas');
        assert.strictEqual(imported[4], 'Ciccorelli Francesca');
        assert.strictEqual(imported[5], 'da Silva Ramos Carminho');
    });

    await t.test('CSV key option is removed from DOM', () => {
        const downloadKeyBtn = window.document.getElementById('downloadKeyBtn');
        assert.strictEqual(downloadKeyBtn, null, '#downloadKeyBtn must no longer exist in the DOM');
    });

    await t.test('Exported text ends with .txt and download button triggers download properly', () => {
        const downloadBtn = window.document.getElementById('downloadBtn');
        assert.ok(downloadBtn, '#downloadBtn must exist');

        const inputEl = window.document.getElementById('inputText');
        inputEl.value = 'Texte secret pour Lucas.';
        inputEl.dispatchEvent(new window.Event('input'));

        let createdDownloadAttr = null;
        let clicked = false;
        const origCreateElement = window.document.createElement.bind(window.document);
        window.document.createElement = function (tagName) {
            const el = origCreateElement(tagName);
            if (tagName.toLowerCase() === 'a') {
                const origClick = el.click;
                el.click = function () {
                    clicked = true;
                    createdDownloadAttr = el.getAttribute('download') || el.download;
                };
            }
            return el;
        };

        try {
            downloadBtn.click();
            assert.ok(clicked, 'Download button click should trigger a.click()');
            assert.ok(createdDownloadAttr, 'a element should have download attribute');
            assert.ok(createdDownloadAttr.endsWith('.txt'), `Download attribute "${createdDownloadAttr}" must end with .txt`);
        } finally {
            window.document.createElement = origCreateElement;
        }
    });

    await t.test('Mode TBI / Projection toggles projection class and expand/compress icon display', () => {
        const projBtn = window.document.getElementById('projection-toggle-btn');
        assert.ok(projBtn, '#projection-toggle-btn must exist');

        const iconExpand = window.document.getElementById('icon-proj-expand');
        const iconCompress = window.document.getElementById('icon-proj-compress');
        assert.ok(iconExpand, '#icon-proj-expand must exist');
        assert.ok(iconCompress, '#icon-proj-compress must exist');

        // Initially not in projection mode
        window.document.body.classList.remove('projection');

        // Click to enter projection mode
        projBtn.click();
        assert.ok(window.document.body.classList.contains('projection'), 'Body should have .projection class');
        assert.strictEqual(iconExpand.style.display, 'none', 'Expand icon should be hidden in projection mode');
        assert.strictEqual(iconCompress.style.display, 'inline-block', 'Compress icon should be shown in projection mode');

        // Click to exit projection mode
        projBtn.click();
        assert.ok(!window.document.body.classList.contains('projection'), 'Body should no longer have .projection class');
        assert.strictEqual(iconExpand.style.display, 'inline-block', 'Expand icon should be shown in normal mode');
        assert.strictEqual(iconCompress.style.display, 'none', 'Compress icon should be hidden in normal mode');
    });

    await t.test('Bandeau rétractable « Pourquoi anonymiser ? » accordion exists, is collapsed by default, and toggles properly', () => {
        const accordion = window.document.getElementById('whyAnonymizeAccordion');
        assert.ok(accordion, '#whyAnonymizeAccordion must exist');

        const trigger = window.document.getElementById('whyAnonymizeTrigger');
        assert.ok(trigger, '#whyAnonymizeTrigger button must exist');

        const content = window.document.getElementById('whyAnonymizeContent');
        assert.ok(content, '#whyAnonymizeContent container must exist');

        // Collapsed by default
        assert.strictEqual(trigger.getAttribute('aria-expanded'), 'false', 'Trigger should have aria-expanded="false" by default');
        assert.ok(content.hasAttribute('hidden'), 'Content must be hidden by default to avoid cluttering workspace');

        // Content checks: crucial why & 3 golden rules
        const text = content.textContent;
        assert.ok(text.includes('entraînement') || text.includes('fuites de données'), 'Content must mention AI training or data leaks');
        assert.ok(text.includes('3 règles d\'or') || text.includes('règles d\'or'), 'Content must mention the 3 golden rules');
        assert.ok(text.includes('Minimisation') || text.includes('minimisation'), 'Content must mention minimization principle');

        // Toggle open
        trigger.click();
        assert.strictEqual(trigger.getAttribute('aria-expanded'), 'true', 'Trigger should have aria-expanded="true" after click');
        assert.ok(!content.hasAttribute('hidden'), 'Content should no longer be hidden');

        // Toggle close
        trigger.click();
        assert.strictEqual(trigger.getAttribute('aria-expanded'), 'false', 'Trigger should have aria-expanded="false" after second click');
        assert.ok(content.hasAttribute('hidden'), 'Content should be hidden again');
    });
    await t.test('Dates: All dates (birth or simple dates, FR, DE, IT) are replaced by [Date]', () => {
        engine.state.mode = 'labels';
        const text = "Lucas est né le 14.05.2013 (11 ans). Une rencontre aura lieu le 24 octobre avec M. Martin ou le 12/11/2025. Geboren am 5. Mai 2012 in Zürich, nato il 3 maggio 2014.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('[Date de naissance]'), 'Must not contain [Date de naissance]');
        assert.ok(/\[Date(?:\s+\d+)?\]/.test(result.cleanText), 'Must contain [Date] or [Date X]');
        assert.ok(!result.cleanText.includes('14.05.2013'), 'Original date 14.05.2013 should be redacted');
        assert.ok(!result.cleanText.includes('24 octobre'), 'Original date 24 octobre should be redacted');
        assert.ok(!result.cleanText.includes('12/11/2025'), 'Original date 12/11/2025 should be redacted');
        assert.ok(!result.cleanText.includes('5. Mai 2012'), 'German date 5. Mai 2012 should be redacted');
        assert.ok(!result.cleanText.includes('3 maggio 2014'), 'Italian date 3 maggio 2014 should be redacted');
        assert.ok(/\[Âge(?:\s+\d+)?\]/.test(result.cleanText), 'Age should be labeled [Âge] or [Âge X]');
    });

    await t.test('Common names: Recognizes Lionel and single common names', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const text = "Lionel a participé activement au cours avec Léon et Patrick.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('Lionel'), 'Lionel should be redacted');
        assert.ok(!result.cleanText.includes('Léon'), 'Léon should be redacted');
        assert.ok(!result.cleanText.includes('Patrick'), 'Patrick should be redacted');
        assert.ok(result.cleanText.includes('[Personne 1]'), 'Should be [Personne 1]');
        assert.ok(result.cleanText.includes('[Personne 2]'), 'Should be [Personne 2]');
        assert.ok(result.cleanText.includes('[Personne 3]'), 'Should be [Personne 3]');
    });

    await t.test('Heuristic NER: Finds Firstname + Lastname without database and propagates single mentions', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        // Lionel Favre is not in the swiss names list as a full name, Favre is unknown
        const text = "Observation pour Lionel Favre : très bon bilan. Plus tard, Lionel a continué ses efforts avec Favre.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('Lionel Favre'), 'Lionel Favre should be redacted');
        assert.ok(!result.cleanText.includes('Lionel a'), 'Standalone Lionel should be redacted');
        assert.ok(!result.cleanText.includes('avec Favre'), 'Standalone Favre should be redacted');
        // Both full name and isolated parts should map to the same [Personne 1]
        const personne1Matches = result.cleanText.match(/\[Personne 1\]/g) || [];
        assert.strictEqual(personne1Matches.length, 3, 'Lionel Favre, Lionel and Favre must all resolve to [Personne 1]');
    });

    await t.test('Compound names and hyphenated surnames are fully anonymized', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const text = "Rencontre avec M. Jean-Pierre Dupont-Moretti et Mme Anne-Claire Rochat-Favre.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('Jean-Pierre'), 'Compound first name should be redacted');
        assert.ok(!result.cleanText.includes('Dupont-Moretti'), 'Compound last name should be redacted');
        assert.ok(!result.cleanText.includes('Anne-Claire'), 'Compound first name Anne-Claire should be redacted');
        assert.ok(!result.cleanText.includes('Rochat-Favre'), 'Compound surname Rochat-Favre should be redacted');
        assert.ok(result.cleanText.includes('[Personne 1]'));
        assert.ok(result.cleanText.includes('[Personne 2]'));
    });

    await t.test('Multi-country phone numbers (FR, DE, AT, IT, CH)', () => {
        engine.state.mode = 'labels';
        const text = "Contacts: CH 079 123 45 67, FR 06 12 34 56 78, DE 0151 12345678, AT 0664 1234567, IT 333 1234567, Intl +33 1 42 68 10 20.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('079 123 45 67'), 'Swiss phone redacted');
        assert.ok(!result.cleanText.includes('06 12 34 56 78'), 'French phone redacted');
        assert.ok(!result.cleanText.includes('0151 12345678'), 'German phone redacted');
        assert.ok(!result.cleanText.includes('0664 1234567'), 'Austrian phone redacted');
        assert.ok(!result.cleanText.includes('333 1234567'), 'Italian phone redacted');
        assert.ok(!result.cleanText.includes('+33 1 42 68 10 20'), 'Intl phone redacted');
        assert.strictEqual(result.replacements.filter(r => r.type === 'phone').length, 6);
    });

    await t.test('Multi-country addresses and postal codes (FR, DE, AT, IT, CH)', () => {
        engine.state.mode = 'labels';
        const text = "Adresses: 1950 Sion, 75001 Paris, D-10115 Berlin, A-1010 Wien, 20121 Milano.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('1950 Sion'), 'Swiss postal city redacted');
        assert.ok(!result.cleanText.includes('75001 Paris'), 'French postal city redacted');
        assert.ok(!result.cleanText.includes('D-10115 Berlin'), 'German postal city redacted');
        assert.ok(!result.cleanText.includes('A-1010 Wien'), 'Austrian postal city redacted');
        assert.ok(!result.cleanText.includes('20121 Milano'), 'Italian postal city redacted');
    });

    await t.test('Official identifiers: Swiss AVS, French NIR (Social Security) and Italian Codice Fiscale', () => {
        engine.state.mode = 'labels';
        const text = "Identifiants: AVS 756.1234.5678.90, NIR 1 85 12 75 108 123 45, CF RSSMRA85M01H501Z.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('756.1234.5678.90'), 'AVS redacted');
        assert.ok(!result.cleanText.includes('1 85 12 75 108 123 45'), 'NIR redacted');
        assert.ok(!result.cleanText.includes('RSSMRA85M01H501Z'), 'Codice Fiscale redacted');
        assert.strictEqual(result.replacements.filter(r => r.type === 'avs').length, 3);
    });
    await t.test('Reverse anonymization: Re-injects real names into AI responses', () => {
        engine.state.mode = 'labels';
        engine.state.roster = ['Lucas Dupont', 'Emma Bovary'];
        const text = "Lucas Dupont a bien travaillé avec Emma Bovary.";
        const anonymized = engine.runAnonymization(text);

        // Simulate AI answering using the tags [Élève 1] and [Élève 2]
        const aiResponse = "Pour [Élève 1], proposer des exercices de géométrie. Pour [Élève 2], encourager la lecture.";
        const restored = engine.reverseAnonymization(aiResponse);

        assert.strictEqual(
            restored,
            "Pour Lucas Dupont, proposer des exercices de géométrie. Pour Emma Bovary, encourager la lecture.",
            "Should accurately replace [Élève 1] by Lucas Dupont and [Élève 2] by Emma Bovary"
        );

        // Modal elements check in DOM
        const revertBtn = window.document.getElementById('revertAiBtn');
        const revertModal = window.document.getElementById('revertModal');
        assert.ok(revertBtn, '#revertAiBtn should exist in DOM');
        assert.ok(revertModal, '#revertModal should exist in DOM');
    });

    await t.test('Real-world email exchange: Consistent identity mapping, no false positive street, dot after phone preserved', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const sampleEmail = `Cours Wikimedia pour Bibliothécaires
Vivian Epiney

Jean Marc Wyss
Hello Jean-Marc,

Pourrais-tu stp répondre à la question de Lionel Walter sur les supports GLAM ?

Merci et belle fin de journée !

Vivian Epiney
Wikimedia CH
From: Lionel Walter <lionel.walter@arbim.ch>
Sent: 03 November 2026 12:07
To: Vivian Epiney <vivian.epiney@wikimedia.ch>
Cc: Jean Marc Wyss <jean.marc.wyss@wikimedia.ch>
Subject: Re: Cours Wikimedia pour Bibliothécaires
 
Salut Vivian,

C'est comme tu veux. Le 24.11, ce sera le début de l'introduction à openrefine.

Uploading Image Collections to Wikimedia Commons with OpenRefine
Joris Burla, Head Collection Documentation, Museum Rietberg

Voici les coordonnées de Eliane Blumer : blumer.eliane@hispeed.ch, 079 728 47 41. Elle était là en 2024.

Les mardis 10.11, 17.11, 24.11, 1.12 et 8.12 à Yverdon.

--
Lionel Walter
arbim IT
Rue Faller 2, 1202 Genève
+41 76 499 12 32`;

        const result = engine.runAnonymization(sampleEmail);

        // 1. Cours Wikimedia must NOT be detected as a street address
        assert.ok(!result.cleanText.includes('[Adresse] pour'), 'Cours Wikimedia should not be converted to [Adresse]');
        assert.ok(result.cleanText.includes('Cours Wikimedia pour Bibliothécaires'), 'Title intact');

        // 2. Identity unification: "Vivian Epiney" and "Vivian" share the same Person tag
        assert.ok(!/\[Personne \d+\]-[Personne \d+]/.test(result.cleanText), 'Compound names should not be split into two separate tags');
        assert.ok(!/\[Personne (\d+)\][ \t]+\[Personne \1\]/.test(result.cleanText), 'No consecutive duplicate person tags');

        // 3. Dot after phone number must be preserved
        assert.ok(result.cleanText.includes('. Elle était là'), 'Punctuation dot after phone number must not be swallowed');

        // 4. Non-person entities remain intact
        assert.ok(result.cleanText.includes('Wikimedia Commons'), 'Wikimedia Commons preserved');
        assert.ok(result.cleanText.includes('arbim IT'), 'arbim IT preserved');

        // 5. Short dates properly handled
        assert.ok(!result.cleanText.includes('24.11'), 'Date 24.11 anonymized');
        assert.ok(!result.cleanText.includes('1.12'), 'Date 1.12 anonymized');
    });

    // =========================================================================
    // REGRESSION TESTS FOR REALISTIC DATA ENGINE HARDENING
    // =========================================================================

    await t.test('Group 1.1 - Heuristic pair & propagation: Non-dictionary names don\'t leak (Kilian Moix)', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const text = "Kilian a perturbé la séance. Ensuite Kilian Moix est sorti de la classe.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('Kilian'), 'Kilian should be completely masked');
        assert.ok(!result.cleanText.includes('Moix'), 'Moix should be completely masked');
        assert.ok(result.cleanText.includes('Ensuite'), 'Sentence connector Ensuite must NOT be swallowed');
        assert.strictEqual(
            result.cleanText,
            "[Personne 1] a perturbé la séance. Ensuite [Personne 1] est sorti de la classe.",
            "Both instances of Kilian must be mapped to the same Person tag"
        );
    });

    await t.test('Group 1.2 - URLs and social handles don\'t leak surnames or birth years', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const text = "Profil élève: https://instagram.com/lucas.dupont et compte @lucas_dupont2013 à surveiller.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('lucas.dupont'), 'URL payload must not leak student identity');
        assert.ok(!result.cleanText.includes('lucas_dupont2013'), 'Social handle must not leak username/year');
        assert.ok(!result.cleanText.includes('2013'), 'Birth year in handle must not leak');
        assert.ok(result.cleanText.includes('[Lien 1]'), 'URL should be masked as [Lien 1]');
        assert.ok(result.cleanText.includes('[Identifiant 1]'), 'Handle should be masked as [Identifiant 1]');
    });

    await t.test('Group 1.3 - Year-only and Month+Year dates are masked', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const text = "Élève 1: Né en 2013. Élève 2: né en mai 2014 dans le canton de Vaud.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('2013'), 'Birth year 2013 must be masked');
        assert.ok(!result.cleanText.includes('mai 2014'), 'Month and year mai 2014 must be masked');
        assert.ok(result.cleanText.includes('[Date 1]'), 'First date tag present');
        assert.ok(result.cleanText.includes('[Date 2]'), 'Second date tag present');
    });

    await t.test('Group 1.4 - Ages written out in words are detected and masked', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const text = "L'enfant a douze ans et son frère est âgé de huit ans et demi.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('douze ans'), 'Age written in words (douze ans) must be masked');
        assert.ok(!result.cleanText.includes('huit ans'), 'Age written in words (huit ans) must be masked');
        assert.ok(result.cleanText.includes('[Âge 1]'), 'First age tag present');
        assert.ok(result.cleanText.includes('[Âge 2]'), 'Second age tag present');
    });

    await t.test('Group 1.5 - Phone number with (+41) country code is recognized', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const text = "Numéro d'urgence des parents: (+41) 79 123 45 67.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('79 123 45 67'), 'Phone number must be masked');
        assert.ok(result.cleanText.includes('[Téléphone 1]'), 'Tag [Téléphone 1] must be present');
    });

    await t.test('Group 1.6 - Lowercase street type followed by "de" is matched', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const text = "Adresse du domicile: route de Bramois 12.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('route de Bramois 12'), 'Street address must be masked');
        assert.ok(result.cleanText.includes('[Adresse 1]'), 'Address tag must be present');
    });

    await t.test('Group 1.7 - Class 9CO and school pattern "école primaire de Vétroz" are matched', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const text = "Affecté en 9CO à l'école primaire de Vétroz pour l'année scolaire.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('9CO'), 'Class 9CO must be masked');
        assert.ok(!result.cleanText.includes('école primaire de Vétroz'), 'School name must be masked');
        assert.ok(result.cleanText.includes('[Classe 1]'), 'First school_class tag present');
        assert.ok(result.cleanText.includes('[Classe 2]'), 'Second school_class tag present');
    });

    await t.test('Group 1.8 - Accent-insensitive roster matching (Chloe matches Chloé Martin)', () => {
        engine.state.mode = 'labels';
        engine.state.roster = ['Chloé Martin'];
        const text = "Chloe a terminé ses devoirs à temps.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('Chloe'), 'Chloe without accent must be matched to roster student');
        assert.ok(result.cleanText.includes('[Élève 1]'), 'Should be masked with student tag [Élève 1]');
    });

    await t.test('Group 1.9 - Possible names warning banner detects unmasked capitalized words and one-click masks', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const inputEl = window.document.getElementById('inputText');
        const possibleBar = window.document.getElementById('possibleNamesBar');
        const possibleChips = window.document.getElementById('possibleNamesChips');
        const outputArea = window.document.getElementById('outputArea');

        // Text with a rare name that is mid-sentence and not in built-in list or roster
        inputEl.value = "Hier, j'ai rencontré Sylvanie pour discuter de ses progrès.";
        inputEl.dispatchEvent(new window.Event('input'));

        assert.strictEqual(possibleBar.style.display, 'flex', 'Warning banner should be displayed');
        assert.ok(possibleChips.innerHTML.includes('Sylvanie'), 'Banner chips must include Sylvanie');

        // Click the chip to mask Sylvanie in one click
        const chipBtn = possibleChips.querySelector('.possible-name-btn');
        assert.ok(chipBtn, 'Chip button must exist');
        chipBtn.click();

        // Sylvanie is now in roster and masked
        assert.ok(engine.state.roster.some(r => r.toLowerCase() === 'sylvanie'), 'Sylvanie should be added to roster');
        assert.ok(!outputArea.textContent.includes('Sylvanie'), 'Sylvanie should now be masked in the output');
        assert.ok(outputArea.textContent.includes('[Élève 1]'), 'Sylvanie should be masked as [Élève 1]');
    });

    await t.test('Group 2 - Pseudonym mode preserves shared surnames and matches gender', () => {
        engine.state.mode = 'pseudo';
        engine.state.roster = [];
        const text = "Lucas Dupont et Emma Rey parlent avec Sophie Dupont. Mme Sophie Dupont confirme.";
        const result = engine.runAnonymization(text);

        assert.ok(!result.cleanText.includes('Lucas Dupont'), 'Original name Lucas Dupont must be replaced');
        assert.ok(!result.cleanText.includes('Sophie Dupont'), 'Original name Sophie Dupont must be replaced');
        assert.ok(!result.cleanText.includes('Emma Rey'), 'Original name Emma Rey must be replaced');

        // Extract pseudonyms assigned to Lucas Dupont and Sophie Dupont
        const mLucas = result.replacements.find(r => r.original === 'Lucas Dupont');
        const mSophie = result.replacements.find(r => r.original === 'Sophie Dupont');
        const mEmma = result.replacements.find(r => r.original === 'Emma Rey');

        assert.ok(mLucas && mSophie && mEmma, 'All full names should be matched as replacements');

        const [lucasFirst, lucasLast] = mLucas.replacementText.split(/\s+/);
        const [sophieFirst, sophieLast] = mSophie.replacementText.split(/\s+/);

        // Family consistency: Lucas and Sophie share the same surname Dupont -> must receive the SAME pseudo surname
        assert.strictEqual(lucasLast, sophieLast, 'Shared surname Dupont must result in consistent pseudo surname for both family members');

        // Gender consistency: Sophie must receive a female first name (e.g. Camille, Éléonore, Clara, Sophie...)
        const femaleNames = ['Camille', 'Éléonore', 'Clara', 'Sophie', 'Inès', 'Juliette', 'Charlotte', 'Alice', 'Mathilde', 'Noémie', 'Romane', 'Justine', 'Emma', 'Chloé', 'Léa', 'Sarah', 'Louise', 'Manon'];
        assert.ok(femaleNames.includes(sophieFirst), `Sophie must receive a female pseudonym first name (got ${sophieFirst})`);

        // Mme Sophie Dupont must keep Mme and not have a male first name
        assert.ok(result.cleanText.includes(`Mme ${sophieFirst} ${sophieLast}`), 'Mme Sophie Dupont must become Mme [FemaleFirstName] [Surname]');
    });

    await t.test('Group 3 - Numbered tags and fresh correspondence table on every run', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];

        // First run with 2 distinct dates, 2 addresses, 2 classes
        const text1 = "Élève né le 14.05.2013 à Rue des Châteaux 14 en classe 7H. Déménagé le 20.09.2024 à Avenue de la Gare 5 en classe 8H.";
        const res1 = engine.runAnonymization(text1);

        assert.ok(res1.cleanText.includes('[Date 1]'), 'Date 1 present');
        assert.ok(res1.cleanText.includes('[Date 2]'), 'Date 2 present');
        assert.ok(res1.cleanText.includes('[Adresse 1]'), 'Adresse 1 present');
        assert.ok(res1.cleanText.includes('[Adresse 2]'), 'Adresse 2 present');
        assert.ok(res1.cleanText.includes('[Classe 1]'), 'Classe 1 present');
        assert.ok(res1.cleanText.includes('[Classe 2]'), 'Classe 2 present');

        // AI reply referencing both numbered dates and addresses
        const aiReply = "L'enfant est né le [Date 1] ([Adresse 1], [Classe 1]) et réside désormais à [Adresse 2] ([Classe 2]) depuis le [Date 2].";
        const restored = engine.reverseAnonymization(aiReply);

        assert.ok(restored.includes('14.05.2013'), 'First date restored at [Date 1]');
        assert.ok(restored.includes('Rue des Châteaux 14'), 'First address restored at [Adresse 1]');
        assert.ok(restored.includes('20.09.2024'), 'Second date restored at [Date 2]');
        assert.ok(restored.includes('Avenue de la Gare 5'), 'Second address restored at [Adresse 2]');

        // Second run with completely new text: correspondence table must be rebuilt, no stale tags
        const text2 = "Nouvel élève à Chemin Neuf 1.";
        const res2 = engine.runAnonymization(text2);
        assert.strictEqual(engine.state.reverseMap.get('[Date 1]'), undefined, 'Old tags from run 1 must not persist in run 2');
        assert.ok(res2.cleanText.includes('[Adresse 1]'), 'Run 2 starts counting anew at [Adresse 1]');
    });

    await t.test('Group 4.1 - Sentence starter "Cependant" is not swallowed with following name', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const text = "Cependant Martin travaille consciencieusement.";
        const result = engine.runAnonymization(text);

        assert.ok(result.cleanText.includes('Cependant [Personne 1] travaille'), 'Word Cependant must remain intact and Martin must be masked');
        assert.ok(!result.cleanText.includes('[Personne 2] travaille'), 'Cependant must not be swallowed into a Person tag');
    });

    await t.test('Group 4.2 - Common nouns (une rose, une pierre) are not masked as person names', () => {
        engine.state.mode = 'labels';
        engine.state.roster = [];
        const text = "Pierre a ramassé une pierre et Rose a cueilli une rose. J'ai aussi acheté du jade.";
        const result = engine.runAnonymization(text);

        // Capitalized Pierre and Rose as persons are masked
        assert.ok(!result.cleanText.includes('Pierre a ramassé'), 'Capitalized Pierre must be masked');
        assert.ok(!result.cleanText.includes('Rose a cueilli'), 'Capitalized Rose must be masked');

        // Common nouns after articles must NOT be masked
        assert.ok(result.cleanText.includes('une pierre'), 'une pierre must remain intact as common noun');
        assert.ok(result.cleanText.includes('une rose'), 'une rose must remain intact as common noun');
        assert.ok(result.cleanText.includes('du jade'), 'du jade must remain intact as common noun');
    });

    await t.test('Group 5 - Dynamic prompt prefix matches active mode', () => {
        const labelsPrefix = engine.getAiPromptPrefix('labels');
        const pseudoPrefix = engine.getAiPromptPrefix('pseudo');
        const redactPrefix = engine.getAiPromptPrefix('redact');

        assert.ok(labelsPrefix.includes('[Élève X]'), 'Labels mode prompt mentions [Élève X]');
        assert.ok(pseudoPrefix.includes('pseudonymes réalistes'), 'Pseudo mode prompt mentions pseudonymes');
        assert.ok(!pseudoPrefix.includes('[Élève X]'), 'Pseudo mode prompt does not mention [Élève X]');
        assert.ok(redactPrefix.includes('████████'), 'Redact mode prompt mentions blocks ████████');
    });
});
