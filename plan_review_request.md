1. **Drag and Drop - Orientation and Toast Fix:**
   - In `simulateur_bluebot.html`, I will update the `drop` event listener to not check for `!isSimTarget` before moving the robot, but rather check if `isSimTarget` is true inside the block and call `showToast(...)` and `placeRandomSimTarget(true)` so gamification bypasses normally. I will also save `simState.startDir = simState.robotDir` so the robot doesn't lose its orientation when `resetSimulatorPosition()` is called.

2. **Locomotive Skin Unlock Path Rendering:**
   - I will add a `redrawTrail(containerId, state)` function globally before `selectSkin()`. It will take a `state` object, clear the trail via `TrailManager.clear`, initialize it using `TrailManager.captureInitialState`, and then loop `moveRobot(tempState, cmd, false)` from `0` to `state.stepIndex - 1` to redraw segments with `TrailManager.addSegment`.
   - I will update `selectSkin()` to call `redrawTrail('sim-grid', simState)` instead of `TrailManager.clear('sim-grid')` if `simState.running` is `true`.

Pre-commit instructions will be followed before submit.
