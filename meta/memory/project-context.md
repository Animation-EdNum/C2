# Project Context

## 1. Mission & Scope
- **Project:** Suite EdNum (Animation-EdNum, HEP-VS).
- **Target Audience:** Primary & lower secondary school students in Switzerland (PER cycles 1-8H & Cycle 3 up to 10CO in Romandie; Zyklus 1-3 in German-speaking cantons like Oberwallis / Lehrplan 21) and their teachers.
- **Goal:** Teach CS concepts (algorithms, binary, networks, cryptography, logic) through interactive, distraction-free web applications complementing the *Décodages* and *Connected* teaching materials in French and Swiss Standard German (de-CH).

## 2. Application Portfolio (25 Webapps & 2 Portals)
- **Portals:**
  - `index.html`: Main portal with smart sticky header, on-demand search toggle, and student/teacher spaces.
  - `indexC1.html`: Simplified Cycle 1 portal for young learners (4-7 years old).
- **Production Student Apps (`webapps/` - 10 apps, ordered by pedagogical level):**
  - Machine à trier (`machine_a_trier.html`, 1-4H), Jeu de la grue (`jeu_de_la_grue.html`, 3-4H), Simulateur Automate (3-4H, 5-8H), Pixel Studio (`binaire_studio`, 5-6H), Tape-Texte (`dactylo.html`, 5-8H & 9-11CO), Générateur de Mot de passe (`generateur_mot_de_passe`, 5H-10CO), Codage binaire (7-8H), Mots secrets (`binaire_message`, 7-8H), Routage Réseau (7-8H), Bit de Parité (7-8H).
- **External Student Resources (`students_external` & `students_utilities`):**
  - Production: Totem (`ext-totem`, 7H-10CO), Qwant Junior (`ext-qwantjunior`, 4H-8H), ia-pedia (`ext-iapedia`, 5H-10CO), Le Dico des Ados (`ext-ledicodesados`, 5H-10CO), Scratch (`ext-scratch`, 7H-10CO).
  - Hidden resources (revealed via "alpha" search trigger): Dico API (`ext-dicoapi`, 3H-8H, inclusive phonetic dictionary), Le Dico des Écoles (`ext-ledicodesecoles`, 3H-10CO, phonetic dictionary), Vikidia (`ext-vikidia`, 5H-8H), Monkeytype (`ext-monkeytype`, 5H-8H), AutoDraw (`ext-autodraw`, 3H-8H), GeoGebra Classique (`ext-geogebra-students`, 7H-10CO).
- **Alpha Student Apps (`alpha/webapps/` - 8 apps, ordered by pedagogical level):**
  - Coffre-fort (3-6H), Réseau de tri (5-6H), Machine à chiffrer (7-8H), Détective IA (7-8H), Compresseur magique (7-8H), Dresseur de neurones (7-8H), Pseudo-code (`apprendre_pseudocode`, 9CO), Une chose après l'autre (`tri_insertion`, 10CO).
- **Teacher Tools (`webapps/teacher/` - 6 production, 1 alpha):**
  - Production: Générateur de Barème (`bareme.html`), Tirage au Sort (`tirage.html`), Créateur de QR codes (`qrcode.html`), Minuteur visuel (`time_timer.html`), Roue de la chance (`roue_de_la_chance.html`), Adaptateur & Simulateur DYS (`sim_dyslexie.html`).
  - Alpha: Anonymiseur de textes (`alpha/webapps/teacher/anonymiseur.html`).

## 3. Core Architectural Constraints
- **100% Offline-First (PWA):** Zero external CDN dependencies. All assets (fonts, icons, audio, scripts) are locally hosted under `assets/`.
- **Vanilla Stack:** Pure HTML5, JavaScript (ES6+), and CSS. No UI frameworks (React, Vue, Tailwind) allowed.
- **Internationalization (i18n):** Zero-CORS, synchronous runtime translation engine (`assets/js/i18n.js` + `assets/js/i18n/de.js`). Supports French and Swiss Standard German (de-CH: strict `ss`, no `ß`, Swiss pedagogical terms). Runs locally from `file://`.
- **Service Worker (`sw.js`):** Caches the application for complete offline usage. Automatically generated via `meta/scripts/generate-sw-manifest.js` (or `npm run build:sw`) and verified via `npm run check:sw`.
- **Persistence:** Synchronous client-side `localStorage` exclusively.
- **Attribution & Licensing:** AGPL-3.0. Every app features the standardized attribution footer linking to AP EdNum, HEP-VS and `merci.html`.

## 4. Current Status & Active Focus
- **Active Focus:** Bilingual Swiss Standard German (de-CH) localization rollout, pedagogical grade progression ordering, and CI/browser test hardening.
- **Pedagogical Progression & External Resources:** Reordered all student apps by strict curriculum grade progression (1-4H to 9-11CO). Integrated external resource card "Totem" (7H-10CO) with bilingual support (`?lang=fr` / `#de`) and zero tracking.
- **Swiss Standard German (de-CH) Rollout:** Single-codebase runtime translation engine (`i18n.js` + `de.js`, zero-FOUC in `<head>`, strict `ss`). All 10 production student apps, 6 teacher tools, and portal fully localized and audited via automated Playwright tests. All 282 unit tests passing.
- **Production Promotions:** 4 webapps promoted to production: Adaptateur & Simulateur DYS (`webapps/teacher/sim_dyslexie.html`), Tape-Texte (`webapps/dactylo.html`), Machine à trier (`webapps/machine_a_trier.html`), and Jeu de la grue (`webapps/jeu_de_la_grue.html`).
- **Offline Reliability:** Service Worker cache manifest synced (`ednum-cb8e9b26`, 79 offline assets). All regulatory footers and universal app resets (`window.__onResetApp`) active.
