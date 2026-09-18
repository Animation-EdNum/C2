# Project Context

## 1. Mission & Scope
- **Project:** Suite EdNum (Animation-EdNum, HEP-VS).
- **Target Audience:** Primary & lower secondary school students in Switzerland (PER cycles 1-8H & Cycle 3 up to 10CO) and their teachers.
- **Goal:** Teach CS concepts (algorithms, binary, networks, cryptography, logic) through interactive, distraction-free web applications complementing the *Décodages* and *Connected* teaching materials.

## 2. Application Portfolio (25 Webapps & 2 Portals)
- **Portals:**
  - `index.html`: Main portal with smart sticky header, on-demand search toggle, and student/teacher spaces.
  - `indexC1.html`: Simplified Cycle 1 portal for young learners (4-7 years old).
- **Production Student Apps (`webapps/` - 7 apps):**
  - Simulateur Automate, Pixel Studio (`binaire_studio`), Mots secrets (`binaire_message`), Codage binaire, Bit de Parité, Routage Réseau, Générateur de Mot de passe (`generateur_mot_de_passe`).
- **Alpha Student Apps (`alpha/webapps/` - 11 apps):**
  - Coffre-fort, Compresseur magique, Machine à chiffrer, Machine à trier, Jeu de la grue, Réseau de tri, Détective IA, Dresseur de neurones, Pseudo-code (`apprendre_pseudocode`), Dactylo (`dactylo`), Une chose après l'autre (`tri_insertion`).
- **Teacher Tools (`webapps/teacher/` - 5 production, 2 alpha):**
  - Production: Générateur de Barème (`bareme.html`), Tirage au Sort (`tirage.html`), Créateur de QR codes (`qrcode.html`), Minuteur visuel (`time_timer.html`), Roue de la chance (`roue_de_la_chance.html`).
  - Alpha: Lentille DYS / Sim Dyslexie (`alpha/webapps/teacher/sim_dyslexie.html`), Anonymiseur de textes (`alpha/webapps/teacher/anonymiseur.html`).

## 3. Core Architectural Constraints
- **100% Offline-First (PWA):** Zero external CDN dependencies. All assets (fonts, icons, audio, scripts) are locally hosted under `assets/`.
- **Vanilla Stack:** Pure HTML5, JavaScript (ES6+), and CSS. No UI frameworks (React, Vue, Tailwind) allowed.
- **Service Worker (`sw.js`):** Caches the application for complete offline usage. Automatically generated via `meta/scripts/generate-sw-manifest.js` (or `npm run build:sw`) and verified via `npm run check:sw`.
- **Persistence:** Synchronous client-side `localStorage` exclusively.
- **Attribution & Licensing:** AGPL-3.0. Every app features the standardized attribution footer linking to AP EdNum, HEP-VS and `merci.html`.

## 4. Current Status & Active Focus
- **Active Focus:** Performance hot loops, mobile navigation fluidity, teacher workflows (roster import/export), and CI hardening.
- **Teacher Tools & Classroom Integration:** Promoted Roue de la chance to production, integrated Swiss ENT/ISM class roster import (XLSX, CSV via local SheetJS) and export in Tirage au sort.
- **Hot-Loop Performance & Security:** Optimized DOM queries in hot loops (`automate-engine.js`, `scores.js`), hardened PWA toast DOM construction against XSS, and pinned GitHub Actions commit SHAs across CI workflows.
- **Standardized Universal Reset & TBI:** All applications support `#reset-cache-btn` with `window.__onResetApp` hook and overflow-safe TBI whiteboard projection modes.
