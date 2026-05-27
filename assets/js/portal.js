/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
async function loadRegistry() {
    return window.REGISTRY || [];
}

function renderBadges(badges) {
    if (!badges) return '';
    return `<div class="badges-wrapper">${badges.map(b => `<span class="badge${b.grey ? ' grey' : ''}${b.text === 'Évaluation' || b.text === 'Gestion de classe' || b.text === 'Animation' || b.text === 'Outils libres' || b.text === 'Ressources' ? ' prof' : ''}">${b.text}</span>`).join('')}</div>`;
}

function renderTags(tags) {
    if (!tags) return '';
    return `<div class="card-tags">${tags.map(t => `<span class="tag">${t}</span>`).join(' ')}</div>`;
}

function renderIndexCard(app) {
    const classes = ['card'];
    if (app.isAlpha) classes.push('alpha-app');
    if (app.isExternal) classes.push('external');
    if (app.isTeacher) classes.push('teacher');

    const displayStyle = (app.id === 'app-reseau-tri' || app.id === 'app-jeu-grue') ? 'display: none;' : '';

    return `
                <a href="${app.href}" ${app.target ? `target="${app.target}"` : ''} ${app.rel ? `rel="${app.rel}"` : ''} class="${classes.join(' ')}" data-level="${app.dataLevel || ''}" ${app.id ? `data-id="${app.id}"` : ''} ${displayStyle ? `style="${displayStyle}"` : ''}>
                    ${renderBadges(app.badges)}
                    <div class="card-title">
                        ${app.icon ? `<i data-fa="${app.icon}" style="${app.iconStyle || ''}"></i>` : ''}
                        ${app.title}
                    </div>
                    ${app.desc ? `<div class="card-desc">${app.desc}</div>` : ''}
                    ${renderTags(app.tags)}
                    ${app.ref ? `<div class="card-ref"><i data-fa="book-open-reader"></i> ${app.ref}</div>` : ''}
                </a>`;
}

function renderC1Card(app) {
    return `
            <a href="${app.href}" class="card" style="${app.style || ''}">
                <div class="card-icon-main">
                    ${app.c1Icon ? `<i data-fa="${app.c1Icon}" style="color: #fff;"></i>` : ''}
                </div>
                <div class="card-icons-small" style="color: #fff;">
                    ${(app.c1SmallIcons || []).map(icon => `<i data-fa="${icon}"></i>`).join('\n                    ')}
                </div>
                <div class="card-title">${app.title}</div>
            </a>`;
}

window.renderPortal = async function(mode) {
    const registry = await loadRegistry();

    if (mode === 'index') {
        const studentActivitiesContainer = document.querySelector('#view-students .searchable-grid');

        let studentExternalContainer = null;
        const studentHeaders = document.querySelectorAll('#view-students h2');
        for (const h of studentHeaders) {
            if (h.textContent.includes('Ressources externes')) {
                studentExternalContainer = h.parentElement.nextElementSibling;
                break;
            }
        }

        const teacherToolsContainer = document.querySelector('#view-teachers .searchable-grid');

        let teacherExternalContainer = null;
        const teacherHeaders = document.querySelectorAll('#view-teachers h2');
        for (const h of teacherHeaders) {
            if (h.textContent.includes('Ressources externes')) {
                teacherExternalContainer = h.parentElement.nextElementSibling;
                break;
            }
        }

        if (studentActivitiesContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'students_activities');
            studentActivitiesContainer.replaceChildren(); studentActivitiesContainer.insertAdjacentHTML('beforeend', apps.map(renderIndexCard).join(''));
        }
        if (studentExternalContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'students_external');
            studentExternalContainer.replaceChildren(); studentExternalContainer.insertAdjacentHTML('beforeend', apps.map(renderIndexCard).join(''));
        }
        if (teacherToolsContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'teachers_tools');
            teacherToolsContainer.replaceChildren(); teacherToolsContainer.insertAdjacentHTML('beforeend', apps.map(renderIndexCard).join(''));
        }
        if (teacherExternalContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'teachers_external');
            teacherExternalContainer.replaceChildren(); teacherExternalContainer.insertAdjacentHTML('beforeend', apps.map(renderIndexCard).join(''));
        }

        window.fa?.createIcons?.();

        // Trigger filters
        if (typeof window.executeFilters === 'function') {
            window.executeFilters();
        }
        if (typeof window.initRecentApps === 'function') {
            window.initRecentApps();
        }

    } else if (mode === 'c1') {
        const grid = document.querySelector('main .grid');
        if (grid) {
            const apps = registry.filter(a => a.inC1);
            grid.replaceChildren(); grid.insertAdjacentHTML('beforeend', apps.map(renderC1Card).join(''));
        }

        window.fa?.createIcons?.();
    }
};


// PWA Installation Logic
function initPWAInstall() {
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');

    if (installBtn) {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Empêche l'affichage automatique de l'invite d'installation par Chrome mini-infobar
            e.preventDefault();
            // Stash l'événement pour pouvoir le déclencher plus tard.
            deferredPrompt = e;
            // Affiche le bouton d'installation
            installBtn.style.display = 'flex';
        });

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Affiche le prompt
                deferredPrompt.prompt();
                // Attend que l'utilisateur réponde au prompt
                const { outcome } = await deferredPrompt.userChoice;
                // L'événement ne peut être utilisé qu'une seule fois, on le réinitialise
                deferredPrompt = null;
                // On cache le bouton
                installBtn.style.display = 'none';
            }
        });

        window.addEventListener('appinstalled', () => {
            // L'application a été installée
            installBtn.style.display = 'none';
            deferredPrompt = null;
        });
    }
}

// Initialize PWA install logic when DOM is ready or portal is rendered
document.addEventListener('DOMContentLoaded', initPWAInstall);
