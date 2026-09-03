/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * index-main.js — Initialisation et gestion des interactions du portail principal (index.html).
 */

/* =========================================
   GESTION DES ONGLETS (TABS)
   ========================================= */
function updateRoleButton(tabId) {
    const roleBtn = document.getElementById('role-toggle-btn');
    if (!roleBtn) return;

    roleBtn.textContent = '';
    const icon = document.createElement('i');

    if (tabId === 'teachers') {
        roleBtn.setAttribute('title', "Passer à l'Espace Élèves");
        roleBtn.setAttribute('aria-label', "Passer à l'Espace Élèves");
        icon.setAttribute('data-fa', 'graduation-cap');
    } else {
        roleBtn.setAttribute('title', "Passer à l'Espace Enseignant·e·s");
        roleBtn.setAttribute('aria-label', "Passer à l'Espace Enseignant·e·s");
        icon.setAttribute('data-fa', 'chalkboard-user');
    }

    roleBtn.appendChild(icon);
    window.fa?.createIcons?.();
}

function switchTab(event, tabId) {
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
        v.style.display = '';
    });
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
        targetView.classList.add('active');
        targetView.style.display = 'block';
    }

    updateRoleButton(tabId);
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
                const rawText = card.innerText || card.textContent || "";
                const textContent = rawText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                const level = card.getAttribute('data-level');

                const matchesSearch = textContent.includes(query);
                const isTeacherCard = card.closest('#view-teachers') !== null;
                const matchesLevel = (currentFilter === 'all' || isTeacherCard) || matchDegree(level, currentFilter, card);
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
        const s = str.trim().toUpperCase();
        const f = filter.trim().toUpperCase();

        if (s === f) return true;

        if (f === '9-10 CO' || f === '9-10CO') {
            if (s.includes('10CO') || s.includes('10 CO') || s.includes('9CO') || s.includes('CYCLE 3')) return true;
            return false;
        }

        // Support '... JUSQU'À ...' or '...-...' (e.g. "5H JUSQU'À 10CO", "7H JUSQU'À 10CO", "5H JUSQU'À 8H", "3H JUSQU'À 8H")
        const rangeMatch = s.match(/(\d+)\s*H?\s*(?:JUSQU'À|-)\s*(\d+)\s*(CO|H)?/i);
        if (rangeMatch) {
            const startH = parseInt(rangeMatch[1], 10);
            const endVal = parseInt(rangeMatch[2], 10);
            const isEndCO = (rangeMatch[3] && rangeMatch[3].toUpperCase() === 'CO') || s.includes('CO');

            if (f === '3-4H') {
                return startH <= 4 && (isEndCO || endVal >= 3);
            }
            if (f === '5-6H') {
                return startH <= 6 && (isEndCO || endVal >= 5);
            }
            if (f === '7-8H') {
                return startH <= 8 && (isEndCO || endVal >= 7);
            }
        }

        return false;
    }

    if (checkString(dataLevel)) return true;

    if (card) {
        const badges = card.querySelectorAll('.badge');
        for (let i = 0; i < badges.length; i++) {
            if (checkString(badges[i].innerText || badges[i].textContent || '')) return true;
        }
    }

    return false;
}

window.executeFilters = executeFilters;
window.switchTab = switchTab;
window.filterApps = filterApps;
window.searchApps = searchApps;
window.clearSearch = clearSearch;
window.initPortalIndex = initPortalIndex;

function initPortalIndex() {
    // Role toggle button in header
    const roleToggleBtn = document.getElementById('role-toggle-btn');
    if (roleToggleBtn) {
        roleToggleBtn.addEventListener('click', () => {
            const isCurrentlyTeacher = document.getElementById('view-teachers')?.classList.contains('active');
            const targetTab = isCurrentlyTeacher ? 'students' : 'teachers';
            switchTab(null, targetTab);
        });
    }

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

    // Search bar toggle & controls
    const searchBar = document.querySelector('.search-bar');
    const searchInput = document.getElementById('searchInput');
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const clearSearchBtn = document.getElementById('clearSearch');

    function toggleSearch(forceOpen) {
        if (!searchBar) return;
        const isOpen = searchBar.classList.contains('active');
        const shouldOpen = forceOpen !== undefined ? forceOpen : !isOpen;

        if (shouldOpen) {
            searchBar.classList.add('active');
            searchToggleBtn?.classList.add('active');
            if (typeof searchBar.scrollIntoView === 'function') {
                searchBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            setTimeout(() => {
                searchInput?.focus();
                if (typeof searchInput?.select === 'function') {
                    searchInput.select();
                }
            }, 150);
        } else {
            searchBar.classList.remove('active');
            searchToggleBtn?.classList.remove('active');
            if (searchInput && searchInput.value.length > 0) {
                searchInput.value = '';
                searchApps();
            }
        }
    }

    if (searchToggleBtn) {
        searchToggleBtn.addEventListener('click', () => toggleSearch());
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('input', searchApps);
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                toggleSearch(false);
            }
        });
    }

    // Parallax smart sticky header
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY <= 80) {
                header.classList.remove('header-hidden');
            } else if (currentScrollY > lastScrollY + 10) {
                // Scrolling down -> hide header
                header.classList.add('header-hidden');
            } else if (currentScrollY < lastScrollY - 10) {
                // Scrolling up -> show header with all buttons
                header.classList.remove('header-hidden');
            }
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // Tag click delegate
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('tag')) {
            e.preventDefault();
            const tagText = e.target.textContent;
            toggleSearch(true);
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
    updateRoleButton('students');
    window.fa?.createIcons?.();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortalIndex);
} else {
    initPortalIndex();
}
