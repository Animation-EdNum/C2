/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
        window.addEventListener('load', () => {

            const coloredCmdsBtn = document.getElementById('colored-cmds-toggle-btn');
            if (coloredCmdsBtn) {
                coloredCmdsBtn.addEventListener('click', () => {
                    document.body.classList.toggle('colored-cmds');
                    const isActive = document.body.classList.contains('colored-cmds');
                    localStorage.setItem('at_colored_cmds', isActive ? '1' : '0');

                    if (isActive) {
                        coloredCmdsBtn.style.color = 'var(--accent)';
                        if (typeof unlockSkin === 'function') {
                            unlockSkin('pedago');
                            if (typeof selectSkin === 'function') selectSkin('pedago');
                        }
                    } else {
                        coloredCmdsBtn.style.color = '';
                        if (typeof activeSkin !== 'undefined' && activeSkin === 'pedago' && typeof selectSkin === 'function') {
                            selectSkin('default');
                        }
                    }
                });

                if (localStorage.getItem('at_colored_cmds') === '1') {
                    document.body.classList.add('colored-cmds');
                    coloredCmdsBtn.style.color = 'var(--accent)';
                    if (typeof unlockSkin === 'function') {
                        unlockSkin('pedago');

                    }
                } else {
                    coloredCmdsBtn.style.color = '';
                }
            }

            // Tab key navigation
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tablist = document.querySelector('.tabs[role="tablist"]');
            if (tablist && tabBtns.length > 0) {
                tabBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        tabBtns.forEach(b => {
                            b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
                        });
                    });
                });
            }

            initApplication();

            // Drawers Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (document.getElementById('mats-drawer').classList.contains('active')) {
                        closeMatsModal();
                    }
                    if (document.getElementById('ui-panel').classList.contains('active')) {
                        closeSkinsModal();
                    }
                }
            });
        });

        window.addEventListener('pageshow', (e) => {
            if (e.persisted) {
                initApplication();
            }
        });
        window.addEventListener('c2_change_difficulty', (e) => {
            const nextDiff = e.detail.difficulty;
            const mode = e.detail.mode; // 'read' or 'chal' or 'draw'
            if (mode === 'read') {
                if (nextDiff === 'medium') document.getElementById('read-diff-medium')?.click();
                if (nextDiff === 'hard') document.getElementById('read-diff-hard')?.click();
                if (nextDiff === 'extreme') document.getElementById('read-diff-extreme')?.click();
            } else if (mode === 'chal') {
                if (nextDiff === 'medium') document.getElementById('diff-medium')?.click();
                if (nextDiff === 'hard') document.getElementById('diff-hard')?.click();
                if (nextDiff === 'extreme') document.getElementById('diff-extreme')?.click();
            } else if (mode === 'draw') {
                if (nextDiff === 'medium') document.getElementById('draw-diff-medium')?.click();
                if (nextDiff === 'hard') document.getElementById('draw-diff-hard')?.click();
                if (nextDiff === 'extreme') document.getElementById('draw-diff-extreme')?.click();
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            
            const toggleHideGrid = document.getElementById('toggle-hide-grid');
            if (toggleHideGrid) {
                toggleHideGrid.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        document.querySelectorAll('.bot-grid').forEach(grid => grid.classList.add('no-grid-lines'));
                        ['btn-explore-hide-grid', 'btn-sim-hide-grid', 'btn-chal-hide-grid', 'btn-draw-hide-grid', 'btn-read-hide-grid'].forEach(id => {
                            const btn = document.getElementById(id);
                            if (btn) {
                                btn.querySelector('[data-fa]')?.setAttribute('data-fa', 'border-all');
                                btn.setAttribute('data-tooltip', 'Afficher le quadrillage');
                                btn.setAttribute('title', 'Afficher le quadrillage');
                            }
                        });
                    } else {
                        document.querySelectorAll('.bot-grid').forEach(grid => grid.classList.remove('no-grid-lines'));
                        ['btn-explore-hide-grid', 'btn-sim-hide-grid', 'btn-chal-hide-grid', 'btn-draw-hide-grid', 'btn-read-hide-grid'].forEach(id => {
                            const btn = document.getElementById(id);
                            if (btn) {
                                btn.querySelector('[data-fa]')?.setAttribute('data-fa', 'border-all-slash');
                                btn.setAttribute('data-tooltip', 'Masquer le quadrillage');
                                btn.setAttribute('title', 'Masquer le quadrillage');
                            }
                        });
                    }
                    window.fa?.createIcons?.();
                });
            }

            if (urlParams.get('hideGrid') === '1') {
                if (toggleHideGrid) {
                    toggleHideGrid.checked = true;
                    toggleHideGrid.dispatchEvent(new Event('change'));
                } else {
                    document.querySelectorAll('.bot-grid').forEach(grid => {
                        grid.classList.add('no-grid-lines');
                    });
                }
            }

        });

        window.__onResetApp = function() {
            // 1. Arrêter les exécutions en cours
            if (typeof simState !== 'undefined') {
                simState.running = false;
                simState.paused = false;
                simState.stopped = true;
                simState.stepIndex = -1;
                simState.failed = false;
                simState.program = [];
                simState.robotRow = simState.startRow = 5;
                simState.robotCol = simState.startCol = 0;
                simState.robotDir = simState.startDir = 0;
                simState.obstacles = [];
                simState.targetRow = null;
                simState.targetCol = null;
                if (typeof renderProgram === 'function') renderProgram();
            }
            if (typeof exploreState !== 'undefined') {
                exploreState.running = false;
                exploreState.robotRow = exploreState.startRow = exploreState.absoluteStartRow = 5;
                exploreState.robotCol = exploreState.startCol = exploreState.absoluteStartCol = 0;
                exploreState.robotDir = exploreState.startDir = exploreState.absoluteStartDir = 0;
                exploreState.obstacles = [];
                exploreState.targetRow = null;
                exploreState.targetCol = null;
                exploreState.history = [];
                exploreState.stepsThisRun = 0;
            }
            if (typeof chalState !== 'undefined') {
                chalState.locked = false;
                chalState.isAnimating = false;
                if (typeof newChallenge === 'function') newChallenge();
            }
            if (typeof readState !== 'undefined') {
                readState.locked = false;
                readState.isAnimating = false;
                if (typeof newReadChallenge === 'function') newReadChallenge();
            }
            if (typeof drawState !== 'undefined') {
                drawState.running = false;
                if (typeof newDrawChallenge === 'function') newDrawChallenge();
            }

            // 2. Réinitialiser les clés localStorage liées à l'automate
            const atKeys = [
                'at_active_skin', 'at_active_mat', 'at_unlocked_skins',
                'at_total_steps', 'at_custom_mat_image', 'at_memory_mode',
                'at_spell_mode', 'at_collect_mode', 'at_mat_opacity',
                'at_colored_cmds', 'at_seen_skin_bubble', 'automate_explore_seen_hint'
            ];
            atKeys.forEach(k => {
                try { localStorage.removeItem(k); } catch (e) {}
            });

            // 3. Réinitialiser les skins et tapis
            if (typeof selectSkin === 'function') selectSkin('default');
            if (typeof selectMat === 'function') selectMat('none');
            document.body.classList.remove('colored-cmds');
            const coloredCmdsBtn = document.getElementById('colored-cmds-toggle-btn');
            if (coloredCmdsBtn) coloredCmdsBtn.style.color = '';

            // 4. Reconstruire les grilles et vider les tracés
            if (typeof rebuildAllGrids === 'function') rebuildAllGrids();

            // 5. Fermer les panneaux et le menu déroulant
            const dropdownContent = document.querySelector('.settings-dropdown-content.show');
            if (dropdownContent) dropdownContent.classList.remove('show');
            document.querySelectorAll('.app-header.dropdown-open').forEach(h => h.classList.remove('dropdown-open'));
            if (typeof closeMatsModal === 'function') closeMatsModal();
            if (typeof closeSkinsModal === 'function') closeSkinsModal();

            // 6. Réinitialiser les scores si l'API Scores existe
            if (typeof Scores !== 'undefined' && typeof Scores.resetAll === 'function') {
                Scores.resetAll();
            }

            // 7. Retours sonore et visuel
            if (typeof playSound === 'function') playSound('click');
            if (typeof showToast === 'function') {
                showToast("Simulateur réinitialisé", "info");
            }
        };
