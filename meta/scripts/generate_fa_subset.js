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
    console.log('✅ Fichier fa-subset.js mis à jour avec succès dans le projet !');
} catch (error) {
    console.error("❌ Erreur lors de la copie du fichier :", error.message);
    process.exit(1);
}
