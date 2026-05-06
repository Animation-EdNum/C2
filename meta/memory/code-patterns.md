# Code Patterns & UI/UX Consistency

## 1. Global App Structure (HTML)
All web applications must follow this strict semantic structure:
- **Head:** Open Graph tags (`og:title`, etc.) and centralized favicon (`favicon.svg`).
- **Body:** Immediately followed by an accessibility link `<a href="#main-content" class="skip-link">Aller au contenu principal</a>`. The `.skip-link` styles are globally maintained in `assets/css/shared.css`.
- **Header (`<header class="app-header">`):** Contains the title, the header icon (clickable back to `../index.html`), and action buttons (Scores, Theme, Audio, Settings) often grouped into a wide, accessible dropdown menu. Action buttons use inline SVGs extracted from `fa-subset.js`.
- **Main (`<main id="main-content">`):** Encapsulates the primary content (grids, simulator) up to the site footer. It must have `id="main-content"` for the skip-link. When aligning to layout conventions, ensure the main content wrapper (like `.app-content`) is centered using `margin: 0 auto;`.
- **Footer (`<footer class="no-print">`):** See `project-context.md` for the exact mandatory text.
- **Confetti:** A `<canvas id="confetti-canvas"></canvas>` for animations.

## 2. CSS & Glassmorphism Design System
- **Centralization:** All global styles, variables (`--text-main`, `--card-bg`), and shared classes (`.btn`, `.tab-btn`, `.chal-instruction`, `.instructions`) must reside STRICTLY in `assets/css/shared.css`. **No local styles in HTML files** (except for single-use pages like `index.html`) and no hardcoded colors (use variables). DO NOT blindly extract generic app-specific `<style>` blocks if they pollute the global namespace.
- **Glassmorphism:** Cards (`.card`) use semi-transparent backgrounds (`var(--glass-bg)`), a `backdrop-filter: blur(12px) saturate(180%)`, and borders using `--glass-border`. Global UI components use `--card-border` (not `--border-color`).
- **Border Radius & Buttons:** Standardized via `--radius-sm` (6px, `.btn-small`), `--radius-md` (8px, primary `.btn`), `--radius-lg` (12px, `.tab-btn`, dropdowns), `--radius-2xl` (20px, `.container`). Specific button variants (e.g., `.btn-primary`) must also include the base `.btn` class (`class="btn btn-primary"`).
- **Responsive & Layout:** Avoid fixed pixel dimensions. Use `flex-wrap`, `min-width: 0`, and `width: clamp(...)`. For responsive tables, hide dynamic columns with `display: none !important` and use `white-space: nowrap` on `<th>`. To prevent horizontal overflow on mobile, limit card widths with `minmax(min(100%, 320px), 1fr)`.
- **Dark Mode:** Managed natively via a `data-theme` attribute on `<html>`. UI components (buttons) must maintain high contrast in light/dark modes on hover (use `filter: brightness()` or semi-transparency; avoid white text on light backgrounds).
- **SVG Styling:** To ensure correct rendering in Safari, always include explicit units (e.g., `px`) for presentation attributes like `r` in CSS (e.g., `r: 14px;`). To prevent FontAwesome SVGs (`.fa-icon`) from being cropped, apply `overflow: visible;` in their CSS.

## 3. Navigation & UI Components
- **Primary Navigation:** EXCLUSIVELY use top tabs (`.tabs` > `.tab-btn`) to navigate between exercises. **NEVER use bottom tab bars or `.nav-bar`**. Inactive tabs should typically have a white background (`#ffffff`) in light mode. Tab swiping (`assets/js/swipe.js`) must be completely omitted in drawing webapps.
- **Accessibility (A11y) & Interactions:**
  - Touch targets of at least 44x44px.
  - Keyboard management (`tabindex="0"`, `onkeydown="Enter/Space"`). Exact ARIA roles for complex grids. Global focus rings via `:focus-visible`. Do not implement global tablist navigation using `ArrowLeft`/`ArrowRight` if the app relies on arrow keys for core gameplay (like `simulateur_bluebot.html`).
  - "Juicy" micro-interactions using spring animations (`var(--spring-easing)`).
- **Instructions:** Long instructions use `<details class="instructions">` (globally styled). Short directives (one sentence) use `.chal-instruction` (e.g., `font-weight: 600; font-size: 1.1em`).
- **Modals & Drawers:** Styled as side-panels, no floating windows or "bottom sheets". Must support gesture closing (swipe) and the Escape key.
- **FontAwesome Rules:** Use `data-fa="<name>"` (solid) and `data-fa="dt-<name>"` (duotone). Dice icons must use text suffixes (e.g., `dice-one`). Run `node meta/scripts/generate_fa_subset.js` after adding icons. Dynamically injected SVGs must be present in the HTML (e.g., hidden `<i>`) before generating the subset.

