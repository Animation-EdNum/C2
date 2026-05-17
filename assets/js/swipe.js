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
/* =========================================
   GESTION DU SWIPE (TOUCH) POUR ONGLETS
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    let touchStartX = 0;
    let touchStartY = 0;

    // Utiliser main ou le body par défaut pour capter le swipe
    const swipeContainer = document.querySelector('main') || document.querySelector('.container') || document.body;

    swipeContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    swipeContainer.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        // Détection de balayage horizontal prédominant (filtrage du scrolling vertical)
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            const tabContainer = document.querySelector('.tabs, .tab-bar');
            if (!tabContainer) return; // Pas de système d'onglets sur cette page

            const tabs = Array.from(tabContainer.querySelectorAll('.tab-btn'));
            if (tabs.length === 0) return;

            const activeIndex = tabs.findIndex(tab => tab.classList.contains('active'));
            if (activeIndex === -1) return;

            // Swipe gauche -> Droite (aller vers l'onglet suivant)
            if (dx < 0 && activeIndex < tabs.length - 1) {
                tabs[activeIndex + 1].click();
            }
            // Swipe droite -> Gauche (aller vers l'onglet précédent)
            else if (dx > 0 && activeIndex > 0) {
                tabs[activeIndex - 1].click();
            }
        }
    }, { passive: true });
});
