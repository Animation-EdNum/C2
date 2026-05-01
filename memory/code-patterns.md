# Code Patterns

## 1. Glassmorphism Card
Standard card style used throughout the apps:
```css
.card {
    background: var(--glass-bg); /* e.g., rgba(255, 255, 255, 0.7) */
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## 2. Dark Mode Implementation
Theme switching using a data attribute on the `<html>` or `<body>` element:
```javascript
const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
};
```

## 3. App Shell Structure
Every application follows this high-level HTML structure:
- `head`: Must include Open Graph meta tags (`og:title`, `og:description`, `og:type`) and link to the shared `favicon.svg` at the repository root.
- `header`: A unified `<header class="app-header">`. Action buttons (Scores, Theme, Audio, Settings) are grouped into a single 'Options' or 'Menu' hamburger dropdown (`.menu-item-btn`). The dropdown items must be wide, easily clickable, and use explicit text labels paired with icons instead of hidden title tooltips. Auxiliary action buttons should be positioned within the `.action-buttons` container inside the unified `.app-header`. When `.action-buttons` are not nested within the unified `.app-header` (e.g., in `index.html`), their top-right positioning is maintained via local CSS (`position: absolute; top: 15px; right: 15px;`).
- `main`: The core interactive area (grid, simulator, etc.).
- `nav`: Bottom tab bar for mobile navigation.
- `footer`: All HTML files must use a uniform `<footer class="no-print">` containing exactly: "Webapp conçue par Vivian de l'[AP EdNum](https://www.hepvs.ch/fr/prestations-de-services/animation-pedagogique-12811/) avec ❤️ et quelques neurones artificiels" and a source code link stating "Code 100% libre (AGPL-3.0)".
- `confetti`: Accompanying `<canvas id="confetti-canvas"></canvas>` for the unified confetti engine.

## 4. CSS Patterns
- **Colors & Theming:** Never hardcode color values (e.g., `white`, `#1e293b`) for structural backgrounds or text styling. Always use predefined CSS variables (like `var(--card-bg)`, `var(--text-main)`) from `css/shared.css` to ensure full compatibility with global Dark Mode. Visual styling like blur and spring transitions are managed via `:root` variables.
- **Z-Index & Overlays:** For global UI overlays (like modals), use a sufficiently high `z-index` (e.g., `10000`) to cover elevated components like the confetti canvas (`9999`) and floating elements. Focus rings are implemented globally using `:focus-visible` in `css/shared.css`. Global toasts (`#toast`) must be positioned at the center (`top: 50%`, `left: 50%`, `transform: translate(-50%, -50%)`) and include `pointer-events: none`.
- **Responsive Layouts:** For dynamic grids, flex rows, and button arrays, avoid fixed pixel dimensions. Use `flex-wrap: wrap`, `flex: 1`, `width: 100%`, and `min-width: 0`. For JavaScript, use relative fraction units (e.g., `gridTemplateColumns = 'repeat(size, 1fr)'`). To prevent interactive cells or bits from stretching on desktop, apply `width: clamp(min, vw, max)` to the elements and `width: fit-content` to their parent containers.
- **Button Visual Hierarchy:** Use distinct styling classes: `.btn-new` for primary actions (solid accent background), and variants of `.btn-outline` (like `.btn-outline-accent` or `.btn-outline-error`) for secondary actions.
- **Micro-interactions:** When adding or modifying interactive elements, employ 'Juicy' micro-interactions by combining spring physics animations (`transition: all 0.3s var(--spring-easing)`) with active state scaling/translating (`transform: scale(...) translateY(...)`).
- **Responsive Alignment:** When aligning absolute dropdown menus in responsive flex headers, prefer `right: 0; left: auto;` on mobile breakpoints to prevent overflowing.
- **Mobile Safe Areas:** When styling bottom-anchored mobile UI elements, use CSS padding referencing `env(safe-area-inset-bottom)` (e.g., `padding-bottom: max(24px, env(safe-area-inset-bottom))`).
- **Global Toasts:** Global toast notifications (`#toast`) should be positioned at the center of the screen (`top: 50%`, `left: 50%`, `transform: translate(-50%, -50%)`) and include `pointer-events: none`.
- **Focus Rings:** Implemented globally using the `:focus-visible` pseudo-class to provide high-contrast keyboard navigation cues.
- **Positioning Fixes:** To prevent internal anchor targets from being obscured by headers, use `:target { scroll-margin-top: 5rem; }`. If `position: fixed` elements get trapped inside a parent container, check for CSS properties that create a new containing block context (like `transform`, `animation`, `filter`, or `backdrop-filter`) on the parent and override them with `transform: none !important; animation: none !important; backdrop-filter: none !important;`. Apply `touch-action: manipulation` to the document `body` or interactive elements to eliminate the 300ms tap delay.

