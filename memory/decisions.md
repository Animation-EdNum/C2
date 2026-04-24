# Architectural Decisions

- **[2026-04-22] Adopted 3-Layer Memory Architecture:** Based on the Jules/Claude-Code architecture to persist state and optimize token usage via constitutional context.
- **[2026-04-15] Strict Vanilla Stack:** Decided against React/Tailwind to maintain 100% offline compatibility and ensure the "standalone" versions (single HTML files) remain maintainable without build steps.
- **[2026-04-10] Glassmorphism Design System:** Selected a glassmorphism aesthetic (semi-transparent backgrounds, backdrop-filters, subtle gradients) to provide a "premium/OS-like" feel that appeals to students.
- **[2026-04-22] Mobile-First Navigation:** Standardized on a Bottom Tab Bar for mobile devices to solve reachability issues, moving away from desktop-centric top headers.
- **[2026-04-18] LocalStorage for Persistence:** Use `localStorage` for all state persistence (theme, student lists, streaks) to avoid the complexity of local databases while maintaining offline functionality.
- **[2026-04-12] Font Self-Hosting:** All fonts (Outfit, Inter) must be stored in the `/fonts` directory to ensure consistent rendering without internet access.
- **[2026-04-23] Unified UI & Shared Styles:** Avoid duplicating common styles (e.g., action buttons, footer, dark mode toggles) in webapps; these must be managed centrally through `css/shared.css`. The webapps share a unified interface and natively include a global Dark Mode, storing the user's choice in `localStorage` to maintain consistency across the applications.
- **[2026-04-23] Audio Handling:** Webapps that incorporate audio must be silent by default (`let isMuted = true;`). The UI should include a toggle button to allow users to manually enable/disable sound. Guard `playSound` execution with `if (isMuted) return;`. Do not add audio or sound effects unless explicitly requested (e.g., interpret 'coup de feu' as a visual effect like `launchFire()`).
- **[2026-04-23] Testing Strategy:** Verification of functionality relies primarily on Playwright frontend verification scripts. There are no automated test suites (like `pytest` or `npm test`) configured in this repository.
- **[2026-04-24] Pedagogical Constraint Enforcement:** Established a pattern for enforcing pedagogical rules (e.g., restricted moves, required obstacles) at the state generation level rather than the UI level to ensure consistency across difficulty tiers.


- **[2026-04-24] Mobile Bottom Navigation Rule:** Bottom buttons/tabs must only be used to switch exercises within a webapp (`.tabs`, `.nav-bar`, `.tab-bar`), never to select a difficulty level (`.difficulty-bar`).
- **[2026-04-25] Adaptive Difficulty:** The application features an Adaptive Difficulty system managed by `ScoreManager` in `js/scores.js`. When a user accepts a difficulty level-up suggestion, a `c2_change_difficulty` custom event is dispatched to `window`.
- **[2026-04-25] Educational Feedback:** When implementing error feedback, prefer 'scaffolded' feedback that helps students identify errors (e.g., indicating if a value is too high/low) rather than simple true/false binary feedback.
- **[2026-04-25] Binary Math Visualization:** Always include '0' values for inactive bits in binary calculations or visual decompositions to explicitly reinforce bit weighting (e.g., `128 + 0 + 32 + 0 = 160`).
- **[2026-04-25] XSS Mitigation:** Avoid `innerHTML` for rendering untrusted or user-controlled data. Use `document.createElement` and `textContent` to ensure data is safely escaped.
- **[2026-04-25] Standalone Directory:** The `standalone/` directory has been intentionally removed from the project to reduce maintenance overhead. Do not attempt to recreate standalone versions.
- **[2026-04-25] SEO & Meta Tags:** When creating new HTML files, include Open Graph meta tags (`og:title`, `og:description`, `og:type`) and link to the shared `favicon.svg`.
