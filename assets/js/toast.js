/*
 * Copyright (C) 2026 Animation-EdNum (HEP-VS)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
        case 'success': iconName = 'circle-check'; break;
        case 'error':   iconName = 'circle-xmark'; break;
        case 'warn':    iconName = 'triangle-exclamation'; break;
        case 'info':    iconName = 'circle-info'; break;
        default:        iconName = toastType; // Use type as icon name if custom
    }

    if (window.fa && iconName) {
        const iconWrapper = document.createElement('i');
        iconWrapper.setAttribute('data-fa', iconName);
        iconWrapper.style.width = '18px';
        iconWrapper.style.height = '18px';
        toast.appendChild(iconWrapper);
    }

    const textSpan = document.createElement('span');
    if (msg instanceof HTMLElement) {
        textSpan.appendChild(msg);
    } else {
        textSpan.textContent = msg;
    }
    toast.appendChild(textSpan);
    
    container.appendChild(toast);

    // Initialize FontAwesome icon if wrapper added
    if (window.fa) {
        window.fa.createIcons();
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

