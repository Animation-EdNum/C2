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
                        // Do not force selection on load if user chose another skin, but unlock it
                        // if (typeof activeSkin === 'undefined' || activeSkin === 'default') selectSkin('pedago');
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
                        ['btn-explore-hide-grid', 'btn-sim-hide-grid', 'btn-chal-hide-grid', 'btn-draw-hide-grid', 'btn-read-hide-grid'].forEach(id => { document.getElementById(id)?.querySelector('[data-fa]')?.setAttribute('data-fa', 'border-none'); });
                    } else {
                        document.querySelectorAll('.bot-grid').forEach(grid => grid.classList.remove('no-grid-lines'));
                        ['btn-explore-hide-grid', 'btn-sim-hide-grid', 'btn-chal-hide-grid', 'btn-draw-hide-grid', 'btn-read-hide-grid'].forEach(id => { document.getElementById(id)?.querySelector('[data-fa]')?.setAttribute('data-fa', 'frame'); });
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
