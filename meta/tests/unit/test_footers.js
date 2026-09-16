/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

function walkHtmlFiles(dir, rootDir = dir) {
    let files = [];
    for (const f of fs.readdirSync(dir)) {
        if (f === 'node_modules' || f === '.git') continue;
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(walkHtmlFiles(fullPath, rootDir));
        } else if (f.endsWith('.html')) {
            files.push(path.relative(rootDir, fullPath));
        }
    }
    return files;
}

test('HTML files - standard footer and legal compliance', async (t) => {
    const rootDir = path.resolve(__dirname, '../../..');
    const htmlFiles = walkHtmlFiles(rootDir, rootDir);

    assert.ok(htmlFiles.length >= 31, `Expected at least 31 HTML files, found ${htmlFiles.length}`);

    for (const relFile of htmlFiles) {
        await t.test(`Footer in ${relFile}`, () => {
            const filePath = path.join(rootDir, relFile);
            const content = fs.readFileSync(filePath, 'utf8');

            const footerMatch = content.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);
            assert.ok(footerMatch, `File ${relFile} should contain a <footer> element`);

            const footerText = footerMatch[1];
            const depth = relFile.split(path.sep).length - 1;
            const prefix = depth === 0 ? '' : '../'.repeat(depth);

            // Mandatory text and links
            assert.ok(
                footerText.includes('Code 100% libre'),
                `File ${relFile} footer should contain "Code 100% libre"`
            );
            assert.ok(
                footerText.includes('https://github.com/Animation-EdNum/C2'),
                `File ${relFile} footer should link to the GitHub repo`
            );
            assert.ok(
                footerText.includes('AGPL-3.0'),
                `File ${relFile} footer should mention AGPL-3.0 license`
            );
            assert.ok(
                footerText.includes('https://www.gnu.org/licenses/agpl-3.0.html'),
                `File ${relFile} footer should link to AGPL-3.0 license URL`
            );
            assert.ok(
                footerText.includes(`${prefix}mentions-legales.html`),
                `File ${relFile} footer should link to ${prefix}mentions-legales.html`
            );
            assert.ok(
                footerText.includes(`${prefix}confidentialite.html`),
                `File ${relFile} footer should link to ${prefix}confidentialite.html`
            );
            assert.ok(
                footerText.includes(`${prefix}cgu.html`),
                `File ${relFile} footer should link to ${prefix}cgu.html`
            );
            assert.ok(
                footerText.includes(`${prefix}merci.html`),
                `File ${relFile} footer should link to ${prefix}merci.html`
            );
            assert.ok(
                footerText.includes('AP EdNum, HEP-VS'),
                `File ${relFile} footer should mention AP EdNum, HEP-VS`
            );
        });
    }
});
