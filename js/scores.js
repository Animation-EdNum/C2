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
        'chal': 'Défis',
        'read': 'Lecture de code',
        'detect': 'Détection d\'erreur',
        'simulator': 'Simulateur'
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

        const statsBtn = document.getElementById('score-manager-btn');
        if (statsBtn) {
            statsBtn.addEventListener('click', () => this.showModal());
        }
    },

    loadStats() {
        const data = localStorage.getItem(`c2_stats_${this.appId}`);
        if (data) {
            try {
                this.stats = JSON.parse(data);
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
            const nextDiffLabel = this.DIFF_LABELS[nextDiff] || nextDiff;
            this.showAdaptivePopup(nextDiff, nextDiffLabel, mode);
        }
    },

    showAdaptivePopup(nextDiffKey, nextDiffLabel, mode) {
        let popup = document.getElementById('adaptive-difficulty-popup');
        if (!popup) {
            const popupHtml = `
                <div id="adaptive-difficulty-popup" class="modal-overlay" aria-hidden="true" role="dialog" style="z-index: 10001;">
                    <div class="modal-content" style="max-width: 400px; text-align: center;">
                        <h2 style="margin-bottom: 15px;">🌟 Niveau maîtrisé !</h2>
                        <p style="margin-bottom: 20px;">Tu as réussi ce niveau 3 fois du premier coup. Veux-tu essayer le niveau <strong><span id="adaptive-next-label"></span></strong> ?</p>
                        <div style="display: flex; gap: 10px; justify-content: center;">
                            <button id="btn-adaptive-yes" class="btn-new" style="flex: 1;">Oui, allons-y !</button>
                            <button id="btn-adaptive-no" class="btn-outline-error" style="flex: 1;">Non, je reste ici</button>
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
            <div id="score-details-modal" class="modal-overlay" aria-hidden="true" role="dialog" aria-labelledby="score-modal-title">
                <div class="modal-content">
                    <h2 id="score-modal-title">📊 Statistiques détaillées</h2>
                    <button class="btn-close-modal" onclick="ScoreManager.closeModal()" aria-label="Fermer">✖</button>
                    <div id="score-modal-body"></div>
                    <button class="btn-reset-scores" onclick="ScoreManager.resetScores()">Réinitialiser les scores</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
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

        if (Object.keys(this.stats).length === 0) {
            body.innerHTML = '<p style="text-align: center; color: var(--text-color); opacity: 0.7;">Aucune statistique enregistrée pour le moment.</p>';
            return;
        }

        let html = '';
        for (const mode in this.stats) {
            const modeName = this.MODE_LABELS[mode] || mode;
            const diffs = Object.keys(this.stats[mode]);

            // Aggregation for the chart
            let aggSuccess1st = 0;
            let aggSuccessMore = 0;
            let aggMistakes = 0;
            let totalSuccess = 0;

            for (const diff in this.stats[mode]) {
                const st = this.stats[mode][diff];
                aggSuccess1st += st.firstTrySuccess;
                aggSuccessMore += (st.totalSuccess - st.firstTrySuccess);
                aggMistakes += st.mistakes;
                totalSuccess += st.totalSuccess;
            }

            const totalActions = totalSuccess + aggMistakes;

            html += `<div class="stat-mode-container">
                        <h3 class="stat-mode-title">${modeName}</h3>
                        <div class="stat-chart-wrapper">
                            ${this.generateDonutChart(aggSuccess1st, aggSuccessMore, aggMistakes)}
                            <div class="stat-legend">
                                <div class="stat-legend-item">
                                    <div class="stat-legend-color color-success-1st"></div>
                                    <span class="stat-legend-label">Réussite (1er coup)</span>
                                    <span class="stat-legend-value">${aggSuccess1st}</span>
                                </div>
                                <div class="stat-legend-item">
                                    <div class="stat-legend-color color-success-more"></div>
                                    <span class="stat-legend-label">Réussite (après essai)</span>
                                    <span class="stat-legend-value">${aggSuccessMore}</span>
                                </div>
                                <div class="stat-legend-item">
                                    <div class="stat-legend-color color-mistakes"></div>
                                    <span class="stat-legend-label">Erreurs (clics)</span>
                                    <span class="stat-legend-value">${aggMistakes}</span>
                                </div>
                                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.05); font-size: 12px; opacity: 0.8;">
                                    <strong>Efficacité globale :</strong> ${totalActions > 0 ? Math.round((totalSuccess / totalActions) * 100) : 0}%
                                </div>
                            </div>
                        </div>`;

            // Detailed table
            const isNoDiff = diffs.length === 1 && diffs[0] === this._NO_DIFF;
            if (!isNoDiff) {
                html += `<div class="stat-table-wrapper"><table class="stat-table">
                            <thead><tr>
                                <th>Difficulté</th>
                                <th>1er coup</th>
                                <th>Total</th>
                                <th>Erreurs</th>
                            </tr></thead>
                            <tbody>`;

                for (const diff in this.stats[mode]) {
                    if (diff === this._NO_DIFF) continue;
                    const st = this.stats[mode][diff];
                    const diffName = this.DIFF_LABELS[diff] || diff;

                    html += `<tr>
                                <td><strong>${diffName}</strong></td>
                                <td>${st.firstTrySuccess}</td>
                                <td>${st.totalSuccess}</td>
                                <td>${st.mistakes}</td>
                             </tr>`;
                }
                html += `</tbody></table></div>`;
            }
            html += `</div>`;
        }

        body.innerHTML = html;

        // Trigger animation reset by re-setting stroke-dashoffset after a short delay
        setTimeout(() => {
            document.querySelectorAll('.stat-donut-circle').forEach(circle => {
                const target = circle.getAttribute('data-target');
                if (target) circle.style.strokeDashoffset = target;
            });
        }, 50);
    },

    generateDonutChart(s1, s2, m) {
        const total = s1 + s2 + m;
        if (total === 0) return `<div class="stat-donut-container" style="display:flex; align-items:center; justify-content:center; border: 2px dashed rgba(0,0,0,0.1); border-radius:50%; font-size:12px; color:rgba(0,0,0,0.4);">Aucune donnée</div>`;

        const radius = 50;
        const circ = 2 * Math.PI * radius;

        const p1 = (s1 / total) * 100;
        const p2 = (s2 / total) * 100;
        const p3 = (m / total) * 100;

        // Cumulative offsets
        const off1 = 0;
        const off2 = (p1 / 100) * circ;
        const off3 = ((p1 + p2) / 100) * circ;

        const drawSegment = (percent, offset, colorClass) => {
            const dash = (percent / 100) * circ;
            // Use negative dashoffset for cumulative segments
            return `<circle class="stat-donut-circle ${colorClass}"
                        cx="70" cy="70" r="${radius}"
                        stroke-dasharray="${circ}"
                        stroke-dashoffset="${circ}"
                        data-target="${circ - dash}"
                        style="transform: rotate(${(offset / circ) * 360}deg); transform-origin: center;">
                    </circle>`;
        };

        return `
            <div class="stat-donut-container">
                <svg class="stat-donut" viewBox="0 0 140 140">
                    <circle class="stat-donut-bg" cx="70" cy="70" r="${radius}"></circle>
                    ${drawSegment(p1, 0, 'color-success-1st')}
                    ${drawSegment(p2, (p1/100)*circ, 'color-success-more')}
                    ${drawSegment(p3, ((p1+p2)/100)*circ, 'color-mistakes')}
                </svg>
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center; line-height:1;">
                    <div style="font-size:24px; font-weight:800;">${s1+s2}</div>
                    <div style="font-size:10px; text-transform:uppercase; opacity:0.6;">Succès</div>
                </div>
            </div>
        `;
    }
};

window.ScoreManager = ScoreManager;
