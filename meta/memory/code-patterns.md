# Code Patterns & Project Idioms

This document records code conventions, reusable hooks, and established project idioms.

## 1. HTML & Page Skeleton
- **AGPL-3.0 License Header:** Every source file (`.html`, `.css`, `.js`) must start with the standardized AGPL-3.0 comment header attributing "Animation-EdNum (HEP-VS)".
- **Semantic Structure:**
  ```html
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>
  <header class="app-header">
      <div class="header-title-wrapper">
          <a href="../index.html" class="header-back-btn" title="Retour à l'accueil" aria-label="Retour à l'accueil"><i data-fa="arrow-left"></i></a>
          <div class="header-icon" aria-hidden="true"><i data-fa="nom-icone"></i></div>
          <div>
              <h1>Nom de l'application <span class="badge-level">7-8H</span></h1>
          </div>
      </div>
      <div class="action-buttons">...</div>
  </header>
  <main id="main-content">...</main>
  <footer class="no-print">...</footer>
  <canvas id="confetti-canvas"></canvas>
  ```
- **Teacher Tools Header Return:** In all teacher webapps (`webapps/teacher/*` and `alpha/webapps/teacher/*`), the header back button must explicitly link back to the teacher portal section:
  ```html
  <a href="../../index.html#teachers" class="header-back-btn" title="Retour à l'espace enseignant·e·s" aria-label="Retour à l'espace enseignant·e·s"><i data-fa="arrow-left"></i></a>
  <div class="header-icon" aria-hidden="true"><i data-fa="nom-icone"></i></div>
  ```
- **Flat Legal Footer:** Attribution footers must sit outside `.app-shell` as a flat, transparent block (`margin-top: 1.5rem; text-align: center; opacity: 0.85;`). Never trap footers inside nested cards.

## 2. CSS & Design System Idioms
- **Cascade Loading Order:** Link stylesheets in parallel in this exact order:
  `tokens.css` → `base.css` → `components.css` → `utilities.css` → `assets/css/<app_name>.css`.
- **Glassmorphism:** Standard card container styles:
  ```css
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg, 12px);
  ```
- **Dark Mode & Form Input Focus:** Declare `color-scheme: dark;` on `body.dark` so browser native controls render darkly. Form inputs (`input`, `textarea`, `select`) must keep dark surfaces on focus:
  ```css
  body.dark input:focus,
  body.dark textarea:focus,
  body.dark select:focus {
      background: #0f172a !important;
      color: var(--text-main, #f8fafc) !important;
  }
  ```
- **Mobile Input Auto-Zoom Prevention:** Form controls on mobile must have `font-size: 16px` (or `1rem`) to prevent iOS Safari from auto-zooming on focus. Minimum touch target size is 44×44px.
- **Custom Tooltips:** Never use native `title` on interactive buttons. Use `data-tooltip="Texte"` with CSS-animated tooltips.
- **TBI Projection Mode:** Classroom whiteboard mode toggles `.tbi-projection` on the root container, hiding configuration panels and enforcing container overflow safeguards (`overflow: hidden` / `overflow-y: auto`) to prevent viewport clipping.
- **Compact Cards for External Links:** Render external links in portals using `.card.card-compact` inside `.grid.grid-compact`, displaying title, badges, and external icon arrow without descriptions or tags.

## 3. JavaScript & State Idioms
- **XSS Prevention & Safe DOM Injection:** Never assign directly to `.innerHTML`. Use:
  - `element.textContent = '...'` for text.
  - `element.replaceChildren()` or `element.textContent = ''` to clear nodes.
  - `document.createElement()` and `element.appendChild()` for DOM trees.
  - `new DOMParser().parseFromString(htmlString, 'text/html')` for static multi-node templates, appending via `while (doc.body.firstChild) { target.appendChild(doc.body.firstChild); }`.
- **Universal App Reset Lifecycle (`window.__onResetApp`):** When an app maintains in-memory state, define:
  ```javascript
  window.__onResetApp = function() {
      // Clear in-memory state, form fields, and re-render UI
  };
  ```
  The central `#reset-cache-btn` in `theme.js` invokes this hook automatically upon user confirmation.
- **ScoreManager Usage (`scores.js`):**
  - Record success: `ScoreManager.addSuccess(modeKey, levelNumber, mistakesCount);`
  - Record mistake: `ScoreManager.addMistake(modeKey, levelNumber);`
  - Always register mode names in `MODE_LABELS` in `scores.js` matching UI tab names.
- **Confetti & Celebrations (`confetti.js`):**
  - Trigger celebration: `window.handleStreakCelebration(currentStreak, isExtreme, score);`
- **Audio Sound Feedback (`audio.js`):**
  - Play sound: `window.playSound('click' | 'success' | 'error' | 'win');`
  - Never redeclare `isMuted` or `playSound` locally in individual webapps.
- **Dynamic FontAwesome Icons:**
  - After inserting `<i data-fa="name"></i>` into the DOM, invoke `window.fa?.createIcons?.(parentElement);`.
- **Event Binding:** Never use inline `onclick="..."` attributes in HTML. Always bind via `addEventListener` or event delegation using `e.target.closest()`.

## 4. Testing & Playwright Idioms
- **IIFE Encapsulation in `page.evaluate()`:** Always wrap Playwright evaluated snippets in IIFEs to prevent polluting the global window scope across test steps:
  ```python
  await page.evaluate("(() => { document.querySelector('#action-btn')?.click(); })()")
  ```
- **Direct `localStorage` State Injection:** For tests with complex animations or modal chains (e.g. Simulateur Automate), inject the target state directly into `localStorage` after `page.goto()` and reload to bypass UI flakiness:
  ```python
  await page.evaluate("(() => { localStorage.setItem('at_active_skin', 'pedago'); })()")
  ```
- **Direct DOM Assertions over Canvas Mocks:** Assert the presence, attributes, and lifecycle of DOM nodes (e.g. `#confetti-canvas`, toast elements, score badges) rather than monkey-patching canvas contexts.
- **JSDOM Unit Tests (`meta/tests/unit/`):** Run via `npm run test:unit`. Instantiate JSDOM with `runScripts: "dangerously"`, eval the target script, and execute timer callbacks synchronously when testing staggered sequences.
