/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * modal-export.js — Utilitaire universel d'exportation de modales en image pour la Suite EdNum.
 *
 * Permet d'exporter n'importe quelle modale (.ui-modal-content ou conteneur de dialogue)
 * sous forme d'image PNG haute fidélité pour que l'élève puisse l'envoyer à son enseignant·e.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ModalExporter = factory();
    }
})(typeof window !== 'undefined' ? window : this, function () {
    'use strict';

    const STORAGE_KEY_STUDENT = 'c2_student_name';

    const ModalExporter = {
        _isInitialized: false,
        _observer: null,

        /**
         * Résout le chemin racine relatif à l'aide de <link rel="root">.
         */
        getRootPath() {
            if (typeof document === 'undefined') {
                return './';
            }
            const rootLink = document.querySelector('link[rel="root"]');
            let rootPath = rootLink ? rootLink.getAttribute('href') : './';
            if (!rootPath.endsWith('/')) {
                rootPath += '/';
            }
            return rootPath;
        },

        /**
         * Récupère le nom d'élève sauvegardé ou présent dans un champ.
         */
        getStudentName(container) {
            if (container) {
                const input = container.querySelector('#dactyloStudentName, #score-student-name, input[data-student-name], .modal-student-input');
                if (input && input.value && input.value.trim()) {
                    return input.value.trim();
                }
            }
            try {
                return localStorage.getItem(STORAGE_KEY_STUDENT) || '';
            } catch (e) {
                return '';
            }
        },

        /**
         * Sauvegarde le nom d'élève de façon globale.
         */
        saveStudentName(name) {
            if (!name) {
                return;
            }
            try {
                localStorage.setItem(STORAGE_KEY_STUDENT, name.trim());
            } catch (e) {
                // localStorage inaccessible
            }
        },

        /**
         * Charge html2canvas de façon asynchrone si non présent.
         */
        ensureHtml2Canvas() {
            return new Promise((resolve, reject) => {
                if (typeof window !== 'undefined' && window.html2canvas) {
                    resolve(window.html2canvas);
                    return;
                }
                if (typeof document === 'undefined') {
                    reject(new Error("Document non défini"));
                    return;
                }

                // Vérifier si un script html2canvas est déjà en cours de chargement
                let script = document.querySelector('script[data-h2c-loader]');
                if (script) {
                    script.addEventListener('load', () => resolve(window.html2canvas));
                    script.addEventListener('error', (err) => reject(err));
                    return;
                }

                script = document.createElement('script');
                script.setAttribute('data-h2c-loader', 'true');
                script.src = this.getRootPath() + 'assets/js/vendor/html2canvas.min.js';
                script.onload = () => {
                    if (window.html2canvas) {
                        resolve(window.html2canvas);
                    } else {
                        reject(new Error("html2canvas n'a pas pu être initialisé"));
                    }
                };
                script.onerror = () => {
                    reject(new Error("Impossible de charger html2canvas"));
                };
                document.head.appendChild(script);
            });
        },

        /**
         * Décoration optionnelle d'une modale.
         * Les actions d'export sont placées de manière ergonomique dans la barre d'action inférieure.
         */
        decorateModal(modalContent) {
            // Les boutons d'export sont intégrés dans les barres d'actions des modales
            return;
        },

        /**
         * Décore toutes les modales existantes dans le document.
         */
        scanAndDecorateAllModals() {
            return;
        },

        /**
         * Active la synchronisation automatique du nom d'élève.
         */
        initAutoExport() {
            if (this._isInitialized || typeof document === 'undefined') {
                return;
            }
            this._isInitialized = true;

            // Synchronisation du champ de nom d'élève universel
            document.addEventListener('input', (e) => {
                if (e.target && (e.target.id === 'dactyloStudentName' || e.target.id === 'score-student-name' || e.target.classList.contains('modal-student-input'))) {
                    this.saveStudentName(e.target.value);
                }
            });
        },

        _escapeHtml(text) {
            if (!text) return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        },

        /**
         * Rendu de la modale dans un élément Canvas haute résolution avec filigrane officiel.
         */
        async _renderModalToCanvas(target) {
            if (!target || !(target instanceof HTMLElement)) {
                return null;
            }

            let contentEl = target;
            if (target.classList.contains('ui-modal-overlay') || target.classList.contains('modal-backdrop') || target.classList.contains('celebration-overlay')) {
                const inner = target.querySelector('.ui-modal-content, .winner-card, .celebration-card, .victory-card, > div');
                if (inner) {
                    contentEl = inner;
                }
            }

            await this.ensureHtml2Canvas();

            // Synchroniser le nom d'élève
            const studentName = this.getStudentName(contentEl);
            if (studentName) {
                this.saveStudentName(studentName);
            }

            const now = new Date();
            const dateFormatted = now.toLocaleDateString('fr-CH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            const timeFormatted = now.toLocaleTimeString('fr-CH', {
                hour: '2-digit',
                minute: '2-digit'
            });

            contentEl.classList.add('exporting-modal');

            const isDark = document.body.classList.contains('dark');
            const bgColor = isDark ? '#1e293b' : '#ffffff';

            try {
                const canvas = await window.html2canvas(contentEl, {
                    scale: 2, // 2x Retina pour netteté d'export
                    useCORS: true,
                    logging: false,
                    backgroundColor: bgColor,
                    windowWidth: 1280,
                    windowHeight: 1024,
                    onclone: (clonedDoc) => {
                        // 1. Cloner les feuilles de styles pour garantir le rendu 100% hors-ligne
                        for (const sheet of document.styleSheets) {
                            try {
                                let cssText = '';
                                for (const rule of sheet.cssRules || []) {
                                    cssText += rule.cssText + '\n';
                                }
                                if (cssText) {
                                    const styleTag = clonedDoc.createElement('style');
                                    styleTag.textContent = cssText;
                                    clonedDoc.head.appendChild(styleTag);
                                }
                            } catch (e) {
                                // Feuilles protégées ignorées
                            }
                        }

                        const clonedTarget = clonedDoc.querySelector('.exporting-modal');
                        if (!clonedTarget) return;

                        // 2. Encadrement propre sous forme de carte imprimable
                        clonedTarget.style.width = '640px';
                        clonedTarget.style.maxWidth = '640px';
                        clonedTarget.style.minWidth = '640px';
                        clonedTarget.style.boxSizing = 'border-box';
                        clonedTarget.style.margin = '0 auto';
                        clonedTarget.style.padding = '28px 32px';
                        clonedTarget.style.borderRadius = '16px';
                        clonedTarget.style.background = isDark ? '#1e293b' : '#ffffff';
                        clonedTarget.style.border = isDark ? '1px solid #334155' : '1px solid #e2e8f0';
                        clonedTarget.style.boxShadow = 'none';
                        clonedTarget.style.transform = 'none';
                        clonedTarget.style.transition = 'none';
                        clonedTarget.style.maxHeight = 'none';
                        clonedTarget.style.height = 'auto';
                        clonedTarget.style.overflow = 'visible';

                        // 3. Masquer la croix de fermeture et les boutons d'actions
                        clonedTarget.querySelectorAll('.ui-btn-close, #btn-close-score-modal, #btn-close-dactylo-modal, [aria-label="Fermer"], .score-modal-actions, .dactylo-modal-actions, [data-html2canvas-ignore]').forEach(el => el.remove());

                        // 4. Nettoyer tout filigrane ou pied de page pré-existant
                        clonedTarget.querySelectorAll('.modal-export-watermark, .modal-export-footer').forEach(el => el.remove());

                        // 5. Remplacer la barre d'input élève par un bandeau typographique propre
                        const studentBar = clonedTarget.querySelector('.modal-student-bar');
                        if (studentBar) {
                            const barContainer = clonedDoc.createElement('div');
                            barContainer.style.display = 'flex';
                            barContainer.style.alignItems = 'center';
                            barContainer.style.justifyContent = 'space-between';
                            barContainer.style.width = '100%';

                            const studentGroup = clonedDoc.createElement('div');
                            studentGroup.style.display = 'flex';
                            studentGroup.style.alignItems = 'center';
                            studentGroup.style.gap = '8px';

                            const labelSpan = clonedDoc.createElement('span');
                            labelSpan.style.fontSize = '0.8rem';
                            labelSpan.style.fontWeight = '700';
                            labelSpan.style.textTransform = 'uppercase';
                            labelSpan.style.letterSpacing = '0.05em';
                            labelSpan.style.color = isDark ? '#818cf8' : '#4f46e5';
                            labelSpan.textContent = 'Élève :';

                            const nameSpan = clonedDoc.createElement('span');
                            nameSpan.style.fontSize = '1.05rem';
                            nameSpan.style.fontWeight = '700';
                            nameSpan.style.color = isDark ? '#f8fafc' : '#0f172a';
                            nameSpan.textContent = studentName || 'Non renseigné';

                            studentGroup.appendChild(labelSpan);
                            studentGroup.appendChild(nameSpan);

                            const dateSpan = clonedDoc.createElement('span');
                            dateSpan.style.fontSize = '0.8rem';
                            dateSpan.style.fontWeight = '600';
                            dateSpan.style.color = isDark ? '#94a3b8' : '#64748b';
                            dateSpan.textContent = dateFormatted;

                            barContainer.appendChild(studentGroup);
                            barContainer.appendChild(dateSpan);

                            studentBar.replaceChildren(barContainer);
                            studentBar.style.padding = '10px 14px';
                            studentBar.style.borderRadius = '10px';
                            studentBar.style.border = isDark ? '1px solid #334155' : '1px solid #e0e7ff';
                            studentBar.style.background = isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(79, 70, 229, 0.05)';
                            studentBar.style.margin = '12px 0 18px 0';
                        }

                        // 6. Déplier les conteneurs scrollables (affiche tous les niveaux sans coupure)
                        clonedTarget.querySelectorAll('.dactylo-scores-table-wrapper, #score-modal-body, .stat-table-wrapper, .modal-body-scroll').forEach(el => {
                            el.style.maxHeight = 'none';
                            el.style.height = 'auto';
                            el.style.overflow = 'visible';
                        });

                        // 7. Recopier les données de canvas d'origine (graphiques donut, etc.)
                        const originalCanvases = contentEl.querySelectorAll('canvas');
                        const clonedCanvases = clonedTarget.querySelectorAll('canvas');
                        originalCanvases.forEach((orig, idx) => {
                            const clone = clonedCanvases[idx];
                            if (clone && orig.width > 0 && orig.height > 0) {
                                const ctx = clone.getContext('2d');
                                if (ctx) {
                                    ctx.drawImage(orig, 0, 0);
                                }
                            }
                        });

                        // 8. Ajouter un pied de page officiel épuré
                        const officialFooter = clonedDoc.createElement('div');
                        officialFooter.style.display = 'flex';
                        officialFooter.style.justifyContent = 'space-between';
                        officialFooter.style.alignItems = 'center';
                        officialFooter.style.marginTop = '22px';
                        officialFooter.style.paddingTop = '12px';
                        officialFooter.style.borderTop = `1px dashed ${isDark ? '#334155' : '#cbd5e1'}`;
                        officialFooter.style.fontSize = '0.75rem';
                        officialFooter.style.fontWeight = '500';
                        officialFooter.style.color = isDark ? '#94a3b8' : '#64748b';
                        officialFooter.style.fontFamily = 'inherit';

                        const leftSpan = clonedDoc.createElement('span');
                        leftSpan.style.display = 'flex';
                        leftSpan.style.alignItems = 'center';
                        leftSpan.style.gap = '6px';

                        const strongTitle = clonedDoc.createElement('strong');
                        strongTitle.style.color = isDark ? '#e2e8f0' : '#1e293b';
                        strongTitle.textContent = 'Suite EdNum';

                        leftSpan.appendChild(strongTitle);
                        leftSpan.appendChild(clonedDoc.createTextNode(' · Animation-EdNum (HEP-VS)'));

                        const rightSpan = clonedDoc.createElement('span');
                        rightSpan.textContent = `Bilan officiel · ${dateFormatted} à ${timeFormatted}`;

                        officialFooter.appendChild(leftSpan);
                        officialFooter.appendChild(rightSpan);
                        clonedTarget.appendChild(officialFooter);
                    }
                });

                return { canvas, contentEl, studentName, now };
            } finally {
                contentEl.classList.remove('exporting-modal');
            }
        },

        /**
         * Exporte une modale en fichier image PNG.
         * @param {HTMLElement} target - Le conteneur de la modale ou son contenu
         * @param {Object} options - Options personnalisées (filename, appName, title, etc.)
         */
        async exportModal(target, options = {}) {
            let contentEl = target;
            if (target && (target.classList?.contains('ui-modal-overlay') || target.classList?.contains('modal-backdrop'))) {
                const inner = target.querySelector('.ui-modal-content, .winner-card, .celebration-card, .victory-card, > div');
                if (inner) {
                    contentEl = inner;
                }
            }

            const exportBtn = contentEl?.querySelector('.ui-btn-export-modal');
            if (exportBtn) {
                exportBtn.disabled = true;
            }

            try {
                const result = await this._renderModalToCanvas(target);
                if (!result || !result.canvas) {
                    return;
                }

                const { canvas, studentName, now } = result;

                // Génération du nom de fichier
                let baseName = options.filename;
                if (!baseName) {
                    let appTitle = options.appName;
                    if (!appTitle) {
                        const titleEl = document.querySelector('header h1');
                        appTitle = titleEl ? titleEl.textContent.trim().split('\n')[0].trim() : 'activite';
                    }
                    const cleanApp = appTitle.toLowerCase().replace(/[^a-z0-9à-öø-ÿ]/gi, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
                    const cleanStudent = (studentName || '').toLowerCase().replace(/[^a-z0-9à-öø-ÿ]/gi, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
                    const datePart = now.toISOString().slice(0, 10);

                    if (cleanStudent) {
                        baseName = `bilan_${cleanApp}_${cleanStudent}_${datePart}.png`;
                    } else {
                        baseName = `bilan_${cleanApp}_${datePart}.png`;
                    }
                }

                // Déclenchement du téléchargement
                if (canvas.toBlob) {
                    canvas.toBlob((blob) => {
                        if (!blob) {
                            return;
                        }
                        const downloadUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        a.download = baseName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);

                        // Tentative de copie dans le presse-papiers si supporté
                        if (navigator.clipboard && window.ClipboardItem) {
                            try {
                                navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).catch(() => {});
                            } catch (e) {
                                // clipboard write ignore
                            }
                        }

                        if (typeof window.showToast === 'function') {
                            window.showToast("Image téléchargée avec succès !", "success");
                        }
                    }, 'image/png');
                } else {
                    const dataUrl = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = dataUrl;
                    a.download = baseName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    if (typeof window.showToast === 'function') {
                        window.showToast("Image téléchargée avec succès !", "success");
                    }
                }
            } catch (err) {
                if (typeof window.showToast === 'function') {
                    window.showToast("Erreur lors de l'exportation de l'image.", "error");
                }
            } finally {
                if (exportBtn) {
                    exportBtn.disabled = false;
                }
            }
        },

        /**
         * Copie l'image de la modale directement dans le presse-papiers.
         * @param {HTMLElement} target - Le conteneur de la modale ou son contenu
         * @param {Object} options - Options personnalisées
         */
        async copyModal(target, options = {}) {
            let contentEl = target;
            if (target && (target.classList?.contains('ui-modal-overlay') || target.classList?.contains('modal-backdrop'))) {
                const inner = target.querySelector('.ui-modal-content, .winner-card, .celebration-card, .victory-card, > div');
                if (inner) {
                    contentEl = inner;
                }
            }

            const copyBtn = contentEl?.querySelector('#btnCopyDactyloModal, .btn-copy-modal');
            if (copyBtn) {
                copyBtn.disabled = true;
            }

            try {
                const result = await this._renderModalToCanvas(target);
                if (!result || !result.canvas) {
                    return;
                }

                const { canvas } = result;

                if (canvas.toBlob && navigator.clipboard && window.ClipboardItem) {
                    canvas.toBlob(async (blob) => {
                        if (!blob) {
                            return;
                        }
                        try {
                            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                            if (typeof window.showToast === 'function') {
                                window.showToast("Image copiée dans le presse-papiers !", "success");
                            }
                        } catch (e) {
                            if (typeof window.showToast === 'function') {
                                window.showToast("Presse-papiers inaccessible. Utilisez 'Exporter en image'.", "warning");
                            }
                        }
                    }, 'image/png');
                } else {
                    if (typeof window.showToast === 'function') {
                        window.showToast("Copie d'image non supportée sur ce navigateur.", "warning");
                    }
                }
            } catch (err) {
                if (typeof window.showToast === 'function') {
                    window.showToast("Erreur lors de la capture de l'image.", "error");
                }
            } finally {
                if (copyBtn) {
                    copyBtn.disabled = false;
                }
            }
        }
    };

    // Démarrage automatique au chargement
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => ModalExporter.initAutoExport());
        } else {
            ModalExporter.initAutoExport();
        }
    }

    return ModalExporter;
});