## 5. JS & State Patterns
- **ScoreManager:** Detailed game statistics are tracked via `js/scores.js` (`ScoreManager`) and persisted in `localStorage` as `c2_stats_${appId}`. Performance percentages must encompass all actions (e.g., `st.totalSuccess + st.mistakes`) in the denominator. Score/stat displays follow a standard `.score-bar` > `.score-item` > `.score-label` & `.score-value` layout.
- **Theme Callbacks:** HTML applications can implement a `window.__onThemeChange(theme)` callback to handle custom updates (like re-rendering canvas elements) when the global theme is modified by `theme.js`.
- **Positive Reinforcement:** Use `playSound('success')` and `launchConfetti()` from `js/confetti.js`.
- **SVG & DOM Injection:** To prevent ID collision issues when dynamically rendering SVG strings multiple times, extract all SVG `<defs>` (like gradients and filters) out of dynamic strings and place them inside a single globally hidden `<svg>` element at the top of the document `<body>`. In simulators, UI injection logic (like `placeOverlay`) should branch to use `innerHTML` for SVG strings and `innerText` for text/emojis.
- **Touch Swipes:** When implementing custom touch swipe gestures, ensure touch event listeners use `{passive: true}` and explicitly measure drag intent (`Math.abs(dx) > Math.abs(dy)`) to avoid interfering with native vertical scrolling.
- **Event Handling:** Prefer delegation or clean initialization inside `DOMContentLoaded` via `addEventListener` for static elements. Avoid using inline event handlers (like `onclick`) in HTML files to maintain cleaner code and support strict CSP.
- **String Building:** When generating HTML dynamically inside loops, prefer collecting HTML strings in an array and using `.join('')` over iterative string concatenation (`+=`).
- **ScoreManager Statistics:** Detailed game statistics are tracked globally via `js/scores.js`. When calculating performance percentages, the denominator must encompass all actions (e.g., `st.totalSuccess + st.mistakes`).
- **Translations:** `ScoreManager` centralizes human-readable translations in `MODE_LABELS` and `DIFF_LABELS`. When rendering labels, use the lookup pattern `this.MODE_LABELS[key] || key`.
- **Swipe Gestures:** Mobile swipe functionality for tab navigation is centralized in `js/swipe.js`. It supports container classes (`.tabs`, `.tab-bar`) and button classes (`.tab-btn`). Ensure this script is explicitly included.
- **Critical Successes:** 'Critical Successes' should trigger intense visual rewards using `launchFire()` from `js/confetti.js` and appending `.critical-success-overlay` to the DOM.

- **Mobile Navigation Rule:** Navigation tabs must only be used to switch exercises within a webapp (`.tabs`, `.tab-bar`), never to select a difficulty level (`.difficulty-bar`). The `.nav-bar` class is deprecated.

## 6. Accessibility (A11y) Patterns
- **Keyboard Navigation:** Custom interactive elements (e.g., `<div>` or `<span>` with `onclick`) must include `tabindex="0"` and an `onkeydown` handler that triggers on 'Enter' or 'Space' (`if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.click(); }`).
- **ARIA Semantics:** Custom interactive grids and overlays must implement precise ARIA semantics: `role="grid"`, `role="row"`, `role="gridcell"`, and `role="img"` for absolute overlays. Maintain dynamically updated `aria-label` attributes reflecting exact coordinates, states, and orientations. Icon-only buttons must always include an `aria-label`. Menu dropdown items must be wide, easily clickable, and use explicit text labels paired with icons instead of hidden title tooltips.


## 7. SVG & Visual Effects
- **Responsive SVGs:** Avoid hardcoding fixed attributes like 'r' or 'font-size' via `setAttribute()`. Assign them CSS classes using `classList.add()` so they can scale with media queries. Preserve root `<svg>` responsive attributes (`width="100%" height="100%" viewBox="..."`) and scale inner graphics using `<g transform="scale(...)">`.
- **Overflow Visibility:** To allow visual effects (like canvas-based particles or glow drop-shadows) to overflow grid cell boundaries, explicitly style parent containers (like `.bot-cell`, grids, and overlays) with `overflow: visible`.
- **Boundary Rendering:** When rendering percentage-based, absolutely positioned elements at container boundaries (e.g., 0% or 100%), place them inside a relative inner wrapper within a padded parent container to prevent visual clipping.

## 8. Simulator & Hardware UI Specifics
- **Fullscreen Mode:** Designed for minimal distraction (e.g., Blue-Bot `.fullscreen-map`). Forces the grid to remain perfectly square (`aspect-ratio: 1/1`), explicitly hides headers/tabs/options, and exposes embedded physical robot buttons (like 'GO' and 'X') within the directional command pad.
- **Visual Consistency:** Background elements like robot paths should be drawn consistently (e.g., using `TrailManager`) during movement animations across all active simulation modes. Educational mats (`MAT_CONFIG`) should be configured with an array of strings (`content: ['🏠', ...]`) to correctly render multi-byte emojis.
- **DOM Refresh Strategy:** When resetting or dynamically recreating a container's contents via `innerHTML = ''` (like a `.bot-grid`), ensure that statically positioned interactive overlays (e.g., fullscreen toggle buttons) are placed in an external parent wrapper (like `.grid-wrapper`) to prevent destruction during redraw. Placement functionalities (targets vs obstacles) should be combined into single interactive UI elements (`#btn-place-elements`) to reduce configuration clutter.

## 9. Gamification Specifics
- **Explicit Conditions:** When implementing 'first try' conditions for gamification or unlock mechanisms, explicitly verify that the relevant mistake counter (e.g., `mistakes`) is exactly `0` or falsy.
- **Consistent Styling:** Rewards (targets) in simulator grids use the `.target-overlay` CSS class and should feature a consistent glow effect implemented via `filter: drop-shadow`.
