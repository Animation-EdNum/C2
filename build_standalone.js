const fs = require('fs');
const path = require('path');

const WEBAPPS_DIR = path.join(__dirname, 'webapps');
const RESSOURCES_DIR = path.join(__dirname, 'ressources');
const STANDALONE_WEBAPPS_DIR = path.join(__dirname, 'standalone', 'webapps');
const STANDALONE_RESSOURCES_DIR = path.join(__dirname, 'standalone', 'ressources');
const STANDALONE_FONTS_DIR = path.join(__dirname, 'standalone', 'fonts');

function ensureDirSync(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function processFile(filePath, outDir) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove <link rel="icon" ...>
    content = content.replace(/\s*<link\s+rel="icon"[^>]*>\n?/gi, '\n');

    // Keep og meta tags

    // The previous standalone script injected shared.css with `<style>\n        /* === shared.css inliné === */`
    // Let's match how we format it.
    const cssPath = path.join(__dirname, 'css', 'shared.css');
    if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        content = content.replace(
            /\s*<link\s+rel="stylesheet"\s+href="\.\.\/css\/shared\.css"\s*\/?>/gi,
            `\n    <style>\n        /* === shared.css inliné === */\n${cssContent}\n    </style>`
        );
    }

    const lucidePath = path.join(__dirname, 'js', 'lucide.min.js');
    if (fs.existsSync(lucidePath)) {
        const lucideContent = fs.readFileSync(lucidePath, 'utf8');
        content = content.replace(
            /\s*<script\s+src="\.\.\/js\/lucide\.min\.js"><\/script>/gi,
            `\n    <script>\n        /* === lucide.min.js inliné === */\n${lucideContent}\n    </script>`
        );
    }

    const themePath = path.join(__dirname, 'js', 'theme.js');
    if (fs.existsSync(themePath)) {
        const themeContent = fs.readFileSync(themePath, 'utf8');
        content = content.replace(
            /\s*<script\s+src="\.\.\/js\/theme\.js"><\/script>/gi,
            `\n    <script>\n        /* === theme.js inliné === */\n${themeContent}\n    </script>`
        );
    }

    const fileName = path.basename(filePath);
    const outPath = path.join(outDir, fileName);
    fs.writeFileSync(outPath, content);
    console.log(`Processed: ${fileName} -> ${outPath}`);
}

function processDirectory(inDir, outDir) {
    if (!fs.existsSync(inDir)) return;
    ensureDirSync(outDir);
    const files = fs.readdirSync(inDir);
    for (const file of files) {
        if (file.endsWith('.html')) {
            processFile(path.join(inDir, file), outDir);
        }
    }
}

function copyFonts() {
    ensureDirSync(STANDALONE_FONTS_DIR);
    const fontsDir = path.join(__dirname, 'fonts');
    if (fs.existsSync(fontsDir)) {
        const files = fs.readdirSync(fontsDir);
        for (const file of files) {
            fs.copyFileSync(path.join(fontsDir, file), path.join(STANDALONE_FONTS_DIR, file));
        }
    }
}

// 1. Setup standalone structure
ensureDirSync(path.join(__dirname, 'standalone'));
copyFonts();
processDirectory(WEBAPPS_DIR, STANDALONE_WEBAPPS_DIR);
processDirectory(RESSOURCES_DIR, STANDALONE_RESSOURCES_DIR);

console.log('Standalone build complete.');
