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
});


