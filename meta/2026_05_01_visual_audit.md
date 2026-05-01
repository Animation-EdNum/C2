# 🔍 Visual Audit — Suite C2
**Date:** 2026-05-01 | **Scope:** `webapps/`, `alpha/webapps/`, `ressources/`

---

## 1 — Button Border-Radius Audit

### Current state (chaos)

Border-radius values are scattered with **no shared token** — every webapp defines its own numbers inline.

| Value | Where it appears | Role |
|---|---|---|
| `50%` | `.icon-action-btn`, `.btn-close-modal`, `.program-cmd`, `.mini-cmd`, `.legend-dot` | Circular icon buttons |
| `30px` | `#toast` (bluebot, bit_de_parite) | Pill toast |
| `20px` | `.container`, `.modal-content`, `.challenge-option` (some), `.result-stage` (tirage) | Panel / card containers |
| `16px` | `.exercise-card` (bit_de_parite), `.stat-chart-wrapper` | Sub-cards |
| `14px` | `.settings-dropdown-content`, `.challenge-option` (bluebot) | Dropdowns, medium cards |
| `12px` | `.tab-btn`, `.skin-list-item`, `.skin-card`, `.tab-btn`, `.gallery` | Tab buttons, list items |
| `10px` | Inline banner in bluebot (`border-radius: 10px`) | Warning banners |
| `8px` | `.btn` (all apps), `.legend`, `.end-item`, `.menu-item-btn` | Primary action buttons |
| `6px` | `.btn-small`, `.gallery-item`, `.skin-item-mini` | Small buttons |
| `5px` | `.tab-btn` in `routage_reseau`, `bit_de_parite` | **⚠️ Divergence** — same component, different radius |
| `4px` | `.legend-box`, `.skin-item-mini` | Micro indicators |

### Problems flagged

> [!WARNING]
> **`.tab-btn`** is the worst offender. It uses `12px` in `binaire_studio` and `bit_de_parite`, but `5px` in `routage_reseau`. Same component, 3 different values across the suite.

> [!WARNING]
> **`.btn`** is universally `8px` in every webapp — but `binaire_message` doesn't define it at all (falls back to browser default `0`). This causes square-looking buttons there.

> [!NOTE]
> **`.btn-small`** uses `6px` in bluebot but inherits `8px` from `.btn` in other apps — visually inconsistent on small screens.

### Proposed token system

Add to `:root` in `shared.css`:

```css
:root {
    /* Border-radius scale */
    --radius-xs:  4px;   /* Micro: legend dots, miniature chips */
    --radius-sm:  6px;   /* Small: .btn-small, editor size btns */
    --radius-md:  8px;   /* Default: .btn, .menu-item-btn */
    --radius-lg:  12px;  /* Medium: .tab-btn, .skin-list-item, dropdowns */
    --radius-xl:  16px;  /* Large: .exercise-card, stat wrappers */
    --radius-2xl: 20px;  /* Panel: .container, .modal-content */
    --radius-pill: 30px; /* Pill: toasts, .diff-btn */
    --radius-full: 50%;  /* Circle: icon buttons */
}
```

### Required fixes per file

| File | Element | Current | Target |
|---|---|---|---|
| `routage_reseau.html` | `.tab-btn` | `5px` | `var(--radius-lg)` = 12px |
| `binaire_message.html` | `.btn` | (missing) | `var(--radius-md)` = 8px |
| `bit_de_parite.html` | `.tab-btn` | `12px` ✅ | Add `var(--radius-lg)` token |
| `simulateur_bluebot.html` | `.btn-small` | `6px` | `var(--radius-sm)` = 6px ✅ |
| `binaire_studio.html` | `.gallery-item` | `6px` | `var(--radius-sm)` ✅ |
| `shared.css` | `.settings-dropdown-content` | `14px` | `var(--radius-lg)` = 12px (±2px, acceptable) |

---

## 2 — Toast Notification Audit

### Current state: 5 different implementations

| File | Container | Signature | Position | Duration | Success/Error |
|---|---|---|---|---|---|
| `simulateur_bluebot.html` | `#toast` (singleton) | `showToast(msg, isSuccess=true)` | **Center screen** (top:50%, left:50%) | 5000ms | ✅ `#10b981` / ❌ `#ef4444` via `style.background` |
| `bit_de_parite.html` | `#toast` (singleton) | `showToast(msg, isSuccess=true)` | **Bottom center** (bottom:20px) | 3000ms | ✅ / ❌ via `style.background` |
| `binaire_studio.html` | `#toast` (singleton) | `showToast(msg)` — **no isSuccess param** | **Bottom center** | 3000ms | Static `var(--card-bg)` background — **no color feedback** |
| `binaire_message.html` | `#toast` (singleton) | `showToast(msg)` — **no isSuccess param** | **Bottom center** | 3000ms | Static `#333` — **no color feedback** |
| `tirage.html` / `bareme.html` | `#toast-container` (dynamic stack) | `showToast(msg, icon='info')` | Bottom center | 3000ms | Uses glassmorphism + Lucide icon |

> [!CAUTION]
> `binaire_studio` sets `background: var(--card-bg)` on the toast — which is nearly white in light mode, making the white text **invisible**.

> [!WARNING]
> `bluebot` is the only app that places the toast in the **center of the screen** — it was intentional (mid-game feedback) but breaks the pattern. It also has the longest duration (5000ms vs 3000ms everywhere else).

> [!NOTE]
> `tirage.html` has the **most advanced implementation**: a stacking container, Lucide icons, and glassmorphism — this should be the reference model.

### Divergences summary

