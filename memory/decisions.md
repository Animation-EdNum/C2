# Architectural Decisions

- **[2026-04-22] Adopted 3-Layer Memory Architecture:** Based on the Jules/Claude-Code architecture to persist state and optimize token usage via constitutional context.
- **[2026-04-15] Strict Vanilla Stack:** Decided against React/Tailwind to maintain 100% offline compatibility and ensure the "standalone" versions (single HTML files) remain maintainable without build steps.
- **[2026-04-10] Glassmorphism Design System:** Selected a glassmorphism aesthetic (semi-transparent backgrounds, backdrop-filters, subtle gradients) to provide a "premium/OS-like" feel that appeals to students.
- **[2026-04-22] Mobile-First Navigation:** Standardized on a top `.tabs` navigation for all apps to ensure consistency, moving away from bottom tab bars.
- **[2026-04-18] LocalStorage for Persistence:** Use `localStorage` for all state persistence (theme, student lists, streaks) to avoid the complexity of local databases while maintaining offline functionality.
- **[2026-04-12] Font Self-Hosting:** All fonts (Outfit, Inter) must be stored in the `/fonts` directory to ensure consistent rendering without internet access.
- **[2026-04-23] Unified UI & Shared Styles:** Avoid duplicating common styles (e.g., action buttons, footer, dark mode toggles) in webapps; these must be managed centrally through `css/shared.css`. The webapps share a unified interface and natively include a global Dark Mode, storing the user's choice in `localStorage` to maintain consistency across the applications.
- **[2026-04-23] Audio Handling:** Webapps that incorporate audio must be silent by default (`let isMuted = true;`). The UI should include a toggle button to allow users to manually enable/disable sound. Guard `playSound` execution with `if (isMuted) return;`. Do not add audio or sound effects unless explicitly requested (e.g., interpret 'coup de feu' as a visual effect like `launchFire()`).
- **[2026-04-23] Testing Strategy:** Verification of functionality relies primarily on Playwright frontend verification scripts. There are no automated test suites (like `pytest` or `npm test`) configured in this repository.
- **[2026-04-24] Pedagogical Constraint Enforcement:** Established a pattern for enforcing pedagogical rules (e.g., restricted moves, required obstacles) at the state generation level rather than the UI level to ensure consistency across difficulty tiers.


- **[2026-04-24] Navigation Rule:** Navigation buttons/tabs must only be used to switch exercises within a webapp (`.tabs`), never to select a difficulty level (`.difficulty-bar`). The `.nav-bar` class is deprecated.
- **[2026-04-25] Adaptive Difficulty:** The application features an Adaptive Difficulty system managed by `ScoreManager` in `js/scores.js`. When a user accepts a difficulty level-up suggestion, a `c2_change_difficulty` custom event is dispatched to `window`.
- **[2026-04-25] Educational Feedback:** When implementing error feedback, prefer 'scaffolded' feedback that helps students identify errors (e.g., indicating if a value is too high/low) rather than simple true/false binary feedback.
- **[2026-04-25] Binary Math Visualization:** Always include '0' values for inactive bits in binary calculations or visual decompositions to explicitly reinforce bit weighting (e.g., `128 + 0 + 32 + 0 = 160`).
- **[2026-04-25] XSS Mitigation:** Avoid `innerHTML` for rendering untrusted or user-controlled data. Use `document.createElement` and `textContent` to ensure data is safely escaped. The shared `ScoreManager` includes `_escapeHtml()` as a defensive measure.
- **[2026-04-25] Standalone Directory:** The `standalone/` directory has been intentionally removed from the project to reduce maintenance overhead. Do not attempt to recreate standalone versions.
- **[2026-04-25] SEO & Meta Tags:** When creating new HTML files, include Open Graph meta tags (`og:title`, `og:description`, `og:type`) and link to the shared `favicon.svg`.
- **[2026-04-25] Navigation Pattern:** Avoid explicit 'home' buttons. Instead, configure the application's header icon (`.header-icon`) as a clickable link pointing to `../index.html`.
- **[2026-04-25] Global Security Review:** Implement comprehensive XSS vulnerability scans across the codebase; when a vulnerability is found, search for and remediate all similar unsafe patterns (e.g., `innerHTML` usage).
- **[2026-04-25] Simulation Modes Focus:** Ensure strict pedagogical focus per mode. E.g., the 'lecture' (reading) mode in Blue-Bot strictly focuses on destination prediction without 'bug identification' tasks.
- **[2026-04-30] Lucide Icon Subset:** Replaced the full `lucide.min.js` bundle (388 Ko) with a project-specific subset `lucide-subset.js` (15 Ko, -96%). The subset is auto-generated via `scripts/generate_lucide_subset.js` which scans HTML files for `data-lucide` attributes. Regenerate when new icons are added.
- **[2026-04-30] CI/CD Pipeline:** GitHub Actions workflow (`.github/workflows/e2e-tests.yml`) runs Playwright E2E tests on every PR to `main`. Tests live in `e2e_tests/`.
- **[2026-04-30] Service Worker Registration:** Single registration point in `js/theme.js` with path-agnostic logic. Duplicate registration blocks must not be added.
- **[2026-05-01] Navigation Standardization:** Decided to exclusively use top `.tabs` elements for navigation across desktop and mobile, explicitly abandoning sticky bottom tab bars to prevent collision with mobile OS gesture areas.
- **[2026-05-01] Embedded Controls Layout:** Decided to insert embedded auxiliary UI controls (like clear/hide buttons in dynamic lists) as standard relative flex items in the DOM flow rather than using absolute positioning, to eliminate clipping and overlap issues when lists expand.
- To maintain PWA offline functionality, new applications (including alpha apps) must be manually added to the `ASSETS` array in the `sw.js` Service Worker, and deleted files must be manually removed.
- Alpha web applications (in `alpha/webapps/`) must use a specific footer stating: 'Webapp conçue par Vivian de l'AP EdNum avec ❤️ et quelques neurones artificiels' and 'Code 100% libre (AGPL-3.0)'. It includes the `.no-print` class.
