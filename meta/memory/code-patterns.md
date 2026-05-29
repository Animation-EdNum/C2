# Code Patterns & UI/UX Consistency

## 1. Global App Structure (HTML)
- **Standalone Pages:** Use inline CSS resets (`* { margin: 0; ... }`) in `<style>` blocks.
- **Teacher Webapps:** Use `.app-shell` > `<header>` and `<main>`. The `.app-main` contains `.config-panel` (`<aside>`) and `.results-panel`.
- **Copyright Header:** All source files (`.html`, `.css`, `.js`) MUST include the AGPL-3.0 header for 'Animation-EdNum (HEP-VS)'.
- **Semantic Structure:**
  - `<a href="#main-content" class="skip-link">`: Mandatory first body element.
  - `<header class="app-header">`: Contains title, back icon, action buttons (inline SVGs from `fa-subset.js`).
  - `<main id="main-content">`: Main content wrapper, center with `margin: 0 auto;`.
  - `<footer class="no-print">`: Mandatory legal text.
  - `<canvas id="confetti-canvas">`: Mandatory for celebrations.

## 2. CSS & Design System (Glassmorphism)
- **Centralization:** NO local styles in stable HTML files. CSS variables (`--text-main`) reside in `assets/css/tokens.css` and `base.css`. Components (`.btn`) are in `components.css`. See §6 FCP Optimization for cascade order.
- **Glassmorphism:** Use `var(--glass-bg)` with `backdrop-filter: blur(12px) saturate(180%)`. Border is `--glass-border`.
- **Border Radii:** `--radius-sm` (6px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-2xl` (20px).
- **Tooltips:** NEVER use native `title` attributes on buttons. Use `data-tooltip="..."` for CSS-animated tooltips.
- **Dark Mode:** Applied via `data-theme="dark"` on `<html>`. Ensure high contrast on hover states.
- **SVG Styling:** Always add `px` to SVG units in CSS (e.g., `r: 14px;`). Apply `overflow: visible` to prevent `.fa-icon` cropping. Scale SVGs via `width/height`, NOT `font-size`. Add `transform-box: fill-box; transform-origin: center;` for proper CSS scaling.
- **CSS Specificity:** Do NOT use `!important` to override. Increase selector specificity (e.g., `html body .class`).
- **Animations:** Use CSS `transform` on `.target-inner` wrappers, not the parent overlay. Use `requestAnimationFrame` for continuous JS animations, not `setInterval`.
- **DOM & UI:** Always provide explicit fallback colors (e.g., `var(--card-bg, #ffffff)`) for CSS variables. Use `overflow: visible` to prevent absolute overlays from clipping.
- **Automate Grid Layers:** To ensure grid lines render above image mats applied via `.bot-grid::before`, the intermediate `.grid-row` container must have `position: relative` and `z-index: 1`, and `.bot-cell` borders must have increased opacity.

## 3. Navigation & UI Components
- **Primary Navigation:** Exclusively use top tabs (`.tabs` > `.tab-btn`). NEVER use bottom tab bars (`.nav-bar` is deprecated).
- **Cards:** `.exercise-card` must use a `.card-footer` with a `.score-bar` and an icon-only stats button (`.icon-action-btn`).
- **Modals/Drawers:** Styled as side-panels. Must support swipe-to-close and Escape key.
- **Icons (FontAwesome 7 Pro):** `data-fa="<name>"` (solid), `data-fa="dt-<name>"` (duotone). Run `generate_fa_subset.js` after adding.
- **Accessibility:** Minimum 44x44px touch targets. Maintain `:focus-visible` rings. Add `tabindex="0"`.

## 4. JS & State Management
- **ScoreManager (`scores.js`):** Centralizes all adaptive difficulty and scores via `localStorage`. Call `ScoreManager.addSuccess(level)` or `addMistake(level)`. Pass `null` for `level` if difficulty logic is disabled.
- **Confetti (`confetti.js`):** Use `window.handleStreakCelebration(currentStreak, isExtreme, score)` instead of raw `launchConfetti()`.
- **Toasts (`toast.js`):** `showToast(msg, type)`. Types: `success`, `error`, `warn`, `info`.
- **DOM Queries:** Pre-cache DOM elements. Do NOT use `Array.from(document.querySelectorAll).find()` inside loops. Use `DocumentFragment` for batch inserts.
- **XSS Prevention (Critical):** Always sanitize untrusted input with `ScoreManager._escapeHtml()` before using `innerHTML`.
- **No Inline Events (Critical):** Do NOT use inline event attributes (e.g. `onclick="..."`, `onchange="..."`) in HTML code across all stable and alpha apps. Always bind events programmatically via `.addEventListener('click', ...)` on elements identified with unique `id` attributes or structural selectors.
- **Audio (`audio.js`):** Use `playSound(id)`. Apps must start muted (`isMuted = true`).
- **URL Parameters (`url-params.js`):** Global UI configs via URL search params.
- **JS Performance Patterns:** Extract regular expression literals used in loops into module-level constants. Use `getElementsByClassName` with a `while` loop over the live `HTMLCollection` instead of `querySelectorAll` for rapid element removal. Use `Array.prototype.map().join('')` or push to an array and `.join('')` instead of `+=` for string concatenation in loops. For animation loops, replace `Array.splice()` with an O(1) swap-and-pop pattern when element order doesn't matter. Avoid nested `querySelector` calls within iterations; use a single, flat `document.querySelectorAll()` call. Implement memoization caches when applying regex replacements to large strings inside render loops.
- **DOM Manipulations:** Avoid using `element.innerHTML` for dynamic content to prevent XSS. Use native DOM APIs (`document.createElement`, `textContent`). Avoid inserting code inside a `<script>` tag that already has a `src` attribute. Ensure functions are defined before callers if spanning multiple `<script>` blocks.
- **Theme Callbacks:** Define `window.__onThemeChange(theme)` to execute page-specific logic when the global dark/light theme changes.
- **Clipboard API:** Deprecate `document.execCommand('copy')`. Use `navigator.clipboard.writeText()` or `ClipboardItem` APIs, relying on Promise-based `.catch()` blocks for errors instead of legacy hidden textarea hacks.
- **Audio Scoping:** Webapps should not locally redeclare variables like `isMuted` or functions like `playSound` to avoid collisions with the centralized `audio.js`.

## 5. App-Specific Quirks
- **Drawing Apps:** Call `e.preventDefault()` on `touchstart/move`.
- **Simulateur Automate:**
  - Robot orientation is an integer `0-3` (Up, Right, Down, Left).
  - Validation: Shape `closed: true` and final position == initial position.
  - Skin config: `MAT_CONFIG` and `SKIN_CONFIG`. Use `createSVG(tag)`.
  - Clear `<filter>` tags from SVG strings before generating thumbnails to fix lag.
- **Jeu de la Grue:** 1D blind queue. Reset `initialCupsState` on failure.
- **Routage Réseau:** Extreme mode breaks nodes dynamically (`brokenNodes`). Undo last node instead of resetting path.

## 6. Structure & Styling Specifics
- **Teacher Webapps Layout**: Teacher webapps (e.g., `tirage.html`, `bareme.html`) use a consistent structural layout that should be replicated for new tools: an `.app-shell` holding a `<header>` and a `<main>`. Inside the main area, use an `.app-main` container typically split into a left `.config-panel` (an `<aside>` for settings) and a right `.results-panel` (or `.main-content` for the output/simulation).
- **Standalone Pages**: For standalone HTML pages (like `index.html` and `merci.html`), the universal CSS reset (`* { margin: 0; padding: 0; box-sizing: border-box; }`) is defined directly inline within the page's `<style>` block rather than being centralized in `assets/css/base.css` or other shared stylesheets.
- **FCP Optimization**: To optimize First Contentful Paint (FCP), HTML files must include direct, parallel `<link>` tags for `tokens.css`, `base.css`, `components.css`, and `utilities.css` (in that specific cascade order). Do not bundle CSS into a single file.
- **Per-App CSS**: Stable webapps include a dedicated `assets/css/<app_name>.css` file (e.g., `automate.css`, `binaire_codage.css`, `routage_reseau.css`). Alpha apps may still use inline `<style>` blocks.
- **CSS Specificity vs `!important`**: Override styles by naturally increasing selector specificity (e.g., prefixing selectors with `html body `) rather than deleting `!important` flags across the codebase, which can break utility classes and accessibility features.
- **Duplicate SVG IDs**: In webapps with multiple tabs or hidden containers, when dynamically injecting identical SVG strings containing `<filter>` or `<linearGradient>`, append a unique suffix to all `id="..."`, `url(#...)`, and `href="#..."` strings to prevent invisibility bugs in Chromium/WebKit.
- **Event Delegation**: For dynamically generated elements (like `.program-cmd` in `#sim-program`), handle click events using event delegation on their static parent containers combined with `e.target.closest()`.
- **FontAwesome Dynamic Injection**: When dynamically injecting new FontAwesome `<i data-fa="...">` tags into the DOM via JavaScript, use optional chaining `window.fa?.createIcons?.(parentElement)` to trigger conversion.
- **AGPL-3.0 Headers**: New or modified source files (.html, .css, .js) should include a standard AGPL-3.0 copyright header attributing 'Animation-EdNum (HEP-VS)'.
- **Back Navigation**: To implement 'back' navigation in static offline HTML pages, use `<a href="javascript:history.back()">`.
- **FontAwesome Subset Tweaks**: Do not manually modify the generated data inside `assets/js/fa-subset.js`. Fix icon appearance issues (like duotone paths or mismatching viewBoxes) via standard CSS overrides. Ensure custom icons use the exact same `viewBox` width and height dimensions as the original icon.
- **Specific Instructions:** Place 'short instruction' texts directly inside the `.exercise-card` using inline styles instead of `.chal-instruction` classes.
- **Visual Overlays (Automate):** When attaching visual overlays to the rotating `.robot-body`, use a wrapper element to apply counter-rotation (`transform: rotate(-${deg}deg)`) and apply translation to the inner element to ensure positioning relative to global screen axes.
