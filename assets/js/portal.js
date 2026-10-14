/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
function loadRegistry() {
    return window.REGISTRY || [];
}

const PROF_BADGES = new Set([
    'Évaluation', 'Gestion de classe', 'Animation', 'Outils libres', 'Outil', 'Outils',
    'Ressources', 'Cartographie', 'Création', 'Programmation', 'Application',
    'Maths', 'Robotique', 'Exercices',
    'Beurteilung', 'Klassenführung', 'Animation', 'Freie Tools', 'Werkzeug', 'Werkzeuge',
    'Ressourcen', 'Kartografie', 'Erstellung', 'Programmieren', 'Anwendung',
    'Mathematik', 'Robotik', 'Übungen'
]);

function localizeBadgeText(text) {
    if (!window.I18N || window.I18N.locale !== 'de') {
        return text;
    }
    const map = {
        '5-6H': '5.-6. Primar',
        '7-8H': '7.-8. Primar',
        '5-8H': '5.-8. Primar',
        '9-10CO': '9.-10. OS',
        '9-11CO': '9.-11. OS',
        '10CO': '10. OS',
        '1-2H': '1.-2. Primar',
        '2-3H': '2.-3. Primar',
        '3-4H': '3.-4. Primar',
        'Cycle 1': 'Zyklus 1',
        'Cycle 2': 'Zyklus 2',
        'Cycle 3': 'Zyklus 3',
        'Outil': 'Werkzeug',
        'Outils': 'Werkzeuge',
        'Évaluation': 'Beurteilung',
        'Gestion de classe': 'Klassenführung',
        'Animation': 'Animation',
        'Outils libres': 'Freie Tools',
        'Ressources': 'Ressourcen',
        'Cartographie': 'Kartografie',
        'Création': 'Erstellung',
        'Programmation': 'Programmieren',
        'Application': 'Anwendung',
        'Maths': 'Mathematik',
        'Robotique': 'Robotik',
        'Exercices': 'Übungen'
    };
    return map[text] || text;
}

function localizeHref(href, isExternal) {
    if (!href || isExternal || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) {
        return href;
    }
    if (window.I18N && window.I18N.locale === 'de') {
        if (!href.includes('lang=')) {
            const sep = href.includes('?') ? '&' : '?';
            return `${href}${sep}lang=de`;
        }
    }
    return href;
}

function getLocalizedApp(app) {
    const isDe = window.I18N && window.I18N.locale === 'de';
    const localizedHref = localizeHref(app.href, app.isExternal);
    if (!isDe || !app.i18n || !app.i18n.de) {
        return {
            ...app,
            href: localizedHref
        };
    }
    const de = app.i18n.de;
    return {
        ...app,
        href: localizedHref,
        title: de.title || app.title,
        desc: de.desc !== undefined ? de.desc : app.desc,
        tags: de.tags || app.tags,
        ref: de.ref !== undefined ? de.ref : app.ref,
        badges: de.badges || app.badges,
        c1Badge: de.c1Badge || app.c1Badge
    };
}

function renderBadges(badges) {
    if (!badges) {
        return '';
    }
    return `<div class="badges-wrapper">${badges.map(b => {
        const text = localizeBadgeText(b.text);
        return `<span class="badge${b.grey ? ' grey' : ''}${PROF_BADGES.has(b.text) || PROF_BADGES.has(text) ? ' prof' : ''}">${text}</span>`;
    }).join('')}</div>`;
}

function renderTags(tags) {
    if (!tags) {
        return '';
    }
    return `<div class="card-tags">${tags.map(t => `<span class="tag">${t}</span>`).join(' ')}</div>`;
}

