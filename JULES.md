# JULES.md: Project Constitution
*This file is read at the start of every session. It contains stable, project-level context.*

## 1. System Prompt & Goals
- **Primary Directive:** Maintain and evolve Suite EdNum (web apps for primary school in Switzerland).
- **Core Focus:** Offline-first functionality, high-quality UI/UX (glassmorphism), and pedagogical clarity.
- **Role:** Autonomous coding agent (Antigravity/Jules).

## 2. Technical Stack
- **Languages:** HTML5, Vanilla JavaScript (ES6+), Vanilla CSS.
- **Testing:**
  - **Unit Tests:** Node.js native test runner (`npm run test:unit`) covering core utility modules (`audio.js`, `confetti.js`, `portal.js`, `scores.js`, `theme.js`, `toast.js`, `automate-engine.js`, etc.).
  - **Automated E2E:** Playwright / Pytest (`python -m pytest meta/tests/e2e/`). *Note: Use `localStorage` manipulation instead of UI clicking for Simulateur Automate to avoid flakiness (see `meta/memory/automate-playwright-tips.md`).*
  - **Accessibility:** Manual browser verification (WCAG AA compliance) and high-contrast projection modes.
- **Style Guidelines:** Clean, documented code, consistent glassmorphism design tokens, zero external CDN dependencies.

## 3. Strict Boundaries & Best Practices
- **Service Worker Manifest:** Always run `npm run check:sw` (or `npm run build:sw`) after modifying, adding, or deleting static assets in `assets/`, `webapps/`, or `alpha/`.
- **Workflows:** GitHub Actions (`.github/workflows/`) run automated SW syncing (`sw-sync.yml`) and smoke/E2E testing (`e2e-tests.yml`). Ensure `npm ci` is preserved when updating node environments.
- **Architecture:** Always consult `agents.md` and `meta/memory/*.md` before making architectural assumptions.
- **File Modifications:** Use standard editing tools (`replace_file_content`, `multi_replace_file_content`, `write_to_file`) appropriately for precise and clean code edits.
