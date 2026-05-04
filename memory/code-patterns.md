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

## 3. App Shell Structure
Every application follows this high-level HTML structure:
- `head`: Must include Open Graph meta tags (`og:title`, `og:description`, `og:type`) and link to the shared `favicon.svg` at the repository root.
- `header`: A unified `<header class="app-header">`. Action buttons (Scores, Theme, Audio, Settings) are grouped into a single 'Options' or 'Menu' hamburger dropdown (`.menu-item-btn`). The dropdown items must be wide, easily clickable, and use explicit text labels paired with icons instead of hidden title tooltips. Auxiliary action buttons should be positioned within the `.action-buttons` container inside the unified `.app-header`. When `.action-buttons` are not nested within the unified `.app-header` (e.g., in `index.html`), their top-right positioning is maintained via local CSS (`position: absolute; top: 15px; right: 15px;`).
- `main`: The core interactive area (grid, simulator, etc.).
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
- **Mobile Drag-and-Drop:** When implementing mobile touch-based drag-and-drop (to bypass HTML5 limitations), do not call `e.preventDefault()` in `touchstart` as it blocks native click events. Instead, track coordinates, create a `position: fixed` clone with `pointer-events: none` during `touchmove` (where `e.preventDefault()` is used to stop scrolling), and detect the drop zone using `document.elementFromPoint` in `touchend` only if movement occurred.

- **Mobile Navigation Rule:** Primary navigation must use top `.tabs` (or `.tab-bar`) across all platforms (desktop and mobile). Bottom tab bars are explicitly deprecated to avoid overlapping issues on mobile OS with bottom swiping gestures. Navigation tabs must only be used to switch exercises within a webapp (`.tabs`), never to select a difficulty level (`.difficulty-bar`). The `.nav-bar` class is deprecated.

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

