/**
 * toast.js — Unified toast notification utility for the C2 suite.
 *
 * Drop-in replacement for all individual showToast() implementations.
 * Fully backward-compatible with existing call signatures:
 *   showToast(msg)                  → info-style (neutral dark)
 *   showToast(msg, true)            → success (green)
 *   showToast(msg, false)           → error (red)
 *   showToast(msg, isSuccess, …)    → extra args silently ignored
 *
 * CSS classes used: .c2-toast, .c2-toast.success, .c2-toast.error
 * Container: #c2-toast-container (auto-created if absent)
 */
function showToast(msg, isSuccess = true, _ignored) {
    // Ensure the container exists
    let container = document.getElementById('c2-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'c2-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'c2-toast ' + (isSuccess ? 'success' : 'error');
    toast.textContent = msg;
    container.appendChild(toast);

    // Force reflow so the transition fires
    void toast.offsetWidth;
    toast.classList.add('visible');

    // Duration: 3 s visible, then 0.4 s fade-out transition
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
