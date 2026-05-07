import sys

filepath = 'webapps/bit_de_parite.html'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
            for (let i = 0; i < gridSize; i++) {
                let sum = trainData[i].reduce((a, b) => a + b, 0) + (trainAnswers[i][gridSize] || 0);
                if (trainAnswers[i][gridSize] === null || sum % 2 !== 0) {
                    hasError = true; getCell(i, gridSize).classList.add('cell-error');
                } else { getCell(i, gridSize).classList.add('cell-correct'); }
            }

            for (let j = 0; j < gridSize; j++) {
                let sum = trainAnswers[gridSize][j] || 0;
                for (let i = 0; i < gridSize; i++) sum += trainData[i][j];
                if (trainAnswers[gridSize][j] === null || sum % 2 !== 0) {
                    hasError = true; getCell(gridSize, j).classList.add('cell-error');
                } else { getCell(gridSize, j).classList.add('cell-correct'); }
            }

            let rowSum = 0, colSum = 0;
            for (let i = 0; i < gridSize; i++) rowSum += (trainAnswers[gridSize][i] || 0);
            for (let i = 0; i < gridSize; i++) colSum += (trainAnswers[i][gridSize] || 0);
            let cornerVal = trainAnswers[gridSize][gridSize];
            if (cornerVal === null || (rowSum + cornerVal) % 2 !== 0 || (colSum + cornerVal) % 2 !== 0) {
                hasError = true; getCell(gridSize, gridSize).classList.add('cell-error');
            } else { getCell(gridSize, gridSize).classList.add('cell-correct'); }

            if (!hasError) {
                playSound('success'); isTrainLocked = true;
                globalCorrect++;
                ScoreManager.addSuccess("train", 'grid' + gridSize, isFirstAttempt ? 0 : 1);
                globalStreak++; if (globalStreak > globalBest) globalBest = globalStreak;
                if (gridSize === 6 && isFirstAttempt) launchFire();
                else if (globalStreak % 3 === 0) launchConfetti();
                setTimeout(initTrainMode, 2000);
            } else {
                isFirstAttempt = false;
                playSound('error');
                ScoreManager.addMistake("train", 'grid' + gridSize); globalStreak = 0;
                showToast("❌ Il y a des erreurs en rouge.", 'error');
                setTimeout(() => document.querySelectorAll('.cell-error').forEach(c => c.classList.remove('cell-error')), 1000);
            }
"""

replace_block = """
            const urlParams = new URLSearchParams(window.location.search);
            const isStrict = urlParams.get('strictMode') === '1';

            for (let i = 0; i < gridSize; i++) {
                let sum = trainData[i].reduce((a, b) => a + b, 0) + (trainAnswers[i][gridSize] || 0);
                if (trainAnswers[i][gridSize] === null || sum % 2 !== 0) {
                    hasError = true;
                    if (!isStrict) getCell(i, gridSize).classList.add('cell-error');
                } else {
                    getCell(i, gridSize).classList.add('cell-correct');
                }
            }

            for (let j = 0; j < gridSize; j++) {
                let sum = trainAnswers[gridSize][j] || 0;
                for (let i = 0; i < gridSize; i++) sum += trainData[i][j];
                if (trainAnswers[gridSize][j] === null || sum % 2 !== 0) {
                    hasError = true;
                    if (!isStrict) getCell(gridSize, j).classList.add('cell-error');
                } else {
                    getCell(gridSize, j).classList.add('cell-correct');
                }
            }

            let rowSum = 0, colSum = 0;
            for (let i = 0; i < gridSize; i++) rowSum += (trainAnswers[gridSize][i] || 0);
            for (let i = 0; i < gridSize; i++) colSum += (trainAnswers[i][gridSize] || 0);
            let cornerVal = trainAnswers[gridSize][gridSize];
            if (cornerVal === null || (rowSum + cornerVal) % 2 !== 0 || (colSum + cornerVal) % 2 !== 0) {
                hasError = true;
                if (!isStrict) getCell(gridSize, gridSize).classList.add('cell-error');
            } else {
                getCell(gridSize, gridSize).classList.add('cell-correct');
            }

            if (!hasError) {
                playSound('success'); isTrainLocked = true;
                globalCorrect++;
                ScoreManager.addSuccess("train", 'grid' + gridSize, isFirstAttempt ? 0 : 1);
                globalStreak++; if (globalStreak > globalBest) globalBest = globalStreak;
                if (gridSize === 6 && isFirstAttempt) launchFire();
                else if (globalStreak % 3 === 0) launchConfetti();
                setTimeout(initTrainMode, 2000);
            } else {
                isFirstAttempt = false;
                playSound('error');
                ScoreManager.addMistake("train", 'grid' + gridSize); globalStreak = 0;
                if (isStrict) {
                    showToast("❌ Il y a une ou plusieurs erreurs.", 'error');
                } else {
                    showToast("❌ Il y a des erreurs en rouge.", 'error');
                    setTimeout(() => document.querySelectorAll('.cell-error').forEach(c => c.classList.remove('cell-error')), 1000);
                }
            }
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("bit_de_parite.html train block updated successfully.")
else:
    print("Search block not found in bit_de_parite.html train block")

search_block_2 = """
            } else {
                const firstHint = !detectHintsEnabled;
                if (firstHint) {
                    detectHintsEnabled = true;
                    renderDetectGrid();
                }
                detectStreak = 0;
                ScoreManager.addMistake("detect", null);
                playSound('error');
                // Get cell from potentially re-rendered grid
                const errCell = document.getElementById('detect-grid').children[r * (DET_SIZE + 1) + c];
                errCell.classList.add('cell-error');
                errCell.classList.add('toggled');
                setTimeout(() => errCell.classList.remove('cell-error'), 600);
                showToast(firstHint ? "❌ Pas ce bit ! Les parités en orange t'indiquent où chercher." : "❌ Pas ce bit ! Consulte les parités en orange.", 'error');
                updateDetectScoreDisplay();
            }
"""

replace_block_2 = """
            } else {
                const urlParams = new URLSearchParams(window.location.search);
                const isStrict = urlParams.get('strictMode') === '1';

                const firstHint = !detectHintsEnabled && !isStrict; // Do not enable hints in strict mode
                if (firstHint) {
                    detectHintsEnabled = true;
                    renderDetectGrid();
                }
                detectStreak = 0;
                ScoreManager.addMistake("detect", null);
                playSound('error');
                // Get cell from potentially re-rendered grid
                const errCell = document.getElementById('detect-grid').children[r * (DET_SIZE + 1) + c];

                if (!isStrict) {
                    errCell.classList.add('cell-error');
                }
                errCell.classList.add('toggled');
                if (!isStrict) {
                    setTimeout(() => errCell.classList.remove('cell-error'), 600);
                }

                if (isStrict) {
                    showToast("❌ Pas ce bit ! Cherche encore.", 'error');
                } else {
                    showToast(firstHint ? "❌ Pas ce bit ! Les parités en orange t'indiquent où chercher." : "❌ Pas ce bit ! Consulte les parités en orange.", 'error');
                }
                updateDetectScoreDisplay();
            }
"""

with open(filepath, 'r') as f:
    content = f.read()

if search_block_2.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block_2.strip(), replace_block_2.strip()))
    print("bit_de_parite.html detect block updated successfully.")
else:
    print("Search block not found in bit_de_parite.html detect block")
