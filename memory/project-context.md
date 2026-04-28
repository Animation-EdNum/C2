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
- **Blue-Bot Simulator – Feature Complete (2026-04-25):** All planned pedagogical and UX refinements have been implemented, including the new custom mat upload feature. The simulator is considered stable.
- **Ongoing:** Screenshots refresh and README update to reflect all new features.
- **Next:** Mobile optimization audit and final accessibility review across the full suite.


## Knowledge Base
- The `pixel_studio_rvb.html` alpha application features a 'Découverte' mode for free drawing on an 8x8 grid and a gamified 'Défi' mode for RGB color matching, utilizing the standard `ScoreManager` for progression tracking.
- The visual opacity of educational mats is controlled via the `--mat-opacity` CSS variable, adjustable via a slider located persistently at the top of the Mats side drawer (`#mats-drawer`), and its value is persisted in `localStorage` under `bb_mat_opacity`.
- Experimental or unreleased web applications (alpha apps) must deliberately remain undocumented in the main `README.md` file to keep them 'under the radar' from general users, per explicit user preference.
- In the 'Suite EdNum' project, when building applications related to 'Décodages 5-6 Scénario 6' binary image encoding, use the standard 2-bit color mapping: 00=Black (Noir), 01=Green (Vert), 10=Blue (Bleu), and 11=Yellow (Jaune).
- In `index.html`, application cards use a `.card-tags` div (placed below the description and just above `.card-ref`) to display space-separated keyword tags. Constraints: limit to a maximum of 4 tags per card, the final tag must be the educational domain (e.g., `#Maths`, `#ArtsVisuels`, `#SHS`, `#Transversal`), ensure tags are reused across cards for a cohesive vocabulary, and avoid using the `#Jeu` tag.
- External links across the project must always open in a new tab (using target="_blank" and rel="noopener noreferrer").
- The `machine_a_chiffrer.html` alpha application features 'Code César', 'Code Vigenère', 'Atbash', and 'Morse' modes. It implements bidirectional text conversion (via a `decrypt` flag for clear/cipher inputs) and displays dynamic, child-friendly explanations for each mode.
- When capturing screenshots with Playwright for documentation or web use, use `device_scale_factor=1` (standard resolution to avoid excessively large file sizes) and set `color_scheme='light'` (normal mode). Explicitly wait (e.g., `time.sleep(4)`) after network idle to allow client-side assets like Lucide icons and CSS animations to fully render.
- In `jeu_de_la_grue.html`, when the crane picks up a colored block, the UI must dynamically update the crane claw's color (e.g., via a `--held-color` CSS variable) to match the grabbed block, avoiding hardcoded static colors.
- In `simulateur_bluebot.html`'s 'décodage' mode, instructions are visually represented using `.program-cmd` elements. To make them strictly read-only and remove interactive hover states (like the deletion 'x' pseudo-element), apply a class such as `.read-only-cmd` defined with `pointer-events: none;`.
- When iterating over an element's `classList` to dynamically remove specific classes (e.g., clearing `mat-*` or `skin-*` prefixes), do not mutate the `classList` directly within its own `forEach` loop. Because `DOMTokenList` is a live collection, mutating it shifts indices and skips elements. Always iterate over a static snapshot using `Array.from(element.classList).forEach(...)`.
- In `simulateur_bluebot.html`, the `showToast` function signature is `showToast(msg, isSuccess = true, isWarning = false)`. Setting `isWarning` to `true` displays an orange notification with a warning emoji, overriding the standard success (green) or error (red) styles.
- When modifying or adding application cards in `index.html`, ensure the description (`.card-desc`) is a single sentence strictly limited to a maximum of 12 words. It should objectively explain the tool's purpose (e.g., 'Un outil pour...') without directly addressing the user/student.
- In `simulateur_bluebot.html`, the `MAT_CONFIG` object incorporates an `example` property for educational mats, containing a short pedagogical use case (e.g., 'Épelle ton prénom.') displayed in the selection drawer.
- In `index.html`, cards representing external resources must be placed after internal resources, use visually distinct, neutral styling (e.g., the `.card.external` class with grey elements instead of standard blue), and feature a unique Lucide icon.
- The 'Suite EdNum' project is structurally aligned with the Swiss 'Plan d'études romand' (PER) and the 'Décodages' teaching materials, targeting specific educational cycles (e.g., 1-2H, 3-4H, 5-6H, 7-8H).
- In `jeu_de_la_grue.html`, the action command (grabbing) is visually represented by the Lucide 'hand-grab' icon, not 'grip-horizontal'.
- To maintain PWA offline functionality, new applications (including alpha apps in `alpha/webapps/`) must be manually added to the `ASSETS` array in the `sw.js` Service Worker, and deleted files must be manually removed.
- In `simulateur_bluebot.html`, both skin and mat selection UIs are implemented as sliding side drawers (`#skins-drawer`, `#mats-drawer`) containing clickable vertical lists (`.skins-list`, `.skin-list-item`), replacing older modal interfaces. Items are selected directly via a click event, and the active state is visually indicated by a green highlight (`.active-skin`).
- In gamified programming simulators like `jeu_de_la_grue.html`, when the user executes a program and the win condition fails (`checkWin`), the game state (like block positions) must be reset to its initial configuration (e.g., `initialCupsState`), allowing the user to debug and run their modified program from the original starting state.
- When changing skins in `simulateur_bluebot.html`, if a visual robot path (trail) already exists on the grid, it must be preserved and re-rendered with the new skin's visual styles rather than being cleared.
- The `machine_a_trier.html` alpha application features 'Couleur', 'Forme', 'Quantité' (using dice icons), and 'Taille' (using scaled visual sizes) modes, with difficulty levels controlling the number of target bins.
- Webapps incorporating standard gamification progression (Score, Streak/Série, Record) should integrate the shared `ScoreManager` (e.g., `ScoreManager.init('app_name')`) to track and persist these metrics.
- In `alpha/webapps/reseau_de_tri.html`, comparators sharing the same sequential stage must implement a horizontal offset (`offsetX`) only when they truly overlap vertically (e.g., `maxA >= minB && maxB >= minA`). This offset must be equally applied to visual SVG lines and clickable `.comparator-btn` overlays. Ensure the SVG background uses `pointer-events: none` so it doesn't block interactions with higher z-index comparators.
- In `simulateur_bluebot.html`, the desktop fullscreen layout (`@media (min-width: 601px)` for `.fullscreen-map`) organizes the `.exercise-card` using CSS Grid (`grid-template-columns: minmax(0, 1fr) auto`) to display the `.grid-wrapper` and control panels side-by-side. Within this layout, pilotage challenge options (`.challenge-options`) are vertically stacked (`flex-direction: column`).
- In `simulateur_bluebot.html`, to ensure grid cells remain perfectly square on custom dimensions and mobile viewports, dynamically calculate and apply an aspect-ratio (e.g., `${GRID_COLS} / ${GRID_ROWS}`) to the `.bot-grid` element, overriding any hardcoded 1/1 CSS to prevent flexbox squishing.
- In `index.html`, resources specifically targeting teachers (e.g., within the `#view-teachers` section) must use the `.badge.prof` CSS class for their category labels, distinct from student grade-level badges.
- When running local HTTP servers for testing (e.g., `python -m http.server`), avoid redirecting output to log files (like `server.log`) within the repository, or ensure such temporary testing artifacts are removed before committing to prevent polluting version control.
- In `simulateur_bluebot.html`'s 'décodage' mode, the `.program-strip` is structurally placed between the instructions (`#read-instruction`) and the grid (`#read-grid`). In 'pilotage' mode, the challenge options (`#chal-options`) are placed directly above the grid (`#chal-grid`).
- For gamified exercises, when an incorrect answer is validated, apply a brief UI cooldown (e.g., disable the validation button for 5 seconds with a visible countdown) to prevent rapid spamming of mistakes. Clear this cooldown if a new challenge is loaded.
- In `simulateur_bluebot.html`, when dragging and dropping the robot, preserve its current orientation by explicitly syncing `simState.startDir` with `simState.robotDir` in the `drop` event listener before any reset or reposition logic.
- When applying or modifying a color theme for a web application, ensure the entire UI (including accents, badge backgrounds, card shadows, and borders) aligns with the chosen color palette, rather than only changing the background gradients.
- Game instructions (consignes) across web applications should utilize a dedicated `.instructions` CSS class to ensure standardized typography, improved readability, and consistent UI design.
- Experimental or unreleased web applications (alpha apps) are stored in the `alpha/webapps/` directory and are hidden by default on the main `index.html` page, accessible only by explicitly searching for the keyword 'alpha' in the search bar.
- When dynamically generating elements for visual matching games (e.g., cubes in `jeu_de_la_grue.html`), use a predefined palette of standard categorical colors rather than randomized HSL values to maintain visual consistency with UI elements.
- To prevent multiple rapid submissions when handling the 'Enter' key in `keydown` event listeners, always check and block repeated keystrokes using `if (e.repeat) return;`.
- The `jeu_de_la_grue.html` application implements a 1D programming interface (using 3 horizontal cups and a vertical max stack of 3 cubes) where users build a sequence of instructions in a `.program-strip` (using arrow/action commands) to program a crane, rather than controlling it in real-time.
- To ensure global offline PWA functionality across all pages, the Service Worker (`sw.js`) should be registered within the shared `js/theme.js` file using path-agnostic logic (determining `./sw.js` vs `../sw.js` based on the current URL), rather than individually in HTML files.
- Modals and side drawers across the project (such as `simulateur_bluebot.html` drawers and `js/scores.js` ScoreManager) must implement mobile-friendly 'swipe-to-close' touch gestures and keyboard-accessible 'Escape' key listeners to dismiss the overlays.
- The `.badge.grey` CSS class in `index.html` is used to style secondary or older-age-range badges (e.g., '5-6H', '7-8H') on application cards. The application filtering logic evaluates both the main `data-level` attribute and the text content of these `.badge` elements to accurately display cards matching the selected degree filter.
- In `simulateur_bluebot.html`, dynamically generated educational mats for custom grid sizes must scale their content appropriately: 'math' counts up to 100, 'shapes' adds extra geometric shapes and colors to fill pairs, 'geo' includes up to 100 distinct flags, and 'fairy_tale' uses a wide pool of unique, non-duplicated emojis.
- To ensure WCAG AA accessibility across mobile applications (e.g., `bit_de_parite.html`), interactive grid cells and touch targets must be at least 44x44px, often achieved using CSS `clamp()` combined with `overflow-x: auto` on parent wrappers to prevent squishing.
- In `jeu_de_la_grue.html`, cups must render explicit background visual slots (`.cup-slot`) to guide users on the 3 discrete vertical levels necessary to properly align the crane for 'Action' commands.
- To align new or alpha webapps with the official Suite EdNum UX/UI design, include `css/shared.css` and structure the page with an `.app-header` containing a `.header-title-wrapper` (with a back-link using a Lucide icon and an `h1` title) and an `.action-buttons` group, followed by a `.container` for main content. Use standard CSS variables (e.g., `--bg-gradient-start`, `--badge-bg` for code areas, `--instructions-bg` for legends) and standard fonts like `JetBrains Mono` for code/binary output to ensure visual coherence.
- In `simulateur_bluebot.html`, hidden unlockable skins (easter eggs) can be configured by setting `hidden: true` in `SKIN_CONFIG`, preventing them from appearing in the visual skins selector until they are explicitly unlocked via their specific gameplay conditions.
- In `simulateur_bluebot.html`, the fullscreen mode (`.fullscreen-map` on `body`) is designed for smartboard/TBI landscape usage. It hides headers, tabs, and difficulty bars but must preserve visibility of mode-specific interactive elements alongside the grid (e.g., `.program-strip` in 'décodage' mode, `.challenge-options` in 'pilotage' mode).
- The non-alpha webapps (e.g., simulateur_bluebot, routage_reseau, bit_de_parite, binaire_*) use specific Tailwind CSS color palettes mapped to their pedagogical themes for their entire UI (including backgrounds, `--accent`, `--badge-bg`, `--card-shadow`, etc.), instead of a uniform design.
- When implementing sorting modes based on magnitude or progression in `machine_a_trier.html` (e.g., 'Quantité' or 'Taille'), the generated target bins must be sorted in ascending order (e.g., by numeric value or visual scale) to match the pedagogical goals of 'décodages' sorting networks.
- To run end-to-end (E2E) tests locally, first install dependencies (`pip install pytest-playwright playwright && playwright install`), then serve the project root using a local HTTP server (`python -m http.server 8000 &`), and finally run the test suite (`python -m pytest e2e_tests/`).
- In `jeu_de_la_grue.html`, the instruction queue must NOT feature a 'Preview Mode' (instructions are blindly queued to force user anticipation). Instruction validity checks, with immediate execution halting upon invalid moves, must only occur during full sequence execution.
- Audio playback in the Suite EdNum project is centralized through `js/audio.js` using the Web Audio API (e.g., `playSound()` via synthetic oscillators). Avoid relying on standalone audio files (e.g., `.mp3`) or HTML `<audio>` elements for sound effects.
