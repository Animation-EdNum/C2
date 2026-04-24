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
- `header`: A unified `<header class="app-header">`. Action buttons (Scores, Theme, Audio, Settings) are grouped into an 'Options' or 'Menu' hamburger dropdown (`.menu-item-btn`), or placed in an `.action-buttons` container. Avoid placing auxiliary action buttons inside the main application card.
- `main`: The core interactive area (grid, simulator, etc.).
- `nav`: Bottom tab bar for mobile navigation.
- `footer`: All HTML files must use a uniform `<footer class="no-print">` containing exactly: "Webapp conçue par Vivian de l'[AP EdNum](https://www.hepvs.ch/fr/prestations-de-services/animation-pedagogique-12811/) avec ❤️ et quelques neurones artificiels" and a source code link stating "Code 100% libre (AGPL-3.0)".
- `confetti`: Accompanying `<canvas id="confetti-canvas"></canvas>` for the unified confetti engine.

## 4. CSS Patterns
- **Colors & Theming:** Never hardcode color values (e.g., `white`, `#1e293b`) for structural backgrounds or text styling. Always use predefined CSS variables (like `var(--card-bg)`, `var(--text-main)`) from `css/shared.css` to ensure full compatibility with global Dark Mode. Visual styling like blur and spring transitions are managed via `:root` variables.
- **Z-Index & Overlays:** For global UI overlays (like modals), use a sufficiently high `z-index` (e.g., `10000`) to cover elevated components like the confetti canvas (`9999`) and floating elements. Focus rings are implemented globally using `:focus-visible` in `css/shared.css`. Global toasts (`#toast`) must be positioned at the center (`top: 50%`, `left: 50%`, `transform: translate(-50%, -50%)`) and include `pointer-events: none`.
- **Responsive Layouts:** For dynamic grids, flex rows, and button arrays, avoid fixed pixel dimensions. Use `flex-wrap: wrap`, `flex: 1`, `width: 100%`, and `min-width: 0`. For JavaScript, use relative fraction units (e.g., `gridTemplateColumns = 'repeat(size, 1fr)'`).
- **Positioning Fixes:** To prevent internal anchor targets from being obscured by headers, use `:target { scroll-margin-top: 5rem; }`. If `position: fixed` elements get trapped inside a parent container, check for CSS `transform` or `animation` on the parent and override them with `transform: none !important; animation: none !important;`. Apply `touch-action: manipulation` to the document `body` or interactive elements to eliminate the 300ms tap delay.

## 5. JS & State Patterns
- **ScoreManager:** Detailed game statistics are tracked via `js/scores.js` (`ScoreManager`) and persisted in `localStorage` as `c2_stats_${appId}`. Performance percentages must encompass all actions (e.g., `st.totalSuccess + st.mistakes`) in the denominator. Score/stat displays follow a standard `.score-bar` > `.score-item` > `.score-label` & `.score-value` layout.
- **Theme Callbacks:** HTML applications can implement a `window.__onThemeChange(theme)` callback to handle custom updates (like re-rendering canvas elements) when the global theme is modified by `theme.js`.
- **Positive Reinforcement:** Use `playSound('success')` and `launchConfetti()` from `js/confetti.js`.
- **SVG & DOM Injection:** To prevent ID collision issues when dynamically rendering SVG strings multiple times, extract all SVG `<defs>` (like gradients and filters) out of dynamic strings and place them inside a single globally hidden `<svg>` element at the top of the document `<body>`. In simulators, UI injection logic (like `placeOverlay`) should branch to use `innerHTML` for SVG strings and `innerText` for text/emojis.
- **Touch Swipes:** When implementing custom touch swipe gestures, ensure touch event listeners use `{passive: true}` and explicitly measure drag intent (`Math.abs(dx) > Math.abs(dy)`) to avoid interfering with native vertical scrolling.
- **Event Handling:** Prefer delegation or clean initialization inside `DOMContentLoaded`.

- **Mobile Navigation Rule:** Bottom buttons/tabs must only be used to switch exercises within a webapp (`.tabs`, `.nav-bar`, `.tab-bar`), never to select a difficulty level (`.difficulty-bar`).

## 6. Accessibility (A11y) Patterns
- **Keyboard Navigation:** Custom interactive elements (e.g., `<div>` or `<span>` with `onclick`) must include `tabindex="0"` and an `onkeydown` handler that triggers on 'Enter' or 'Space' (`if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.click(); }`).
- **ARIA Semantics:** Custom interactive grids and overlays must implement precise ARIA semantics: `role="grid"`, `role="row"`, `role="gridcell"`, and `role="img"` for absolute overlays. Maintain dynamically updated `aria-label` attributes reflecting exact coordinates, states, and orientations. Icon-only buttons must always include an `aria-label`. Menu dropdown items must be wide, easily clickable, and use explicit text labels paired with icons instead of hidden title tooltips.

