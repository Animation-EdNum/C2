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

    // Dynamic cache-busting timestamp version (e.g., ednum-20260520-1520)
    const now = new Date();
    const pad = num => String(num).padStart(2, '0');
    const version = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
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