## 4. JS & State Management
- **Modularity:** When modularizing vanilla JS, trace dependencies and ensure foundational state is in the base script. Order `<script>` tags by dependency, and defer UI/skin setup to a central initialization function (e.g., `initApplication()`) instead of synchronous top-level calls.
- **ScoreManager (`assets/js/scores.js`):** Centralizes adaptive difficulty, streaks, and records, stored in `localStorage`. Statistics (%) must encompass all actions. Do not use deprecated functions.
- **Toasts (`assets/js/toast.js`):** Used via `showToast(msg, type = 'success', duration = 3000)`. Types include 'success' (maps to 'circle-check' FA7 icon), 'error' ('circle-xmark'), 'warn' ('triangle-exclamation'), and 'info' ('circle-info'). Container `#c2-toast-container` is auto-generated.
- **Audio (`assets/js/audio.js`):** All applications with audio must start muted (`let isMuted = true;`). Use the Web Audio API (`playSound()`), never static files or `<audio>` tags.
- **Asynchronous Loops:** When managing loops (`setInterval`, `setTimeout`), track all timer IDs and clear them explicitly during state transitions to prevent auto-advancement. Avoid double-binding event listeners (e.g., mixing `addEventListener` with `.onclick`).
- **Inline Event Handlers:** When using inline HTML handlers that rely on deferred scripts (e.g., `onclick="window.openShareModal && window.openShareModal()"`), ensure the target function is explicitly bound to the global window object (`window.openShareModal = openShareModal;`).
- **URL Parameters (`assets/js/url-params.js`):** Global UI configuration (hiding elements, locking difficulty) is managed centrally. Apps can implement `window.getAppShareState()` to return state objects serialized into the Share URL. Check flags dynamically (`new URLSearchParams(window.location.search).get('lockName')`) in event listeners rather than caching statically on load.
- **Drag & Drop (Mobile & Desktop):** Explicitly track global state (e.g., `isDragged = true`) to prevent conflicts with `requestAnimationFrame` loops. For mobile D&D without HTML5 API, clone the element, use `position: fixed`, and block scrolling via `e.preventDefault()` in `touchmove`.
- **SVG & DOM Injection:** Do not use `innerHTML` for untrusted data. Use `ScoreManager._escapeHtml()`. Place shared SVG `<defs>` in a hidden global `<svg>` in the `<body>` to avoid ID collisions.

## 5. Alpha Apps & App-Specific Quirks (Keywords)
- **Drawing / Pixels (Pixel Studio, Binaire):** Implement 'swipe-to-paint' with `isDrawing` tracking; `e.preventDefault()` on `touchstart` and `touchmove`; total deactivation/removal of `assets/js/swipe.js` to avoid Swipe vs Drawing conflicts.
  - In `binaire_studio.html`, the Editor mode ('Éditeur') must remain locked by default until 3 'decode' and 3 'encode' challenges are completed.
- **Simulateur Blue-Bot:**
  - Verify routing via `activeTab` for global listeners (keyboard).
  - "Drawing" validation: requires shape `closed: true` and final position == initial position check.
  - Square Grid: Dynamically calculate `aspect-ratio` instead of fixed `1/1`.
  - Skins/Mats: In-place DOM classes updates. Do not use `buildGrid()`. Force `redrawTrail()`.
  - 'Read' Mode (Décodage): Hide the target on render! Use `.read-only-cmd` (`pointer-events: none`).
- **Jeu de la Grue:** 1D blind queue logic (no Preview); `.active-column`/`.active-slot` on the DOM to animate execution; Reset `initialCupsState` on failure.
- **Réseau de Tri:** Parallel animations via `currentStageIndex`. `offsetX` shifts only for guaranteed vertical overlaps. Dynamic `GRID_SPACING_X` calculations on `window.resize`.
- **Machine à Trier:** Ascending sort required for "Quantité" (dice) and "Taille" modes.
- **Machine à Chiffrer:** Circular container (`aspect-ratio: 1/1`), % internal heights, `transform-origin: bottom center`.
- **Routage Réseau:** Extreme mode uses `solarInterval` for real-time breakdowns (`brokenNodes`). Clicking the last added node should trigger an 'undo' action rather than resetting the path.
