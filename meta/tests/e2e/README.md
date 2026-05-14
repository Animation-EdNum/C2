# E2E Tests

This directory contains automated end-to-end (E2E) tests for the project using [Playwright](https://playwright.dev/python/).

This testing setup ensures that tests are completely isolated from the pure vanilla HTML/JS core application files, conforming to the "no dependencies" philosophy for the application files.

## Running Tests Locally

All commands should be run from the **root directory** of the project.

1. **Install dependencies:**
   Ensure you have Python installed. Then, run:
   ```bash
   pip install -r meta/tests/e2e/requirements.txt
   playwright install
   ```

2. **Start a local server:**
   In the root of the project, start a local HTTP server on port 8000:
   ```bash
   python -m http.server 8000
   ```

3. **Run the tests:**
   In another terminal, run:
   ```bash
   python -m pytest meta/tests/e2e/ -v
   ```

## Adding a New Test

Tests are organized by application in `meta/tests/e2e/`. Conventions:
- Name the files `test_<app_name>.py`.
- Use `page.goto("http://localhost:8000/webapps/...")` as the base URL.
- Prefer selectors by ID (`#my-element`) for stability.
