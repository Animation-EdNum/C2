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
- **Centralization:** NO local styles in HTML files. All variables (`--text-main`) and utility classes (`.btn`) reside in `assets/css/shared.css`.
- **Glassmorphism:** Use `var(--glass-bg)` with `backdrop-filter: blur(12px) saturate(180%)`. Border is `--glass-border`.
- **Border Radii:** `--radius-sm` (6px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-2xl` (20px).
- **Tooltips:** NEVER use native `title` attributes on buttons. Use `data-tooltip="..."` for CSS-animated tooltips.
- **Dark Mode:** Applied via `data-theme="dark"` on `<html>`. Ensure high contrast on hover states.
- **SVG Styling:** Always add `px` to SVG units in CSS (e.g., `r: 14px;`). Apply `overflow: visible` to prevent `.fa-icon` cropping. Scale SVGs via `width/height`, NOT `font-size`. Add `transform-box: fill-box; transform-origin: center;` for proper CSS scaling.
- **CSS Specificity:** Do NOT use `!important` to override. Increase selector specificity (e.g., `html body .class`).
- **Animations:** Use CSS `transform` on `.target-inner` wrappers, not the parent overlay. Use `requestAnimationFrame` for continuous JS animations, not `setInterval`.

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
- **Audio (`audio.js`):** Use `playSound(id)`. Apps must start muted (`isMuted = true`).
- **URL Parameters (`url-params.js`):** Global UI configs via URL search params.

## 5. App-Specific Quirks
- **Drawing Apps:** Call `e.preventDefault()` on `touchstart/move`.
- **Simulateur Automate:**
  - Robot orientation is an integer `0-3` (Up, Right, Down, Left).
  - Validation: Shape `closed: true` and final position == initial position.
  - Skin config: `MAT_CONFIG` and `SKIN_CONFIG`. Use `createSVG(tag)`.
  - Clear `<filter>` tags from SVG strings before generating thumbnails to fix lag.
- **Jeu de la Grue:** 1D blind queue. Reset `initialCupsState` on failure.
- **Routage Réseau:** Extreme mode breaks nodes dynamically (`brokenNodes`). Undo last node instead of resetting path.
