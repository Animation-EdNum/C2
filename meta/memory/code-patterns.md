# Code Patterns & UI/UX Consistency

## 1. Global App Structure (HTML)
All web applications must follow this strict semantic structure:
- **Head:** Open Graph tags (`og:title`, etc.) and centralized favicon (`favicon.svg`).
- **Body:** Immediately followed by an accessibility link `<a href="#main-content" class="skip-link">Aller au contenu principal</a>`.
- **Header (`<header class="app-header">`):** Contains the title, the header icon (clickable back to `../index.html`), and action buttons (Scores, Theme, Audio, Settings) often grouped into a wide, accessible dropdown menu. Action buttons use inline SVGs extracted from `fa-subset.js`.
- **Main (`<main id="main-content">`):** Encapsulates the primary content (grids, simulator). Can be wrapped in a `.desktop-layout` (flex) container to optimize wide screens (>900px).
- **Footer (`<footer class="no-print">`):** See `project-context.md` for the exact mandatory text.
- **Confetti:** A `<canvas id="confetti-canvas"></canvas>` for animations.

## 2. CSS & Glassmorphism Design System
- **Centralization:** All global styles, variables (`--text-main`, `--card-bg`), and shared classes (`.btn`, `.tab-btn`, `.chal-instruction`) must reside STRICTLY in `assets/css/shared.css`. **No local styles in HTML files** and no hardcoded colors (use variables).
- **Glassmorphism:** Cards (`.card`) use semi-transparent backgrounds (`var(--glass-bg)`), a `backdrop-filter: blur(12px) saturate(180%)`, and borders using `--glass-border`. Global UI components use `--card-border` (not `--border-color`).
- **Border Radius:** Standardized via `--radius-sm` (6px, `.btn-small`), `--radius-md` (8px, primary `.btn`), `--radius-lg` (12px, `.tab-btn`, dropdowns), `--radius-2xl` (20px, `.container`).
- **Responsive & Layout:** Avoid fixed pixel dimensions. Use `flex-wrap`, `min-width: 0`, and `width: clamp(...)`. For responsive tables, hide dynamic columns with `display: none !important` and use `white-space: nowrap` on `<th>`. To prevent horizontal overflow on mobile, limit card widths with `minmax(min(100%, 320px), 1fr)`.
- **Dark Mode:** Managed natively via a `data-theme` attribute on `<html>`. UI components (buttons) must maintain high contrast in light/dark modes on hover (use `filter: brightness()` or semi-transparency; avoid white text on light backgrounds).

## 3. Navigation & UI Components
- **Primary Navigation:** EXCLUSIVELY use top tabs (`.tabs` > `.tab-btn`) to navigate between exercises. **NEVER use bottom tab bars or `.nav-bar`** (to avoid conflicts with mobile OS gestures). Tabs must not be used for difficulty selection.
- **Accessibility (A11y) & Interactions:**
  - Touch targets of at least 44x44px.
  - Keyboard management (`tabindex="0"`, `onkeydown="Enter/Space"`). Exact ARIA roles for complex grids. Global focus rings via `:focus-visible`.
  - "Juicy" micro-interactions using spring animations (`var(--spring-easing)`).
- **Instructions:** Long instructions use `<details class="instructions">`. Short directives (one sentence) use `.chal-instruction` (e.g., `font-weight: 600; font-size: 1.1em`).
- **Modals & Drawers:** Styled as side-panels, no floating windows or "bottom sheets". Must support gesture closing (swipe) and the Escape key.

## 4. JS & State Management
- **ScoreManager (`assets/js/scores.js`):** Centralizes adaptive difficulty, streaks, and records, stored in `localStorage`. Statistics (%) must encompass all actions (successes + mistakes). Do not use deprecated functions (e.g., no `addCorrect()`).
- **Toasts (`assets/js/toast.js`):** Used via `showToast(msg, type)`. Container is auto-generated. Do not hardcode `<div id="toast"></div>` in apps. Uses global positioning and `pointer-events: none`.
- **Audio (`assets/js/audio.js`):** All applications with audio must start muted (`let isMuted = true;`). Use the Web Audio API (`playSound()`), never static files or `<audio>` tags.
- **Drag & Drop (Mobile & Desktop):** Explicitly track global state (e.g., `isDragged = true`) to prevent conflicts with `requestAnimationFrame` loops. For mobile D&D without HTML5 API, clone the element, use `position: fixed`, and block scrolling via `e.preventDefault()` in `touchmove`.
- **SVG & DOM Injection:** Do not use `innerHTML` for untrusted data. Use `ScoreManager._escapeHtml()`. Place shared SVG `<defs>` in a hidden global `<svg>` in the `<body>` to avoid ID collisions. Do not apply `overflow: hidden` to `.fa-icon` to prevent clipping icons that exceed their viewBox.

## 5. Alpha Apps & App-Specific Quirks (Keywords)
- **Drawing / Pixels (Pixel Studio, Binaire):** `isDrawing` tracking; `e.preventDefault()` on touchmove; total deactivation of `assets/js/swipe.js` to avoid Swipe vs Drawing conflicts.
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
- **Routage Réseau:** Extreme mode uses `solarInterval` for real-time breakdowns (`brokenNodes`).