| Concern | Impact |
|---|---|
| 2 apps have no `isSuccess` param — no color feedback | UX — errors look identical to successes |
| `binaire_studio` toast is invisible in light mode | Accessibility / visual bug |
| 5 different durations/positions | Inconsistent UX feel |
| No shared CSS — 5 × duplicated `#toast` blocks | Maintenance debt |

### Recommended unified spec

Move to `shared.css` and add a `js/toast.js` utility:

```css
/* shared.css — unified toast */
#toast-container {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10001;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
    align-items: center;
}

.c2-toast {
    padding: 10px 20px;
    border-radius: var(--radius-pill, 30px);
    font-weight: 600;
    font-size: 0.9rem;
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: toastIn 0.3s var(--spring-easing) forwards;
    opacity: 0;
}

.c2-toast.success { background: #10b981; }
.c2-toast.error   { background: #ef4444; }
.c2-toast.info    { background: #6366f1; }

@keyframes toastIn {
    from { opacity: 0; transform: translateY(12px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

```js
// js/toast.js — drop-in replacement for all showToast() calls
function showToast(msg, isSuccess = true, duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `c2-toast ${isSuccess ? 'success' : 'error'}`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}
```

This approach:
- Keeps backward-compat with all existing `showToast(msg)` and `showToast(msg, true/false)` call signatures
- Supports stacking (multiple toasts at once)
- Removes the 5 duplicated `#toast` CSS blocks
- Fixes the invisible toast in `binaire_studio`

---

## 3 — Interactive Layout Bug Catalogue

### Bug 3.1 — `binaire_studio.html`: Broken `@media` query uses a CSS variable as breakpoint

**Location:** `binaire_studio.html`, line 619

```css
/* BUG — CSS variables cannot be used in media query conditions */
@media (max-width: var(--container-max-width, 1400px)) {
    .grid-cell { width: 28px; height: 28px; }
}
```

`var()` is **invalid inside `@media`** — this entire responsive block is silently ignored by all browsers.

**Fix:**
```css
@media (max-width: 1400px) {
    .grid-cell { width: 28px; height: 28px; }
}
```

---

### Bug 3.2 — `binaire_studio.html`: `@media print` block has malformed indentation / misplaced `body` rule

**Location:** `binaire_studio.html`, lines 646–660

```css
@media print {
    .no-print { display: none; }
/* ⚠️ body rule escapes the @media print block due to missing closing brace: */
body {
    touch-action: manipulation;
    background: var(--card-bg);
    color: black;
}
```

This causes `body { touch-action: manipulation; background: var(--card-bg); }` to apply **globally** (not just on print), overriding the light/dark theme background colors.

**Fix:** Add missing brace before `body`:
```css
@media print {
    .no-print { display: none; }

    body {
        touch-action: manipulation;
        background: var(--card-bg);
        color: black;
    }

    .container {
        box-shadow: none;
        border: 1px solid #ccc;
    }
}
```

---

### Bug 3.3 — `binaire_message.html`: `#toast` is placed before `</body>` but **after** the `<footer>` — not after the scripts

**Location:** `binaire_message.html`, line 872

The `#toast` div is placed after `</footer>` but before `</body>`, which is fine structurally. However, the `showToast()` function references `document.getElementById('toast')` synchronously — if it's ever called before DOMContentLoaded, it would return `null`. Low risk currently but worth noting.

---

### Bug 3.4 — `simulateur_bluebot.html`: Toast `pointer-events: none` missing

**Location:** `simulateur_bluebot.html`, lines 1568–1590

The bluebot toast is positioned at **center-screen** (`top: 50%; left: 50%`). Without `pointer-events: none`, it blocks all clicks in the center of the simulator while it is visible (5 seconds). This is especially disruptive on mobile where the command pad sits in the center.

**Fix:** Already has `pointer-events: none` ✅ — **no action needed**, just confirming this is correct.

---

### Bug 3.5 — `shared.css`: Mobile tab bar `border-radius: 20px 20px 0 0` overridden to `0` on some webapps

**Location:** `shared.css`, line 529

The shared rule gives the fixed bottom tab bar a `border-radius: 20px 20px 0 0`. However, because it uses `!important`, if any webapp wraps tabs inside a container with `overflow: hidden`, the rounded corners clip and disappear. Observed in `binaire_studio` on narrow screens.

**Fix:** Ensure wrapper containers that hold `.tabs` don't have `overflow: hidden`.

---

### Bug 3.6 — `routage_reseau.html`: `.tab-btn` has `border-radius: 5px` vs `12px` everywhere else

**Location:** `routage_reseau.html`, line 223

Purely visual inconsistency — see Section 1 for full context.

---

## Priority Summary

| # | Issue | Severity | Effort |
|---|---|---|---|
| 3.2 | `@media print` missing brace causes global CSS bleed | 🔴 High | Trivial |
| 3.1 | `var()` in `@media` — entire responsive block ignored | 🔴 High | Trivial |
| 2 | `binaire_studio` toast invisible in light mode | 🟠 Medium | Low |
| 2 | No unified `showToast` — 5 diverging implementations | 🟠 Medium | Medium (new `toast.js`) |
| 1 | No `border-radius` token system | 🟡 Low | Medium (token migration) |
| 3.4 | Bluebot toast blocks center clicks | ✅ Already fixed | — |
| 3.5 | Tab bar border-radius clipping | 🟡 Low | Low |
| 1 | `.tab-btn` radius inconsistency | 🟡 Low | Trivial |
| 1 | `binaire_message` `.btn` has no border-radius | 🟡 Low | Trivial |
