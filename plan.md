1. **Fix drag & drop orientation and target issue**
In `simulateur_bluebot.html`, line 3808:
```javascript
<<<<<<< SEARCH
                    cell.addEventListener('drop', (e) => {
                        e.preventDefault();
                        const isSimObstacle = simState.obstacles && simState.obstacles.some(o => o.r === r && o.c === c);
                        const isSimTarget = simState.targetRow === r && simState.targetCol === c;

                        if (containerId === 'sim-grid' && !simState.running && !isSimObstacle && !isSimTarget) {
                            playSound('click');
                            simState.robotRow = r;
                            simState.robotCol = c;
                            simState.startRow = r;
                            simState.startCol = c;
                            resetSimulatorPosition();
                        }
                    });
=======
                    cell.addEventListener('drop', (e) => {
                        e.preventDefault();
                        const isSimObstacle = simState.obstacles && simState.obstacles.some(o => o.r === r && o.c === c);
                        const isSimTarget = simState.targetRow === r && simState.targetCol === c;

                        if (containerId === 'sim-grid' && !simState.running && !isSimObstacle) {
                            playSound('click');
                            simState.robotRow = r;
                            simState.robotCol = c;
                            simState.startRow = r;
                            simState.startCol = c;
                            simState.startDir = simState.robotDir;
                            resetSimulatorPosition();

                            if (isSimTarget) {
                                showToast("Trésor récupéré manuellement. Ne compte pas pour le score.", true, true);
                                placeRandomSimTarget(true);
                            }
                        }
                    });
>>>>>>> REPLACE
```

