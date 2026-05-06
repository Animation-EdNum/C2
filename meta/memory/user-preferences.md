# User Preferences & Testing Guidelines

## Aesthetics & Design Philosophy
- **Visual Style:** Strong preference for the "Glassmorphism" design (semi-transparent backgrounds, blur effects), providing a "Premium", modern aesthetic similar to recent operating systems.
- **Micro-Animations:** The interface must feel "alive". Prioritize hover effects, elastic transitions (spring animations), and playful interactive feedback (confetti on success, shaking on error).
- **Typography:** Strict use of modern sans-serif fonts (e.g., **Outfit** for headings, **Inter** for body text).
- **Text Formatting (UI):** Always use the true typographic ellipsis character (`…`) in HTML text intended for users, rather than three consecutive dots (`...`). However, take care to maintain the correct syntax (`...`) for the JavaScript spread operator.

## Code Style & Communication
- **Code:** Always use curly braces `{}` for control structures (if, else), even for single-line statements or nested conditions, to maximize readability. Avoid overly verbose code but include clear comments.
- **Communication with the Agent:**
  - **Conciseness:** Responses should be brief with actionable summaries. Prefer clear Markdown (GitHub style).
  - **Proactive Execution:** The agent is expected to execute commands and modifications directly as soon as the task is clear, without systematically waiting for intermediate validation.

## E2E Testing Guidelines (Playwright & Local)
### Local E2E Test Execution
To run the E2E test suite locally, the following steps must be strictly followed:
1. Install dependencies: `pip install -r meta/e2e_tests/requirements.txt && playwright install`
2. Start a local HTTP server (in the background): `python -m http.server 8000 &`
3. Wait for the server to initialize (e.g., `sleep 5`) to avoid connection race conditions.
4. Run the suite: `pytest meta/e2e_tests/`
5. Cleanly kill the process: `kill $(lsof -t -i :8000) 2>/dev/null || true`

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
- Before the final commit, all temporary Python scripts used for Playwright or tests must be completely deleted from the disk and index (`git rm --cached`).
- If Git commands behave poorly (revision errors), force `git fetch --unshallow` to retrieve the full history.