# User Preferences & Testing Guidelines

## 1. Aesthetics & Design
- **Visual Style:** "Glassmorphism" (semi-transparent backgrounds, blur effects) for a premium, modern feel.
- **Micro-Animations:** UI must feel "alive" (hover effects, spring animations, confetti on success, shaking on error).
- **Typography:** Modern sans-serif: **Outfit** (headings), **Inter** (body), **JetBrains Mono** (code). Always use true ellipsis (`…`) for UI text.
- **High Contrast Mode:** Forced via `highContrast=1` URL param (`body.high-contrast`). Removes backgrounds/shadows, enforces black/white contrast and thick borders.
- **Watermarks:** Apply `opacity: 0.5`, `pointer-events: none`, and `user-select: none`.

## 2. UI States & Layouts
- **Inactive States:** Gray out locked elements (`opacity: 0.5`, `filter: grayscale(100%)`, `pointer-events: none`) but *preserve their original icon*. Do NOT swap to a generic lock icon.
- **Error Feedback:** For young audiences, use highly clear visual icons (e.g., FontAwesome stacked 'ban' symbol) rather than long text.
- **Mobile Navigation:** For `width <= 600px`, navigation bars (`.tabs`, `.nav-bar`) must be pinned to the bottom. Use `main > .tabs` in CSS for correct positioning.
- **Share Modal:** Dynamically generated via DOM elements. Do NOT hardcode it into individual HTML files.

## 3. Code Style & Execution
- **Code:** Always use curly braces `{}` for control structures (if, else), even for single-line statements.
- **Communication:** Brief, actionable summaries in French using Markdown.
- **Proactivity:** Execute tasks directly without waiting for intermediate validation.
- **Execution Plans:** 
  - Verification steps must use concrete tool calls.
  - Test suites must run immediately before the pre-commit step.
  - Use `grep` or `sed` to print exact target lines before requesting review.
  - The pre-commit step description must be: *'Complete pre commit steps to ensure proper testing, verification, review, and reflection are done.'*
- **Execution Plans Details:** Pre-commit plan step description must exactly match: 'Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.' Use `grep -n '^#'`, `head`/`tail`, or `sed -n '<start>,<end>p'` to map file structures and extract exact target lines for plan reviews to satisfy Exploration and Groundedness rules.

## 4. Testing (Unit & E2E)
- **Unit Tests:** `npm run test:unit` (`meta/tests/unit/`).
- **E2E Tests (Playwright):** `python3 -m pytest meta/tests/e2e/`. Requires a local HTTP server (`python3 -m http.server 8000`).
- **Test Setup Requirements:** Ensure required test dependencies are installed: `npm install jsdom` for unit tests, and `pip install pytest pytest-playwright && python -m playwright install chromium` for E2E tests.
- **JSDOM Techniques:** When testing browser-side JS files via `node:test`, instantiate JSDOM with `runScripts: "dangerously"`, read the source via `fs.readFileSync`, and execute it via `window.eval()`. Override `window.setTimeout = (cb) => { cb(); }` in JSDOM to execute callbacks synchronously for deterministic staggered animations.

## 5. Visual Verification (Playwright)
- **Wait for Assets:** Explicitly wait (e.g., `time.sleep(4)`) for FontAwesome and local fonts to load before screenshotting.
- **Disable Animations:** Inject `* { animation: none !important; transition: none !important; opacity: 1 !important; }` before screenshots.
- **Mobile Viewport:** Set `has_touch=True` and specific dimensions (e.g., 375x812). NEVER use `full_page=True` for mobile or fixed-position elements.
- **Interactions:** Simulate real user interactions (fill fields, click) before capturing documentation screenshots. Scroll elements into view first.
- **Assertions:** Use regex for class assertions: `expect(element).to_have_class(re.compile(r'class_name'))`.

## 6. Cleanup Rules
- **Workspace:** Ensure temp scripts, `package.json` modifications (restore original), and python test files outside `e2e/` are deleted before final commit.
- **Workspace Polish:** Ensure all temporary scratchpad scripts (like Python patch scripts) are completely deleted. Revert both `package.json` and `package-lock.json` (e.g., via `git restore package.json package-lock.json`) to uphold zero-dependency rules without destroying the lockfile.

## 7. Additional Developer Rules
- **UI Paradigm**: Across the entire suite, UI toggle buttons must follow an action-oriented paradigm: the button's icon and tooltip text must reflect the target action that will occur upon clicking, not the system's current state.
- **Automate UI Specifics**: Masked command buttons (`.program-strip.masked .program-cmd`) must strictly maintain a neutral gray appearance, superseding the 'colored commands' mode. Share options strictly specific to this application append an explicit asterisk badge. Grid line visibility is toggled by adding/removing `.no-grid-lines` on `.bot-grid` containers. To ensure grid lines render above image mats, `.grid-row` must have `position: relative` and `z-index: 1`, and `.bot-cell` borders need increased opacity. Fixed grid constraints are in `MAT_GRID_CONSTRAINTS`. Tooltips defined by `data-tooltip` are scoped to `.grid-toolbar [data-tooltip]`.
- **Automate Descriptions**: Mat descriptions should be concise, factual, and written in simple language easily understandable by an 8-year-old child.
- **Execution Plans**: Avoid vague steps that defer decision-making. Ensure verification steps use concrete tool calls. Include steps to run tests before pre-commit. Use `grep` or `sed` to extract specific lines for plan reviews.
- **Workspace Cleanliness**: Ensure the workspace is fully cleaned up before committing by removing scratchpad scripts and reverting `package.json` and `package-lock.json` (e.g., `git restore package.json package-lock.json`) to uphold the zero-dependency rule without destroying the lockfile. Ensure all temporary scratchpad scripts are completely deleted.
