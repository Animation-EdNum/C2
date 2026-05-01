/**
 * toast.js — Unified toast notification utility for the C2 suite.
 *
 * Drop-in replacement for all individual showToast() implementations.
 * Supports:
 *   showToast(msg)                        → info-style (neutral dark)
 *   showToast(msg, true)                  → success (green)
 *   showToast(msg, false)                 → error (red)
 *   showToast(msg, 'warn')                → warning (orange)
 *   showToast(msg, 'info', 5000)          → info with custom duration
 *
 * CSS classes used: .c2-toast, .c2-toast.success, .c2-toast.error, .c2-toast.warn, .c2-toast.info
 * Container: #c2-toast-container (auto-created if absent)
 */
function showToast(msg, type = 'success', duration = 3000) {
    // Ensure the container exists
    let container = document.getElementById('c2-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'c2-toast-container';
        document.body.appendChild(container);
    }

    // Map legacy boolean isSuccess to types
    let toastType = type;
    if (type === true) toastType = 'success';
    if (type === false) toastType = 'error';

    const toast = document.createElement('div');
    toast.className = `c2-toast ${toastType}`;
    
    // Determine icon
    let iconName = '';
    switch(toastType) {
        case 'success': iconName = 'check-circle'; break;
        case 'error':   iconName = 'alert-circle'; break;
        case 'warn':    iconName = 'alert-triangle'; break;
        case 'info':    iconName = 'info'; break;
        default:        iconName = toastType; // Use type as icon name if custom
    }

    if (window.lucide && iconName) {
        const iconWrapper = document.createElement('i');
        iconWrapper.setAttribute('data-lucide', iconName);
        iconWrapper.style.width = '18px';
        iconWrapper.style.height = '18px';
        toast.appendChild(iconWrapper);
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = msg;
    toast.appendChild(textSpan);
    
    container.appendChild(toast);

    // Initialize lucide icon if wrapper added
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Force reflow so the transition fires
    void toast.offsetWidth;
    toast.classList.add('visible');

    // Auto-remove after duration
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

