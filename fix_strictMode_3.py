import sys

filepath = 'webapps/bit_de_parite.html'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
            if (!hasError) {
                playSound('success'); isTrainLocked = true;
                globalCorrect++;
                ScoreManager.addSuccess("train", 'grid' + gridSize, isFirstAttempt ? 0 : 1);
                globalStreak++; if (globalStreak > globalBest) globalBest = globalStreak;
                if (gridSize === 6 && isFirstAttempt) launchFire();
                else if (globalStreak % 3 === 0) launchConfetti();
                showToast("✅ Parfait ! Tout est pair.", 'success');
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
            if (!hasError) {
                playSound('success'); isTrainLocked = true;
                globalCorrect++;
                ScoreManager.addSuccess("train", 'grid' + gridSize, isFirstAttempt ? 0 : 1);
                globalStreak++; if (globalStreak > globalBest) globalBest = globalStreak;
                if (gridSize === 6 && isFirstAttempt) launchFire();
                else if (globalStreak % 3 === 0) launchConfetti();
                showToast("✅ Parfait ! Tout est pair.", 'success');
                setTimeout(initTrainMode, 2000);
            } else {
                isFirstAttempt = false;
                playSound('error');
                ScoreManager.addMistake("train", 'grid' + gridSize); globalStreak = 0;

                const urlParams = new URLSearchParams(window.location.search);
                const isStrict = urlParams.get('strictMode') === '1';

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
    print("bit_de_parite.html checkTrainAnswer errors updated successfully.")
else:
    print("Search block not found in bit_de_parite.html checkTrainAnswer errors block")
