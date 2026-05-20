/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const fs = require('fs');
const path = require('path');

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

function generateManifest() {
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

    fs.writeFileSync(swPath, swContent, 'utf8');
    console.log(`Successfully updated sw.js with ${finalAssets.length} assets.`);
}

generateManifest();
