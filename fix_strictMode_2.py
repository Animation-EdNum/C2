import sys

filepath = 'webapps/bit_de_parite.html'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
        function checkTrainAnswer() {
            if (isTrainLocked) return;
            let hasError = false;
            const cells = document.getElementById('train-grid').children;
            const getCell = (r, c) => cells[r * (gridSize + 1) + c];

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
"""

replace_block = """
        function checkTrainAnswer() {
            if (isTrainLocked) return;
            let hasError = false;
            const cells = document.getElementById('train-grid').children;
            const getCell = (r, c) => cells[r * (gridSize + 1) + c];

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
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("bit_de_parite.html checkTrainAnswer updated successfully.")
else:
    print("Search block not found in bit_de_parite.html checkTrainAnswer block")
