# Project Context

## 1. Mission & Scope
- **Project:** Suite EdNum (Animation-EdNum, HEP-VS).
- **Target Audience:** Primary & lower secondary school students in Switzerland (PER cycles 1-8H & Cycle 3 up to 10CO) and their teachers.
- **Goal:** Teach CS concepts (algorithms, binary, networks, cryptography, logic) through interactive, distraction-free web applications complementing the *Décodages* and *Connected* teaching materials.

## 2. Application Portfolio (26 Webapps)
- **Portals:**
  - `index.html`: Main portal with smart sticky header, on-demand search toggle, and student/teacher spaces.
  - `indexC1.html`: Simplified Cycle 1 portal for young learners (4-7 years old).
- **Production Student Apps (`webapps/` - 7 apps):**
  - Simulateur Automate, Pixel Studio (`binaire_studio`), Mots secrets (`binaire_message`), Codage binaire, Bit de Parité, Routage Réseau, Générateur de Mot de passe (`generateur_mot_de_passe`).
- **Alpha Student Apps (`alpha/webapps/` - 11 apps):**
  - Coffre-fort, Compresseur magique, Machine à chiffrer, Machine à trier, Jeu de la grue, Réseau de tri, Détective IA, Dresseur de neurones, Pseudo-code (`apprendre_pseudocode`), Dactylo (`dactylo`), Une chose après l'autre (`tri_insertion`).
- **Teacher Tools (`webapps/teacher/` - 4 production, 1 alpha):**
  - Production: Générateur de Barème (`bareme.html`), Tirage au Sort (`tirage.html`), Créateur de QR codes (`qrcode.html`), Minuteur visuel (`time_timer.html`).
  - Alpha: Lentille DYS / Sim Dyslexie (`alpha/webapps/teacher/sim_dyslexie.html`).

## 3. Core Architectural Constraints
- **100% Offline-First (PWA):** Zero external CDN dependencies. All assets (fonts, icons, audio, scripts) are locally hosted under `assets/`.
- **Vanilla Stack:** Pure HTML5, JavaScript (ES6+), and CSS. No UI frameworks (React, Vue, Tailwind) allowed.
- **Service Worker (`sw.js`):** Caches the application for complete offline usage. Automatically generated via `meta/scripts/generate-sw-manifest.js` (or `npm run build:sw`) and verified via `npm run check:sw`.
- **Persistence:** Synchronous client-side `localStorage` exclusively.
- **Attribution & Licensing:** AGPL-3.0. Every app features the standardized attribution footer linking to AP EdNum, HEP-VS and `merci.html`.

## 4. Current Status & Active Focus
- **Standardized Universal Reset:** All applications support a standardized `#reset-cache-btn` with `window.__onResetApp` hook to cleanly reset app state in-place.
- **TBI Projection Mode:** Classroom whiteboard projection modes available across binary, math, and teacher tools with explicit overflow protections.
- **Security & A11y:** Full dark mode compliance (`color-scheme: dark;` on `body.dark`), 100% WCAG AA contrast, and hardened DOM injection (zero direct `innerHTML` assignments to satisfy VICE/CodeQL).
