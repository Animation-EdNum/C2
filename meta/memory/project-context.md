# Project Context

## Overview & Mission
The **Suite EdNum** (by Animation-EdNum, HEP-VS) is a collection of high-quality, interactive educational web applications aimed at primary school students in Switzerland (Hautes Écoles Pédagogiques - HEP-VS). These tools complement the **Décodages** teaching materials and align with the Swiss "Plan d'Études Romand" (PER) for cycles 1-2H, 3-4H, 5-6H, and 7-8H. The goal is to teach computer science concepts such as algorithms, binary encoding, networks, and logic.

## Application Categories
The applications are structured into two main categories:
- **Student Tools (`webapps/`):** Simulateur Blue-Bot, Pixel Studio, Mots secrets, Routage Réseau, Codage binaire, Bit de Parité, etc.
- **Teacher Tools (`webapps/teacher/`):** Générateur de Barème, Tirage au Sort. *(Formerly located in `ressources/`)*

## Technical Philosophy & Architecture
- **Offline-First / PWA (Critical):** The project functions as an installable Progressive Web App (PWA). There is zero internet dependency; all assets (fonts, FontAwesome icons, logic) are local. The Service Worker (`sw.js`) caches the `webapps/`, `webapps/teacher/`, `assets/css/`, `assets/js/`, and `assets/fonts/` folders to guarantee complete offline functionality.
- **Vanilla Stack:** Pure HTML, CSS, and JS (Vanilla). No frameworks (React, Vue, Tailwind) to ensure longevity, maintainability, and no build-step overhead.
- **Premium Aesthetics & A11y:** Modern "Glassmorphism" design, clean typography ("Outfit"), smooth micro-animations, and WCAG AA compliance (full keyboard support, ARIA semantics).
- **Repository Structure:**
  - **`standalone/` Folder:** Intentionally removed. Do not attempt to create standalone versions.
  - **`alpha/webapps/` Folder:** Contains experimental applications. They must remain here, stay hidden by default (requiring the 'alpha' keyword search in `index.html`), and must not be documented in the README.

## Documentation & Assets
- **Screenshots & README:** The `README.md` file must strictly preserve the explanations of the different webapps (as they are highly useful for teachers) and include a screenshot for every application, resource, and the `index.html` portal (Desktop and Mobile). Screenshots are stored in `meta/screenshots/`.
- **Application Cards (`index.html`):**
  - Descriptions (`.card-desc`) must be a single sentence (max 12 words), objectively explaining the tool (e.g., "An educational tool to...").
  - Tags (`.card-tags`): Maximum of 4 tags, reused for consistency, with the educational domain placed last (e.g., `#Maths`, `#Transversal`). Do not use the `#Jeu` tag.
  - External Resources: Placed after internal resources, styled neutrally (`.card.external`, grey elements), with a unique FontAwesome icon.
  - Badges: Secondary/older cycle badges use `.badge.grey`. Teacher resources use `.badge.prof`.

## License, Attribution & Support
- **Attribution (Critical):** ALL HTML files must use a uniform footer (`<footer class="no-print">`) containing exactly: "Webapp conçue par Vivian de l'[AP EdNum](https://www.hepvs.ch/fr/prestations-de-services/animation-pedagogique-12811/) avec ❤️ et quelques neurones artificiels" (the link must be strictly on "AP EdNum") and a source code link: "Code 100% libre (AGPL-3.0)".
- **License:** Source code licensed under AGPL-3.0.
- **Support:** Primary contact: vivian.epiney@hepvs.ch.

## Current Sprint Focus
- **Simulateur Blue-Bot:** Stable, feature complete.
- **Ongoing:** Standardization of mobile navigation (moving away from bottom tab bars to top `.tabs`), unified toast notifications, and visual UI audits (border-radius, interactions).