2. **Fix locomotive unlocked path issue**
When locomotive is unlocked during a run, `selectSkin` is called which re-renders the grid and calls `TrailManager.clear()`.
If `simState.running` is true, we should either NOT clear the trail, or we should re-draw it up to the current point.
Actually, wait: `selectSkin` calls `TrailManager.clear('sim-grid');`. It resets the path visually. However, since the robot is moving (`simState.running` is true), we could redraw the path, OR just not clear it if the sim is running?
But wait, if we change the skin, the path element for the new skin is different! F1 and train have different path DOM structures! So we must redraw the whole path up to `stepIndex` or current `robotRow, robotCol`.
Or, even simpler: wait until the run finishes to visually switch to the new skin, or just skip calling `TrailManager.clear` and `captureInitialState` but `selectSkin` calls `buildGrid` which removes the `.trail-layer` from the grid completely!
Wait, `buildGrid` removes `.trail-layer` because it does `grid.innerHTML = ''`.
So the trail is lost.
If `simState.running` is true, re-running `captureInitialState` will start the trail from the original position, and we would need to manually add all segments up to the current position.
Let's see what happens if I re-add the segments.
Actually, what if I modify `selectSkin` so that if `simState.running` is true, it restores the trail?
Or we can modify `moveRobot`: `unlockSkin` is called directly during `moveRobot` if `totalSteps >= 100`.
Instead of unlocking immediately during the background `moveRobot` inside the loop, we could defer the unlock until `runProgram` finishes?
No, the skin unlocks the moment it crosses 100 steps. It triggers `selectSkin('train')`.
If I look at `TrailManager.redrawPath('sim-grid', simState)`, it doesn't exist. I can create it:
```javascript
            if (simState.running && containerId === 'sim-grid') {
                 // Restore trail
                 TrailManager.captureInitialState('sim-grid', simState.startRow, simState.startCol, simState.startDir);
                 let tempR = simState.startRow, tempC = simState.startCol, tempD = simState.startDir;
                 for (let i = 0; i <= simState.stepIndex; i++) {
                      let c = simState.program[i];
                      if (c === 'forward' || c === 'backward') {
                          // actually we just need to re-simulate
                          // but wait, `simState.robotRow` has already reached the current step!
                      }
                 }
            }
```
Wait, wait. `simState.stepIndex` is updated in `runProgram`. The trail is updated by `TrailManager.addSegment(containerId, nextRow, nextCol)`.
Wait, if `selectSkin` rebuilds the grid and clears the trail, the NEXT segment added will start from `simState.robotRow/Col` because `captureInitialState` hasn't been called.
Instead of rebuilding the trail, why not just `captureInitialState` and then add segments?
Wait, if `moveRobot` calls `unlockSkin`, it's called inside `runProgram` loop:
```javascript
                const result = moveRobot(simState, cmd, true);
                simState.robotRow = result.robotRow; simState.robotCol = result.robotCol; simState.robotDir = result.robotDir;
```
It is a synchronous call.
We could add a function to `TrailManager`:
```javascript
        function redrawTrail(containerId, state) {
            TrailManager.clear(containerId);
            TrailManager.captureInitialState(containerId, state.startRow, state.startCol, state.startDir);
            let tempState = { robotRow: state.startRow, robotCol: state.startCol, robotDir: state.startDir, obstacles: state.obstacles };
            for(let i = 0; i <= state.stepIndex; i++) {
                let cmd = state.program[i];
                let res = moveRobot(tempState, cmd, false);
                if (res.robotRow !== tempState.robotRow || res.robotCol !== tempState.robotCol) {
                    TrailManager.addSegment(containerId, res.robotRow, res.robotCol);
                }
                tempState = res;
            }
        }
```
And inside `selectSkin`:
```javascript
            // Re-render grids to apply skin
            buildGrid('sim-grid', GRID_ROWS, GRID_COLS, simState.obstacles);
            renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
            if (simState.running) {
                redrawTrail('sim-grid', simState);
            } else {
                TrailManager.clear('sim-grid');
            }
```
Wait, we need to declare `redrawTrail` before `selectSkin` or inside it.
Let's see if `redrawTrail` will perfectly restore the trail up to `state.stepIndex`.
Wait, in `runProgram`, `moveRobot` is called, which updates `totalSteps`, which calls `unlockSkin`, which calls `selectSkin`, which calls `buildGrid` and then `redrawTrail`. Then `moveRobot` returns. Then `runProgram` proceeds to visually animate the robot and add the segment!
Wait, `runProgram` does this:
```javascript
                const result = moveRobot(simState, cmd, true);
                simState.robotRow = result.robotRow; simState.robotCol = result.robotCol; simState.robotDir = result.robotDir;

                // Déplacer le robot d'abord (déclenche la transition CSS)
                renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);

                // Ajouter le segment visuel au chemin si on a bougé
                if (result.robotRow !== prevRow || result.robotCol !== prevCol) {
                    TrailManager.addSegment('sim-grid', simState.robotRow, simState.robotCol);
                }
```
Wait, if `selectSkin` redraws up to `stepIndex`, it will redraw including the *current* step if we use `state.program[i]` up to `state.stepIndex`?
Wait, inside `moveRobot`, `state` is `simState`. `moveRobot` doesn't modify `simState.stepIndex`. `runProgram` does `simState.stepIndex = i` BEFORE calling `moveRobot`.
So inside `moveRobot` -> `unlockSkin` -> `selectSkin`, `simState.stepIndex` is exactly the current index `i`.
BUT `simState.robotRow` is NOT YET UPDATED in `runProgram`, however `moveRobot` modifies the temporary `r`, `c` and passes them back. BUT wait! The state passed to `moveRobot` is `simState`, and `moveRobot` does NOT mutate `simState` in place, it returns a new object or just `{ ...state, robotRow: r, robotCol: c, robotDir: d, blocked: false }`!
So inside `selectSkin`, `simState.robotRow/Col` are the OLD ones (before the move)!
If we redraw up to `stepIndex - 1`, we get the exact state before the current move!
So `redrawTrail` should only simulate up to `simState.stepIndex - 1`!
Let's trace `runProgram`:
```javascript
            for (let i = 0; i < simState.program.length; i++) {
                simState.stepIndex = i; renderProgram();
                const cmd = simState.program[i];

                const prevRow = simState.robotRow; const prevCol = simState.robotCol;

                const result = moveRobot(simState, cmd, true);
                simState.robotRow = result.robotRow; simState.robotCol = result.robotCol; simState.robotDir = result.robotDir;
```
If `moveRobot` calls `selectSkin`, `simState.stepIndex` is `i`. But the actual trail drawn so far was up to `simState.stepIndex - 1`!
So to perfectly restore the trail inside `selectSkin`, we just need to reconstruct the trail up to `simState.stepIndex - 1`.
