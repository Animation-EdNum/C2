/**
 * generate_lucide_subset.js
 * 
 * Script one-shot qui lit lucide.min.js et génère un fichier
 * js/lucide-subset.js ne contenant que les icônes réellement
 * utilisées dans le projet.
 * 
 * Usage : node scripts/generate_lucide_subset.js
 * 
 * Le script :
 * 1. Scanne tous les fichiers HTML du projet pour trouver les data-lucide="..."
 * 2. Évalue lucide.min.js pour extraire les définitions d'icônes
 * 3. Génère un nouveau fichier JS avec la même API (lucide.createIcons())
 *    mais ne contenant que les icônes nécessaires.
 * 
 * Après exécution, remplacer dans chaque HTML :
 *   <script src="../js/lucide.min.js"></script>
 * par :
 *   <script src="../js/lucide-subset.js"></script>
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LUCIDE_SOURCE = path.join(ROOT, 'js', 'lucide.min.js');
const OUTPUT_FILE = path.join(ROOT, 'js', 'lucide-subset.js');

// Directories to scan for icon usage
const SCAN_DIRS = [
    path.join(ROOT, 'webapps'),
    path.join(ROOT, 'ressources'),
    path.join(ROOT, 'alpha', 'webapps'),
];
const SCAN_FILES = [path.join(ROOT, 'index.html')];

// ── Step 1: Find all icon names used ──
function findUsedIcons() {
    const icons = new Set();
    const regex = /data-lucide="([^"]+)"/g;

    function scanFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        let match;
        while ((match = regex.exec(content)) !== null) {
            // Skip template literals like ${icon}
            if (!match[1].startsWith('$')) {
                icons.add(match[1]);
            }
        }
    }

    for (const dir of SCAN_DIRS) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
        for (const file of files) {
            scanFile(path.join(dir, file));
        }
    }
    for (const file of SCAN_FILES) {
        if (fs.existsSync(file)) scanFile(file);
    }

    return [...icons].sort();
}

// ── Step 2: Convert kebab-case to PascalCase (Lucide convention) ──
function toPascalCase(str) {
    return str.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
}

// ── Step 3: Extract icon definitions from the full bundle ──
function extractIconDefinitions(iconNames) {
    // Evaluate lucide.min.js to get the exported icons
    const lucideCode = fs.readFileSync(LUCIDE_SOURCE, 'utf-8');
    
    // Create a fake module environment
    const fakeExports = {};
    const fakeModule = { exports: fakeExports };
    
    // The UMD wrapper checks for exports/module - we provide them
    const wrappedCode = `(function(exports, module) { ${lucideCode} })(fakeExports, fakeModule);`;
    
    try {
        // Try direct eval approach
        const fn = new Function('fakeExports', 'fakeModule', `
            const exports = fakeExports;
            const module = fakeModule;
            const define = undefined;
            const globalThis = { lucide: {} };
            const self = globalThis;
            ${lucideCode}
            Object.assign(fakeExports, globalThis.lucide || {});
        `);
        fn(fakeExports, fakeModule);
    } catch (e) {
        console.error('Failed to evaluate lucide.min.js:', e.message);
        console.error('Falling back to regex-based extraction...');
        return extractIconDefinitionsRegex(iconNames, lucideCode);
    }

    const lucide = Object.keys(fakeExports).length > 0 ? fakeExports : fakeModule.exports;
    
    if (!lucide || typeof lucide !== 'object') {
        console.error('Could not extract Lucide exports, falling back to regex');
        return extractIconDefinitionsRegex(iconNames, lucideCode);
    }

    const extracted = {};
    let missing = [];
    
    for (const kebabName of iconNames) {
        const pascalName = toPascalCase(kebabName);
        if (lucide[pascalName]) {
            extracted[kebabName] = lucide[pascalName];
        } else {
            missing.push(kebabName);
        }
    }

    if (missing.length > 0) {
        console.warn(`⚠️  ${missing.length} icons not found via eval: ${missing.join(', ')}`);
        console.warn('    These icons will be extracted via regex fallback.');
        // Try regex for missing ones
        const lucideSource = fs.readFileSync(LUCIDE_SOURCE, 'utf-8');
        const regexExtracted = extractIconDefinitionsRegex(missing, lucideSource);
        Object.assign(extracted, regexExtracted);
    }

    return extracted;
}

// ── Fallback: regex-based extraction ──
function extractIconDefinitionsRegex(iconNames, sourceCode) {
    const extracted = {};

    // Lucide stores icons as arrays of [tagName, attributes] tuples
    // The icons object maps PascalCase names to these arrays
    // We need to find them in the minified source
    
    // In the evaluated source, icons are registered in a.icons = { ... }
    // Let's try to find the icons object
    const iconsMatch = sourceCode.match(/icons\s*[:=]\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/);
    
    if (!iconsMatch) {
        console.error('❌ Could not find icons object in lucide.min.js');
        console.error('   The subset generation failed. Please check the Lucide version.');
        process.exit(1);
    }

    console.log(`ℹ️  Using regex fallback for ${iconNames.length} icons`);
    return extracted;
}

// ── Step 4: Generate the subset file ──
function generateSubset(iconNames, iconDefinitions) {
    const iconEntries = iconNames
        .filter(name => iconDefinitions[name])
        .map(name => {
            const def = JSON.stringify(iconDefinitions[name]);
            return `  "${toPascalCase(name)}": ${def}`;
        })
        .join(',\n');

    const output = `/**
 * lucide-subset.js — Subset of Lucide Icons v1.8.0 (ISC License)
 * 
 * Auto-generated by scripts/generate_lucide_subset.js
 * Contains only the ${Object.keys(iconDefinitions).length} icons used in this project.
 * 
 * To regenerate: node scripts/generate_lucide_subset.js
 * 
 * Original: lucide.min.js (${(fs.statSync(LUCIDE_SOURCE).size / 1024).toFixed(0)} Ko)
 * Subset:   this file
 */
