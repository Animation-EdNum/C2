/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DIRECTORIES_TO_SCAN = ['webapps', 'assets', 'alpha'];
const ROOT_FILES = [
    './',
    './index.html',
    './indexC1.html',
    './manifest.json',
    './merci.html'
];

function getFiles(dir, files = []) {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            // Convert to posix path format (for Windows support if needed) and ensure it starts with ./
            const posixPath = './' + name.split(path.sep).join('/');
            files.push(posixPath);
        }
    }
    return files;
}

function compileCSS() {
    const cssDir = path.join(__dirname, '..', '..', 'assets', 'css');
    const filesToBundle = ['tokens.css', 'base.css', 'components.css', 'utilities.css'];

    let bundledContent = `/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/* ==========================================================================
   shared.css — Fichier CSS groupé généré automatiquement.
   Ne pas modifier directement. Modifiez les fichiers sources séparés :
   - tokens.css
   - base.css
   - components.css
   - utilities.css
   ========================================================================== */\n\n`;

    for (const file of filesToBundle) {
        const filePath = path.join(cssDir, file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            // Remove SPDX headers / license comments from nested files to avoid duplication
            content = content.replace(/\/\*[\s\S]*?SPDX-License-Identifier[\s\S]*?\*\/\r?\n?/, '');
            bundledContent += `/* --- Début de ${file} --- */\n` + content.trim() + '\n\n';
        } else {
            console.warn(`Warning: CSS file to bundle not found: ${file}`);
        }
    }

    const outputPath = path.join(cssDir, 'shared.css');
    fs.writeFileSync(outputPath, bundledContent, 'utf8');
    console.log('Successfully bundled shared.css.');
}

function generateManifest() {
    compileCSS();
    let allFiles = [...ROOT_FILES];

    for (const dir of DIRECTORIES_TO_SCAN) {
        if (fs.existsSync(dir)) {
            const filesInDir = getFiles(dir);
            allFiles = allFiles.concat(filesInDir);
        }
    }

    // Sort to maintain deterministic order, formatting
    allFiles.sort();
    // Reorder to put ROOT_FILES first for readability
    const finalAssets = [...ROOT_FILES, ...allFiles.filter(f => !ROOT_FILES.includes(f))];

    const swPath = path.join(__dirname, '..', '..', 'sw.js');
    if (!fs.existsSync(swPath)) {
        console.error('sw.js not found in repository root');
        process.exit(1);
    }

    let swContent = fs.readFileSync(swPath, 'utf8');

    // Regex to match the ASSETS array block
    const assetRegex = /const ASSETS = \[\s*[\s\S]*?\s*\];/;

    if (!assetRegex.test(swContent)) {
        console.error('Could not find ASSETS array in sw.js');
        process.exit(1);
    }

    // Format the new array string
    const assetString = `const ASSETS = [\n    ${finalAssets.map(f => `'${f}'`).join(',\n    ')}\n];`;

    swContent = swContent.replace(assetRegex, assetString);

    // Dynamic cache-busting based on file content hash
    const hash = crypto.createHash('md5');
    for (const file of finalAssets) {
        if (file === './') continue; // Skip directory reference
        const filePath = path.join(__dirname, '..', '..', file);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            hash.update(fs.readFileSync(filePath));
        }
    }
    const version = hash.digest('hex').substring(0, 8);

    const cacheRegex = /const CACHE_NAME = 'ednum-[^']*'/;

    if (cacheRegex.test(swContent)) {
        swContent = swContent.replace(cacheRegex, `const CACHE_NAME = 'ednum-${version}'`);
    } else {
        // Fallback to match any initial CACHE_NAME definition
        const fallbackRegex = /const CACHE_NAME = '[^']*'/;
        swContent = swContent.replace(fallbackRegex, `const CACHE_NAME = 'ednum-${version}'`);
    }

    fs.writeFileSync(swPath, swContent, 'utf8');
    console.log(`Successfully updated sw.js with cache version ednum-${version} and ${finalAssets.length} assets.`);
}

generateManifest();
