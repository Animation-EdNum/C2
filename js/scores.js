/**
 * ScoreManager - Handles detailed scoring stats and rendering of the stats modal.
 */
const ScoreManager = {
    appId: null,
    stats: {}, // structure: { mode: { difficulty: { totalAttempts: 0, totalSuccess: 0, firstTrySuccess: 0, mistakes: 0 } } }

    init(appId) {
        this.appId = appId;
        this.loadStats();
        this.injectModalHtml();
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
        if (!this.stats[mode]) this.stats[mode] = {};
        if (!this.stats[mode][difficulty]) {
            this.stats[mode][difficulty] = {
                totalAttempts: 0,
                totalSuccess: 0,
                firstTrySuccess: 0,
                mistakes: 0
            };
        }
    },

    addSuccess(mode, difficulty, mistakesMade) {
        this.ensurePath(mode, difficulty);
        const st = this.stats[mode][difficulty];
        st.totalAttempts++;
        st.totalSuccess++;
        if (mistakesMade === 0) {
            st.firstTrySuccess++;
        }
        this.saveStats();
    },

    addMistake(mode, difficulty) {
        this.ensurePath(mode, difficulty);
        const st = this.stats[mode][difficulty];
        st.mistakes++;
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
            // Translate mode logic if necessary
            let modeName = mode;
            if (mode === 'dec_to_bin') modeName = 'Décimal → Binaire';
            if (mode === 'bin_to_dec') modeName = 'Binaire → Décimal';
            if (mode === 'encode') modeName = 'Encodage';
            if (mode === 'decode') modeName = 'Décodage';
            if (mode === 'train') modeName = 'Entraînement';
            if (mode === 'path') modeName = 'Routage';
            if (mode === 'chal') modeName = 'Simulateur';

            html += `<h3 class="stat-mode-title">${modeName}</h3>`;
            html += `<div class="stat-table-wrapper"><table class="stat-table">
                        <thead>
                            <tr>
                                <th>Difficulté</th>
                                <th>Réussites 1er coup</th>
                                <th>Total réussites</th>
                                <th>Erreurs</th>
                            </tr>
                        </thead>
                        <tbody>`;

            for (const diff in this.stats[mode]) {
                const st = this.stats[mode][diff];
                const totalAttempts = st.totalAttempts || 1; // Prevent division by zero for percentage

                let diffName = diff;
                if (diff === '4') diffName = 'Facile (4 bits)';
                if (diff === '7') diffName = 'Moyen (7 bits)';
                if (diff === '8') diffName = 'Difficile (8 bits)';
                if (diff === 'easy') diffName = 'Facile';
                if (diff === 'medium') diffName = 'Moyen';
                if (diff === 'hard') diffName = 'Difficile';
                if (diff === 'extreme') diffName = 'Extrême';

                const totalActions = st.totalSuccess + st.mistakes;
                const pctFirstTry = st.totalSuccess > 0 ? Math.round((st.firstTrySuccess / st.totalSuccess) * 100) : 0;
                const pctTotalSuccess = totalActions > 0 ? Math.round((st.totalSuccess / totalActions) * 100) : 0;
                const pctMistakes = totalActions > 0 ? Math.round((st.mistakes / totalActions) * 100) : 0;

                html += `<tr>
                            <td><strong>${diffName}</strong></td>
                            <td>${st.firstTrySuccess} <span class="stat-pct">(${pctFirstTry}%)</span></td>
                            <td>${st.totalSuccess} <span class="stat-pct">(${pctTotalSuccess}%)</span></td>
                            <td>${st.mistakes} <span class="stat-pct">(${pctMistakes}%)</span></td>
                         </tr>`;
            }
            html += `</tbody></table></div>`;
        }

        body.innerHTML = html;
    }
};

window.ScoreManager = ScoreManager;
