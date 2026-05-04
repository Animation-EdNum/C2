# User Preferences

## Design & UI
- **Aesthetic First:** Highly values "premium" and "modern" designs. Specifically fond of Glassmorphism and rich HSL color palettes.
- **Micro-Animations:** Prefers interfaces that feel "alive" with hover effects, transitions, and interactive feedback (e.g., success confettis, error shakes).
- **Typography:** Strong preference for modern sans-serif fonts like **Outfit** for headers and **Inter** for body text.

## Technical Implementation
- **Vanilla over Frameworks:** Strong preference for pure HTML/CSS/JS to ensure offline reliability and zero build-step overhead.
- **Offline-First:** All solutions must work without an internet connection. No external CDNs (scripts, styles, or icons).
- **Accessibility:** High standard for WCAG AA compliance and semantic HTML.
- **Conciseness:** Prefers code that is clean, well-commented, but not overly verbose.

## Communication
- **Concise Responses:** Values brief, actionable summaries.
- **Proactive Execution:** Expects the agent to run commands and make changes directly when the task is clear.
- **Markdown Formatting:** Prefers clear GitHub-style markdown.

## Code Style & Formatting
- **Control Structures:** Always use curly braces `{}` for control structures (like `if` and `else`), even for single-line statements or nested conditions, to ensure readability.
- **Typography:** Prefer using the proper typographic ellipsis character (`…`) instead of three consecutive periods (`...`) for user-facing HTML text, taking care to preserve JavaScript spread syntax.

## UI/UX Requirements
- **Touch Targets:** Ensure buttons and interactive elements maintain a minimum hit area of 44x44px for touch accessibility.
- **Assets:** Use local assets exclusively. Do not rely on external CDNs for fonts or icons.
- **Mobile Navigation:** Primary navigation tabs should be presented as top `.tabs` elements. Modals should be styled as side-panels.
- **Frontend Verification:** User-visible modifications to the frontend UI must be visually verified by calling `frontend_verification_instructions`, capturing a local Playwright screenshot, and passing the image path to `frontend_verification_complete`.

## Verification & Environment Guidelines
- **Playwright Testing:**
  - When verifying exact DOM element dimensions or coordinates (e.g., via `.bounding_box()`) on elements with CSS transitions, explicitly wait for the transition duration to complete before measuring.
  - When verifying specific UI elements located off-screen, explicitly scroll the element into view (e.g., `element.scroll_into_view_if_needed()`) before capturing screenshots.
  - Avoid using `full_page=True` for screenshots of dynamically positioned `position: fixed` elements, as it expands the captured viewport to the total scroll height, visually misplacing elements anchored to the bottom.
  - Bypass randomness in gamification elements by directly injecting state into `localStorage` via `page.evaluate()`.
  - When visually verifying local HTML files without a running dev server, construct an absolute file URI using `os.path.abspath()` (e.g., `filepath = os.path.abspath('path/to/file.html'); page.goto(f'file://{filepath}')`).
  - To test mobile touch gestures like swipes, configure the browser context with mobile emulation by passing `has_touch=True` and a mobile viewport (e.g., `viewport={'width': 375, 'height': 812}`).
  - When verifying XSS mitigations, inject malicious payloads (e.g., `<img src=x onerror=window.xssTriggered=true>`) directly into state variables via `page.evaluate()`, trigger a re-render, and assert the payload is safely displayed.
  - Lucide icons (`<i data-lucide="...">`) are dynamically replaced by SVG elements. To wait for them to render, use the selector `svg.lucide-{icon_name}` rather than the initial `<i>` tag.
  - When verifying if an element has a specific class within a list of classes, use `expect(element).to_have_class(re.compile(r'class_name'))` rather than a lambda function.
- **Bash & Git Constraints:**
  - If git operations like `git revert` or `git diff` on older commits fail with bad revision errors, run `git fetch --unshallow` to retrieve the full history before proceeding.
  - Tool outputs for commands like `cat` or `grep` are typically truncated. To read exact structures in large files, use Python scripts to slice and print specifically bounded sections.
  - Ensure that any temporary helper scripts created during development are completely removed from the filesystem and unstaged before creating a final commit.

- **Frontend Verification Details:** When verifying frontend changes visually using the `frontend_verification_instructions` tool, first start the local development server, then write a temporary Playwright Python script (e.g., in `/home/jules/verification/`) to navigate to the page, wait for the required selectors, take a screenshot, and pass the screenshot's file path to the `frontend_verification_complete` tool.
- **Playwright Screenshot Context:** When generating Playwright screenshots of webapps for documentation or previews, simulate user interactions (like filling inputs or clicking buttons) to capture the tool in an 'in use' state rather than just its empty initial state.
- **Playwright Resizing Restrictions:** When generating full-page Playwright screenshots, first initialize a small viewport height to allow content to overflow, measure the true content height (via scrollHeight), and dynamically resize to match. However, for realistic mobile device screenshots, do NOT dynamically resize or use `full_page=True`; capture only a standard fixed viewport (e.g., 375x812) to avoid unrealistically long images.
- **Playwright Automated Screenshots:** When generating automated visual screenshots of the web applications (e.g., using Playwright), inject CSS to disable animations, transitions, and force opacity to 1 (`* { animation: none !important; transition: none !important; opacity: 1 !important; }`) to prevent partial rendering or faded 'luminosité' effects from entrance animations. Hide footers if the user requests capturing just the 'full card'.
