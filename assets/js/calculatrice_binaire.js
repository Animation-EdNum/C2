/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

(function () {
    'use strict';

    const POWERS = [128, 64, 32, 16, 8, 4, 2, 1];
    let calcState = [0, 0, 0, 0, 0, 0, 0, 0]; // Index 0 = MSB (128), Index 7 = LSB (1)

    // DOM cache
    let cachedBits = [];
    let cachedBoxes = [];

    function init() {
        buildTable();
        bindEvents();
        updateUI();
    }

    function buildTable() {
        const table = document.getElementById('calc-table');
        if (!table) {
            return;
        }

        const trBits = document.createElement('tr');
        const thBits = document.createElement('th');
        thBits.setAttribute('data-i18n', 'calculatrice_binaire.binary_bits');
        thBits.textContent = window.I18N ? window.I18N.t('calculatrice_binaire.binary_bits', 'Bits') : 'Bits';
        trBits.appendChild(thBits);

        const trPow = document.createElement('tr');
        const thPow = document.createElement('th');
        thPow.setAttribute('data-i18n', 'calculatrice_binaire.powers_of_two');
        thPow.textContent = window.I18N ? window.I18N.t('calculatrice_binaire.powers_of_two', 'Puissances') : 'Puissances';
        trPow.appendChild(thPow);

        const trVals = document.createElement('tr');
        const thVals = document.createElement('th');
        thVals.setAttribute('data-i18n', 'calculatrice_binaire.decimal_values');
        thVals.textContent = window.I18N ? window.I18N.t('calculatrice_binaire.decimal_values', 'Valeurs') : 'Valeurs';
        trVals.appendChild(thVals);

        cachedBits = [];
        cachedBoxes = [];

        for (let i = 0; i < 8; i++) {
            const exp = 7 - i;
            const val = POWERS[i];

            // 1. Bouton bit
            const tdBit = document.createElement('td');
            const btnBit = document.createElement('button');
            btnBit.type = 'button';
            btnBit.className = 'calc-bit';
            btnBit.id = `calc-bit-${i}`;
            btnBit.setAttribute('aria-label', `Basculer bit ${exp} (valeur ${val})`);
            btnBit.textContent = '0';
            tdBit.appendChild(btnBit);
            trBits.appendChild(tdBit);

            // 2. Puissance de 2 (2^exp)
            const tdPow = document.createElement('td');
            tdPow.className = 'calc-power-cell';
            const baseText = document.createTextNode('2');
            const sup = document.createElement('sup');
            sup.textContent = String(exp);
            tdPow.appendChild(baseText);
            tdPow.appendChild(sup);
            trPow.appendChild(tdPow);

            // 3. Boîte valeur décimale
            const tdVal = document.createElement('td');
            const divVal = document.createElement('div');
            divVal.className = 'calc-box';
            divVal.id = `calc-box-${i}`;
            divVal.setAttribute('role', 'button');
            divVal.setAttribute('tabindex', '0');
            divVal.setAttribute('aria-label', `Valeur ${val}, bit ${exp}`);
            divVal.textContent = String(val);
            tdVal.appendChild(divVal);
            trVals.appendChild(tdVal);

            cachedBoxes[i] = divVal;
            cachedBits[i] = btnBit;
        }

        table.replaceChildren(trBits, trPow, trVals);
    }

    function toggleBit(index) {
        if (index < 0 || index >= 8) {
            return;
        }
        calcState[index] = calcState[index] === 1 ? 0 : 1;
        if (typeof window.playSound === 'function') {
            window.playSound('click');
        }
        updateUI();
    }

    function setDecimalValue(num, options = {}) {
        const fromDecInput = typeof options === 'boolean' ? !options : (options.fromDecInput === true);
        const fromBinInput = typeof options === 'object' && options.fromBinInput === true;
        let val = parseInt(num, 10);
        if (isNaN(val)) {
            val = 0;
        }
        if (val < 0) {
            val = 0;
        }
        if (val > 255) {
            val = 255;
        }

        for (let i = 0; i < 8; i++) {
            calcState[i] = (val & (1 << (7 - i))) !== 0 ? 1 : 0;
        }
        updateUI({ fromDecInput, fromBinInput });
    }

    function setBinaryValue(str, options = {}) {
        const fromBinInput = options.fromBinInput === true;
        const fromDecInput = options.fromDecInput === true;
        const clean = String(str || '').replace(/[^01]/g, '').slice(0, 8);
        if (clean.length === 0) {
            calcState = [0, 0, 0, 0, 0, 0, 0, 0];
        } else {
            const padded = clean.padStart(8, '0');
            for (let i = 0; i < 8; i++) {
                calcState[i] = padded[i] === '1' ? 1 : 0;
            }
        }
        updateUI({ fromBinInput, fromDecInput });
    }

    function resetCalc() {
        calcState = [0, 0, 0, 0, 0, 0, 0, 0];
        if (typeof window.playSound === 'function') {
            window.playSound('click');
        }
        updateUI();
    }

    function setAllOnes() {
        calcState = [1, 1, 1, 1, 1, 1, 1, 1];
        if (typeof window.playSound === 'function') {
            window.playSound('click');
        }
        updateUI();
    }

    function invertBits() {
        for (let i = 0; i < 8; i++) {
            calcState[i] = calcState[i] === 1 ? 0 : 1;
        }
        if (typeof window.playSound === 'function') {
            window.playSound('click');
        }
        updateUI();
    }

    function calculateSum() {
        let sum = 0;
        for (let i = 0; i < 8; i++) {
            if (calcState[i] === 1) {
                sum += POWERS[i];
            }
        }
        return sum;
    }

    function updateUI(options = {}) {
        let fromDecInput = false;
        let fromBinInput = false;
        if (typeof options === 'boolean') {
            fromDecInput = !options;
        } else if (options && typeof options === 'object') {
            fromDecInput = options.fromDecInput === true;
            fromBinInput = options.fromBinInput === true;
        }

        const sum = calculateSum();
        const activeParts = [];

        // Mise à jour visuelle des bits et des boîtes
        for (let i = 0; i < 8; i++) {
            const isSet = calcState[i] === 1;
            const bitEl = cachedBits[i];
            const boxEl = cachedBoxes[i];

            if (bitEl) {
                bitEl.textContent = isSet ? '1' : '0';
                if (isSet) {
                    bitEl.classList.add('active');
                } else {
                    bitEl.classList.remove('active');
                }
            }
            if (boxEl) {
                if (isSet) {
                    boxEl.classList.add('selected');
                } else {
                    boxEl.classList.remove('selected');
                }
            }

            if (isSet) {
                activeParts.push(POWERS[i]);
            }
        }

        // Zone de résultat / addition décomposée
        const resultArea = document.getElementById('calc-result-area');
        if (resultArea) {
            if (activeParts.length === 0) {
                const msgSpan = document.createElement('span');
                msgSpan.style.color = 'var(--text-muted, #94a3b8)';
                msgSpan.setAttribute('data-i18n', 'calculatrice_binaire.click_bits');
                msgSpan.textContent = window.I18N ? window.I18N.t('calculatrice_binaire.click_bits', 'Clique sur les bits pour calculer') : 'Clique sur les bits pour calculer';
                resultArea.replaceChildren(msgSpan);
            } else {
                const opDiv = document.createElement('div');
                opDiv.className = 'calc-operation';
                opDiv.textContent = activeParts.join(' + ') + ' = ';

                const sumSpan = document.createElement('span');
                sumSpan.className = 'calc-sum';
                sumSpan.textContent = String(sum);

                opDiv.appendChild(sumSpan);
                resultArea.replaceChildren(opDiv);
            }
        }

        // Saisie décimale synchronisée
        const decInput = document.getElementById('dec-input');
        if (decInput && !fromDecInput) {
            decInput.value = String(sum);
        }

        // Représentation binaire (champ texte ou affichage)
        const rawBin = calcState.join('');
        const binNibbles = `${rawBin.slice(0, 4)} ${rawBin.slice(4)}`;

        const binInput = document.getElementById('bin-input');
        if (binInput && !fromBinInput) {
            binInput.value = binNibbles;
        }

        const binDisplay = document.getElementById('rep-bin-val');
        if (binDisplay) {
            binDisplay.textContent = binNibbles;
        }

        const decDisplay = document.getElementById('rep-dec-val');
        if (decDisplay) {
            decDisplay.textContent = String(sum);
        }
    }

    async function copyToClipboard(text, successMessage) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            if (typeof window.showToast === 'function') {
                window.showToast(successMessage, 'success');
            }
        } catch (e) {
            if (typeof window.showToast === 'function') {
                window.showToast(String(text), 'info');
            }
        }
    }

    function bindEvents() {
        const table = document.getElementById('calc-table');
        if (table) {
            table.addEventListener('click', (e) => {
                const target = e.target;
                if (!target) {
                    return;
                }
                const btn = target.closest('.calc-bit');
                if (btn && btn.id) {
                    const match = btn.id.match(/^calc-bit-(\d+)$/);
                    if (match) {
                        toggleBit(parseInt(match[1], 10));
                        return;
                    }
                }
                const box = target.closest('.calc-box');
                if (box && box.id) {
                    const match = box.id.match(/^calc-box-(\d+)$/);
                    if (match) {
                        toggleBit(parseInt(match[1], 10));
                        return;
                    }
                }
            });

            table.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    const target = e.target;
                    if (!target) {
                        return;
                    }
                    if (target.classList.contains('calc-bit') || target.classList.contains('calc-box')) {
                        e.preventDefault();
                        const match = target.id.match(/\d+$/);
                        if (match) {
                            toggleBit(parseInt(match[0], 10));
                        }
                    }
                }
            });
        }

        // Input décimal (strictement borné à [0, 255])
        const decInput = document.getElementById('dec-input');
        if (decInput) {
            decInput.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey || e.altKey) {
                    return;
                }
                if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                    e.preventDefault();
                }
                if (e.key === 'Enter') {
                    decInput.blur();
                }
            });

            decInput.addEventListener('focus', () => {
                decInput.select();
            });

            decInput.addEventListener('input', () => {
                if (decInput.value === '') {
                    setDecimalValue(0, { fromDecInput: true });
                    return;
                }
                let val = parseInt(decInput.value, 10);
                if (isNaN(val) || val < 0) {
                    val = 0;
                    decInput.value = '0';
                } else if (val > 255) {
                    val = 255;
                    decInput.value = '255';
                    if (typeof window.showToast === 'function') {
                        const msg = window.I18N ? window.I18N.t('calculatrice_binaire.toast_max_val', 'La valeur maximale pour un octet (8 bits) est 255.') : 'La valeur maximale pour un octet (8 bits) est 255.';
                        window.showToast(msg, 'warn');
                    }
                }
                setDecimalValue(val, { fromDecInput: true });
            });

            decInput.addEventListener('change', () => {
                let v = parseInt(decInput.value, 10);
                if (isNaN(v) || v < 0) {
                    v = 0;
                }
                if (v > 255) {
                    v = 255;
                }
                decInput.value = String(v);
                setDecimalValue(v);
            });

            decInput.addEventListener('blur', () => {
                if (decInput.value === '') {
                    decInput.value = '0';
                    setDecimalValue(0);
                }
            });
        }

        // Input binaire (éditable à la main)
        const binInput = document.getElementById('bin-input');
        if (binInput) {
            binInput.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey || e.altKey) {
                    return;
                }
                const allowedKeys = ['0', '1', ' ', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'Enter'];
                if (!allowedKeys.includes(e.key)) {
                    e.preventDefault();
                    return;
                }
                if (e.key === 'Enter') {
                    binInput.blur();
                }
            });

            binInput.addEventListener('focus', () => {
                binInput.select();
            });

            binInput.addEventListener('input', () => {
                const raw = binInput.value;
                const filtered = raw.replace(/[^01 ]/g, '');
                if (raw !== filtered) {
                    binInput.value = filtered;
                }
                setBinaryValue(filtered, { fromBinInput: true });
            });

            binInput.addEventListener('blur', () => {
                const rawBin = calcState.join('');
                binInput.value = `${rawBin.slice(0, 4)} ${rawBin.slice(4)}`;
            });
        }

        // Actions rapides
        const resetBtn = document.getElementById('reset-calc-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetCalc);
        }

        // Boutons de copie
        const copyBinBtn = document.getElementById('btn-copy-bin');
        if (copyBinBtn) {
            copyBinBtn.addEventListener('click', () => {
                const msg = window.I18N ? window.I18N.t('calculatrice_binaire.toast_copied', 'Copié dans le presse-papier !') : 'Copié dans le presse-papier !';
                copyToClipboard(calcState.join(''), msg);
            });
        }

        const copyDecBtn = document.getElementById('btn-copy-dec');
        if (copyDecBtn) {
            copyDecBtn.addEventListener('click', () => {
                const msg = window.I18N ? window.I18N.t('calculatrice_binaire.toast_copied', 'Copié dans le presse-papier !') : 'Copié dans le presse-papier !';
                copyToClipboard(String(calculateSum()), msg);
            });
        }
    }

    // Expose API for external scripts & tests
    window.CalculatriceBinaire = {
        init,
        toggleBit,
        setDecimalValue,
        setBinaryValue,
        resetCalc,
        setAllOnes,
        invertBits,
        calculateSum,
        getState: () => [...calcState]
    };

    // Universal app reset hook for Suite EdNum theme.js
    window.__onResetApp = function () {
        resetCalc();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
