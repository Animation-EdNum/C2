# Architectural Decisions

- **[2026-04-22] Adopted 3-Layer Memory Architecture:** Based on the Jules/Claude-Code architecture to persist state and optimize token usage via constitutional context.
- **[2026-04-15] Strict Vanilla Stack:** Decided against React/Tailwind to maintain 100% offline compatibility and ensure the "standalone" versions (single HTML files) remain maintainable without build steps.
- **[2026-04-10] Glassmorphism Design System:** Selected a glassmorphism aesthetic (semi-transparent backgrounds, backdrop-filters, subtle gradients) to provide a "premium/OS-like" feel that appeals to students.
- **[2026-04-22] Mobile-First Navigation:** Standardized on a Bottom Tab Bar for mobile devices to solve reachability issues, moving away from desktop-centric top headers.
- **[2026-04-18] LocalStorage for Persistence:** Use `localStorage` for all state persistence (theme, student lists, streaks) to avoid the complexity of local databases while maintaining offline functionality.
- **[2026-04-12] Font Self-Hosting:** All fonts (Outfit, Inter) must be stored in the `/fonts` directory to ensure consistent rendering without internet access.

