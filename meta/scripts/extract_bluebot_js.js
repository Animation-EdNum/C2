/**
 * extract_bluebot_js.js — Extracts inline JS from simulateur_bluebot.html
 * into a separate js/bluebot.js file.
 * 
 * Usage: node scripts/extract_bluebot_js.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HTML_FILE = path.join(ROOT, 'webapps', 'simulateur_bluebot.html');
const OUTPUT_JS = path.join(ROOT, 'js', 'bluebot.js');

const lines = fs.readFileSync(HTML_FILE, 'utf-8').split(/\r?\n/);

// Block 1: main script (lines 2551-5417, 0-indexed: 2550-5416)
const block1 = lines.slice(2550, 5417);

// Block 2: init script (lines 5428-5499, 0-indexed: 5427-5498)
const block2 = lines.slice(5427, 5499);

const jsContent = [...block1, '', ...block2].join('\n');

fs.writeFileSync(OUTPUT_JS, jsContent, 'utf-8');
console.log(`✅ Extracted ${block1.length + block2.length} lines to ${OUTPUT_JS}`);
console.log(`   File size: ${(fs.statSync(OUTPUT_JS).size / 1024).toFixed(0)} Ko`);
