# Repo Audit

## 1. Security & Hygiene
- **Missing `lang="fr"`**: None found.
- **Inline Scripts & Styles**: Every HTML file contains inline script and style blocks. This makes CSP enforcement difficult.
- **Potential XSS (innerHTML)**: Multiple files heavily use `.innerHTML` assignment.
  - `simulateur_bluebot.html` (26 occurrences)
  - `binaire_codage.html` (10 occurrences)
  - `binaire_message.html` (9 occurrences)
  - `routage_reseau.html` (8 occurrences)
  - `assets/js/scores.js` (2 occurrences)
- **console.log in Prod**: `sw.js` and `index.html` still contain `console.log` statements.

## 2. Accessibility
- **Skip Links**: Almost every application (except `index.html` apparently, wait no, `index.html` is missing it too according to script) is missing a "Skip to content" link for screen readers.
- **Semantic HTML**: Most webapps are missing a `<main>` semantic tag (`index.html` is the only one that uses it properly, wait actually bareme uses it too, but missing in most).
- **Missing `alt` on images**: No images were found missing `alt` attributes (good job!).

## 3. PWA & Service Worker
- `sw.js` contains a `console.log`.
- Cache assets check out, no missing files in the cache array.

## 4. Performance & File Size
- **Large HTML Files**: `simulateur_bluebot.html` is a massive 253.3 KB monolith.
- **Large Resource Files**:
  - `meta/ressources/regular_icons.js` (2.6 MB)
  - `meta/ressources/solid_icons.js` (2.2 MB)
  - `meta/ressources/duotone.js` (2.6 MB)
  - `meta/ressources/lucide.min.js` (388 KB)
  *Note: These are in `meta/ressources/` so they might not be served to users, but `lucide.min.js` was flagged in previous audits as being loaded.*
- **Large Images**:
  - `assets/img/mats/city.png` is massive (6.9 MB). Needs compression.

## 5. CSS Architecture & Code Quality
- **Duplicated Selectors**: `shared.css` contains many duplicated selectors (`hover`, `.icon-action-btn`, `.modal-content`, `.settings-dropdown-content`, etc.).
- **Global Scope Overrides**: `.tab-btn` and `.btn` classes are overridden locally in several files (`index.html`, `bareme.html`, `tirage.html`), breaking encapsulation.
- **Inline Styles**: Extensive use of inline style attributes (e.g., 90 in `simulateur_bluebot.html`, 45 in `index.html`).
- **`!important` Usage**: 40 `!important` declarations in `shared.css` and 27 in `simulateur_bluebot.html`.
- **Hardcoded Colors**: Massive amount of hardcoded hex colors instead of CSS variables across `shared.css` and local `<style>` blocks (e.g., 138 in `simulateur_bluebot.html`, 100 in `jeu_de_la_grue.html`).

## 6. Testing & Memory
- **Memory Files**: All memory files are populated.
- **E2E Tests**: No E2E issues found (tests exist).
