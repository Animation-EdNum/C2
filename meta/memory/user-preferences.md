# User Preferences & Testing Guidelines

## 1. Aesthetics & Design
- **Visual Style:** "Glassmorphism" (semi-transparent backgrounds, blur effects) for a premium, modern feel.
- **Micro-Animations:** UI must feel "alive" (hover effects, spring animations, confetti on success, shaking on error).
- **Typography:** Modern sans-serif: **Outfit** (headings), **Inter** (body), **JetBrains Mono** (code). Always use true ellipsis (`…`) for UI text.
- **High Contrast Mode:** Forced via `highContrast=1` URL param (`body.high-contrast`). Removes backgrounds/shadows, enforces black/white contrast and thick borders.
- **Watermarks:** Apply `opacity: 0.5`, `pointer-events: none`, and `user-select: none`.
- **UI Paradigm:** Across the entire suite, UI toggle buttons must follow an action-oriented paradigm: the button's icon and tooltip text must reflect the target action that will occur upon clicking, not the system's current state.

## 2. UI States & Layouts
- **Inactive States:** Gray out locked elements (`opacity: 0.5`, `filter: grayscale(100%)`, `pointer-events: none`) but *preserve their original icon*. Do NOT swap to a generic lock icon.
- **Error Feedback:** For young audiences, use highly clear visual icons (e.g., FontAwesome stacked 'ban' symbol) rather than long text.
- **Mobile Navigation:** For `width <= 600px`, navigation bars (`.tabs`, `.nav-bar`) must be pinned to the bottom. Use `main > .tabs` in CSS for correct positioning.
- **Share Modal:** Dynamically generated via DOM elements. Do NOT hardcode it into individual HTML files.
- **Automate UI Specifics:** Masked command buttons (`.program-strip.masked .program-cmd`) must strictly maintain a neutral gray appearance, superseding the 'colored commands' mode. Share options strictly specific to this application append an explicit asterisk badge. Grid line visibility is toggled by adding/removing `.no-grid-lines` on `.bot-grid` containers. Fixed grid constraints are in `MAT_GRID_CONSTRAINTS`. Tooltips defined by `data-tooltip` are scoped to `.grid-toolbar [data-tooltip]`.
- **Automate Descriptions:** Mat descriptions should be concise, factual, and written in simple language easily understandable by an 8-year-old child.
- **Portal Navigation & Search UI :** The search bar must remain hidden by default and reveal smoothly upon clicking the header magnifying glass button (`#search-toggle-btn`) or clicking a card tag. To avoid confusion with Mode TBI (`chalkboard-user`), there is no toggle button in the header. Access to "Espace Enseignant·e·s" is provided via a discreet footer link (`#link-teachers`), and returning to "Espace Élèves" is done via a single `graduation-cap` button in the header when in teacher view.
- **External Resources Display:** Student external resources and utilities must use compact cards (`.card-compact`), omitting descriptions, hashtags, and manual references to keep the interface focused and readable for students.

## 3. Developer & Execution Workflows
- **Code:** Always use curly braces `{}` for control structures (if, else), even for single-line statements.
- **Communication:** Brief, actionable summaries in French using Markdown.
- **Proactivity:** Execute tasks directly without waiting for intermediate validation.
- **Execution Plans & pre-commit:** 
  - Verification steps must use concrete tool calls.
  - Test suites must run immediately before the pre-commit step.
  - Use `grep` or `sed` to print exact target lines before requesting review.
  - The pre-commit step description must exactly match: *'Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.'*
  - Use `grep -n '^#'`, `head`/`tail`, or `sed -n '<start>,<end>p'` to map file structures and extract exact target lines for plan reviews.
- **Workspace Polish & Cleanup:**
  - Ensure temp scripts, `package.json` modifications (restore original), and python test files outside `e2e/` are deleted before final commit.
  - Ensure all temporary scratchpad scripts (like Python patch scripts) are completely deleted. Revert both `package.json` and `package-lock.json` (e.g., via `git restore package.json package-lock.json`) to uphold zero-dependency rules without destroying the lockfile.

## 4. Testing (Unit & E2E)
- **Unit Tests:** `npm run test:unit` (`meta/tests/unit/`).
- **Service Worker Manifest:** `npm run check:sw` (update using `npm run build:sw`).
- **E2E Tests (Playwright):** `python3 -m pytest meta/tests/e2e/`. Requires a local HTTP server (`python3 -m http.server 8000`).
- **Test Setup Requirements:** Ensure the local test environment is strictly initialized using `npm ci` (never a loose `npm install`) to match the CI environment exactly and guarantee the stable installation of `jsdom` required by `npm run test:unit`. For E2E tests, install Python dependencies via `pip install pytest pytest-playwright && python -m playwright install chromium`.
- **JSDOM Techniques:** When testing browser-side JS files via `node:test`, instantiate JSDOM with `runScripts: "dangerously"`, read the source via `fs.readFileSync`, and execute it via `window.eval()`. Override `window.setTimeout = (cb) => { cb(); }` in JSDOM to execute callbacks synchronously for deterministic staggered animations.

## 5. Visual Verification (Playwright)
- **Wait for Assets:** Explicitly wait (e.g., `time.sleep(4)`) for FontAwesome and local fonts to load before screenshotting.
- **Disable Animations:** Inject `* { animation: none !important; transition: none !important; opacity: 1 !important; }` before screenshots.
- **Mobile Viewport:** Set `has_touch=True` and specific dimensions (e.g., 375x812). NEVER use `full_page=True` for mobile or fixed-position elements.
- **Interactions:** Simulate real user interactions (fill fields, click) before capturing documentation screenshots. Scroll elements into view first.
- **Assertions:** Use regex for class assertions: `expect(element).to_have_class(re.compile(r'class_name'))`.
