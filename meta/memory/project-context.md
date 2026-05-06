# Project Context

## Overview & Mission
The **Suite EdNum** (by Animation-EdNum, HEP-VS) is a collection of high-quality, interactive educational web applications aimed at primary school students in Switzerland (Hautes Écoles Pédagogiques - HEP-VS). These tools complement the **Décodages** teaching materials and align with the Swiss "Plan d'Études Romand" (PER) for cycles 1-2H, 3-4H, 5-6H, and 7-8H. The goal is to teach computer science concepts such as algorithms, binary encoding, networks, and logic.

## Application Categories & Specific Webapps
The applications are structured into two main categories:
- **Student Tools (`webapps/`):** Simulateur Blue-Bot, Pixel Studio, Mots secrets (located at `webapps/binaire_message.html`), Routage Réseau, Codage binaire, Bit de Parité, etc.
  - The 'simulateur automate' refers to `webapps/simulateur_bluebot.html`, featuring 4 modes: Simulateur, Pilotage, Décodage, and Dessin. Its user manual is at `MODE_EMPLOI_SIMULATEUR_AUTOMATE.md`.
- **Teacher Tools (`webapps/teacher/`):** Générateur de Barème, Tirage au Sort. They use a distinct style and layout compared to student apps, sharing a dedicated stylesheet (`assets/css/teacher.css`). Avoid extracting their shared styles into the global `shared.css` and avoid redundant local `<style>` overrides within them.

## Technical Philosophy & Architecture
- **Offline-First / PWA (Critical):** The project functions as an installable Progressive Web App (PWA). There is zero internet dependency; all assets (fonts, FontAwesome icons, logic) are local. The Service Worker (`sw.js`) caches the `webapps/`, `webapps/teacher/`, `assets/css/`, `assets/js/`, and `assets/fonts/` folders to guarantee complete offline functionality.
- **Vanilla Stack:** Pure HTML, CSS, and JS (Vanilla). No frameworks (React, Vue, Tailwind) to ensure longevity, maintainability, and no build-step overhead.
- **Premium Aesthetics & A11y:** Modern "Glassmorphism" design, clean typography ("Outfit"), smooth micro-animations, and WCAG AA compliance (full keyboard support, ARIA semantics).
- **Assets Centralization:** All static assets including JS scripts, CSS stylesheets, fonts, mat images, and favicons are strictly centralized within the `/assets/` directory.
- **Repository Structure:**
  - **`standalone/` Folder:** Intentionally removed. Do not attempt to create standalone versions.
  - **`alpha/webapps/` Folder:** Contains experimental applications. They must remain here (as 'alpha' status) and not be promoted to the main `webapps/` folder unless explicitly instructed by the user, even if their UI/UX is being standardized. They must stay hidden by default and must not be documented in the README.

## Documentation & Assets
- **Screenshots & README:** The `README.md` file must strictly preserve the explanations of the different webapps (as they are highly useful for teachers) and include a screenshot for every application, resource, and the `index.html` portal (Desktop and Mobile). Screenshots are stored in `meta/screenshots/`.
- **Documentation Tone:** Maintain a professional, factual tone. Avoid promotional fluff, patronizing language towards users (teachers), and colloquialisms like 'geek'. The developer-facing sections of the README should be written in English, while the user-facing sections remain in French.
- **Application Cards (`index.html`):**
  - Descriptions (`.card-desc`) must be a single sentence (max 12 words), objectively explaining the tool (e.g., "An educational tool to...").
  - Tags (`.card-tags`): Maximum of 4 tags, reused for consistency, with the educational domain placed last (e.g., `#Maths`, `#Transversal`). Do not use the `#Jeu` tag.
  - Icon styling: Webapp cards use duotone icons (`dt-` prefix) colored blue (`--fa-primary:#2980b9;--fa-secondary:#3498db;`) for student apps and green (`--fa-primary:#27ae60;--fa-secondary:#2ecc71;`) for teacher resources. Inside webapps, `.header-icon` elements and all internal UI must strictly use solid icons (no duotone or regular), with header icons styled as white.
  - External Resources: Placed after internal resources, styled neutrally (`.card.external`, grey elements), with a unique FontAwesome icon.
  - Badges: Secondary/older cycle badges use `.badge.grey`. Teacher resources use `.badge.prof`.

## License, Attribution & Support
- **Attribution (Critical):** ALL HTML files must use a uniform footer (`<footer class="no-print">`) containing exactly: "Webapp conçue par Vivian de l'[AP EdNum](https://www.hepvs.ch/fr/prestations-de-services/animation-pedagogique-12811/) avec ❤️ et quelques neurones artificiels" (the link must be strictly on "AP EdNum") and a source code link: "Code 100% libre (AGPL-3.0)".
- **License:** Source code licensed under AGPL-3.0.
- **Support:** Primary contact: vivian.epiney@hepvs.ch.

## Current Sprint Focus
- **Simulateur Blue-Bot:** Stable, feature complete.
- **Ongoing:** Standardization of mobile navigation (moving away from bottom tab bars to top `.tabs`), unified toast notifications, and visual UI audits (border-radius, interactions).