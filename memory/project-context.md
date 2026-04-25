# Project Context

## Overview
The **suite EdNum** (by Animation-EdNum, HEP-VS) is a suite of interactive, high-quality educational web applications designed for primary school students in Switzerland (Hautes Écoles Pédagogiques - HEP-VS). These tools complement the **Décodage** manuals, focusing on computer science concepts like algorithms, binary encoding, networking, and logic.

## Key Applications
- **Student Tools (Webapps):**
    - **Simulateur Blue-Bot:** Robotics and pathfinding simulator.
    - **Pixel Studio:** Binary image encoding/decoding (Pixel Art).
    - **Mots secrets:** Binary text encryption/decryption.
    - **Routage Réseau:** Network routing pathfinding.
    - **Codage binaire:** Integer ↔ Binary conversion training.
    - **Bit de Parité:** Error detection logic.
- **Teacher Tools (Ressources):**
    - **Générateur de Barème:** Grading scale generator.
    - **Tirage au Sort:** Randomized student selection with history.

## Technical Philosophy
- **Offline-First / PWA:** No internet dependency; all assets (fonts, icons, logic) are local. The repository functions as an installable Progressive Web App (PWA). A Service Worker (`sw.js`) pre-caches core local directories (`webapps/`, `ressources/`, `css/`, `js/`, `fonts/`) and assets to guarantee full offline capabilities.
- **Dependency-Free:** Pure Vanilla HTML, CSS, and JS. No frameworks (React/Vue/Tailwind) to ensure longevity and ease of distribution.
- **Premium Aesthetics:** Modern Glassmorphism design, "Outfit" typography, and smooth micro-animations.
- **Accessibility:** WCAG AA compliant, full keyboard support, and ARIA integration.
- **Architecture Constraints:** The `standalone/` directory has been intentionally removed from the project to reduce maintenance overhead. Do not attempt to recreate standalone versions of the webapps.
- **Project Scope:** The C2 (Animation-EdNum) project is a suite of interactive educational web applications for primary school students in Switzerland (HEP-VS) focusing on computer science concepts. Do NOT modify `.github/workflows` without explicit permission.

## Documentation & Assets
- **Visuals:** Project documentation visual assets are stored in the `screenshots/` directory at the repository root. The `README.md` file must contain a screenshot for every single webapp and resource. The root `index.html` file serves as the project's central entry portal and must also be documented with a screenshot.
- **Directory Structure:** Utility pages like `bareme.html` and `tirage.html` are located in the `ressources/` directory, separate from the main interactive applications which are located in `webapps/`.
- **Attribution:** All HTML files must use a uniform `<footer class="no-print">` containing attribution exactly worded as 'Webapp conçue par Vivian de l'AP EdNum avec ❤️ et quelques neurones artificiels' (with the hyperlink 'https://www.hepvs.ch/fr/prestations-de-services/animation-pedagogique-12811/' placed exclusively on the text 'AP EdNum', not the preceding words) and a link to the source code stating 'Code 100% libre (AGPL-3.0)'.

## License & Support
- **License:** The project source code is licensed under the AGPL-3.0 license.
- **Contact:** The primary contact email for project support, questions, or issues is vivian.epiney@hepvs.ch.

## Current Sprint / Focus
- **Blue-Bot Simulator – Feature Complete (2026-04-25):** All planned pedagogical and UX refinements have been implemented, including the new custom mat upload feature and refined geometric shapes. The simulator is considered stable.
- **Ongoing:** Screenshots refresh and README update to reflect all new features.
- **Next:** Mobile optimization audit and final accessibility review across the full suite.