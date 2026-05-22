/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * generate_fa_subset.js
 *
 * Appelle le script generate_fa_subset.js du dépôt privé fontawesome-subset
 * pour générer les icônes, puis copie le résultat dans assets/js/fa-subset.js.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const faSubsetDir = process.env.FA_SUBSET_DIR;

if (!faSubsetDir) {
    console.error("Erreur : La variable d'environnement FA_SUBSET_DIR n'est pas définie.");
    console.error("Veuillez définir FA_SUBSET_DIR pour pointer vers le dépôt privé fontawesome-subset.");
    console.error("Exemple : FA_SUBSET_DIR=../fontawesome-subset node meta/scripts/generate_fa_subset.js");
    process.exit(1);
}

const faSubsetScript = path.join(faSubsetDir, 'generate_fa_subset.js');
const sourceFile = path.join(faSubsetDir, 'fa-subset.js');
const ROOT = path.resolve(__dirname, '../..');
const targetFile = path.join(ROOT, 'assets', 'js', 'fa-subset.js');

if (!fs.existsSync(faSubsetScript)) {
    console.error(`Erreur : Le script ${faSubsetScript} est introuvable dans le dossier spécifié.`);
    process.exit(1);
}

console.log(`🚀 Exécution de ${faSubsetScript} dans ${faSubsetDir}...`);

try {
    execSync(`node generate_fa_subset.js "${ROOT}"`, {
        cwd: faSubsetDir,
        stdio: 'inherit',
        env: { ...process.env, SUITE_DIR: ROOT }
    });
    console.log('✅ Script généré avec succès dans la repo privée.');
} catch (error) {
    console.error("❌ Erreur lors de l'exécution du script :", error.message);
    process.exit(1);
}

if (!fs.existsSync(sourceFile)) {
    console.error(`Erreur : Le fichier généré ${sourceFile} est introuvable.`);
    process.exit(1);
}

console.log(`📋 Copie de ${sourceFile} vers ${targetFile}...`);

