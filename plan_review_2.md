The user said: "Quand je change un skin, s'il existe un path, il doit rester ! Juste être re-render "

Wait! My logic for redrawing the path:
```javascript
            if (simState.running) {
                redrawTrail('sim-grid', simState);
            } else {
                TrailManager.clear('sim-grid');
            }
```
If I just switch a skin when NOT running (i.e., I ran a program, it finished, the path is there on the screen, and THEN I switch the skin), the path disappears! Because I did `else { TrailManager.clear('sim-grid'); }`.
BUT if I change a skin, and a path exists, it should be re-rendered!

Ah! `stepIndex` is at the end. So `redrawTrail('sim-grid', simState)` works!
But wait, if the program finished, `simState.running` is `false`, but the path is still visually there!
However, `simState.stepIndex` will be whatever it was at the end of the program! Wait, when `runProgram` finishes, `simState.running` becomes `false`, and `simState.stepIndex` is `simState.program.length - 1`!
Wait, when we clear the program or do `resetSimulatorPosition()`, we set `simState.stepIndex = -1` and call `TrailManager.clear('sim-grid')`.
So, if `simState.stepIndex >= 0`, there is a path to re-render!
Actually, even if `simState.stepIndex == -1`, `redrawTrail` would loop from `0` to `-2` (which doesn't execute), but it WOULD call `TrailManager.captureInitialState`, putting the start marker on the board!
Wait! The start marker is always placed when we run. If `stepIndex` is `-1`, should we show the start marker? No, `TrailManager.clear` makes it fully empty.

So in `selectSkin`, we should replace:
```javascript
            if (simState.running) {
                redrawTrail('sim-grid', simState);
            } else {
                TrailManager.clear('sim-grid');
            }
```
with:
```javascript
            if (simState.stepIndex >= 0) {
                redrawTrail('sim-grid', simState);
            } else {
                TrailManager.clear('sim-grid');
            }
```
Let me verify if `simState.stepIndex >= 0` means a path exists.
Yes, `runProgram` sets `stepIndex` as it iterates. When it ends, `stepIndex` is the last index.
So `redrawTrail('sim-grid', simState)` will correctly redraw it up to `stepIndex - 1`?
Wait! If the program has FINISHED, the robot is at `simState.program.length`, so the trail should include the LAST step!
My `redrawTrail` does:
```javascript
            for(let i = 0; i <= state.stepIndex - 1; i++) {
```
If `stepIndex` is the last instruction, say index 3, and the program finished... wait!
If `runProgram` finishes, what is `simState.stepIndex`?
Let's check `runProgram` again.
