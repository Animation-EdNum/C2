/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * index-main.js — Initialisation et gestion des interactions du portail principal (index.html).
 */

/* =========================================
   GESTION DES ONGLETS (TABS)
   ========================================= */
function switchTab(event, tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
        v.style.display = '';
    });
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
        targetView.classList.add('active');
        targetView.style.display = 'block';
    }

    executeFilters();
}

/* =========================================
   GESTION DES FILTRES DE NIVEAU
   ========================================= */
let currentFilter = 'all';

function filterApps(level) {
    currentFilter = level;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if ((level === 'all' && btn.innerText === 'Toutes') || btn.innerText === level) {
            btn.classList.add('active');
        }
    });
    executeFilters();
}

/* =========================================
   GESTION DE LA RECHERCHE & FILTRES CROISÉS
   ========================================= */
function searchApps() {
    executeFilters();
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    if (searchInput && clearSearchBtn) {
        if (searchInput.value.length > 0) {
            clearSearchBtn.style.display = 'flex';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    searchApps();
}

function executeFilters() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    const rawQuery = searchInput.value;
    const query = rawQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const isSearching = query.length > 0;

    // Filter cards
    document.querySelectorAll('.searchable-grid .card').forEach(card => {
        const isAlphaApp = card.classList.contains('alpha-app');

        if (query === 'alpha') {
            if (isAlphaApp) {
                card.style.display = '';
                card.classList.remove('filter-hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('filter-hidden');
            }
        } else {
            if (isAlphaApp) {
                card.style.display = 'none';
                card.classList.add('filter-hidden');
            } else {
                const textContent = card.innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                const level = card.getAttribute('data-level');

                const matchesSearch = textContent.includes(query);
                const matchesLevel = (currentFilter === 'all') || matchDegree(level, currentFilter, card);
                const matchesFilter = isSearching ? true : matchesLevel;

                if (matchesSearch && matchesFilter) {
                    card.style.display = '';
                    card.classList.remove('filter-hidden');
                } else {
                    card.style.display = 'none';
                    card.classList.add('filter-hidden');
                }
            }
        }
    });

    // Handle filter bar visibility during alpha search
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
        filterBar.style.display = (query === 'alpha') ? 'none' : '';
    }

    // Hide/show section headers and empty grids
    document.querySelectorAll('.view').forEach(view => {
        const grids = view.querySelectorAll('.searchable-grid');
        let viewTotalVisible = 0;

        grids.forEach(grid => {
            const cards = Array.from(grid.querySelectorAll('.card'));
            const visibleCards = cards.filter(c => !c.classList.contains('filter-hidden') && c.style.display !== 'none');
            const hasVisible = visibleCards.length > 0;
            viewTotalVisible += visibleCards.length;

            grid.style.display = hasVisible ? '' : 'none';

            // Find preceding section header
            let prev = grid.previousElementSibling;
            while (prev && !prev.classList.contains('section-header')) {
                prev = prev.previousElementSibling;
            }
            if (prev && prev.classList.contains('section-header')) {
                prev.style.display = hasVisible ? '' : 'none';
            }
        });

        // No results message per view
        let noResults = view.querySelector('.no-results-msg');
        if (viewTotalVisible === 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results-msg';
                noResults.style.textAlign = 'center';
                noResults.style.padding = '3rem 1rem';
                noResults.style.color = 'var(--text-light)';
                noResults.style.fontSize = '1.1rem';
                noResults.textContent = 'Aucune application trouvée pour cette recherche.';
                view.appendChild(noResults);
            }
            noResults.style.display = 'block';
        } else if (noResults) {
            noResults.style.display = 'none';
        }
    });
}

/**
 * Helper to match degree strings or badge text against the active degree filter
 */
function matchDegree(dataLevel, filter, card) {
    if (filter === 'all') return true;

    function checkString(str) {
        if (!str) return false;
        const s = str.trim();
        if (s === filter) return true;

        if (filter === '9-10 CO') {
            const coLevels = ['9CO', '10CO', '9-10 CO', '9-10CO', 'Cycle 3'];
            if (coLevels.some(c => s.includes(c))) return true;
            if (s.includes('10CO') || s.includes('10 CO')) return true;
            return false;
        }

        if (s === '4-8H') {
            return ['3-4H', '5-6H', '7-8H'].includes(filter);
        }
        if (s === '3-8H') {
            return ['3-4H', '5-6H', '7-8H'].includes(filter);
        }
        if (s.includes('5H') && (s.includes('10CO') || s.includes('10 CO'))) {
            return ['5-6H', '7-8H', '9-10 CO'].includes(filter);
        }
        return false;
    }

    if (checkString(dataLevel)) return true;

    if (card) {
        const badges = card.querySelectorAll('.badge');
        for (let i = 0; i < badges.length; i++) {
            if (checkString(badges[i].innerText)) return true;
        }
    }

    return false;
}

window.executeFilters = executeFilters;
window.switchTab = switchTab;
window.filterApps = filterApps;
window.searchApps = searchApps;
window.clearSearch = clearSearch;

function initPortalIndex() {
    // Event listeners for tabs
    const tabStudents = document.getElementById('tab-students');
    const tabTeachers = document.getElementById('tab-teachers');
    if (tabStudents) tabStudents.addEventListener('click', (e) => switchTab(e, 'students'));
    if (tabTeachers) tabTeachers.addEventListener('click', (e) => switchTab(e, 'teachers'));

    // Event listeners for filters
    const filterAll = document.getElementById('filter-all');
    const filter34H = document.getElementById('filter-3-4H');
    const filter56H = document.getElementById('filter-5-6H');
    const filter78H = document.getElementById('filter-7-8H');
    const filter910CO = document.getElementById('filter-9-10CO');

    if (filterAll) filterAll.addEventListener('click', () => filterApps('all'));
    if (filter34H) filter34H.addEventListener('click', () => filterApps('3-4H'));
    if (filter56H) filter56H.addEventListener('click', () => filterApps('5-6H'));
    if (filter78H) filter78H.addEventListener('click', () => filterApps('7-8H'));
    if (filter910CO) filter910CO.addEventListener('click', () => filterApps('9-10 CO'));

    // Search listeners
    const clearSearchBtn = document.getElementById('clearSearch');
    const searchInput = document.getElementById('searchInput');
    if (clearSearchBtn) clearSearchBtn.addEventListener('click', clearSearch);
    if (searchInput) searchInput.addEventListener('input', searchApps);

    // Tag click delegate
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('tag')) {
            e.preventDefault();
            const tagText = e.target.textContent;
            if (searchInput) {
                searchInput.value = tagText;
                searchApps();
            }
        }
    });

    // Render portal activities and icons
    if (typeof window.renderPortal === 'function') {
        window.renderPortal('index');
    }
    window.fa?.createIcons?.();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortalIndex);
} else {
    initPortalIndex();
}
