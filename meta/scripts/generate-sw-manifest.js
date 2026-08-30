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
        if (file.startsWith('.') || file === 'Thumbs.db') continue;
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            files.push(name);
        }
    }
    return files;
}


function generateManifest() {
    const isCheckMode = process.argv.includes('--check');
    const rootDir = path.resolve(path.join(__dirname, '..', '..'));
    let allFiles = [...ROOT_FILES];

    for (const dir of DIRECTORIES_TO_SCAN) {
        const fullDirPath = path.join(rootDir, dir);
        if (fs.existsSync(fullDirPath)) {
            const filesInDir = getFiles(fullDirPath).map(f => {
                // Relativize path to rootDir and prefix with ./
                const rel = path.relative(rootDir, f).split(path.sep).join('/');
                return './' + rel;
            });
            allFiles = allFiles.concat(filesInDir);
        }
    }

    // Sort to maintain deterministic order, formatting
    allFiles.sort();
    // Reorder to put ROOT_FILES first for readability
    const finalAssets = [...ROOT_FILES, ...allFiles.filter(f => !ROOT_FILES.includes(f))];

    const swPath = path.join(rootDir, 'sw.js');
    if (!fs.existsSync(swPath)) {
        console.error('sw.js not found in repository root');
        process.exit(1);
    }

    const originalContent = fs.readFileSync(swPath, 'utf8');
    let swContent = originalContent;

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
    const hash = crypto.createHash('sha256');
    const TEXT_EXTS = ['.html', '.css', '.js', '.json', '.svg', '.md', '.txt'];
    for (const file of finalAssets) {
        if (file === './') continue; // Skip directory reference
        const filePath = path.join(rootDir, file);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const content = fs.readFileSync(filePath);
            const ext = path.extname(filePath).toLowerCase();
            if (TEXT_EXTS.includes(ext)) {
                // Normalize CRLF to LF for deterministic cross-platform hashing (Windows vs Linux CI)
                const normalized = content.toString('utf8').replace(/\r\n/g, '\n');
                hash.update(normalized);
            } else {
                hash.update(content);
            }
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

    if (isCheckMode) {
        if (swContent.replace(/\r\n/g, '\n') === originalContent.replace(/\r\n/g, '\n')) {
            console.log(`✅ sw.js is up to date (cache version: ednum-${version}, ${finalAssets.length} assets).`);
            process.exit(0);
        } else {
            console.error(`❌ sw.js is outdated!`);
            console.error(`Expected cache version: ednum-${version} with ${finalAssets.length} assets.`);
            console.error(`Run 'npm run build:sw' to update sw.js.`);
            process.exit(1);
        }
    } else {
        fs.writeFileSync(swPath, swContent, 'utf8');
        console.log(`Successfully updated sw.js with cache version ednum-${version} and ${finalAssets.length} assets.`);
    }
}

generateManifest();
