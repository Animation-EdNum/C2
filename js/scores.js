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
        'chal': 'Simulateur',
        'detect': 'Détection d\'erreur'
    },

    DIFF_LABELS: {
        // binary apps (bit count)
        '4': 'Facile (4 bits)',
        '6': 'Moyen (6 bits)',
        '8': 'Difficile (8 bits)',
        // generic string levels
        'easy': 'Facile',
        'medium': 'Moyen',
        'hard': 'Difficile',
        'extreme': 'Extrême',
        // bit_de_parite grid sizes
        'grid4': 'Facile (4×4)',
        'grid5': 'Moyen (5×5)',
        'grid6': 'Difficile (6×6)'
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
                mistakes: 0
            };
        }
    },

    addSuccess(mode, difficulty, mistakesMade) {
        this.ensurePath(mode, difficulty);
        const st = this.stats[mode][this._diffKey(difficulty)];
        st.totalAttempts++;
        st.totalSuccess++;
        if (mistakesMade === 0) st.firstTrySuccess++;
        this.saveStats();
    },

    addMistake(mode, difficulty) {
        this.ensurePath(mode, difficulty);
        this.stats[mode][this._diffKey(difficulty)].mistakes++;
        this.saveStats();
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
            const isNoDiff = diffs.length === 1 && diffs[0] === this._NO_DIFF;

            html += `<h3 class="stat-mode-title">${modeName}</h3>`;

            if (isNoDiff) {
                // Mode without difficulty levels — no Difficulté column
                const st = this.stats[mode][this._NO_DIFF];
                const totalActions = st.totalSuccess + st.mistakes;
                const pctFirstTry = st.totalSuccess > 0 ? Math.round((st.firstTrySuccess / st.totalSuccess) * 100) : 0;
                const pctSuccess = totalActions > 0 ? Math.round((st.totalSuccess / totalActions) * 100) : 0;
                const pctMistakes = totalActions > 0 ? Math.round((st.mistakes / totalActions) * 100) : 0;

                html += `<div class="stat-table-wrapper"><table class="stat-table">
                            <thead><tr>
                                <th>Réussites 1er coup</th>
                                <th>Total réussites</th>
                                <th>Erreurs</th>
                            </tr></thead>
                            <tbody><tr>
                                <td>${st.firstTrySuccess} <span class="stat-pct">(${pctFirstTry}%)</span></td>
                                <td>${st.totalSuccess} <span class="stat-pct">(${pctSuccess}%)</span></td>
                                <td>${st.mistakes} <span class="stat-pct">(${pctMistakes}%)</span></td>
                            </tr></tbody>
                        </table></div>`;
            } else {
                // Mode with difficulty levels
                html += `<div class="stat-table-wrapper"><table class="stat-table">
                            <thead><tr>
                                <th>Difficulté</th>
                                <th>Réussites 1er coup</th>
                                <th>Total réussites</th>
                                <th>Erreurs</th>
                            </tr></thead>
                            <tbody>`;

                for (const diff in this.stats[mode]) {
                    if (diff === this._NO_DIFF) continue;
                    const st = this.stats[mode][diff];
                    const totalActions = st.totalSuccess + st.mistakes;
                    const pctFirstTry = st.totalSuccess > 0 ? Math.round((st.firstTrySuccess / st.totalSuccess) * 100) : 0;
                    const pctSuccess = totalActions > 0 ? Math.round((st.totalSuccess / totalActions) * 100) : 0;
                    const pctMistakes = totalActions > 0 ? Math.round((st.mistakes / totalActions) * 100) : 0;
                    const diffName = this.DIFF_LABELS[diff] || diff;

                    html += `<tr>
                                <td><strong>${diffName}</strong></td>
                                <td>${st.firstTrySuccess} <span class="stat-pct">(${pctFirstTry}%)</span></td>
                                <td>${st.totalSuccess} <span class="stat-pct">(${pctSuccess}%)</span></td>
                                <td>${st.mistakes} <span class="stat-pct">(${pctMistakes}%)</span></td>
                             </tr>`;
                }
                html += `</tbody></table></div>`;
            }
        }

        body.innerHTML = html;
    }
};

window.ScoreManager = ScoreManager;