function renderIndexCard(app) {
    const localized = getLocalizedApp(app);
    const classes = ['card'];
    if (localized.isAlpha) {
        classes.push('alpha-app');
    }
    if (localized.isExternal) {
        classes.push('external');
    }
    if (localized.isTeacher) {
        classes.push('teacher');
    }

    const displayStyle = (localized.id === 'app-reseau-tri' || localized.id === 'app-jeu-grue') ? 'display: none;' : '';
    const iconStyle = localized.iconStyle === null ? '' : (localized.iconStyle || 'width:32px;height:32px;flex-shrink:0;');

    return `
                <a href="${localized.href}" ${localized.target ? `target="${localized.target}"` : ''} ${localized.rel ? `rel="${localized.rel}"` : ''} class="${classes.join(' ')}" data-level="${localized.dataLevel || ''}" ${localized.id ? `data-id="${localized.id}"` : ''} ${displayStyle ? `style="${displayStyle}"` : ''}>
                    ${renderBadges(localized.badges)}
                    <div class="card-title">
                        ${localized.icon ? `<i data-fa="${localized.icon}" style="${iconStyle}"></i>` : ''}
                        ${localized.title}
                    </div>
                    ${localized.desc ? `<div class="card-desc">${localized.desc}</div>` : ''}
                    ${renderTags(localized.tags)}
                    ${localized.ref ? `<div class="card-ref"><i data-fa="book-open-reader"></i> ${localized.ref}</div>` : ''}
                </a>`;
}

function renderExternalCard(app) {
    const localized = getLocalizedApp(app);
    const classes = ['card', 'card-compact', 'external'];
    if (localized.isAlpha) {
        classes.push('alpha-app');
    }
    const iconStyle = localized.iconStyle === null ? '' : (localized.iconStyle || 'width:32px;height:32px;flex-shrink:0;');

    return `
                <a href="${localized.href}" ${localized.target ? `target="${localized.target}"` : ''} ${localized.rel ? `rel="${localized.rel}"` : ''} class="${classes.join(' ')}" data-level="${localized.dataLevel || ''}" ${localized.id ? `data-id="${localized.id}"` : ''}>
                    ${renderBadges(localized.badges)}
                    <div class="card-title">
                        ${localized.icon ? `<i data-fa="${localized.icon}" style="${iconStyle}"></i>` : ''}
                        <span>${localized.title}</span>
                        <i data-fa="arrow-up-right-from-square" class="external-link-icon" aria-hidden="true"></i>
                    </div>
                    ${localized.desc ? `<div class="card-desc">${localized.desc}</div>` : ''}
                </a>`;
}

function renderC1Card(app) {
    const localized = getLocalizedApp(app);
    const badgeText = localized.c1Badge || (localized.dataLevel ? localizeBadgeText(localized.dataLevel) : '');
    const badgeHtml = badgeText ? `<div class="card-c1-badge"><span class="badge-pill-c1">${badgeText}</span></div>` : '';
    return `
            <a href="${localized.href}" class="card" style="${localized.style || ''}">
                ${badgeHtml}
                <div class="card-icon-main">
                    ${localized.c1Icon ? `<i data-fa="${localized.c1Icon}" style="color: #fff;"></i>` : ''}
                </div>
                <div class="card-icons-small" style="color: #fff;">
                    ${(localized.c1SmallIcons || []).map(icon => `<i data-fa="${icon}"></i>`).join('\n                    ')}
                </div>
                <div class="card-title">${localized.title}</div>
            </a>`;
}