- **Embedded UI Controls:** Auxiliary controls within dynamic lists (such as `#hideCmdToggleBtn` inside `#sim-program` in the Blue-Bot Simulator) should be appended as normal flex items in the DOM flow. Avoid absolutely positioning them, as this can cause them to obscure dynamically added content.
- For text processing or cipher webapps (like `machine_a_chiffrer.html`), the standard large-screen (TBI) layout (`@media (min-width: 1024px)`) uses a horizontal row structure: input text area on the left (`flex: 1`), a fixed-width central controls column (`.controls-wrapper`), and the output text area on the right (`flex: 1`).
- In pixel-based decoding games (e.g., pixels_binaires.html), all predefined drawing patterns must use every available color at least once to ensure full decoding practice.
- The project standardizes on top `.tabs` navigation for all apps to ensure consistency. Do not use `.nav-bar` or bottom-fixed navigation designs.
- For responsive circular UI elements (like the cipher wheel in `machine_a_chiffrer.html`), avoid hardcoded pixel dimensions and `transform-origin` values. Instead, use responsive containers (`aspect-ratio: 1/1`, `max-width`, `width: 100%`) and percentage-based inner height calculations (e.g., `height: calc(50% - 5px)`) with `transform-origin: bottom center` to maintain correct scaling and radial alignment on mobile viewports.
- To ensure touch accessibility and a modern UX across webapps, standard `<button>` elements should have a minimum touch target size of 44x44 pixels (e.g., `min-width: 44px; min-height: 44px;`) and primary action buttons (`.btn`, `.tab-btn`) should use legible typography and padding (e.g., `font-size: 16px; padding: 10px 20px;`).
- The standard `font-family` across all webapps is `'Outfit', 'Segoe UI', system-ui, sans-serif;`, utilizing the local 'Outfit' font from the `/font` folder while falling back cleanly.
- Webapps generally implement swipe navigation by including `js/swipe.js` at the end of the `<body>` element. For the swipe mechanic to function, the page must include standard tab HTML markup (`.tabs` or `.tab-bar`). To explicitly disable swipe navigation, omit or remove the `js/swipe.js` import.
- Do not use the `replace_file_content` tool for modifying files; project guidelines restrict file modifications to `write_to_file` and `replace_with_git_merge_diff`.
- In `simulateur_bluebot.html`, embedded auxiliary UI controls inside program strips (such as the hide toggle `#hideCmdToggleBtn` or `#btn-clear-end`) must be inserted as standard relative flex items in the DOM flow, explicitly avoiding absolute positioning to prevent visual overlapping on crowded lines.
- When animating elements that are draggable via HTML5 drag-and-drop (e.g., using a `requestAnimationFrame` loop), track the drag state globally (e.g., setting `isDragged = true` on `dragstart` and `false` on `dragend`) to prevent the animation loop from overwriting the element's position while it is being dragged.
- Navigation rule: Use `.tabs` and `.tab-btn` (top navigation) for mode switching in all webapps, explicitly avoiding `.nav-bar` or bottom tab bars.
- To maintain consistent layout spacing across webapps, avoid applying hardcoded `margin-top` to main `.container` elements; rely on the default page/body padding instead.
- The standard CSS variable for borders on cards, grid elements, and UI containers across the project is `--card-border`, not `--border-color`.
- To support 'swipe-to-paint' in grid drawing webapps (like `pixels_binaires.html`, `pixel_studio_rvb.html`, and `binaire_studio.html`), implement a continuous drawing mechanic tracking an `isDrawing` boolean, applying colors on `mouseenter`, and handling touch drag via `touchmove` and `touchstart` with `e.preventDefault()` to prevent page scrolling. Completely omit/remove `js/swipe.js` in these applications to disable tab-swiping and prevent UX conflicts.
- When introducing new Lucide icons to the project, their SVG definitions must be manually extracted (e.g., via `curl -s https://unpkg.com/lucide-static@0.300.0/icons/<icon-name>.svg`) and appended to the `icons` object within the custom `js/lucide-subset.js` file.
- In `simulateur_bluebot.html`, dynamically updating the active skin must be done via in-place DOM class updates on all existing grids (`#sim-grid`, `#chal-grid`, `#read-grid`, `#draw-grid`) and updating inner elements (like `.bot-cell.obstacle`), rather than calling `buildGrid()` which destructively resets the visual game state and clears trails.
- For standard responsive navigation, use the top `.tabs` and `.tab-btn` HTML structure across all platforms (both desktop and mobile). Bottom tab bars are explicitly deprecated to avoid overlapping issues on mobile OS gesture areas.
- When implementing mobile touch-based drag-and-drop (to bypass HTML5 limitations), do not call `e.preventDefault()` in `touchstart` as it blocks native click events. Instead, track coordinates, create a `position: fixed` clone with `pointer-events: none` during `touchmove` (where `e.preventDefault()` is used to stop scrolling), and detect the drop zone using `document.elementFromPoint` in `touchend` only if movement occurred.
- Modals should be styled as side-panels, NOT sliding bottom sheets.
- The standard CSS variable for error or danger states (e.g., red text or backgrounds) across the project is `--error`, not `--danger`.
- When dynamically updating container elements that house embedded UI controls (e.g., `#sim-program` in `simulateur_bluebot.html`), ensure the control elements (like `#hideCmdToggleBtn`) are preserved and re-appended as normal flex items rather than overwritten by `innerHTML`. Furthermore, use specific class selectors like `querySelectorAll('.program-cmd')` instead of index-based `children` to iterate over dynamic items, preventing accidental targeting of the preserved UI controls.
- In `simulateur_bluebot.html`, adaptive difficulty transitions are triggered by a global `c2_change_difficulty` event emitted by `ScoreManager`. All modes supporting this (e.g., 'read', 'chal', 'draw') must explicitly route the event to their specific difficulty UI buttons (`.click()`) within this event listener.
- In `simulateur_bluebot.html`'s 'décodage' (Lecture/read-grid) mode, the target destination (`#read-target`) must remain hidden for the challenge. Global UI update functions (like `selectSkin`) must be configured to never render the target for `read-grid` to avoid accidentally revealing the solution.
- In `jeu_de_la_grue.html`, visually highlight the crane's position during execution (`isExecuting`) by applying an `.active-column` class to the current `.cup` and an `.active-slot` class to the specific `.cup-slot` based on `craneState.height`.
- To prevent horizontal overflow on small mobile screens, CSS grid column definitions for cards should utilize `minmax(min(100%, <min-width>), 1fr)` (e.g., `minmax(min(100%, 320px), 1fr)`), allowing cards to shrink below their minimum width when the container is narrower.
- In `simulateur_bluebot.html`, when preventing UI interactions during robot movement, ensure you check the animation state for all relevant modes (e.g., `simState.running`, `chalState.isAnimating`, `readState.isAnimating`, `drawState.isAnimating`) instead of relying solely on `simState.running`.
- In `simulateur_bluebot.html`, features that hide entered commands (for 'blind coding' challenges) mask the command display panel by toggling a `.masked` class on `#sim-program` (obscuring contents with generic '?' boxes) rather than collapsing the element via `display: none`. The toggle control (`#hideCmdToggleBtn`) is prominently visible in the main UI.
- When implementing responsive fixed-layout tables (`table-layout: fixed`) with dynamically hidden columns, use `display: none !important;` on the hidden class so the browser entirely ignores them during width distribution calculations. Apply `white-space: nowrap;` and a responsive width (e.g., via `clamp()`) to row headers (`<th>`) to prevent text from wrapping and overlapping data cells.
- The standard border-radius UI tokens are: `var(--radius-sm)` (6px) for `.btn-small`, `var(--radius-md)` (8px) for primary `.btn`, `var(--radius-lg)` (12px) for `.tab-btn` and dropdowns, and `var(--radius-2xl)` (20px) for main `.container` panels.
- CSS classes defined in `shared.css` (e.g., `.btn`, `.tab-btn`, `.tabs`, `.btn-small`, `.game-instruction`) must be strictly centralized and never redefined locally in the `<style>` blocks of individual webapps.
- To maintain UX consistency across webapps, use `simulateur_bluebot.html` as the reference for UI element sizing: primary navigation buttons (`.tab-btn`) should use `border-radius: 12px` and avoid fixed small font sizes to inherit larger base fonts; action buttons (`.btn`) should use `border-radius: 8px` and `font-weight: 700`; instruction text (`.game-instruction`) should be highly readable (e.g., `font-size: 1.1em; font-weight: 600; color: var(--text-main);`).
- To prevent clipping the rounded corners (`border-radius`) of the responsive mobile tab bar, do not apply `overflow: hidden` to the `.container` class or elements wrapping `.tabs`.
- The project strictly uses a vanilla web stack (HTML, CSS, JS) without frameworks like React or Tailwind to ensure 100% offline compatibility and maintainability of standalone applications.
- Long game instructional text across webapps should be hidden by default using a collapsible `<details class="instructions">` element. Short, single-sentence instructions should use the `.game-instruction` class (defined in `shared.css`) and remain visually prominent.
- For toast notifications in webapps, the `js/toast.js` unified utility handles the display logic with the signature `showToast(msg, type = 'success', duration = 3000)`. It supports types like 'success' (or true), 'error' (or false), 'warn', and 'info'. The container `#c2-toast-container` is auto-created if absent, meaning hardcoded `<div id="toast"></div>` elements and local CSS definitions in individual webapps are no longer needed.
