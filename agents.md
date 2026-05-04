# Agents Memory Index
*This is the pointer index. Do not write full context here. Use this to find the correct domain file.*

| Domain | File Path | Description |
| :--- | :--- | :--- |
| **Context** | `meta/memory/project-context.md` | High-level goals, current sprint status, and unresolved constraints. |
| **Decisions** | `meta/memory/decisions.md` | Architectural choices, library selections, and the reasoning behind them. |
| **Patterns** | `meta/memory/code-patterns.md` | Code conventions, reusable hooks, and established project idioms. |
| **User Prefs** | `meta/memory/user-preferences.md` | How the human prefers code delivered, reviewed, and formatted. |
| **Event Log** | `meta/memory/event-log.md` | Append-only ledger of major agent actions and memory updates. |

**Agent Instructions:**
1. Read this index first.
2. Read the file AGENT.md where AGENT is you. (for example : JULES.md for Jules and Antigravity, CLAUDE.md for Claude Code, etc.)
3. Load only the specific `meta/memory/*.md` files relevant to the current task.
4. If a fact changes, update the domain file and log the change in `event-log.md`.
