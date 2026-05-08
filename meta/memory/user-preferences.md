# User Preferences & Testing Guidelines

## Aesthetics & Design Philosophy
- **Visual Style:** Strong preference for the "Glassmorphism" design (semi-transparent backgrounds, blur effects), providing a "Premium", modern aesthetic similar to recent operating systems.
- **High Contrast Mode:** High Contrast mode is accessible exclusively via the `highContrast=1` URL parameter and is applied via the `body.high-contrast` class. High Contrast mode focuses strictly on accessibility: enforcing a highly accessible system font stack, removing subtle background colors, inline styles, box-shadows, and ensuring pure black/white element contrast with thick, clear borders. When forcing white or black backgrounds in this mode, ensure nested elements have explicit color overrides to guarantee legibility against the background.
- **UI States & Pedagogy:** For young target audiences who cannot read well, UI feedback (such as error messages) should be extremely concise and utilize highly clear, descriptive visual icons, such as FontAwesome stacked icons (e.g., a 'ban' symbol superimposed over the relevant action). When a UI element (like a mode tab or tool button) is locked or temporarily unavailable, preserve its original contextual icon rather than swapping it for a generic lock icon. Visually indicate its inactive state by completely graying it out and disabling interactions (e.g., using `opacity: 0.5`, `filter: grayscale(100%)`, and `pointer-events: none`).
- **Share Modal Generation:** The Share Modal interface is dynamically generated, context-aware (only showing options for features present in the app's DOM), optionally supports QR code generation via `assets/js/vendor/qrious.min.js`, and should not be hardcoded into individual webapp HTML files.
- **Mobile Navigation Layout:** For mobile views (`width <= 600px`), tab navigation bars (`.tabs`, `.nav-bar`, `.tab-bar`) must be pinned to the bottom of the viewport. Since these navigation elements typically reside inside a `<main>` container, global CSS rules targeting them must explicitly include selectors like `main > .tabs` to ensure proper layout positioning.
- **Watermark Text:** When creating non-interactive, visual watermark text (filigrane) in the UI, apply CSS properties like `opacity: 0.5`, `pointer-events: none`, and `user-select: none` to prevent interference with interactive elements.
- **Micro-Animations:** The interface must feel "alive". Prioritize hover effects, elastic transitions (spring animations), and playful interactive feedback (confetti on success, shaking on error).
- **Typography:** Strict use of modern sans-serif fonts (e.g., **Outfit** for headings, **Inter** for body text). The custom font 'JetBrains Mono' is loaded via `@font-face` in `assets/css/shared.css` and is available for use throughout the project.
- **Text Formatting (UI):** Always use the true typographic ellipsis character (`…`) in HTML text intended for users, rather than three consecutive dots (`...`). However, take care to maintain the correct syntax (`...`) for the JavaScript spread operator.

## Code Style & Communication
- **Code:** Always use curly braces `{}` for control structures (if, else), even for single-line statements or nested conditions, to maximize readability. Avoid overly verbose code but include clear comments.
- **Communication with the Agent:**
  - **Conciseness:** Responses should be brief, actionable summaries in French using GitHub-style Markdown.
  - **Proactive Execution:** The user prefers proactive execution of tasks without waiting for intermediate validation. The agent is expected to execute commands and modifications directly.
  - **Execution Plans:** When creating an execution plan, ensure verification steps use concrete tool calls (e.g., `read_file` or `run_in_bash_session`) rather than vague summaries. Always include a distinct step to run all relevant tests (such as the E2E suite) immediately before the pre-commit step. To satisfy the 'Exploration' and 'Groundedness' rules during plan reviews, ensure the specific code blocks you intend to modify are explicitly visible in the trace. Since `read_file` outputs may be truncated in the trace (e.g., to 1000 characters), use `grep` or `sed -n '<start>,<end>p' <filepath>` to print the exact target lines into the trace before requesting a review.
  - **Pre-commit Phrasing:** When creating an execution plan, the description for the pre-commit step must exactly match the required phrasing: 'Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.'

## E2E Testing Guidelines (Playwright & Local)
### Local E2E Test Execution
To run the E2E test suite locally, the following steps must be strictly followed:
1. Ensure dependencies are installed (e.g., via `python3 -m pip install playwright pytest-playwright -r meta/e2e_tests/requirements.txt` and `playwright install`). If running the E2E test suite fails due to missing modules like `pytest` or `playwright`, you can successfully install them in the sandbox via `pip install playwright pytest-playwright` followed by `python -m playwright install`.
2. If the E2E test suite throws a "fixture 'page' not found" error when run with `pytest` and custom `PYTHONPATH` manipulation, it means the `pytest-playwright` plugin failed to load. To resolve this, run the tests by invoking the module directly (e.g., `python3 -m pytest`) without altering the `PYTHONPATH`.
3. Start a local HTTP server with output redirection to prevent broken pipe crashes: `python3 -m http.server 8000 > server.log 2>&1 &`
4. Wait for the server to initialize (e.g., `sleep 5`) to avoid connection race conditions.
5. Run the suite: `python3 -m pytest meta/e2e_tests/`
6. Cleanly kill the process: `kill $(lsof -t -i :8000) 2>/dev/null || true`

Note: The development sandbox environment is network-restricted (offline). Commands that require external resource fetching will fail unless pre-installed. If the automated E2E test suite (`pytest`) cannot be run due to environment constraints, use a standalone Playwright script to capture screenshots for visual verification of frontend changes.

### Frontend Visual Verification (Screenshots)
Any modification affecting the user-facing UI MUST be visually verified via the integrated Playwright tools (`frontend_verification_instructions` and `frontend_verification_complete`).
- **Prerequisites:** The local dev server must be running before starting a Playwright script. Build URIs using `os.path.abspath('path/to/file.html'); page.goto(f'file://{filepath}')` if a server is not used.
- **Implicit Waits:** After navigating, explicitly **wait** (e.g., `time.sleep(4)` or network idle) to allow client assets (FontAwesome icons, shared CSS styles, local fonts) and entrance animations to fully load.
- **Render Animations:** When generating automated screenshots with Playwright, inject this CSS to force a complete display without transitions: `* { animation: none !important; transition: none !important; opacity: 1 !important; }`.
- **Viewport Settings:**
  - **Mobile:** To simulate mobile and test touch interactions (e.g., swipes), set `has_touch=True` and a fixed viewport (e.g., `viewport={'width': 375, 'height': 812}`). NEVER use `full_page=True` for mobile screenshots, as it generates unrealistically long images.
  - **Fixed Elements:** Avoid `full_page=True` if elements use `position: fixed`, as it misplaces them at the bottom of the extended page.
  - **Global Screenshots:** Use `device_scale_factor=1` (light mode) to prevent overly large image files.
- **Advanced Playwright Interactions:**
  - **Dimensions:** Before checking the bounding box of an element (e.g., via `.bounding_box()`) undergoing a CSS transition, always wait for the transition to end.
  - **Visibility:** Always scroll the element into view (`element.scroll_into_view_if_needed()`) before taking a screenshot.
  - **Games & Randomization:** To test gamification systems without randomness, directly inject the desired states via `localStorage` using `page.evaluate()`.
  - **Class Assertions:** Use regular expressions to verify specific classes within long lists: `expect(element).to_have_class(re.compile(r'class_name'))`.
  - **Security Verification (XSS):** To verify that XSS protections work, manually inject the malicious payload into the state variables (via `page.evaluate()`), trigger a render, and certify that the payload is displayed without executing.
  - **"In Use" State:** When creating screenshots for documentation, Playwright must simulate a real user interaction (filling a field, clicking) rather than capturing the fully empty application.

## Cleanup & Git
- Ensure temporary testing artifacts and workspace files (e.g., ad-hoc Playwright scripts like `verify.py`, visual verification screenshots, `plan.md`, or log files like `server.log`) created during development or pre-commit steps are physically deleted and removed from Git staging before final submission.
- Before the final commit, all temporary Python scripts used for Playwright or tests must be completely deleted from the disk and index (`git rm --cached`).
- If Git commands behave poorly (revision errors), force `git fetch --unshallow` to retrieve the full history.