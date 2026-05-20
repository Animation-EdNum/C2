# Project Context

## 1. Mission & Scope
- **Project:** Suite EdNum (Animation-EdNum, HEP-VS).
- **Target Audience:** Primary school students in Switzerland (PER cycles 1-8H).
- **Goal:** Teach CS concepts (algorithms, binary, networks, logic) through interactive web applications complementing the *Décodages* teaching materials.

## 2. Application Structure
- **Student Portals:** `index.html` (general use), `indexC1.html` (simplified for 4-7 year olds).
- **Student Apps (`webapps/`):** Simulateur Automate, Pixel Studio, Mots secrets, Routage Réseau, Codage binaire, Bit de Parité, etc.
- **Teacher Tools (`webapps/teacher/`):** Générateur de Barème, Tirage au Sort.
  - *Rule:* They use a distinct stylesheet (`assets/css/teacher.css`). Do NOT extract their shared styles into the global `shared.css`.

## 3. Technical Architecture & Constraints
- **Offline-First (Critical):** Installable PWA. Zero internet dependency.
- **Service Worker:** `sw.js` caches `webapps/`, `webapps/teacher/`, `assets/css/`, `assets/js/`, and `assets/fonts/`.
  - *Rule:* Run `node meta/scripts/generate-sw-manifest.js` after adding/modifying files to auto-update the cache manifest.
- **Vanilla Stack:** Pure HTML, CSS, JS. No frameworks (React, Vue, Tailwind) allowed.
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
- **Attribution Footer (Critical):** ALL HTML files must use exactly this `<footer class="no-print">` content:
  - Text: "Webapp conçue par Vivian de l'[AP EdNum](https://www.hepvs.ch/fr/prestations-de-services/animation-pedagogique-12811/) avec ❤️ et quelques neurones artificiels" (link strictly on "AP EdNum"). The '❤️' must link to `merci.html`.
  - Source Link: "Code 100% libre (AGPL-3.0)".
- **Support Contact:** vivian.epiney@hepvs.ch.
