# E2E Tests

This directory contains automated end-to-end (E2E) tests for the project using [Playwright](https://playwright.dev/python/).

This testing setup ensures that tests are completely isolated from the pure vanilla HTML/JS core application files, conforming to the "no dependencies" philosophy for the application files.

## Running Tests Locally

1. **Install dependencies:**
   Ensure you have Python installed. Then, run:
   ```bash
   pip install -r e2e_tests/requirements.txt
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
   pytest e2e_tests/
   ```
