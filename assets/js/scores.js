/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * ScoreManager - Handles detailed scoring stats and rendering of the stats modal.
 */
const ScoreManager = {
    appId: null,
    stats: {}, // structure: { mode: { diffKey: { totalAttempts, totalSuccess, firstTrySuccess, mistakes } } }

    MODE_LABELS: {
        'dec_to_bin': 'Décimal → Binaire',
        'bin_to_dec': 'Binaire → Décimal',
        'encode': 'Encodage',
        'decode': 'Décodage',
        'train': 'Entraînement',
        'path': 'Routage',
        'chal': 'Pilotage',
        'read': 'Décodage',
        'detect': 'Détection d\'erreur',
        'simulator': 'Simulateur',
        'draw': 'Dessin',
        'jeu_de_la_grue': 'Jeu de la grue',
        'color': 'Par couleur',
        'shape': 'Par forme',
        'quantity': 'Par quantité',
        'size': 'Par taille',
        'nombres': 'Nombres',
        'lettres': 'Lettres',
        'sort': 'Mode Tri',
        'scenarios': 'Mode Scénarios'
    },

    DIFF_LABELS: {
        // binary apps (bit count)
        '4': 'Facile (4 bits)',
        '6': 'Moyen (6 bits)',
        '8': 'Difficile (8 bits)',
        '10': 'Extrême (10 bits)',
        // generic string levels
        'easy': 'Facile',
        'medium': 'Moyen',
        'hard': 'Difficile',
        'extreme': 'Extrême',
        // bit_de_parite grid sizes
        'grid4': 'Facile (4×4)',
        'grid5': 'Moyen (5×5)',
        'grid6': 'Difficile (6×6)',
        'grid7': 'Extrême (7×7)'
    },

    // Internal sentinel used when difficulty is null/undefined (mode has no levels)
    _NO_DIFF: '_nodiff_',

    _diffKey(difficulty) {
        return (difficulty === null || difficulty === undefined) ? this._NO_DIFF : String(difficulty);
    },



    init(appId) {
        this.appId = appId;
        this.loadStats();
        this.injectModalHtml();

        if (!this._listenerAdded) {
            document.addEventListener('click', (e) => {
                if (e.target.closest('[data-action="show-stats"]')) {
                    this.showModal();
                }
            });
            this._listenerAdded = true;
        }
    },

    loadStats() {
        const data = localStorage.getItem(`c2_stats_${this.appId}`);
        if (data) {
            try {
                this.stats = JSON.parse(data);
                // Clean up obsolete password scores if present
                if (this.stats && this.stats.password) {
                    delete this.stats.password;
                    this.saveStats();
                }
            } catch (e) {
                this.stats = {};
            }
        } else {
            this.stats = {};
        }
    },

    saveStats() {
        localStorage.setItem(`c2_stats_${this.appId}`, JSON.stringify(this.stats));
    },

    ensurePath(mode, difficulty) {
        const key = this._diffKey(difficulty);
        if (!this.stats[mode]) this.stats[mode] = {};
        if (!this.stats[mode][key]) {
            this.stats[mode][key] = {
                totalAttempts: 0,
                totalSuccess: 0,
                firstTrySuccess: 0,
                mistakes: 0,
                streak: 0
            };
        }
    },

    addSuccess(mode, difficulty, mistakesMade) {
        this.ensurePath(mode, difficulty);
        const st = this.stats[mode][this._diffKey(difficulty)];
        st.totalAttempts++;
        st.totalSuccess++;
        if (mistakesMade === 0) {
            st.firstTrySuccess++;
            st.streak = (st.streak || 0) + 1;
            if (st.streak === 3) {
                this.checkAdaptiveDifficulty(mode, difficulty);
            }
        } else {
            st.streak = 0;
        }
        this.saveStats();
    },

    addMistake(mode, difficulty) {
        this.ensurePath(mode, difficulty);
        const st = this.stats[mode][this._diffKey(difficulty)];
        st.mistakes++;
        st.streak = 0;
        this.saveStats();
    },

    checkAdaptiveDifficulty(mode, difficulty) {
        const upgrades = {
            'easy': 'medium',
            'medium': 'hard',
            'hard': 'extreme',
            '4': '6',
            '6': '8',
            '8': '10',
            'grid4': 'grid5',
            'grid5': 'grid6',
            'grid6': 'grid7'
        };
        const diffStr = String(difficulty);
        if (upgrades[diffStr]) {
            const nextDiff = upgrades[diffStr];
            if (this.isDifficultySupported(nextDiff)) {
                const nextDiffLabel = this.DIFF_LABELS[nextDiff] || nextDiff;
                this.showAdaptivePopup(nextDiff, nextDiffLabel, mode);
            }
        }
    },

    isDifficultySupported(nextDiff) {
        if (document.querySelector(`[data-diff="${nextDiff}"]`)) return true;
        const idMap = {
            'easy': ['diff-easy', 'read-diff-easy'],
            'medium': ['diff-medium', 'read-diff-medium'],
            'hard': ['diff-hard', 'read-diff-hard'],
            'extreme': ['diff-extreme', 'read-diff-extreme'],
            '4': ['diff-easy'],
            '6': ['diff-medium'],
            '8': ['diff-hard'],
            '10': ['diff-extreme'],
            'grid4': ['diff-easy'],
            'grid5': ['diff-medium'],
            'grid6': ['diff-hard'],
            'grid7': ['diff-extreme']
        };
        if (idMap[nextDiff]) {
            for (const id of idMap[nextDiff]) {
                if (document.getElementById(id)) return true;
            }
        }
        return false;
    },

    showAdaptivePopup(nextDiffKey, nextDiffLabel, mode) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('noNudges') === '1') return;

        let popup = document.getElementById('adaptive-difficulty-popup');
        if (!popup) {
            const popupHtml = `
                <div id="adaptive-difficulty-popup" class="ui-modal-overlay z-top" aria-hidden="true" role="dialog">
                    <div class="ui-modal-content ui-modal-prompt">
                        <h2>🌟 Niveau maîtrisé !</h2>
                        <p>Tu as réussi ce niveau 3 fois du premier coup. Veux-tu essayer le niveau <strong><span id="adaptive-next-label"></span></strong> ?</p>
                        <div class="ui-modal-prompt-actions">
                            <button id="btn-adaptive-yes" class="btn btn-new">Oui, allons-y !</button>
                            <button id="btn-adaptive-no" class="btn btn-outline-error">Non, je reste ici</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', popupHtml);
            popup = document.getElementById('adaptive-difficulty-popup');

            document.getElementById('btn-adaptive-no').addEventListener('click', () => {
                popup.classList.remove('active');
                popup.setAttribute('aria-hidden', 'true');
            });
        }

        document.getElementById('adaptive-next-label').textContent = nextDiffLabel;

        const btnYes = document.getElementById('btn-adaptive-yes');
        // Remove old listeners by cloning
        const newBtnYes = btnYes.cloneNode(true);
        btnYes.parentNode.replaceChild(newBtnYes, btnYes);

        newBtnYes.addEventListener('click', () => {
            popup.classList.remove('active');
            popup.setAttribute('aria-hidden', 'true');
            window.dispatchEvent(new CustomEvent('c2_change_difficulty', {
                detail: { difficulty: nextDiffKey, mode: mode }
            }));
        });

        // Small delay to allow potential confettis or other animations to be seen before modal
        setTimeout(() => {
            popup.classList.add('active');
            popup.setAttribute('aria-hidden', 'false');
        }, 1500);
    },

    resetScores() {
        if (confirm("Voulez-vous vraiment réinitialiser toutes vos statistiques pour cette application ?")) {
            this.stats = {};
            this.saveStats();
            this.renderModalContent();
        }
    },

    injectModalHtml() {
        if (document.getElementById('score-details-modal')) return;

        const modalHtml = `
            <div id="score-details-modal" class="ui-modal-overlay" aria-hidden="true" role="dialog" aria-labelledby="score-modal-title">
                <div class="ui-modal-content" id="score-modal-content">
                    <h2 id="score-modal-title">📊 Statistiques détaillées</h2>
                    <button class="ui-btn-close" id="btn-close-score-modal" aria-label="Fermer">✖</button>
                    <div id="score-modal-body"></div>
                    <button class="btn-reset-scores" id="btn-reset-scores-action">Réinitialiser les scores</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Attacher les gestionnaires d'événements pour la conformité CSP (pas de onclick inline)
        const closeBtn = document.getElementById('btn-close-score-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        const resetBtn = document.getElementById('btn-reset-scores-action');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetScores());
        }

        this.addSwipeToClose();
    },

    addSwipeToClose() {
        let touchStartX = 0;
        let touchStartY = 0;
        const modalContent = document.getElementById('score-modal-content');
        if (!modalContent) return;

        modalContent.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        modalContent.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const dy = touchEndY - touchStartY;
            const dx = touchEndX - touchStartX;

            const isMobile = window.innerWidth <= 600;

            if (isMobile && dy > 50 && Math.abs(dy) > Math.abs(dx)) {
                this.closeModal(); // Swipe down
            } else if (!isMobile && dx > 50 && Math.abs(dx) > Math.abs(dy)) {
                this.closeModal(); // Swipe right
            }
        }, { passive: true });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('score-details-modal');
                if (modal && modal.classList.contains('active')) {
                    this.closeModal();
                }
            }
        });
    },

    showModal() {
        const modal = document.getElementById('score-details-modal');
        if (!modal) return;
        this.renderModalContent();
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    },

    closeModal() {
        const modal = document.getElementById('score-details-modal');
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    },

    renderModalContent() {
        const body = document.getElementById('score-modal-body');
        if (!body) return;

        body.replaceChildren();

        if (Object.keys(this.stats).length === 0) {
            const p = document.createElement('p');
            p.style.textAlign = 'center';
            p.style.color = 'var(--text-color)';
            p.style.opacity = '0.7';
            p.textContent = 'Aucune statistique enregistrée pour le moment.';
            body.appendChild(p);
            return;
        }

        for (const mode in this.stats) {
            const modeName = this.MODE_LABELS[mode] || mode;
            const diffs = Object.keys(this.stats[mode]);

            let aggSuccess1st = 0;
            let aggSuccessMore = 0;
            let aggMistakes = 0;
            let totalSuccess = 0;

            for (const diff in this.stats[mode]) {
                const st = this.stats[mode][diff];
                aggSuccess1st += Number(st.firstTrySuccess) || 0;
                aggSuccessMore += (Number(st.totalSuccess) || 0) - (Number(st.firstTrySuccess) || 0);
                aggMistakes += Number(st.mistakes) || 0;
                totalSuccess += Number(st.totalSuccess) || 0;
            }

            const totalActions = totalSuccess + aggMistakes;

            const modeContainer = document.createElement('div');
            modeContainer.className = 'stat-mode-container';

            const title = document.createElement('h3');
            title.className = 'stat-mode-title';
            title.textContent = modeName;
            modeContainer.appendChild(title);

            const chartWrapper = document.createElement('div');
            chartWrapper.className = 'stat-chart-wrapper';

            const donutChart = this.generateDonutChart(aggSuccess1st, aggSuccessMore, aggMistakes);
            chartWrapper.appendChild(donutChart);

            const legend = document.createElement('div');
            legend.className = 'stat-legend';

            const createLegendItem = (colorClass, labelText, valueText) => {
                const item = document.createElement('div');
                item.className = 'stat-legend-item';

                const colorDiv = document.createElement('div');
                colorDiv.className = `stat-legend-color ${colorClass}`;

                const labelSpan = document.createElement('span');
                labelSpan.className = 'stat-legend-label';
                labelSpan.textContent = labelText;

                const valueSpan = document.createElement('span');
                valueSpan.className = 'stat-legend-value';
                valueSpan.textContent = valueText;

                item.appendChild(colorDiv);
                item.appendChild(labelSpan);
                item.appendChild(valueSpan);
                return item;
            };

            legend.appendChild(createLegendItem('color-success-1st', 'Réussite (1er coup)', String(aggSuccess1st)));
            legend.appendChild(createLegendItem('color-success-more', 'Réussite (après essai)', String(aggSuccessMore)));
            legend.appendChild(createLegendItem('color-mistakes', 'Erreurs (clics)', String(aggMistakes)));

            const effDiv = document.createElement('div');
            effDiv.style.marginTop = '10px';
            effDiv.style.paddingTop = '10px';
            effDiv.style.borderTop = '1px solid rgba(0,0,0,0.05)';
            effDiv.style.fontSize = '12px';
            effDiv.style.opacity = '0.8';

            const strong = document.createElement('strong');
            strong.textContent = 'Efficacité globale : ';
            effDiv.appendChild(strong);

            const effText = document.createTextNode(`${totalActions > 0 ? Math.round((totalSuccess / totalActions) * 100) : 0}%`);
            effDiv.appendChild(effText);

            legend.appendChild(effDiv);
            chartWrapper.appendChild(legend);
            modeContainer.appendChild(chartWrapper);

            const isNoDiff = diffs.length === 1 && diffs[0] === this._NO_DIFF;
            if (!isNoDiff) {
                const tableWrapper = document.createElement('div');
                tableWrapper.className = 'stat-table-wrapper';

                const table = document.createElement('table');
                table.className = 'stat-table';

                const thead = document.createElement('thead');
                const trHead = document.createElement('tr');
                ['Difficulté', '1er coup', 'Total', 'Erreurs'].forEach(text => {
                    const th = document.createElement('th');
                    th.textContent = text;
                    trHead.appendChild(th);
                });
                thead.appendChild(trHead);
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                for (const diff in this.stats[mode]) {
                    if (diff === this._NO_DIFF) continue;
                    const st = this.stats[mode][diff];
                    const diffName = this.DIFF_LABELS[diff] || diff;

                    const tr = document.createElement('tr');

                    const tdDiff = document.createElement('td');
                    const tdStrong = document.createElement('strong');
                    tdStrong.textContent = diffName;
                    tdDiff.appendChild(tdStrong);
                    tr.appendChild(tdDiff);

                    const td1 = document.createElement('td');
                    td1.textContent = String(st.firstTrySuccess);
                    tr.appendChild(td1);

                    const td2 = document.createElement('td');
                    td2.textContent = String(st.totalSuccess);
                    tr.appendChild(td2);

                    const td3 = document.createElement('td');
                    td3.textContent = String(st.mistakes);
                    tr.appendChild(td3);

                    tbody.appendChild(tr);
                }
                table.appendChild(tbody);
                tableWrapper.appendChild(table);
                modeContainer.appendChild(tableWrapper);
            }
            body.appendChild(modeContainer);
        }

        setTimeout(() => {
            document.querySelectorAll('.stat-donut-circle').forEach(circle => {
                const target = circle.getAttribute('data-target');
                if (target) circle.style.strokeDashoffset = target;
            });
        }, 50);
    },


    generateDonutChart(s1, s2, m) {
        const total = s1 + s2 + m;
        if (total === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'stat-donut-container';
            emptyDiv.style.display = 'flex';
            emptyDiv.style.alignItems = 'center';
            emptyDiv.style.justifyContent = 'center';
            emptyDiv.style.border = '2px dashed rgba(0,0,0,0.1)';
            emptyDiv.style.borderRadius = '50%';
            emptyDiv.style.fontSize = '12px';
            emptyDiv.style.color = 'rgba(0,0,0,0.4)';
            emptyDiv.textContent = 'Aucune donnée';
            return emptyDiv;
        }

        const radius = 50;
        const circ = 2 * Math.PI * radius;

        const p1 = (s1 / total) * 100;
        const p2 = (s2 / total) * 100;
        const p3 = (m / total) * 100;

        const off1 = 0;
        const off2 = (p1 / 100) * circ;
        const off3 = ((p1 + p2) / 100) * circ;

        const createCircle = (percent, offset, colorClass) => {
            const dash = (percent / 100) * circ;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('class', `stat-donut-circle ${colorClass}`);
            circle.setAttribute('cx', '70');
            circle.setAttribute('cy', '70');
            circle.setAttribute('r', String(radius));
            circle.setAttribute('stroke-dasharray', String(circ));
            circle.setAttribute('stroke-dashoffset', String(circ));
            circle.setAttribute('data-target', String(circ - dash));
            circle.setAttribute('style', `transform: rotate(${(offset / circ) * 360}deg); transform-origin: center;`);
            return circle;
        };

        const container = document.createElement('div');
        container.className = 'stat-donut-container';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'stat-donut');
        svg.setAttribute('viewBox', '0 0 140 140');

        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('class', 'stat-donut-bg');
        bgCircle.setAttribute('cx', '70');
        bgCircle.setAttribute('cy', '70');
        bgCircle.setAttribute('r', String(radius));

        svg.appendChild(bgCircle);
        svg.appendChild(createCircle(p1, 0, 'color-success-1st'));
        svg.appendChild(createCircle(p2, (p1/100)*circ, 'color-success-more'));
        svg.appendChild(createCircle(p3, ((p1+p2)/100)*circ, 'color-mistakes'));

        container.appendChild(svg);

        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.textAlign = 'center';
        overlay.style.lineHeight = '1';

        const numberDiv = document.createElement('div');
        numberDiv.style.fontSize = '24px';
        numberDiv.style.fontWeight = '800';
        numberDiv.textContent = String(s1 + s2);

        const labelDiv = document.createElement('div');
        labelDiv.style.fontSize = '10px';
        labelDiv.style.textTransform = 'uppercase';
        labelDiv.style.opacity = '0.6';
        labelDiv.textContent = 'Succès';

        overlay.appendChild(numberDiv);
        overlay.appendChild(labelDiv);

        container.appendChild(overlay);

        return container;
    }
};



window.ScoreManager = ScoreManager;
