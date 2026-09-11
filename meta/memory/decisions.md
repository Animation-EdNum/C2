# Architectural Decisions & Technical Choices

This document records the architectural choices, library selections, and the rationale behind them.

## 1. Architecture & Portability
- **Strict Vanilla Stack (HTML/JS/CSS):** Zero build tools, zero frameworks (No React, Vue, or Tailwind). Guarantees decades-long longevity, instant page loading, and frictionless offline execution.
- **Synchronous Script Data Loading over `fetch()`:** Static application registries (`registry.js`) and subsets are loaded synchronously via `<script>` tags rather than asynchronous `fetch()` to eliminate CORS blocking when opened directly from the filesystem (`file://`).
- **Zero-CDN Local Asset Centralization:** All fonts, icons, styles, and audio reside strictly in `/assets/`. Third-party CDNs are forbidden to ensure 100% offline availability in isolated school environments.

## 2. PWA & Offline Strategy
- **Stale-While-Revalidate Service Worker (`sw.js`):** Assets load instantaneously from the local cache while the worker checks for updates in the background. Immediate updates notify the user via a lightweight toast (`skipWaiting`).
- **Crawler SW Registration Bypass:** Search engine crawlers and headless bots (`Googlebot`, `bingbot`, `HeadlessChrome`, etc.) are detected via regex in `theme.js` and bypassed from Service Worker registration. This saves significant bandwidth by preventing the pre-caching of ~2 MB of assets per crawl.
- **Deterministic Cache Manifest Hashing:** `meta/scripts/generate-sw-manifest.js` normalizes line endings (CRLF/LF) across all hashed files before generating checksums, preventing cross-platform Git cache mismatches.
- **LocalStorage for Synchronous Persistence:** Chosen over IndexedDB for zero-latency synchronous reading during page boot, simplicity, and low cognitive overhead.

## 3. Design System & CSS Architecture
- **4-Layer CSS Cascade for First Contentful Paint (FCP):** Rather than bundling or minifying CSS into a single monolithic file, stylesheets are split into `tokens.css` → `base.css` → `components.css` → `utilities.css` and loaded in parallel. Application-specific stylesheets (`assets/css/<app>.css`) load last to provide clean, isolated overrides.
- **Glassmorphism Design Language:** Semi-transparent surfaces with backdrop-filter blur and subtle borders provide a modern, tactile feel without heavy graphics or frameworks.
- **Custom FontAwesome 7 Pro Subset:** Instead of loading multi-megabyte icon libraries, an automated generator (`meta/scripts/generate_fa_subset.js`) compiles an exact subset into `assets/js/fa-subset.js`.

## 4. Navigation & Layout Decisions
- **Top-Tabs over Bottom Navigation:** Primary navigation strictly uses top tabs (`.tabs`). Bottom tab bars were deprecated to avoid conflicts with system navigation gestures on iOS and Android tablets.
- **Dedicated Header Back Button (`.header-back-btn`):** Every webapp includes a standardized `[←]` back button in the header (`<a class="header-back-btn">`) providing an unmistakable, one-click return to the portal or teacher space.
- **Sober Headers (Subtitle Deprecation):** Descriptive subtitle tags (`<p class="subtitle">` or secondary header paragraphs) were deprecated and removed across all webapps to keep pupil attention strictly focused on the pedagogical activity.
- **Smart Sticky Header & Parallax Reveal:** The portal header uses sticky positioning with a directional scroll listener: it tucks away on downward scroll (`.header-hidden`) to maximize reading area and reveals immediately on any upward scroll. Includes an on-demand expanding search input to save space on mobile.
- **Dedicated Teacher Space (`#teachers`):** Accessible via a footer link and a subtle ghost button in the portal header. In teacher view, a distinct `graduation-cap` role button appears in the header to return to the student space.
- **Teacher Tools Header Return:** Inside all teacher apps (`webapps/teacher/*`), the header home icon navigates back to `index.html#teachers` rather than the student landing page.

## 5. Gamification & State Management
- **Decoupled Score Management (`scores.js`):** Adaptive difficulty and statistics are centralized in `ScoreManager`. Total attempts are calculated as `totalSuccess + mistakes` with self-healing migration to keep metrics consistent across app restarts.
- **Action-Oriented Button Paradigm:** Toggle buttons display the glyph and tooltip representing the *target action* resulting from a click, rather than the current system state.
- **Universal Application Reset Lifecycle (`window.__onResetApp`):** Standardized `#reset-cache-btn` in `theme.js` clears storage/caches and triggers `window.__onResetApp()` if defined, allowing complex apps to cleanly reset their in-memory models without a full browser reload.

## 6. Security & Vulnerability Remediation (VICE / CodeQL)
- **Safe DOM Construction over `innerHTML` Assignments:** To prevent DOM XSS vulnerabilities and resolve static analysis security alerts (Google VICE / CodeQL), direct assignments to `.innerHTML` are banned. Code must use `textContent`, native DOM methods (`createElement`, `replaceChildren`), or inert `DOMParser.parseFromString(..., 'text/html')`.

## 7. Packaging & Distribution
- **Standalone Static Server CLI (`bin/ednum.js`):** Distributed as `@ednum/suite-ednum`. Implements directory traversal protection (verifying canonical paths against trailing-slash root) and HSTS headers while remaining 100% dependency-free.