window.renderPortal = function(mode) {
    const registry = loadRegistry();

    if (mode === 'index') {
        const studentActivitiesContainer = document.getElementById('grid-students-activities') ||
            document.querySelector('#view-students .searchable-grid');

        let studentExternalContainer = document.getElementById('grid-students-sites');
        let studentUtilitiesContainer = document.getElementById('grid-students-utilities');

        if (!studentExternalContainer || !studentUtilitiesContainer) {
            const studentHeaders = document.querySelectorAll('#view-students h2');
            for (const h of studentHeaders) {
                if (h.textContent.includes('Sites utiles') || h.textContent.includes('Ressources recommandées') || h.textContent.includes('Ressources externes')) {
                    studentExternalContainer = studentExternalContainer || h.parentElement.nextElementSibling;
                } else if (h.textContent.includes('Utilitaires')) {
                    studentUtilitiesContainer = studentUtilitiesContainer || h.parentElement.nextElementSibling;
                }
            }
        }

        const teacherToolsContainer = document.getElementById('grid-teachers-tools') ||
            document.querySelector('#view-teachers .searchable-grid');

        let teacherExternalContainer = document.getElementById('grid-teachers-resources');
        let teacherUtilitiesContainer = document.getElementById('grid-teachers-utilities');

        if (!teacherExternalContainer || !teacherUtilitiesContainer) {
            const teacherHeaders = document.querySelectorAll('#view-teachers h2');
            for (const h of teacherHeaders) {
                if (h.textContent.includes('Ressources recommandées') || h.textContent.includes('Ressources externes')) {
                    teacherExternalContainer = teacherExternalContainer || h.parentElement.nextElementSibling;
                } else if (h.textContent.includes('Utilitaires')) {
                    teacherUtilitiesContainer = teacherUtilitiesContainer || h.parentElement.nextElementSibling;
                }
            }
        }

        if (studentActivitiesContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'students_activities');
            studentActivitiesContainer['innerHTML'] = apps.map(renderIndexCard).join('');
        }
        if (studentExternalContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'students_external');
            studentExternalContainer['innerHTML'] = apps.map(renderExternalCard).join('');
        }
        if (studentUtilitiesContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'students_utilities');
            studentUtilitiesContainer['innerHTML'] = apps.map(renderExternalCard).join('');
        }
        if (teacherToolsContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'teachers_tools');
            teacherToolsContainer['innerHTML'] = apps.map(renderIndexCard).join('');
        }
        if (teacherExternalContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'teachers_external');
            teacherExternalContainer['innerHTML'] = apps.map(renderIndexCard).join('');
        }
        if (teacherUtilitiesContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'teachers_utilities');
            teacherUtilitiesContainer['innerHTML'] = apps.map(renderIndexCard).join('');
        }

        window.fa?.createIcons?.();

        // Trigger filters
        if (typeof window.executeFilters === 'function') {
            window.executeFilters();
        }

    } else if (mode === 'c1') {
        const grid = document.querySelector('main .grid');
        if (grid) {
            const apps = registry.filter(a => a.inC1);
            grid['innerHTML'] = apps.map(renderC1Card).join('');
        }

        window.fa?.createIcons?.();
    }
};


// PWA Installation & Platform Guidance Logic
function isPWAStandalone() {
    if (typeof window === 'undefined') return false;
    return Boolean(
        window.matchMedia?.('(display-mode: standalone)')?.matches ||
        window.navigator?.standalone === true ||
        (typeof document !== 'undefined' && document.referrer?.includes?.('android-app://'))
    );
}

function detectClientPlatform() {
    if (typeof navigator === 'undefined') return 'desktop';
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    const isIOS = /iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1);
    if (isIOS) return 'ios';

    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(platform || ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    if (isMac && isSafari) return 'mac';

    return 'desktop';
}

