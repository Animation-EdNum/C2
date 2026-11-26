# Project Context

## 1. Mission & Scope
- **Project:** Suite EdNum (Animation-EdNum, HEP-VS).
- **Target Audience:** Primary & lower secondary school students in Switzerland (PER cycles 1-8H & Cycle 3 up to 10CO in Romandie; Zyklus 1-3 in German-speaking cantons like Oberwallis / Lehrplan 21) and their teachers.
- **Goal:** Teach CS concepts (algorithms, binary, networks, cryptography, logic) through interactive, distraction-free web applications complementing the *Décodages* and *Connected* teaching materials in French and Swiss Standard German (de-CH).

## 2. Application Portfolio (25 Webapps & 2 Portals)
- **Portals:**
  - `index.html`: Main portal with smart sticky header, on-demand search toggle, detailed/compact view switcher, and student/teacher spaces.
  - `indexC1.html`: Simplified Cycle 1 portal for young learners (4-7 years old).
- **Production Student Apps (`webapps/` - 13 apps, ordered by pedagogical level):**
  - Machine à trier (`machine_a_trier.html`, 1-4H), Jeu de la grue (`jeu_de_la_grue.html`, 1-4H / 1-2H & 3-4H), Simulateur Automate (3-4H, 5-8H), Pixel Studio (`binaire_studio`, 5-6H), Tape-Texte (`dactylo.html`, 5H-11CO), Générateur de Mot de passe (`generateur_mot_de_passe`, 5H-11CO), Codage binaire (7-8H), Mots secrets (`binaire_message`, 7-8H), Routage Réseau (7-8H), Bit de Parité (7-8H), Machine à chiffrer (`machine_a_chiffrer.html`, 7-8H), Simulateur de téléchargement (`simulateur_telechargement.html`, 7-8H), Calculatrice binaire (`calculatrice_binaire.html`, 7H-10CO).
- **External Student Resources (`students_external` & `students_utilities`):**
  - Production: Totem (`ext-totem`, 7H-10CO), Qwant Junior (`ext-qwantjunior`, 4H-8H), ia-pedia (`ext-iapedia`, 5H-10CO), Le Dico des Ados (`ext-ledicodesados`, 5H-10CO), Scratch (`ext-scratch`, 7H-10CO).
  - Hidden resources (revealed via "alpha" search trigger): Dico API (`ext-dicoapi`, 3H-8H, inclusive phonetic dictionary), Le Dico des Écoles (`ext-ledicodesecoles`, 3H-10CO, phonetic dictionary), Vikidia (`ext-vikidia`, 5H-8H), Monkeytype (`ext-monkeytype`, 5H-8H), AutoDraw (`ext-autodraw`, 3H-8H), GeoGebra Classique (`ext-geogebra-students`, 7H-10CO), Classroomscreen (`ext-classroomscreen`), Canva (`ext-canva`).
- **Alpha Student Apps (`alpha/webapps/` - 13 apps, ordered by pedagogical level):**
  - Coffre-fort (`coffre_fort.html`, 3-6H), La Fabrique de Recettes (`fabrique_recette.html`, 3-5H), Réseau de tri (`reseau_de_tri.html`, 5-6H), Le Rendu de Monnaie (`rendu_monnaie.html`, 5-8H), Chasseur d'Infox (`chasseur_infox.html`, 6H-10CO), Compresseur magique (`compresseur_magique.html`, 7-8H), Dresseur de neurones (`dresseur_neurones.html`, 7-8H), Simulateur Réseau & DNS (`simulateur_reseau_dns.html`, 7-8H), Créditer une image TASL (`crediter_image.html`, 7-8H), Le Réseau des Villages (`reseau_villages.html`, 7-8H, 9CO), La Bulle de Filtres (`bulle_filtres.html`, 8H-10CO), Pseudo-code (`apprendre_pseudocode.html`, 9CO), L'Atelier des Portes Logiques (`portes_logiques.html`, 9-10CO).
- **Teacher Tools (`webapps/teacher/` - 6 production, 2 alpha):**
  - Production: Générateur de Barème (`bareme.html`), Tirage au Sort (`tirage.html`), Créateur de QR codes (`qrcode.html`), Minuteur visuel (`time_timer.html`), Roue de la chance (`roue_de_la_chance.html`), Adaptateur & Simulateur DYS (`sim_dyslexie.html`).
  - Alpha: Anonymiseur de textes (`alpha/webapps/teacher/anonymiseur.html`), Créateur de Groupes (`alpha/webapps/teacher/createur_groupes.html`).

## 3. Core Architectural Constraints
- **100% Offline-First (PWA):** Zero external CDN dependencies. All assets (fonts, icons, audio, scripts) are locally hosted under `assets/`.
- **Vanilla Stack:** Pure HTML5, JavaScript (ES6+), and CSS. No UI frameworks (React, Vue, Tailwind) allowed.
- **Internationalization (i18n):** Zero-CORS, synchronous runtime translation engine (`assets/js/i18n.js` + `assets/js/i18n/de.js`). Supports French and Swiss Standard German (de-CH: strict `ss`, no `ß`, Swiss pedagogical terms). Runs locally from `file://`.
- **Service Worker (`sw.js`):** Caches the application for complete offline usage. Automatically generated via `meta/scripts/generate-sw-manifest.js` (or `npm run build:sw`) and verified via `npm run check:sw`.
- **Persistence:** Synchronous client-side `localStorage` exclusively.
- **Attribution & Licensing:** AGPL-3.0. Every app features the standardized attribution footer linking to AP EdNum, HEP-VS and `merci.html`.

## 4. Current Status & Active Focus
- **Active Focus:** Suite-wide comprehensive audit, multi-device classroom UX (TBI, tablets, mobile, desktop), offline PWA reliability, and icon/registry compliance.
- **Production Portfolio:** 13 production student webapps (including Machine à chiffrer, Simulateur de téléchargement, Calculatrice binaire), 6 production teacher webapps, and 6 alpha apps.
- **Portal & Accessibility:** Segmented detailed/compact view mode switcher (`c2_portal_view_mode`), persistent view preference, action-oriented descriptions, zero grid holes, and responsive multi-screen layout.
- **Offline Reliability:** Service Worker cache manifest synced (`ednum-4fafad6f`, 82 offline assets). All 420 unit tests passing. Icon subset updated to 219 icons (including restored `lightbulb` and `universal-access`).
