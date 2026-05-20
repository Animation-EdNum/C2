# JULES.md: Project Constitution
*This file is read at the start of every session. It contains stable, project-level context.*

## 1. System Prompt & Goals
- **Primary Directive:** Maintain and evolve Suite EdNum (web apps for primary school in Switzerland).
- **Core Focus:** Offline-first functionality, high-quality UI/UX (glassmorphism), and pedagogical clarity.
- **Role:** Autonomous coding agent (Antigravity/Jules).

## 2. Technical Stack
- **Languages:** HTML5, Vanilla JavaScript (ES6+), Vanilla CSS.
- **Testing:**
  - Manual browser testing (WCAG AA accessibility).
  - **Automated E2E:** Playwright. *Note: Use `localStorage` manipulation instead of UI clicking for Simulateur Automate to avoid flakiness (see `meta/memory/automate-playwright-tips.md`).*
- **Style Guidelines:** Clean, documented code, consistent glassmorphism design tokens, **no external dependencies**.

## 3. Strict Boundaries
- **Workflows:** Do NOT modify `.github/workflows` without explicit permission.
- **Architecture:** Always read `agents.md` before making architectural assumptions.
- **File Modifications:** Do NOT use `replace_file_content`; only use `write_to_file` for all file modifications.
