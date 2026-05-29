# Project Context

## 1. Mission & Scope
- **Project:** Suite EdNum (Animation-EdNum, HEP-VS).
- **Target Audience:** Primary school students in Switzerland (PER cycles 1-8H).
- **Goal:** Teach CS concepts (algorithms, binary, networks, logic) through interactive web applications complementing the *Décodages* teaching materials.

## 2. Application Structure
- **Student Portals:** `index.html` (general use), `indexC1.html` (simplified for 4-7 year olds).
- **Stable Student Apps (`webapps/`):** Simulateur Automate, Pixel Studio (`binaire_studio`), Mots secrets (`binaire_message`), Codage binaire, Bit de Parité, Routage Réseau.
- **Alpha Student Apps (`alpha/webapps/`):** Coffre-fort, Compresseur magique, Machine à chiffrer, Machine à trier, Jeu de la grue, Réseau de tri, Détective IA, Dresseur de neurones, Pseudo-code (`apprendre_pseudocode`).
- **Teacher Tools (`webapps/teacher/`):** Générateur de Barème, Tirage au Sort. Alpha: Sim Dyslexie (`alpha/webapps/teacher/`).
  - *Rule:* They use a distinct stylesheet (`assets/css/teacher.css`). Do NOT extract their shared styles into the global CSS cascade.

## 3. Technical Architecture & Constraints
- **Offline-First (Critical):** Installable PWA. Zero internet dependency.
- **Service Worker:** `sw.js` caches `webapps/`, `webapps/teacher/`, `assets/css/`, `assets/js/`, and `assets/fonts/`.
  - *Rule:* Run `node meta/scripts/generate-sw-manifest.js` after adding/modifying files to auto-update the cache manifest.
- **Vanilla Stack:** Pure HTML, JS, CSS. No frameworks (React, Vue, Tailwind) allowed.
- **Asset Centralization:** ALL static assets (JS, CSS, fonts, images) are strictly in `/assets/`.
- **Global Interactions:** Portal interactions (theme, cache reset) are centralized in `assets/js/theme.js`.

## 4. Repository Rules
- **Main Branch:** `main` (not `master`).
- **Alpha Apps (`alpha/webapps/`):** Experimental apps (e.g., `jeu_de_la_grue.html`). Must remain hidden and undocumented in README unless explicitly promoted.
- **Removed Folders:** `standalone/` is permanently removed. Do not recreate.
- **Security:** Never hardcode sensitive tokens (e.g., GitHub PATs) anywhere.

## 5. Documentation & Presentation
- **Aesthetics:** Modern "Glassmorphism", "Outfit" typography, micro-animations, WCAG AA compliance.
- **Application Cards (`index.html`):**
  - Descriptions: Max 12 words.
  - Tags: Max 4 tags, end with educational domain (e.g., `#Maths`). Do NOT use `#Jeu`.
  - Icons: Duotone (`dt-`) with specific primary/secondary colors (Blue for students, Green for teachers).
- **README:** Must contain screenshots (desktop/mobile) for every app, saved in `meta/screenshots/`. Keep tone professional (English for devs, French for users).
- **Images:** Always compress large images (e.g., resize to 1920x1080) before committing.

## 6. Attribution & Licensing
- **License:** AGPL-3.0.
- **Attribution Footer (Critical):** The footer serves as 'Appropriate Legal Notices' for AGPL-3.0 compliance. ALL HTML files must include the copyright "Animation-EdNum (HEP-VS)", a link to the source code, the license, and the footer content:
  - Text: "Webapp conçue par Vivian de l'[AP EdNum](https://www.hepvs.ch/fr/prestations-de-services/animation-pedagogique-12811/) avec <i data-fa=\"heart\"></i> et quelques neurones artificiels" (link strictly on "AP EdNum"). The `<i data-fa=\"heart\"></i>` (red, solid FA heart with hover scale effect) must link to `merci.html`.
  - Source Link: "Code 100% libre (AGPL-3.0)".
- **Support Contact:** vivian.epiney@hepvs.ch.

## 7. Additional Constraints
- **Alpha Paths**: Alpha versions of teacher-specific web applications in `alpha/webapps/teacher/` must use the relative path `../../../` to correctly reference global resources in the root `assets/` directory.
- **Tutorials**: Pedagogical documentation (e.g., user guides for apps) is stored in `meta/tuto/`.
