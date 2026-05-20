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

## 4. Testing (Unit & E2E)
- **Unit Tests:** `npm run test:unit` (`meta/tests/unit/`).
- **E2E Tests (Playwright):** `python3 -m pytest meta/tests/e2e/`. Requires a local HTTP server (`python3 -m http.server 8000`).

## 5. Visual Verification (Playwright)
- **Wait for Assets:** Explicitly wait (e.g., `time.sleep(4)`) for FontAwesome and local fonts to load before screenshotting.
- **Disable Animations:** Inject `* { animation: none !important; transition: none !important; opacity: 1 !important; }` before screenshots.
- **Mobile Viewport:** Set `has_touch=True` and specific dimensions (e.g., 375x812). NEVER use `full_page=True` for mobile or fixed-position elements.
- **Interactions:** Simulate real user interactions (fill fields, click) before capturing documentation screenshots. Scroll elements into view first.
- **Assertions:** Use regex for class assertions: `expect(element).to_have_class(re.compile(r'class_name'))`.

## 6. Cleanup Rules
- **Workspace:** Ensure temp scripts, `package.json` modifications (restore original), and python test files outside `e2e/` are deleted before final commit.