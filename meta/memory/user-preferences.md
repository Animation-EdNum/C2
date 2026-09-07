# User Preferences & Workflow Guidelines

This document defines how the human user prefers code delivered, reviewed, and formatted.

## 1. Communication & Mindset
- **Language & Tone:** Concise, actionable summaries in French using GitHub-flavored Markdown. Avoid verbose meta-commentary or re-stating obvious code diffs.
- **Proactivity:** Execute straightforward, approved tasks directly without pausing for trivial permissions.
- **Documentation Integrity:** Always preserve existing comments, pedagogical rationale, and AGPL-3.0 attribution headers.

## 2. Code Formatting & Syntax
- **Strict Control Flow Braces:** Always use curly braces `{}` for all control flow blocks (`if`, `else`, `for`, `while`), even for single-line statements.
  ```javascript
  // Correct
  if (!modal) {
      return;
  }
  // Incorrect
  if (!modal) return;
  ```
- **Surgical Edits:** Favor targeted, minimal replacements (`replace_file_content`) over rewriting entire files.
- **Typography in UI:** Always use true typographical ellipsis (`…`) in user-facing texts, never three periods (`...`).

## 3. Workspace Cleanliness & Zero Pollution
- **No Temporary Files:** Never commit temporary scratch scripts, test dumps, or python automation helpers to the workspace. Clean up temporary files immediately after use.
- **Dependency Discipline:** Never commit temporary dependencies or modified dependency trees in `package.json` / `package-lock.json`. Restore them with `git restore package.json package-lock.json`.
- **No Debug Artifacts:** Ensure no stray `console.log` or debugging breakpoints are left in production code.

## 4. Verification & Pre-Commit Workflow
- **Verification First:** Always run automated unit tests (`npm run test:unit`) and verify Service Worker cache synchronization (`npm run check:sw` or `npm run build:sw`) after modifying runtime assets.
- **Mandatory Pre-Commit Step:** In implementation plans, the pre-commit review step description must match this exact phrasing:
  *'Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.'*

## 5. Pedagogical & Visual Taste
- **Target Audience:** Swiss primary and secondary school pupils (Cycles 1-3, 4-15 years old) and their teachers. Keep interfaces distraction-free, visually engaging, and accessible.
- **Action-Oriented Buttons:** Button icons and tooltips must convey the *action* that will take place upon clicking, rather than the current state of the system.
- **Aesthetic Excellence:** Glassmorphism, smooth micro-animations, curated color palettes, and full WCAG AA contrast in both light and dark modes.