try {
    fs.copyFileSync(sourceFile, targetFile);

    // INJECT CUSTOM ICONS (border-all-slash as a standard solid string path)
    console.log("💉 Injection de l'icône personnalisée (border-all-slash) et correctif de classes...");
    let content = fs.readFileSync(targetFile, 'utf8');
    const newIcons = `  "border-all-slash": [640, 640, [], "border-all-slash", "M39 39.2C29.7 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L538.8 505.1C542.1 497.4 543.9 488.9 543.9 480L543.9 160C543.9 124.7 515.2 96 479.9 96L160 96C151.1 96 142.6 97.8 134.9 101.1L72.9 39.1C63.5 29.7 48.3 29.7 39 39.1zM288 254.2L193.8 160L288 160L288 254.2zM352 288L352 160L480 160L480 288L352 288zM96 197.8L96 480C96 515.3 124.7 544 160 544L160 544L160 544L442.2 544L378.2 480L352 480L352 453.8L288 389.8L288 480L160 480L160 352L250.2 352L186.2 288L160 288L160 261.8L96 197.8zM480 446.2L385.8 352L480 352L480 446.2L480 446.2z"],\n`;
    const iconDictEndPattern = /,?\n  };\n/;
    if (!iconDictEndPattern.test(content)) {
        console.error("❌ Erreur : Impossible de trouver le marqueur de fin du dictionnaire d'icônes ('};') dans le fichier généré.");
        console.error("   Le format du fichier source a peut-être changé. Vérifiez le fichier généré par le dépôt privé.");
        process.exit(1);
    }
    content = content.replace(iconDictEndPattern, ',\n' + newIcons + '  };\n');

    const functionStartToken = '  function createIcons({ attrs = {}, nameAttr = "data-fa" } = {}) {';
    const startIndex = content.indexOf(functionStartToken);
    
    if (startIndex === -1) {
        console.error("❌ Erreur : Impossible de trouver la signature de la fonction 'createIcons' dans le fichier généré.");
        console.error("   Token recherché : " + functionStartToken);
        console.error("   Le format du fichier source a peut-être changé. Vérifiez le fichier généré par le dépôt privé.");
        process.exit(1);
    }

    const newCreateIconsAndExport = `  function createIcons({ attrs = {}, nameAttr = "data-fa" } = {}) {
    // Injecter le CSS duotone une seule fois
    if (typeof document !== "undefined" && !document.getElementById("fa-duotone-styles")) {
      var style = document.createElement("style");
      style.id = "fa-duotone-styles";
      style.textContent = ".fa-icon path.fa-secondary{fill:var(--fa-secondary,currentColor);opacity:var(--fa-secondary-opacity,.4)}.fa-icon path.fa-primary{fill:var(--fa-primary,currentColor);opacity:var(--fa-primary-opacity,1)}";
      document.head.appendChild(style);
    }

    const elements = document.querySelectorAll("[" + nameAttr + "]");
    elements.forEach(el => {
      const name = el.getAttribute(nameAttr);
      if (!name) return;
      const iconData = icons[name];
      if (!iconData) {
        console.warn("fa-subset: icon '" + name + "' not found in subset.");
        return;
      }

      const width    = iconData[0];
      const height   = iconData[1];
      const pathData = iconData[4];
      const isDuotone = Array.isArray(pathData);

      const existingAttrs = {};
      Array.from(el.attributes).forEach(a => { existingAttrs[a.name] = a.value; });

      const hasAria = Object.keys(existingAttrs).some(k => k.startsWith("aria-") || k === "role" || k === "title");
      const ariaAttrs = hasAria ? {} : { "aria-hidden": "true" };

      const mergedAttrs = {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "currentColor",
        ...ariaAttrs,
        ...attrs,
        ...existingAttrs
      };

      // Garantir que la viewBox est correcte
      mergedAttrs.viewBox = "0 0 " + width + " " + height;
      mergedAttrs["data-fa"] = name;

      // Correction d'échelle optique pour border-all-slash
      if (name === "border-all-slash") {
        mergedAttrs.style = (mergedAttrs.style ? mergedAttrs.style + ";" : "") + "transform: scale(1.25);";
        mergedAttrs.overflow = "visible";
      }

      const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "-");
      const classes = ["fa-icon", "fa-" + safeName];
      if (isDuotone) classes.push("fa-duotone");

      // Filtrer les classes
      let oldClass = existingAttrs.class || "";
      const classList = oldClass.split(/\\s+/);
      const filteredClasses = classList.filter(c => {
        if (c === "fa-duotone" && !isDuotone) return false;
        if (c.startsWith("fa-")) {
          const possibleIconName = c.substring(3);
          if (icons[possibleIconName] && possibleIconName !== safeName) {
            return false;
          }
        }
        return true;
      });
      oldClass = filteredClasses.join(" ").trim();
      if (oldClass) classes.push(oldClass);

      if (attrs.class) classes.push(typeof attrs.class === "string" ? attrs.class : attrs.class.join(" "));

      const allClassNames = classes.filter(Boolean).join(" ").split(/\\s+/);
      mergedAttrs.class = [...new Set(allClassNames)].join(" ").trim();

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      Object.keys(mergedAttrs).forEach(k => svg.setAttribute(k, String(mergedAttrs[k])));

      if (isDuotone) {
        const pathSecondary = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathSecondary.setAttribute("d", pathData[0]);
        pathSecondary.setAttribute("class", "fa-secondary");
        svg.appendChild(pathSecondary);
        const pathPrimary = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathPrimary.setAttribute("d", pathData[1]);
        pathPrimary.setAttribute("class", "fa-primary");
        svg.appendChild(pathPrimary);
      } else {
        const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathEl.setAttribute("d", pathData);
        svg.appendChild(pathEl);
      }

      el.parentNode.replaceChild(svg, el);
    });
  }

  // Export
  const fa = { icons, createIcons };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = fa;
  } else {
    root.fa = fa;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this);
`;
    content = content.substring(0, startIndex) + newCreateIconsAndExport;

    // Vérification finale : s'assurer que le fichier généré contient les marqueurs attendus
    if (!content.includes('border-all-slash')) {
        console.error("❌ Erreur : L'icône personnalisée 'border-all-slash' n'a pas été injectée correctement.");
        process.exit(1);
    }
    if (!content.includes('border-all')) {
        console.error("❌ Erreur : L'icône 'border-all' n'a pas été injectée correctement.");
        process.exit(1);
    }
    if (!content.includes('createIcons')) {
        console.error("❌ Erreur : La fonction 'createIcons' est absente du fichier final.");
        process.exit(1);
    }

    fs.writeFileSync(targetFile, content);
    console.log('✅ Fichier fa-subset.js mis à jour avec succès dans le projet !');
} catch (error) {
    console.error("❌ Erreur lors de la copie du fichier :", error.message);
    process.exit(1);
}
