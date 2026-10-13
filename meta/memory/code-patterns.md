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
  - **Standard localized footer template:**
    ```html
    <footer class="no-print">
        <p>
            <span data-i18n="common.footer.app_designed_by">Application conçue par Vivian Epiney de l'</span><a href="https://www.hepvs.ch/fr/prestations-de-services/animation-pedagogique-12811/" target="_blank" rel="noopener noreferrer">AP EdNum, HEP-VS</a> <span data-i18n="common.footer.with">avec</span> <a href="../merci.html" style="text-decoration: none; color: #ef4444;" title="Remerciements" data-i18n-attr="title:common.footer.merci_title"><i data-fa="heart"></i></a> <span data-i18n="common.footer.and_neurons">et quelques neurones artificiels</span>
            <br>
            <span style="font-size: 0.9em; opacity: 0.85;">
                <a href="https://github.com/Animation-EdNum/C2" target="_blank" rel="noopener noreferrer" data-i18n="common.footer.free_code">Code 100% libre</a>
                (<a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer">AGPL-3.0</a>)
                · <a href="../mentions-legales.html" data-i18n="common.footer.legal">Mentions légales</a>
                · <a href="../confidentialite.html" data-i18n="common.footer.privacy">Confidentialité</a>
                · <a href="../cgu.html" data-i18n="common.footer.terms">CGU</a>
                · <a href="../merci.html" data-i18n="common.footer.credits">Remerciements</a>
            </span>
        </p>
    </footer>
    ```
  - **Webapps attribution:** Must feature the full name `Vivian Epiney de l'AP EdNum, HEP-VS` and include links to the 3 regulatory pages (`mentions-legales.html`, `confidentialite.html`, `cgu.html`) with appropriate relative paths (`../`, `../../`, `../../../`).
  - **Portals attribution:** Features `Portail conçu par l'AP EdNum, HEP-VS` with links to the 3 regulatory pages.
  - **Licensing:** Code is licensed under AGPL-3.0; pedagogical and didactic contents under CC BY-SA 4.0; vector icons under Font Awesome Pro.

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
- **Portal Badge Classification (`PROF_BADGES` in `portal.js`):** Thematic, discipline, and pedagogical tool badges (*Évaluation*, *Gestion de classe*, *Animation*, *Outil*, *Exercices*, etc.) must be registered in `PROF_BADGES` to receive `.badge.prof` (high-contrast off-white pill with slate text). School grade levels (e.g. *3-4H*, *7-8H*) default to `.badge` (rose/red pill).
- **Mobile Header Responsiveness:** Enforce two-line layout and hide `.badge-level` on mobile screens (`@media (max-width: 640px) { .badge-level { display: none; } }`) to prevent header overflow and ensure touch actions stay accessible.

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
- **Hot-Loop DOM Query Pre-Caching:** In performance-critical loops (e.g. grid drawing or recurrent difficulty validation), avoid repeated `document.querySelector` or `getElementById` calls. Pre-cache target elements into a `Map` or local dictionary before the loop executes.
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

## 5. Internationalization (i18n) Idioms & Workflow
- **Script Ingestion Order:** In `<head>`, always include `i18n.js` and locale dictionaries before any UI rendering logic:
  ```html
  <script src="assets/js/i18n.js"></script>
  <script src="assets/js/i18n/de.js"></script>
  ```
  *(Adjust path relatively: `../assets/js/...` in `webapps/`, `../../assets/js/...` in `webapps/teacher/`).*
- **Declarative HTML Translation:**
  - `data-i18n="app.key"`: Translates text content while caching original French fallback in `data-i18n-orig`.
  - `data-i18n-attr="title:app.title_key;aria-label:app.aria_key"`: Translates attributes separated by `;`.
  - `data-i18n-html="app.html_key"`: Translates simple safe HTML templates (e.g. bold or emphasis).
- **Programmatic Translations in JavaScript:**
  ```javascript
  const label = I18N.t('scores.streak', 'Série de {count} !', { count: currentStreak });
  ```
  Always provide the source French string as the second argument as a natural fallback.
- **Locale-Aware Date Formatting:**
  ```javascript
  const formatted = I18N.formatDate(new Date(), { day: '2-digit', month: '2-digit', year: 'numeric' });
  ```
  Formats automatically as `dd.MM.yyyy` for both `fr-CH` and `de-CH`.
- **URL Parameter Preservation on Internal Links:** When rendering portal cards or sharing links, append `?lang=de` if `I18N.locale === 'de'` so student and shared links stay in German without requiring manual toggling.
- **Strict Swiss Standard German (de-CH) Rules:**
  - Never use the German letter Eszett (`ß`) anywhere (enforced by automated unit test in `test_i18n.js`).
  - Always use typographical ellipsis (`…`), never three dots (`...`).
