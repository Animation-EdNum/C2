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

    // INJECT CUSTOM ICONS
    console.log("💉 Injection des icône personnalisée (border-all-slash)...");
    let content = fs.readFileSync(targetFile, 'utf8');
    const newIcons = `  "border-all-slash": [640, 640, [], "border-all-slash", "M39 39.2C29.7 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L538.8 505.1C542.1 497.4 543.9 488.9 543.9 480L543.9 160C543.9 124.7 515.2 96 479.9 96L160 96C151.1 96 142.6 97.8 134.9 101.1L72.9 39.1C63.5 29.7 48.3 29.7 39 39.1zM288 254.2L193.8 160L288 160L288 254.2zM352 288L352 160L480 160L480 288L352 288zM96 197.8L96 480C96 515.3 124.7 544 160 544L160 544L160 544L442.2 544L378.2 480L352 480L352 453.8L288 389.8L288 480L160 480L160 352L250.2 352L186.2 288L160 288L160 261.8L96 197.8zM480 446.2L385.8 352L480 352L480 446.2L480 446.2z"],\n`;
    content = content.replace(/\n  };\n/, ',\n' + newIcons + '  };\n');
    fs.writeFileSync(targetFile, content);

    console.log('✅ Fichier fa-subset.js mis à jour avec succès dans le projet !');
} catch (error) {
    console.error("❌ Erreur lors de la copie du fichier :", error.message);
    process.exit(1);
}
