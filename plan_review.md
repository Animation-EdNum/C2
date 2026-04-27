The bugs in `simulateur_bluebot.html` are:
1. "Après un drag and drop du robot sur une autre case de la grille, les points et erreurs sont décomptabilisés alors que je t'avais demandé de montrer un toast orange quand on arrivait sur un trésor pour dire que ça ne comptait pas."
- In `drop` event listener in `buildGrid`, if user drops robot onto a target cell (`isSimTarget`), it currently does nothing or maybe the check `!isSimTarget` prevents placing it. Wait, the problem says "les points et erreurs sont décomptabilisés alors que je t'avais demandé de montrer un toast orange quand on arrivait sur un trésor pour dire que ça ne comptait pas."
Let's see what happens if I drop on a target. Wait, right now it is:
```javascript
                        if (containerId === 'sim-grid' && !simState.running && !isSimObstacle && !isSimTarget) {
```
Wait, the memory says: "In `simulateur_bluebot.html`, dragging the robot directly onto a target cell constitutes a manual collection. This action must bypass gamification scoring, display an orange warning toast, and silently trigger `placeRandomSimTarget()`."

If we change it to:
```javascript
                        if (containerId === 'sim-grid' && !simState.running && !isSimObstacle) {
                            playSound('click');
                            simState.robotRow = r;
                            simState.robotCol = c;
                            simState.startRow = r;
                            simState.startCol = c;
                            resetSimulatorPosition();

                            if (isSimTarget) {
                                showToast("Trésor récupéré manuellement. Ne compte pas pour le score.", true, true);
                                placeRandomSimTarget(true);
                            }
                        }
```

Wait, `resetSimulatorPosition()` gets the current orientation of the DOM element if I change the drag and drop?
"Quand je drag and drop le robot, il ne garde pas toujours son orientation !"
Let's look at `resetSimulatorPosition()`:
```javascript
        function resetSimulatorPosition() {
            if (simState.running) return;
            playSound('click');
            simState.robotRow = simState.startRow;
            simState.robotCol = simState.startCol;
            simState.robotDir = simState.startDir;
            simState.stepIndex = -1; simState.failed = false;

            TrailManager.clear('sim-grid');
            renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
            if (simState.targetRow !== null && simState.targetCol !== null) {
                renderTarget('sim-grid', 'sim-target', simState.targetRow, simState.targetCol);
            }
            renderProgram();
        }
```
Wait, when we do drag and drop:
```javascript
                            simState.robotRow = r;
                            simState.robotCol = c;
                            simState.startRow = r;
                            simState.startCol = c;
                            resetSimulatorPosition();
```
Wait, `simState.startDir` is NOT updated to the current `robotDir`! It resets `simState.robotDir` to whatever `simState.startDir` was.
But wait, if we drop it, we should preserve its current orientation `simState.robotDir`.
Ah, `simState.startDir = simState.robotDir;` before calling `resetSimulatorPosition()`.

3. "Quand la loco est débloquée (directement après 100 cases, c'est top), mais le path n'est pas mis à jour ! Corrige."
When we unlock a skin with `unlockSkin('train')`, it does:
```javascript
            if (!unlockedSkins.includes(skinId)) {
                unlockedSkins.push(skinId);
                localStorage.setItem('bb_unlocked_skins', JSON.stringify(unlockedSkins));

                if (activeSkin === 'volcano') {
                    launchFire();
                } else {
                    launchConfetti();
                }

                showToast(`Nouveau Skin débloqué : ${SKIN_CONFIG[skinId].name} ! 🎁`, true);
                selectSkin(skinId);
            }
```
And `selectSkin(skinId)` does:
```javascript
            // Re-render grids to apply skin
            buildGrid('sim-grid', GRID_ROWS, GRID_COLS, simState.obstacles);
            renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
            if (simState.targetRow !== null && simState.targetCol !== null) {
                renderTarget('sim-grid', 'sim-target', simState.targetRow, simState.targetCol);
            }
```
Wait, it re-renders the robot and target, but it doesn't re-render the trail path! `TrailManager` has state, and if we change the skin, the trail might not visually update properly, or maybe the path itself is not drawn.
Wait! In `moveRobot()`, when total steps reach 100, we call `unlockSkin('train')`. This changes the skin while a program might be running! `selectSkin` re-renders the grid, which clears the `.trail-path` SVG container that `buildGrid` creates?
Let's see `buildGrid`:
Does `buildGrid` recreate the trail? No, wait, `buildGrid` creates the cells but what about the SVG container for paths?
Let's check `TrailManager`.