function showPWAInstallInstructions(preferredTab) {
    const platform = preferredTab || detectClientPlatform();
    let modalOverlay = document.getElementById('pwa-install-modal-overlay');

    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'pwa-install-modal-overlay';
        modalOverlay.className = 'ui-modal-overlay z-top';
        modalOverlay.setAttribute('role', 'dialog');
        modalOverlay.setAttribute('aria-modal', 'true');
        modalOverlay.setAttribute('aria-labelledby', 'pwa-modal-title');

        const t = function (key, fallback) {
            if (typeof window !== 'undefined' && window.I18N && typeof window.I18N.t === 'function') {
                return window.I18N.t(key, fallback);
            }
            return fallback;
        };

        const parser = new DOMParser();
        const doc = parser.parseFromString(`
            <div class="ui-modal-content pwa-install-modal">
                <button class="ui-btn-close" id="pwa-modal-close" aria-label="${t('common.close', 'Fermer la fenêtre')}">&times;</button>
                <div class="pwa-modal-header">
                    <div class="pwa-modal-icon" aria-hidden="true">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </div>
                    <div>
                        <h2 id="pwa-modal-title">${t('pwa.install_title', "Installer l'application")}</h2>
                        <p class="pwa-modal-subtitle">${t('pwa.install_subtitle', "Accédez à la Suite EdNum en 1 clic et profitez d'un accès complet hors-ligne.")}</p>
                    </div>
                </div>

                <div class="pwa-tabs" role="tablist" aria-label="${t('pwa.system_choice_aria', 'Choix du système')}">
                    <button class="pwa-tab-btn" role="tab" id="pwa-tab-ios" data-tab="ios" aria-controls="pwa-panel-ios" aria-selected="false">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                        <span>iPhone / iPad</span>
                    </button>
                    <button class="pwa-tab-btn" role="tab" id="pwa-tab-mac" data-tab="mac" aria-controls="pwa-panel-mac" aria-selected="false">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                        <span>Mac (Safari)</span>
                    </button>
                    <button class="pwa-tab-btn" role="tab" id="pwa-tab-desktop" data-tab="desktop" aria-controls="pwa-panel-desktop" aria-selected="false">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <span>${t('pwa.tab_other', 'Autres')}</span>
                    </button>
                </div>

                <div class="pwa-tab-panel" id="pwa-panel-ios" role="tabpanel" aria-labelledby="pwa-tab-ios">
                    <div class="pwa-steps">
                        <div class="pwa-step">
                            <span class="pwa-step-num">1</span>
                            <div class="pwa-step-body">
                                <p>${t('pwa.ios_step1', "Ouvrez le site dans <strong>Safari</strong>, puis touchez le bouton <strong>Partager</strong>.")}</p>
                                <span class="pwa-badge-action">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                                    ${t('pwa.share_btn', 'Bouton Partager')}
                                </span>
                            </div>
                        </div>
                        <div class="pwa-step">
                            <span class="pwa-step-num">2</span>
                            <div class="pwa-step-body">
                                <p>${t('pwa.ios_step2', "Faites défiler vers le bas et sélectionnez <strong>Sur l'écran d'accueil</strong>.")}</p>
                                <span class="pwa-badge-action">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                    ${t('pwa.add_home', "Sur l'écran d'accueil")}
                                </span>
                            </div>
                        </div>
                        <div class="pwa-step">
                            <span class="pwa-step-num">3</span>
                            <div class="pwa-step-body">
                                <p>${t('pwa.ios_step3', "Touchez <strong>Ajouter</strong> en haut à droite. L'application est installée sur votre appareil !")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pwa-tab-panel" id="pwa-panel-mac" role="tabpanel" aria-labelledby="pwa-tab-mac">
                    <div class="pwa-steps">
                        <div class="pwa-step">
                            <span class="pwa-step-num">1</span>
                            <div class="pwa-step-body">
                                <p>${t('pwa.mac_step1', "Dans <strong>Safari</strong>, cliquez sur le menu <strong>Fichier</strong> en haut de votre écran (ou sur le bouton Partager).")}</p>
                            </div>
                        </div>
                        <div class="pwa-step">
                            <span class="pwa-step-num">2</span>
                            <div class="pwa-step-body">
                                <p>${t('pwa.mac_step2', "Cliquez sur l'option <strong>Ajouter au Dock…</strong> (disponible sous macOS Sonoma 14+).")}</p>
                                <span class="pwa-badge-action">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    ${t('pwa.mac_badge', "Fichier > Ajouter au Dock…")}
                                </span>
                            </div>
                        </div>
                        <div class="pwa-step">
                            <span class="pwa-step-num">3</span>
                            <div class="pwa-step-body">
                                <p>${t('pwa.mac_step3', "Cliquez sur <strong>Ajouter</strong>. L'application s'ouvre désormais dans sa propre fenêtre autonome depuis le Dock !")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pwa-tab-panel" id="pwa-panel-desktop" role="tabpanel" aria-labelledby="pwa-tab-desktop">
                    <div class="pwa-steps">
                        <div class="pwa-step">
                            <span class="pwa-step-num">1</span>
                            <div class="pwa-step-body">
                                <p>${t('pwa.desktop_step1', "<strong>Google Chrome / Microsoft Edge / Brave :</strong> Cliquez sur l'icône d'installation dans la barre d'adresse à droite <span class=\"pwa-inline-chip\">⊕ Installer</span>.")}</p>
                            </div>
                        </div>
                        <div class="pwa-step">
                            <span class="pwa-step-num">2</span>
                            <div class="pwa-step-body">
                                <p>${t('pwa.desktop_step2', "<strong>Mozilla Firefox :</strong> Firefox ne supporte pas l'installation PWA native sur ordinateur. Vous pouvez ajouter la page à vos favoris avec le raccourci <span class=\"pwa-inline-chip\">Ctrl + D</span> (ou <span class=\"pwa-inline-chip\">Cmd + D</span>).")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pwa-tip">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <span>${t('pwa.offline_tip', "Une fois installée, l'application fonctionne <strong>100% hors-ligne</strong> même sans connexion Internet !")}</span>
                </div>

                <div class="pwa-modal-actions">
                    <button class="btn btn-primary" id="pwa-modal-ok-btn">${t('common.got_it', "J'ai compris")}</button>
                </div>
            </div>
        `, 'text/html');

        while (doc.body.firstChild) {
            modalOverlay.appendChild(doc.body.firstChild);
        }

        document.body.appendChild(modalOverlay);

        // Tab switching logic
        const tabBtns = modalOverlay.querySelectorAll('.pwa-tab-btn');
        const tabPanels = modalOverlay.querySelectorAll('.pwa-tab-panel');

        function switchTab(targetTab) {
            tabBtns.forEach(btn => {
                const isActive = btn.getAttribute('data-tab') === targetTab;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
            tabPanels.forEach(panel => {
                const isActive = panel.id === `pwa-panel-${targetTab}`;
                panel.classList.toggle('active', isActive);
            });
        }

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                switchTab(tab);
            });
        });

        // Close handlers
        function closeModal() {
            modalOverlay.classList.remove('active');
            document.removeEventListener('keydown', handleKeydown);
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }

        modalOverlay.querySelector('#pwa-modal-close')?.addEventListener('click', closeModal);
        modalOverlay.querySelector('#pwa-modal-ok-btn')?.addEventListener('click', closeModal);

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        modalOverlay._switchTab = switchTab;
        modalOverlay._closeModal = closeModal;
        modalOverlay._handleKeydown = handleKeydown;
    }

    // Activate selected tab and show modal
    if (typeof modalOverlay._switchTab === 'function') {
        modalOverlay._switchTab(platform);
    }
    modalOverlay.classList.add('active');
    document.addEventListener('keydown', modalOverlay._handleKeydown);

    // Focus OK button for accessibility
    setTimeout(() => {
        modalOverlay.querySelector('#pwa-modal-ok-btn')?.focus();
    }, 50);
}

