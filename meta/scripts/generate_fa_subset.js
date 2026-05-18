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
    const newIcons = `  "border-all-slash": [448, 512, [], "border-all-slash", "M384 32c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H384zM256 96H64v128H256V96zm0 192H64V416H256V288zM448 96c0-35.3-28.7-64-64-64H256V224H448V96zm0 192H256V416h128c35.3 0 64-28.7 64-64V288z M -32 464 L 464 -32 L 512 16 L 16 512 Z"],
`;
    content = content.replace(/\n  };\n/, ',\n' + newIcons + '  };\n');
    fs.writeFileSync(targetFile, content);

    console.log('✅ Fichier fa-subset.js mis à jour avec succès dans le projet !');
} catch (error) {
    console.error("❌ Erreur lors de la copie du fichier :", error.message);
    process.exit(1);
}