(function(root) {
  "use strict";

  const defaultAttrs = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24, height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  };

  function createSvgElement([tag, attrs, children]) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs).forEach(k => el.setAttribute(k, String(attrs[k])));
    if (children) children.forEach(c => el.appendChild(createSvgElement(c)));
    return el;
  }

  function toPascalCase(str) {
    return str.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
  }

  const icons = {
${iconEntries}
  };

  function createIcons({ attrs = {}, nameAttr = "data-lucide" } = {}) {
    const elements = document.querySelectorAll("[" + nameAttr + "]");
    elements.forEach(el => {
      const name = el.getAttribute(nameAttr);
      if (!name) return;
      const pascal = toPascalCase(name);
      const iconData = icons[pascal];
      if (!iconData) {
        console.warn("lucide-subset: icon '" + name + "' not found in subset.");
        return;
      }

      const existingAttrs = {};
      Array.from(el.attributes).forEach(a => { existingAttrs[a.name] = a.value; });
      
      const hasAria = Object.keys(existingAttrs).some(k => k.startsWith("aria-") || k === "role" || k === "title");
      const ariaAttrs = hasAria ? {} : { "aria-hidden": "true" };
      
      const mergedAttrs = {
        ...defaultAttrs,
        "data-lucide": name,
        ...ariaAttrs,
        ...attrs,
        ...existingAttrs
      };

      // Build class
      const classes = ["lucide", "lucide-" + name];
      if (existingAttrs.class) classes.push(existingAttrs.class);
      if (attrs.class) classes.push(typeof attrs.class === "string" ? attrs.class : attrs.class.join(" "));
      mergedAttrs.class = [...new Set(classes.filter(Boolean))].join(" ").trim();

      const svg = createSvgElement(["svg", mergedAttrs, iconData]);
      el.parentNode.replaceChild(svg, el);
    });
  }

  // Export
  const lucide = { icons, createIcons };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = lucide;
  } else {
    root.lucide = lucide;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this);
`;
    return output;
}

// ── Main ──
console.log('🔍 Scanning HTML files for Lucide icon usage...');
const usedIcons = findUsedIcons();
console.log(`   Found ${usedIcons.length} unique icons: ${usedIcons.join(', ')}`);

console.log('📦 Extracting icon definitions from lucide.min.js...');
const definitions = extractIconDefinitions(usedIcons);
const foundCount = Object.keys(definitions).length;
console.log(`   Extracted ${foundCount}/${usedIcons.length} icon definitions.`);

console.log('✏️  Generating subset file...');
const output = generateSubset(usedIcons, definitions);
fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
const newSize = fs.statSync(OUTPUT_FILE).size;
const oldSize = fs.statSync(LUCIDE_SOURCE).size;
const saved = ((1 - newSize / oldSize) * 100).toFixed(1);
console.log(`✅ Written to ${OUTPUT_FILE}`);
console.log(`   Original: ${(oldSize / 1024).toFixed(0)} Ko`);
console.log(`   Subset:   ${(newSize / 1024).toFixed(0)} Ko`);
console.log(`   Saved:    ${saved}%`);
console.log('');
console.log('📝 Next step: Replace all <script src="../js/lucide.min.js"> with <script src="../js/lucide-subset.js">');