function initPWAInstall() {
    // Si l'application est déjà lancée en mode autonome (PWA installée), ne rien afficher
    if (isPWAStandalone()) {
        return;
    }

    let deferredPrompt = null;
    const installBtn = document.getElementById('installBtn');
    if (!installBtn) return;

    const platform = detectClientPlatform();

    // Sur iOS et Mac Safari, l'événement beforeinstallprompt n'existe pas :
    // On affiche directement le bouton pour permettre l'accès au guide pas-à-pas
    if (platform === 'ios' || platform === 'mac') {
        installBtn.style.display = 'flex';
    }

    // Capture standard de l'événement Chromium (Chrome, Edge, Brave, etc.)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'flex';
    });

    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            if (outcome === 'accepted') {
                installBtn.style.display = 'none';
            }
        } else {
            // Pas de prompt natif disponible (iOS, Mac Safari, ou déjà refusé/bloqué) : afficher le guide
            showPWAInstallInstructions();
        }
    });

    window.addEventListener('appinstalled', () => {
        installBtn.style.display = 'none';
        deferredPrompt = null;
    });
}

// Global exposure for modularity & unit testing
window.isPWAStandalone = isPWAStandalone;
window.detectClientPlatform = detectClientPlatform;
window.showPWAInstallInstructions = showPWAInstallInstructions;
window.initPWAInstall = initPWAInstall;

// Initialize PWA install logic when DOM is ready or portal is rendered
document.addEventListener('DOMContentLoaded', initPWAInstall);
