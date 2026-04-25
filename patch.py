with open("webapps/simulateur_bluebot.html", "r") as f:
    content = f.read()

import re

search = """            if (isCorrect) {
                readState.locked = true;
                playSound('success');
                launchConfetti();
                readGlobalScore++;
                readGlobalStreak++;
                ScoreManager.addSuccess('read', readState.difficulty, 0);
                updateExtremeVisibility();

                // Déblocages
                if (readState.difficulty === 'medium' && (!readState.mistakes || readState.mistakes === 0)) {
                    unlockSkin('thymio');
                } else if (readState.difficulty === 'extreme') {
                    if (!readState.mistakes || readState.mistakes === 0) unlockSkin('volcano');
                    document.getElementById('sim-grid').classList.add('ground-fire');
                    document.getElementById('chal-grid').classList.add('ground-fire');
                    document.getElementById('read-grid').classList.add('ground-fire');
                    showToast('Le sol est maintenant EN FEU !', true);
                }

                showToast(`Excellent ! C'est la bonne réponse !`, true);
                if (cell) cell.style.background = 'rgba(16, 185, 129, 0.4)'; // vert

                document.getElementById('read-global-score').textContent = readGlobalScore;
                document.getElementById('read-global-streak').textContent = readGlobalStreak;

                if (readGlobalStreak > 0 && readGlobalStreak % 3 === 0) {
                    if (activeSkin === 'volcano') launchFire(); else launchConfetti();
                }

                // Animate robot to destination
                let currR = readState.robotRow, currC = readState.robotCol, currD = readState.robotDir;
                TrailManager.captureInitialState('read-grid', currR, currC, currD);
                for (const cmd of readState.program) {
                    const res = moveRobot({ robotRow: currR, robotCol: currC, robotDir: currD, obstacles: readState.obstacles }, cmd);
                    currR = res.robotRow; currC = res.robotCol; currD = res.robotDir;
                    renderRobot('read-grid', 'read-robot', currR, currC, currD);

                    if (cmd === 'forward' || cmd === 'backward') {
                        await sleep(350);
                        TrailManager.addSegment('read-grid', currR, currC);
                    }

                    await sleep(currentSpeed - (cmd === 'forward' || cmd === 'backward' ? 350 : 0));
                }

            } else {"""

replace = """            if (isCorrect) {
                readState.locked = true;
                readGlobalScore++;
                readGlobalStreak++;
                ScoreManager.addSuccess('read', readState.difficulty, 0);
                updateExtremeVisibility();

                // Déblocages
                if (readState.difficulty === 'medium' && (!readState.mistakes || readState.mistakes === 0)) {
                    unlockSkin('thymio');
                } else if (readState.difficulty === 'extreme') {
                    if (!readState.mistakes || readState.mistakes === 0) unlockSkin('volcano');
                    document.getElementById('sim-grid').classList.add('ground-fire');
                    document.getElementById('chal-grid').classList.add('ground-fire');
                    document.getElementById('read-grid').classList.add('ground-fire');
                    showToast('Le sol est maintenant EN FEU !', true);
                }

                if (cell) cell.style.background = 'rgba(16, 185, 129, 0.4)'; // vert

                document.getElementById('read-global-score').textContent = readGlobalScore;
                document.getElementById('read-global-streak').textContent = readGlobalStreak;

                // Animate robot to destination
                let currR = readState.robotRow, currC = readState.robotCol, currD = readState.robotDir;
                TrailManager.captureInitialState('read-grid', currR, currC, currD);
                for (const cmd of readState.program) {
                    const res = moveRobot({ robotRow: currR, robotCol: currC, robotDir: currD, obstacles: readState.obstacles }, cmd);
                    currR = res.robotRow; currC = res.robotCol; currD = res.robotDir;
                    renderRobot('read-grid', 'read-robot', currR, currC, currD);

                    if (cmd === 'forward' || cmd === 'backward') {
                        await sleep(350);
                        TrailManager.addSegment('read-grid', currR, currC);
                    }

                    await sleep(currentSpeed - (cmd === 'forward' || cmd === 'backward' ? 350 : 0));
                }

                playSound('success');
                launchConfetti();
                showToast(`Excellent ! C'est la bonne réponse !`, true);

                if (readGlobalStreak > 0 && readGlobalStreak % 3 === 0) {
                    if (activeSkin === 'volcano') launchFire(); else launchConfetti();
                }

            } else {"""

if search in content:
    content = content.replace(search, replace)
    with open("webapps/simulateur_bluebot.html", "w") as f:
        f.write(content)
    print("Successfully patched")
else:
    print("Could not find search block")
