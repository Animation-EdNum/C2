/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * i18n.js — Système d'internationalisation (i18n) pour la Suite EdNum.
 *
 * Supporte le français (fr, source par défaut) et l'allemand suisse (de-CH).
 * Fonctionne 100% en local et sous protocole file:// sans fetch ni bundler.
 *
 * Détection de la langue :
 *   1. Paramètre URL ?lang=de ou ?lang=fr
 *   2. localStorage('global_lang')
 *   3. navigator.language (si commence par 'de' -> 'de')
 *   4. Repli par défaut : 'fr'
 */

(function (root) {
    'use strict';

    const STORAGE_KEY_LANG = 'global_lang';

    // Détection initiale de la locale
    function detectLocale() {
        if (typeof window === 'undefined') {
            return 'fr';
        }

        // 1. Paramètre URL ?lang=
        try {
            if (window.location && window.location.search) {
                const params = new URLSearchParams(window.location.search);
                const urlLang = params.get('lang');
                if (urlLang === 'de' || urlLang === 'de-CH') {
                    try {
                        localStorage.setItem(STORAGE_KEY_LANG, 'de');
                    } catch (e) {}
                    return 'de';
                }
                if (urlLang === 'fr' || urlLang === 'fr-CH') {
                    try {
                        localStorage.setItem(STORAGE_KEY_LANG, 'fr');
                    } catch (e) {}
                    return 'fr';
                }
            }
        } catch (e) {}

        // 2. Persistance localStorage
        try {
            const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
            if (savedLang === 'de' || savedLang === 'fr') {
                return savedLang;
            }
        } catch (e) {}

        // 3. Préférence navigateur
        try {
            const navLang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
            if (navLang.toLowerCase().startsWith('de')) {
                return 'de';
            }
        } catch (e) {}

        // 4. Par défaut : français
        return 'fr';
    }

    const currentLocale = detectLocale();

    // Anti-FOUC immédiat : si la langue est 'de', masquer temporairement le body
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = currentLocale === 'de' ? 'de-CH' : 'fr';
        if (currentLocale === 'de') {
            document.documentElement.classList.add('i18n-loading');

            // Timeout de sécurité pour ne jamais bloquer l'affichage
            setTimeout(function () {
                if (document.documentElement.classList.contains('i18n-loading')) {
                    document.documentElement.classList.remove('i18n-loading');
                }
            }, 800);
        }
    }

    const I18N = {
        locale: currentLocale,
        dictionaries: {
            fr: {},
            de: {}
        },

        /**
         * Enregistre un dictionnaire de traduction pour une locale.
         */
        register: function (locale, dict) {
            if (!this.dictionaries[locale]) {
                this.dictionaries[locale] = {};
            }
            if (dict && typeof dict === 'object') {
                Object.assign(this.dictionaries[locale], dict);
            }
            if (typeof document !== 'undefined' && document.readyState !== 'loading' && locale === this.locale) {
                this.apply();
            }
        },

        /**
         * Définit la langue courante et recharge optionnellement la page.
         */
        setLocale: function (newLocale, reload = true) {
            const targetLocale = (newLocale === 'de' || newLocale === 'de-CH') ? 'de' : 'fr';
            try {
                localStorage.setItem(STORAGE_KEY_LANG, targetLocale);
            } catch (e) {}
            this.locale = targetLocale;

            if (typeof document !== 'undefined' && document.documentElement) {
                document.documentElement.lang = targetLocale === 'de' ? 'de-CH' : 'fr';
            }

            if (reload && typeof window !== 'undefined' && window.location) {
                try {
                    const url = new URL(window.location.href);
                    url.searchParams.set('lang', targetLocale);
                    window.location.href = url.toString();
                    return;
                } catch (e) {
                    window.location.reload();
                    return;
                }
            }

            this.apply();
            this.updateLangToggle();
        },

        /**
         * Traduit une clé donnée avec repli et interpolation de paramètres {param}.
         */
        t: function (key, fallbackTextOrParams, params) {
            if (!key) {
                return '';
            }

            let fallback = key;
            let interpolationParams = null;

            if (typeof fallbackTextOrParams === 'object' && fallbackTextOrParams !== null) {
                interpolationParams = fallbackTextOrParams;
                fallback = key;
            } else if (typeof fallbackTextOrParams === 'string') {
                fallback = fallbackTextOrParams;
                interpolationParams = params || null;
            }

            let translation = fallback;
            const dict = this.dictionaries[this.locale];
            if (dict && typeof dict[key] === 'string') {
                translation = dict[key];
            }

            if (interpolationParams && typeof translation === 'string') {
                for (const p in interpolationParams) {
                    if (Object.prototype.hasOwnProperty.call(interpolationParams, p)) {
                        translation = translation.replace(new RegExp('\\{' + p + '\\}', 'g'), String(interpolationParams[p]));
                    }
                }
            }

            return translation;
        },

        /**
         * Formate une date selon la locale suisse appropriée (fr-CH ou de-CH).
         */
        formatDate: function (date, options) {
            const d = (date instanceof Date) ? date : new Date(date);
            if (Number.isNaN(d.getTime())) {
                return '';
            }
            const localeCode = this.locale === 'de' ? 'de-CH' : 'fr-CH';
            try {
                return new Intl.DateTimeFormat(localeCode, options || {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).format(d);
            } catch (e) {
                return d.toLocaleDateString();
            }
        },

        /**
         * Assigne de façon sécurisée du contenu HTML simple (tags inline autorisés)
         * sans jamais recourir à une affectation directe innerHTML, éliminant tout risque XSS (règle VICE vice/code/xss-dom).
         */
        setSanitizedHtml: function (targetEl, htmlString) {
            if (!targetEl || typeof htmlString !== 'string') {
                return;
            }

            const docObj = targetEl.ownerDocument || (typeof document !== 'undefined' ? document : null);
            const winObj = (docObj && docObj.defaultView) || (typeof window !== 'undefined' ? window : null);

            if (!docObj || !winObj || typeof winObj.DOMParser === 'undefined') {
                targetEl.textContent = htmlString.replace(/<[^>]+>/g, '');
                return;
            }

            const parser = new winObj.DOMParser();
            const parsedDoc = parser.parseFromString(htmlString, 'text/html');
            const allowedTags = new Set(['STRONG', 'EM', 'B', 'I', 'U', 'SPAN', 'BR', 'P', 'A', 'CODE', 'KBD', 'SMALL', 'SUB', 'SUP']);
            const dangerousTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH']);

            function sanitizeNode(node) {
                if (node.nodeType === 3) {
                    return docObj.createTextNode(node.textContent || '');
                }
                if (node.nodeType === 1) {
                    const tag = node.nodeName.toUpperCase();
                    if (allowedTags.has(tag)) {
                        const cleanEl = docObj.createElement(tag.toLowerCase());

                        if (tag === 'A') {
                            const href = (node.getAttribute('href') || '').trim();
                            const lowerHref = href.toLowerCase();
                            if (lowerHref && !lowerHref.startsWith('javascript:') && !lowerHref.startsWith('vbscript:') && !lowerHref.startsWith('data:')) {
                                cleanEl.setAttribute('href', href);
                            }
                            if (node.hasAttribute('target')) {
                                cleanEl.setAttribute('target', node.getAttribute('target'));
                            }
                            if (node.hasAttribute('rel')) {
                                cleanEl.setAttribute('rel', node.getAttribute('rel'));
                            } else if (cleanEl.getAttribute('target') === '_blank') {
                                cleanEl.setAttribute('rel', 'noopener noreferrer');
                            }
                        }

                        if (node.hasAttribute('class')) {
                            cleanEl.setAttribute('class', node.getAttribute('class'));
                        }

                        const children = node.childNodes;
                        for (let i = 0; i < children.length; i++) {
                            const cleanChild = sanitizeNode(children[i]);
                            if (cleanChild) {
                                cleanEl.appendChild(cleanChild);
                            }
                        }
                        return cleanEl;
                    }

                    if (dangerousTags.has(tag)) {
                        return null;
                    }

                    if (node.childNodes && node.childNodes.length > 0) {
                        const frag = docObj.createDocumentFragment();
                        for (let i = 0; i < node.childNodes.length; i++) {
                            const cleanChild = sanitizeNode(node.childNodes[i]);
                            if (cleanChild) {
                                frag.appendChild(cleanChild);
                            }
                        }
                        return frag;
                    } else if (node.textContent) {
                        return docObj.createTextNode(node.textContent);
                    }
                }
                return null;
            }

            while (targetEl.firstChild) {
                targetEl.removeChild(targetEl.firstChild);
            }

            const bodyChildren = (parsedDoc.body && parsedDoc.body.childNodes) ? parsedDoc.body.childNodes : [];
            for (let i = 0; i < bodyChildren.length; i++) {
                const cleanChild = sanitizeNode(bodyChildren[i]);
                if (cleanChild) {
                    targetEl.appendChild(cleanChild);
                }
            }
        },

        /**
         * Applique les traductions aux éléments du DOM contenant data-i18n, data-i18n-html ou data-i18n-attr.
         */
        apply: function (root) {
            const targetRoot = root || (typeof document !== 'undefined' ? document : null);
            if (!targetRoot) {
                return;
            }

            // 1. Text content via data-i18n
            const textNodes = targetRoot.querySelectorAll('[data-i18n]');
            for (let i = 0; i < textNodes.length; i++) {
                const el = textNodes[i];
                const key = el.getAttribute('data-i18n');
                if (key) {
                    if (!el.hasAttribute('data-i18n-orig')) {
                        el.setAttribute('data-i18n-orig', el.textContent.trim());
                    }
                    const fallback = el.getAttribute('data-i18n-orig');
                    el.textContent = this.t(key, fallback);
                }
            }

            // 2. HTML content via data-i18n-html (sécurisé via setSanitizedHtml, sans injection innerHTML directe)
            const htmlNodes = targetRoot.querySelectorAll('[data-i18n-html]');
            for (let i = 0; i < htmlNodes.length; i++) {
                const el = htmlNodes[i];
                const key = el.getAttribute('data-i18n-html');
                if (key) {
                    if (!el.hasAttribute('data-i18n-orig-html')) {
                        el.setAttribute('data-i18n-orig-html', el.innerHTML);
                    }
                    const fallback = el.getAttribute('data-i18n-orig-html');
                    const translated = this.t(key, fallback);
                    this.setSanitizedHtml(el, translated);
                }
            }

            // 3. Attributs via data-i18n-attr="title:key;aria-label:key;placeholder:key"
            const attrNodes = targetRoot.querySelectorAll('[data-i18n-attr]');
            for (let i = 0; i < attrNodes.length; i++) {
                const el = attrNodes[i];
                const attrSpec = el.getAttribute('data-i18n-attr');
                if (attrSpec) {
                    const pairs = attrSpec.split(';');
                    for (let j = 0; j < pairs.length; j++) {
                        const parts = pairs[j].split(':');
                        if (parts.length === 2) {
                            const attrName = parts[0].trim();
                            const key = parts[1].trim();
                            if (attrName && key) {
                                const origAttrKey = 'data-i18n-orig-' + attrName;
                                if (!el.hasAttribute(origAttrKey)) {
                                    el.setAttribute(origAttrKey, el.getAttribute(attrName) || '');
                                }
                                const fallback = el.getAttribute(origAttrKey);
                                el.setAttribute(attrName, this.t(key, fallback));
                            }
                        }
                    }
                }
            }

            // Retrait de la classe anti-FOUC
            if (typeof document !== 'undefined' && document.documentElement) {
                document.documentElement.classList.remove('i18n-loading');
            }

            // Mise à jour de l'état du bouton de changement de langue
            this.updateLangToggle();

            // Rafraîchir les icônes FontAwesome si présentes
            if (typeof window !== 'undefined' && window.fa && typeof window.fa.createIcons === 'function') {
                window.fa.createIcons();
            }
        },

        /**
         * Met à jour le texte et les attributs du bouton de langue.
         */
        updateLangToggle: function () {
            if (typeof document === 'undefined') {
                return;
            }

            const isDe = this.locale === 'de';
            const toggleBtns = document.querySelectorAll('.lang-toggle-btn, #lang-toggle-btn');

            for (let i = 0; i < toggleBtns.length; i++) {
                const btn = toggleBtns[i];
                const titleText = isDe ? 'Passer en français' : 'Auf Deutsch wechseln (de-CH)';
                btn.setAttribute('title', titleText);
                btn.setAttribute('aria-label', titleText);

                // Bouton icône compact dans la barre d'actions
                const badge = btn.querySelector('.lang-badge');
                if (badge) {
                    badge.textContent = isDe ? 'FR' : 'DE';
                }

                // Bouton dans le menu dropdown
                const menuText = btn.querySelector('.lang-menu-text');
                if (menuText) {
                    menuText.textContent = isDe ? 'Français' : 'Deutsch (de-CH)';
                }
            }
        },

        /**
         * Initialise et insère le bouton de bascule de langue si absent.
         * Masqué pour le grand public tant que la traduction est en cours.
         */
        initLangToggle: function () {
            if (typeof document === 'undefined') {
                return;
            }

            // Le bouton FR/DE est masqué par défaut pour le grand public.
            // Il peut être activé pour le développement/test via ?show_lang=1 ou localStorage('show_lang_btn') === '1'.
            let showToggle = false;
            try {
                if (typeof window !== 'undefined' && window.location && window.location.search) {
                    const params = new URLSearchParams(window.location.search);
                    if (params.get('show_lang') === '1') {
                        localStorage.setItem('show_lang_btn', '1');
                        showToggle = true;
                    } else if (params.get('show_lang') === '0') {
                        localStorage.removeItem('show_lang_btn');
                        showToggle = false;
                    }
                }
                if (!showToggle && typeof localStorage !== 'undefined') {
                    showToggle = localStorage.getItem('show_lang_btn') === '1';
                }
            } catch (e) {}

            const existingBtn = document.getElementById('lang-toggle-btn');
            if (existingBtn) {
                if (!showToggle) {
                    existingBtn.style.display = 'none';
                }
                existingBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.setLocale(this.locale === 'de' ? 'fr' : 'de', true);
                });
                this.updateLangToggle();
                return;
            }

            const isDe = this.locale === 'de';
            const titleText = isDe ? 'Passer en français' : 'Auf Deutsch wechseln (de-CH)';

            // Cas A : Menu dropdown dans l'en-tête de l'application (.settings-dropdown-content)
            const dropdownContent = document.querySelector('.settings-dropdown-content');
            if (dropdownContent) {
                const themeBtn = document.getElementById('theme-toggle-btn');
                const divider = document.createElement('div');
                divider.className = 'dropdown-divider';
                divider.id = 'lang-dropdown-divider';

                const langBtn = document.createElement('button');
                langBtn.className = 'menu-item-btn lang-toggle-btn';
                langBtn.id = 'lang-toggle-btn';
                langBtn.setAttribute('aria-label', titleText);
                langBtn.setAttribute('title', titleText);

                const badge = document.createElement('span');
                badge.className = 'lang-badge';
                badge.style.cssText = 'font-weight: 800; font-size: 0.8rem; padding: 2px 5px; border-radius: 4px; background: var(--border); margin-right: 8px;';
                badge.textContent = isDe ? 'FR' : 'DE';
                langBtn.appendChild(badge);

                const menuText = document.createElement('span');
                menuText.className = 'lang-menu-text';
                menuText.textContent = isDe ? 'Français' : 'Deutsch (de-CH)';
                langBtn.appendChild(menuText);

                if (!showToggle) {
                    divider.style.display = 'none';
                    langBtn.style.display = 'none';
                }

                if (themeBtn && themeBtn.nextSibling) {
                    dropdownContent.insertBefore(divider, themeBtn.nextSibling);
                    dropdownContent.insertBefore(langBtn, divider.nextSibling);
                } else {
                    dropdownContent.appendChild(divider);
                    dropdownContent.appendChild(langBtn);
                }

                langBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.setLocale(this.locale === 'de' ? 'fr' : 'de', true);
                });
                return;
            }

            // Cas B : Barre d'actions directe (.action-buttons, comme sur index.html et indexC1.html)
            const actionButtons = document.querySelector('.action-buttons');
            if (actionButtons) {
                const themeBtn = document.getElementById('theme-toggle-btn');
                const langBtn = document.createElement('button');
                langBtn.className = 'icon-action-btn lang-toggle-btn';
                langBtn.id = 'lang-toggle-btn';
                langBtn.setAttribute('type', 'button');
                langBtn.setAttribute('aria-label', titleText);
                langBtn.setAttribute('title', titleText);

                const badge = document.createElement('span');
                badge.className = 'lang-badge';
                badge.style.cssText = 'font-weight: 800; font-size: 0.95rem; letter-spacing: 0.05em;';
                badge.textContent = isDe ? 'FR' : 'DE';
                langBtn.appendChild(badge);

                if (!showToggle) {
                    langBtn.style.display = 'none';
                }

                if (themeBtn) {
                    actionButtons.insertBefore(langBtn, themeBtn);
                } else {
                    actionButtons.appendChild(langBtn);
                }

                langBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.setLocale(this.locale === 'de' ? 'fr' : 'de', true);
                });
            }
        }
    };

    // Auto-initialisation au chargement du DOM
    function onDomReady() {
        I18N.apply();
        I18N.initLangToggle();
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDomReady);
        } else {
            onDomReady();
        }
    }

    if (root._pendingI18nDe) {
        I18N.register('de', root._pendingI18nDe);
        delete root._pendingI18nDe;
    }

    root.I18N = I18N;
})(typeof window !== 'undefined' ? window : globalThis);
