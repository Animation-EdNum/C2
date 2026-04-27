Wait, if `runProgram` succeeds, it does `simState.stepIndex = -1;`.
So `stepIndex` is `-1` if it succeeded. The path STAYS visually because we don't call `TrailManager.clear()`.
If `simState.failed` is true, `stepIndex` remains at the failed index `i`.
Wait, if we unlock the locomotive mid-run (`moveRobot` increments `totalSteps`, reaches 100, calls `unlockSkin`, calls `selectSkin`), `simState.running` is TRUE.
When `selectSkin` is called mid-run, `simState.stepIndex` is exactly `i`. `redrawTrail` loops up to `state.stepIndex - 1`!
Wait! The loop in `redrawTrail`:
```javascript
            for(let i = 0; i <= state.stepIndex - 1; i++) {
```
This is because during `runProgram`, `moveRobot` happens immediately, updating `simState.robotRow` and triggering `unlockSkin`, BEFORE `await sleep(...)` and BEFORE `TrailManager.addSegment(...)` is called for index `i`. So the visually drawn segments correspond exactly up to index `i - 1`. Redrawing up to `state.stepIndex - 1` exactly restores the path up to that point.

BUT what if the user manually changes the skin AFTER the program finishes successfully?
`simState.running` is `false`. `simState.stepIndex` is `-1`.
If they change the skin, my logic is:
```javascript
            if (simState.running) {
                redrawTrail('sim-grid', simState);
            } else {
                TrailManager.clear('sim-grid');
            }
```
If the user changes the skin after the robot finished running, the path is cleared! "s'il existe un path, il doit rester"
Ah! The user said: "Quand je change un skin, s'il existe un path, il doit rester ! Juste être re-render".

To know if a path exists when not running, we could look at `TrailManager.states['sim-grid']` before clearing!
Or we could just ALWAYS redraw up to the full `simState.program` if `simState.stepIndex == -1` and the robot is at the END of the path?
Wait, if the user moves the robot manually (e.g. dragging), we DO clear the path `TrailManager.clear('sim-grid')` in `resetSimulatorPosition()`.
If the user clicks "Clear program", we `TrailManager.clear('sim-grid')`? No, `clearProgram` doesn't explicitly clear the trail. `resetSimulatorPosition` clears it.
Actually, if the path is currently on screen, `TrailManager.states['sim-grid']` exists.
So if `TrailManager.states['sim-grid']` exists, we can use the length of the *drawn segments* or just rely on the fact that `TrailManager.states['sim-grid']` is defined.
BUT `TrailManager.states['sim-grid']` just tells us if `captureInitialState` was called.
To properly re-render the path, we need to know HOW MANY segments were drawn.
Wait, `simState.running` is TRUE when `unlockSkin` is called.
If the user just opens the skin modal and clicks a skin, and there is a visible path on the board, how do we recreate it?
If it's an old run that finished, the robot is at the END. `simState.stepIndex` is `-1`. But `simState.robotRow` is NOT the `startRow`.
If the robot is not at `startRow`, then a path was run!
Wait, no. The user can drag the robot, then `simState.startRow` becomes the current row, and `simState.robotRow` is the current row. `TrailManager.clear` is called. So `TrailManager.states['sim-grid']` is cleared (actually, `clear` removes the layer, but doesn't delete `this.states[containerId]`? Let's check `TrailManager.clear`).

```javascript
            clear(containerId) {
                const layer = document.querySelector(`#${containerId} .trail-layer`);
                if (layer) layer.innerHTML = '';
                delete this.states[containerId];
            },
```
Yes, `delete this.states[containerId]`!
So to know if a path is currently visible, we just check `if (TrailManager.states['sim-grid'])`!
If it exists, what is the maximum index to redraw?
If `simState.running`, the max index is `simState.stepIndex - 1`.
If `!simState.running`, the program finished! Did it fail? If it failed, `simState.failed = true` and `simState.stepIndex` is the index it failed at. So max index is `simState.stepIndex - 1`.
If it succeeded, `simState.failed = false`, `simState.stepIndex = -1`. So max index is `simState.program.length - 1`.

So:
```javascript
            // Inside selectSkin:
            let hasPath = !!TrailManager.states['sim-grid'];

            buildGrid('sim-grid', GRID_ROWS, GRID_COLS, simState.obstacles);
            renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);

            if (hasPath) {
                let maxIndex = simState.program.length - 1;
                if (simState.running) {
                    maxIndex = simState.stepIndex - 1;
                } else if (simState.failed) {
                    maxIndex = simState.stepIndex - 1;
                }

                TrailManager.clear('sim-grid'); // Clean up state
                TrailManager.captureInitialState('sim-grid', simState.startRow, simState.startCol, simState.startDir);
                let tempState = { robotRow: simState.startRow, robotCol: simState.startCol, robotDir: simState.startDir, obstacles: simState.obstacles };
                for(let i = 0; i <= maxIndex; i++) {
                    let cmd = simState.program[i];
                    let res = moveRobot(tempState, cmd, false);
                    if (res.robotRow !== tempState.robotRow || res.robotCol !== tempState.robotCol) {
                        TrailManager.addSegment('sim-grid', res.robotRow, res.robotCol);
                    }
                    tempState = res;
                }
            } else {
                TrailManager.clear('sim-grid');
            }
```

Let's modify `redrawTrail` to handle this logic instead!
```javascript
        function redrawTrail(containerId, state) {
            let maxIndex = state.program.length - 1;
            if (state.running || state.failed) {
                maxIndex = state.stepIndex - 1;
            }
            TrailManager.clear(containerId);
            TrailManager.captureInitialState(containerId, state.startRow, state.startCol, state.startDir);
            let tempState = { robotRow: state.startRow, robotCol: state.startCol, robotDir: state.startDir, obstacles: state.obstacles };
            for(let i = 0; i <= maxIndex; i++) {
                let cmd = state.program[i];
                let res = moveRobot(tempState, cmd, false);
                if (res.robotRow !== tempState.robotRow || res.robotCol !== tempState.robotCol) {
                    TrailManager.addSegment(containerId, res.robotRow, res.robotCol);
                }
                tempState = res;
            }
        }
```
And in `selectSkin`:
```javascript
            if (TrailManager.states['sim-grid']) {
                redrawTrail('sim-grid', simState);
            } else {
                TrailManager.clear('sim-grid');
            }
```
This is perfect and fully robust! It satisfies "Quand je change un skin, s'il existe un path, il doit rester !".

I will apply this patch and verify.
