/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */

(function () {
    'use strict';

    // ==========================================
    // CONSTANTS & WEAK PATTERN DICTIONARIES
    // ==========================================
    const COMMON_WEAK_WORDS = [
        'password', 'motdepasse', 'pass', 'admin', 'login', '123456', '12345678', '123456789',
        'azerty', 'qwerty', 'abcdef', 'iloveyou', 'letmein', 'welcome', 'monkey', 'dragon',
        'master', 'football', 'shadow', 'sunshine', 'princess', 'soleil', 'bonjour', 'chocolat',
        'secret', 'test', 'superman', 'batman', 'pokemon'
    ];

    const COMMON_SEQUENCES = [
        '12', '21', '123', '321', '1234', '2345', '3456', '4567', '5678', '6789', '7890',
        '111', '222', '333', '444', '555', '666', '777', '888', '999', '000',
        'abcd', 'bcde', 'cdef', 'defg', 'efgh', 'fghi', 'ghij', 'hijk', 'ijkl', 'jklm',
        'klmn', 'lmno', 'mnop', 'nopq', 'opqr', 'pqrs', 'qrst', 'rstu', 'stuv', 'tuvw', 'uvwx', 'vwxy', 'wxyz',
        'azer', 'zert', 'erty', 'rtyu', 'tyui', 'yuio', 'uiop',
        'qsdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl',
        'wxcv', 'xcvb', 'cvbn',
        'qwer', 'wert', 'asdf', 'zxcv'
    ];

    // ==========================================
    // DOM REFERENCES
    // ==========================================
    const elPasswordInput = document.getElementById('password-input');
    const elPasswordToggle = document.getElementById('password-toggle');
    const elPasswordCopy = document.getElementById('password-copy');
    const elStrengthBar = document.getElementById('strength-bar');
    const elStrengthStatus = document.getElementById('strength-status');
    const elColoredPreview = document.getElementById('password-colored-preview');
    const elPatternWarning = document.getElementById('pattern-warning');
    const elGaugeFill = document.getElementById('gauge-fill');
    const elGaugeBadge = document.getElementById('gauge-badge');
    const elTimeEstimate = document.getElementById('time-estimate-text');
    const elProjectionBtn = document.getElementById('projection-toggle-btn');
    const elProjectionText = document.getElementById('projectionToggleText');
    const elElementsOrderContainer = document.getElementById('elements-order-container');
    const elGenerateBtn = document.getElementById('generate-pw-btn');

    const elBaseWordInput = document.getElementById('generator-base-word');
    const elNumberInput = document.getElementById('generator-number');
    const elServiceInput = document.getElementById('generator-service');
    const elSpecCharInput = document.getElementById('generator-special-char');
    const elMinLengthSlider = document.getElementById('generator-min-length');
    const elMinLengthVal = document.getElementById('min-length-val');

    // ==========================================
    // STATE
    // ==========================================
    let passwordUnlocked = false;
    let elementsOrder = ['word', 'number', 'service'];
    let lastGeneratedParts = null;

    // ==========================================
    // WEAK PATTERNS DETECTION
    // ==========================================
    function detectWeakPatterns(pw) {
        if (!pw) return [];
        const warnings = [];
        const lower = pw.toLowerCase();

        // 1. Common weak dictionary words
        for (const w of COMMON_WEAK_WORDS) {
            if (lower.includes(w)) {
                warnings.push(`Contient un mot trop classique ou prévisible (« ${w} »).`);
                break;
            }
        }

        // 2. Keyboard sequences (4+ keys in sequence)
        for (const seq of COMMON_SEQUENCES) {
            if (lower.includes(seq)) {
                warnings.push(`Contient une suite de clavier ou de chiffres évidente (« ${seq} »).`);
                break;
            }
        }

        // 3. Repeated characters (3+ identical characters in a row, e.g., 'aaa', '111', '!!!')
        const repeatMatch = pw.match(/(.)\1{2,}/);
        if (repeatMatch) {
            warnings.push(`Contient des répétitions de caractères consécutifs (« ${repeatMatch[0]} »).`);
        }

        return warnings;
    }

    // ==========================================
    // CRACK TIME ESTIMATION (REFINED)
    // ==========================================
    function estimateCrackTime(pw, patterns = []) {
        if (!pw) return "instantané";

        const len = pw.length;
        const hasUpper = /[A-Z]/.test(pw);
        const hasLower = /[a-z]/.test(pw);
        const hasNumber = /[0-9]/.test(pw);
        const hasSpecial = /[^A-Za-z0-9]/.test(pw);
        const typesCount = (hasUpper ? 1 : 0) + (hasLower ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0);

        let poolSize = 0;
        if (hasLower) poolSize += 26;
        if (hasUpper) poolSize += 26;
        if (hasNumber) poolSize += 10;
        if (hasSpecial) poolSize += 32;
        if (poolSize === 0) poolSize = 1;

        let combinations = Math.pow(poolSize, len);

        // Apply dictionary/pattern discount if it contains repeated sub-strings
        let hasRepeatedPattern = false;
        for (let i = 2; i <= Math.floor(len / 2); i++) {
            let sub = pw.substring(0, i);
            const escaped = sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (pw.replace(new RegExp(escaped, 'g'), '').length === 0) {
                hasRepeatedPattern = true;
                break;
            }
        }
        if (hasRepeatedPattern) {
            combinations = Math.pow(poolSize, Math.floor(len / 2));
        }

        // Penalty for detected weak patterns
        if (patterns.length > 0) {
            combinations = combinations / Math.pow(1000, patterns.length);
        }

        // Conservative: assume a multi-GPU rig with a fast hash (MD5/NTLM)
        const guessesPerSecond = 1e12; // 1 trillion guesses/sec
        let seconds = combinations / guessesPerSecond;

        // Enforce realistic bounds based on length and types
        if (len < 8 || patterns.length >= 2) {
            seconds = Math.min(seconds, 5);
        } else if (len < 12) {
            if (typesCount < 3 || patterns.length > 0) {
                seconds = Math.min(seconds, 3600);
            } else {
                seconds = Math.min(seconds, 86400 * 7);
            }
        } else { // len >= 12
            if (typesCount < 3) {
                seconds = Math.min(seconds, 86400 * 30);
            } else if (patterns.length > 0) {
                seconds = Math.min(seconds, 86400 * 180);
            }
        }

        if (seconds < 1) {
            return "instantané";
        } else if (seconds < 60) {
            return "quelques secondes";
        } else if (seconds < 3600) {
            return "quelques minutes";
        } else if (seconds < 86400) {
            return "quelques heures";
        } else if (seconds < 2592000) {
            return "quelques jours";
        } else if (seconds < 31536000) {
            return "quelques mois";
        } else if (seconds < 3153600000) {         // < 100 years
            return "quelques années";
        } else if (seconds < 3.1536e12) {          // < 100 000 years
            return "des siècles";
        } else if (seconds < 3.1536e16) {          // < 1 billion years
            return "des millions d'années";
        } else {
            return "des milliards d'années";
        }
    }

    // ==========================================
    // GENERATOR LOGIC
    // ==========================================
    function generatePedagogicalPassword(word, number, service, specChar, order, minLength) {
        if (!word || word.length < 4) return { password: "", parts: null };

        const serviceAbbr = service ? service.substring(0, 4).toLowerCase() : "";
        const serviceBlock = specChar + serviceAbbr;
        const otherLength = number.length + serviceBlock.length;
        const k = Math.max(1, Math.ceil((minLength - otherLength) / word.length));

        // Capitalize deterministically for memorability:
        // - All lowercase or all uppercase → first letter uppercase, rest lowercase
        // - Mixed case → keep as entered by the student
        let modifiedBase;
        const isAllLower = word === word.toLowerCase();
        const isAllUpper = word === word.toUpperCase();
        if (isAllLower || isAllUpper) {
            modifiedBase = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
            modifiedBase = word;
        }
        let modifiedWord = modifiedBase.repeat(k);

        const parts = {
            word: modifiedWord,
            number: number,
            service: serviceBlock
        };

        let pw = order.map(key => parts[key]).join('');
        return { password: pw, parts: parts };
    }

    function renderColoredPreview(parts, order) {
        if (!elColoredPreview) return;

        if (!parts || !parts.word) {
            elColoredPreview.innerHTML = '';
            elColoredPreview.style.display = 'none';
            return;
        }

        elColoredPreview.innerHTML = '';
        const blockConfig = {
            word: { className: 'pw-block-word', label: 'Mot' },
            number: { className: 'pw-block-number', label: 'Nombre' },
            service: { className: 'pw-block-service', label: 'Caractère / Service' }
        };

        for (const key of order) {
            const text = parts[key];
            if (text) {
                const span = document.createElement('span');
                span.className = `pw-block ${blockConfig[key].className}`;
                span.textContent = text;
                span.title = `${blockConfig[key].label} : ${text}`;
                elColoredPreview.appendChild(span);
            }
        }
        elColoredPreview.style.display = 'flex';
    }

    function autoGeneratePassword() {
        const baseWord = elBaseWordInput.value.trim();
        const numberVal = elNumberInput.value.trim();
        const serviceVal = elServiceInput.value.trim();
        const specChar = elSpecCharInput.value;
        const minLength = parseInt(elMinLengthSlider.value, 10);

        if (baseWord.length >= 4 && /^\d{1,4}$/.test(numberVal)) {
            const res = generatePedagogicalPassword(baseWord, numberVal, serviceVal, specChar, elementsOrder, minLength);
            lastGeneratedParts = res.parts;
            elPasswordInput.value = res.password;
            updatePasswordChecklist(res.password, res.parts);
        } else {
            lastGeneratedParts = null;
            elPasswordInput.value = '';
            updatePasswordChecklist('', null);
        }
    }

    // ==========================================
    // UI UPDATES & CHECKLIST EVALUATION
    // ==========================================
    function updateCriterionUI(id, isOk) {
        const item = document.getElementById(id);
        if (!item) return;
        const icon = item.querySelector('.crit-icon');

        if (isOk) {
            item.classList.add('ok');
            if (icon) icon.className = 'crit-icon crit-ok';
        } else {
            item.classList.remove('ok');
            if (icon) icon.className = 'crit-icon crit-ko';
        }
    }

    function updatePasswordChecklist(pw, parts = null) {
        // Rules
        const hasLength = pw.length >= 12;
        const hasUpper = /[A-Z]/.test(pw);
        const hasLower = /[a-z]/.test(pw);
        const hasNumber = /[0-9]/.test(pw);
        const hasSpecial = /[^A-Za-z0-9]/.test(pw);

        const typesCount = (hasUpper ? 1 : 0) + (hasLower ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0);
        const hasTypes = typesCount >= 3;

        updateCriterionUI('crit-length', hasLength);
        updateCriterionUI('crit-types', hasTypes);
        updateCriterionUI('crit-upper', hasUpper);
        updateCriterionUI('crit-lower', hasLower);
        updateCriterionUI('crit-number', hasNumber);
        updateCriterionUI('crit-special', hasSpecial);

        // Pattern warnings
        const patterns = detectWeakPatterns(pw);
        if (elPatternWarning) {
            if (patterns.length > 0) {
                elPatternWarning.innerHTML = `
                    <div class="pattern-warning-title">⚠️ <strong>Motif détecté :</strong></div>
                    <ul class="pattern-warning-list">
                        ${patterns.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                `;
                elPatternWarning.style.display = 'block';
            } else {
                elPatternWarning.innerHTML = '';
                elPatternWarning.style.display = 'none';
            }
        }

        // Strength calculations
        let score = 0;
        if (pw.length > 0) {
            // Length up to 40 points
            if (hasLength) {
                score += 40;
            } else {
                score += Math.min(20, Math.floor((pw.length / 12) * 20));
            }

            // Types up to 60 points
            score += Math.min(60, typesCount * 20);

            // Penalty for weak patterns
            if (patterns.length > 0) {
                score = Math.max(5, score - (patterns.length * 15));
            }
        }

        // Adjust fill and labels
        elStrengthBar.style.width = `${score}%`;

        let color = 'var(--error)';
        let status = 'Vide';

        if (score === 0 && pw.length > 0) {
            status = 'Très faible ❌';
        } else if (score > 0 && score <= 40) {
            status = 'Faible ⚠️';
            color = 'var(--error)';
        } else if (score > 40 && score <= 60) {
            status = 'Moyen 🔏';
            color = 'var(--warn)';
        } else if (score > 60 && score < 100) {
            status = 'Fort 👍';
            color = 'var(--accent)';
        } else if (score === 100) {
            status = 'Très fort ! 💪';
            color = 'var(--success)';
        }

        elStrengthBar.style.backgroundColor = color;
        elStrengthStatus.textContent = status;

        // Is the password secure?
        const isSecure = hasLength && hasTypes && patterns.length === 0;

        // Progressive SVG Gauge color & fill
        let gaugeColor = '#ef4444';
        if (score <= 35) {
            gaugeColor = '#ef4444';
        } else if (score <= 65) {
            gaugeColor = '#f59e0b';
        } else if (score <= 85) {
            gaugeColor = '#3b82f6';
        } else if (isSecure) {
            gaugeColor = '#10b981';
        } else {
            gaugeColor = '#f59e0b';
        }

        const fillPercent = isSecure ? 100 : Math.min(85, Math.max(10, Math.floor(score * 0.8)));
        const dashoffset = 251.3 - (251.3 * fillPercent / 100);

        if (elGaugeFill) {
            elGaugeFill.style.strokeDashoffset = dashoffset;
            elGaugeFill.style.stroke = gaugeColor;
        }

        if (elGaugeBadge) {
            if (isSecure) {
                elGaugeBadge.className = 'gauge-badge secure';
                elGaugeBadge.textContent = 'Fort';
            } else {
                elGaugeBadge.className = 'gauge-badge vulnerable';
                elGaugeBadge.textContent = 'Vulnérable';
            }
        }

        // Crack time estimation
        const timeStr = estimateCrackTime(pw, patterns);
        if (elTimeEstimate) {
            elTimeEstimate.innerHTML = `<strong>${timeStr}</strong> pour pirater ce mot de passe`;
        }

        // Colored preview rendering
        const expectedGeneratedPw = parts ? elementsOrder.map(k => parts[k]).join('') : null;
        if (parts && pw === expectedGeneratedPw) {
            renderColoredPreview(parts, elementsOrder);
        } else {
            renderColoredPreview(null, elementsOrder);
        }

        // Handle success audio & confetti
        if (isSecure && !passwordUnlocked) {
            passwordUnlocked = true;
            if (typeof playSound === 'function') playSound('success');
            if (typeof launchConfetti === 'function') launchConfetti();
        } else if (!isSecure && passwordUnlocked) {
            passwordUnlocked = false;
        }
    }

    // ==========================================
    // ELEMENTS ORDER & KEYBOARD NAVIGATION
    // ==========================================
    function moveElement(index, direction, refocus = false) {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= elementsOrder.length) return;

        const temp = elementsOrder[index];
        elementsOrder[index] = elementsOrder[targetIndex];
        elementsOrder[targetIndex] = temp;

        renderElementsOrder();
        autoGeneratePassword();

        if (refocus) {
            setTimeout(() => {
                const items = elElementsOrderContainer.querySelectorAll('.order-item');
                if (items[targetIndex]) {
                    items[targetIndex].focus();
                }
            }, 50);
        }
    }

    let draggedIndex = null;

    function renderElementsOrder() {
        if (!elElementsOrderContainer) return;

        elElementsOrderContainer.innerHTML = '';
        elElementsOrderContainer.setAttribute('role', 'list');
        elElementsOrderContainer.setAttribute('aria-label', 'Ordre des blocs du mot de passe');

        const labels = {
            word: { text: 'Mot', name: 'Mot' },
            number: { text: 'Nombre', name: 'Nombre' },
            service: { text: 'Caractère', name: 'Caractère / Service' }
        };

        const specChar = elSpecCharInput.value;
        const serviceVal = elServiceInput.value.trim();
        const serviceAbbr = serviceVal ? serviceVal.substring(0, 4).toLowerCase() : "";
        const servicePreviewText = specChar + serviceAbbr;

        let serviceText = "";
        if (serviceVal) {
            serviceText = servicePreviewText;
        } else if (specChar) {
            serviceText = specChar;
        } else {
            serviceText = "Caractère";
        }
        labels.service.text = serviceText;

        for (let i = 0; i < elementsOrder.length; i++) {
            const key = elementsOrder[i];
            const item = document.createElement('div');
            item.className = 'order-item';
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'listitem');
            item.setAttribute('draggable', 'true');
            item.setAttribute('aria-label', `${labels[key].name}, position ${i + 1} sur ${elementsOrder.length}. Glisse-dépose ou utilise les flèches pour déplacer.`);

            // HTML5 Drag and Drop
            item.addEventListener('dragstart', (e) => {
                draggedIndex = i;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', i.toString());
                setTimeout(() => item.classList.add('dragging'), 0);
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                const allItems = elElementsOrderContainer.querySelectorAll('.order-item');
                allItems.forEach(el => el.classList.remove('drag-over', 'dragging'));
                draggedIndex = null;
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (draggedIndex !== null && draggedIndex !== i) {
                    item.classList.add('drag-over');
                }
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
                if (draggedIndex !== null && draggedIndex !== i) {
                    const movedItem = elementsOrder.splice(draggedIndex, 1)[0];
                    elementsOrder.splice(i, 0, movedItem);
                    if (typeof playSound === 'function') playSound('click');
                    renderElementsOrder();
                    autoGeneratePassword();
                }
            });

            // Keyboard navigation (ArrowLeft / ArrowRight)
            item.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' && i > 0) {
                    e.preventDefault();
                    if (typeof playSound === 'function') playSound('click');
                    moveElement(i, -1, true);
                } else if (e.key === 'ArrowRight' && i < elementsOrder.length - 1) {
                    e.preventDefault();
                    if (typeof playSound === 'function') playSound('click');
                    moveElement(i, 1, true);
                }
            });

            // Left Arrow Button (◀)
            if (i > 0) {
                const leftBtn = document.createElement('button');
                leftBtn.className = 'order-arrow-btn';
                leftBtn.type = 'button';
                leftBtn.setAttribute('draggable', 'false');
                leftBtn.innerHTML = '◀';
                leftBtn.title = 'Déplacer à gauche';
                leftBtn.setAttribute('aria-label', `Déplacer ${labels[key].name} à gauche`);
                leftBtn.setAttribute('tabindex', '-1');
                leftBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (typeof playSound === 'function') playSound('click');
                    moveElement(i, -1, false);
                });
                item.appendChild(leftBtn);
            }

            // Text
            const span = document.createElement('span');
            span.textContent = labels[key].text;
            item.appendChild(span);

            // Right Arrow Button (▶)
            if (i < elementsOrder.length - 1) {
                const rightBtn = document.createElement('button');
                rightBtn.className = 'order-arrow-btn';
                rightBtn.type = 'button';
                rightBtn.setAttribute('draggable', 'false');
                rightBtn.innerHTML = '▶';
                rightBtn.title = 'Déplacer à droite';
                rightBtn.setAttribute('aria-label', `Déplacer ${labels[key].name} à droite`);
                rightBtn.setAttribute('tabindex', '-1');
                rightBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (typeof playSound === 'function') playSound('click');
                    moveElement(i, 1, false);
                });
                item.appendChild(rightBtn);
            }

            elElementsOrderContainer.appendChild(item);
        }

        window.fa?.createIcons?.();
    }

    // ==========================================
    // PROJECTION / TBI MODE
    // ==========================================
    function setProjectionMode(active) {
        if (active) {
            document.body.classList.add('projection');
            if (elProjectionText) elProjectionText.textContent = 'Mode normal';
        } else {
            document.body.classList.remove('projection');
            if (elProjectionText) elProjectionText.textContent = 'Mode TBI';
        }
    }

    function toggleProjectionMode() {
        const isProj = document.body.classList.contains('projection');
        setProjectionMode(!isProj);
        if (typeof playSound === 'function') playSound('click');
    }

    if (elProjectionBtn) {
        elProjectionBtn.addEventListener('click', toggleProjectionMode);
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    if (elGenerateBtn) {
        elGenerateBtn.addEventListener('click', () => {
            const baseWord = elBaseWordInput.value.trim();
            const numberVal = elNumberInput.value.trim();
            const serviceVal = elServiceInput.value.trim();
            const specChar = elSpecCharInput.value;
            const minLength = parseInt(elMinLengthSlider.value, 10);

            if (baseWord.length < 4) {
                if (typeof showToast === 'function') showToast('Le mot de base doit contenir au moins 4 caractères.', 'error');
                return;
            }
            if (!numberVal || !/^\d{1,4}$/.test(numberVal)) {
                if (typeof showToast === 'function') showToast('Veuillez donner un nombre entre 1 et 4 chiffres.', 'error');
                return;
            }

            const res = generatePedagogicalPassword(baseWord, numberVal, serviceVal, specChar, elementsOrder, minLength);
            lastGeneratedParts = res.parts;
            elPasswordInput.value = res.password;

            if (elPasswordInput.type === 'password') {
                elPasswordToggle.click();
            }

            updatePasswordChecklist(res.password, res.parts);
            if (typeof showToast === 'function') showToast('Mot de passe généré !', 'success');
        });
    }

    // Copy button with masked preview
    if (elPasswordCopy) {
        elPasswordCopy.addEventListener('click', () => {
            const val = elPasswordInput.value;
            if (!val) {
                if (typeof showToast === 'function') showToast('Aucun mot de passe à copier.', 'warn');
                return;
            }
            navigator.clipboard.writeText(val).then(() => {
                const masked = val.length <= 6
                    ? val[0] + '•'.repeat(val.length - 1)
                    : val.substring(0, 3) + '•••' + val.substring(val.length - 2);
                if (typeof showToast === 'function') {
                    showToast(`Copié : ${masked}`, 'success');
                }
                if (typeof playSound === 'function') playSound('click');
            }).catch(() => {
                if (typeof showToast === 'function') showToast('Impossible de copier automatiquement.', 'error');
            });
        });
    }

    // Generator inputs live reactions
    [elBaseWordInput, elNumberInput, elServiceInput, elSpecCharInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                renderElementsOrder();
                autoGeneratePassword();
            });
        }
    });

    if (elMinLengthSlider) {
        elMinLengthSlider.addEventListener('input', (e) => {
            if (elMinLengthVal) {
                elMinLengthVal.textContent = e.target.value + ' caractères';
            }
            autoGeneratePassword();
        });
    }

    // Password input toggle (eye / eye-slash)
    if (elPasswordToggle) {
        elPasswordToggle.addEventListener('click', () => {
            if (elPasswordInput.type === 'password') {
                elPasswordInput.type = 'text';
                elPasswordToggle.innerHTML = '<i data-fa="dt-eye-slash"></i>';
            } else {
                elPasswordInput.type = 'password';
                elPasswordToggle.innerHTML = '<i data-fa="dt-eye"></i>';
            }
            window.fa?.createIcons?.();
        });
    }

    // Manual typing inside password input
    if (elPasswordInput) {
        elPasswordInput.addEventListener('input', () => {
            updatePasswordChecklist(elPasswordInput.value, null);
        });
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================
    renderElementsOrder();
    updatePasswordChecklist('', null);

    // URL parameter detection for TBI mode
    try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'tbi' || urlParams.get('tbi') === '1' || urlParams.get('projection') === '1') {
            setProjectionMode(true);
        }
    } catch (e) {
        // ignore
    }

})();
