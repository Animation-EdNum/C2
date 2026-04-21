1. **Add `isFirstAttempt` state variable:** I will add a `let isFirstAttempt = true;` flag to track if the current puzzle in "Train" mode is being solved for the first time.
2. **Reset `isFirstAttempt` in `initTrainMode`:** I'll set `isFirstAttempt = true;` at the beginning of `initTrainMode()`.
3. **Track attempts in `checkTrainAnswer`:** In `checkTrainAnswer()`, if there are errors, I'll set `isFirstAttempt = false;`.
4. **Trigger `launchFire()` instead of `launchConfetti()`:** In `checkTrainAnswer()`, when the user succeeds (no errors), I will check `if (gridSize === 6 && isFirstAttempt)`. If true, I'll call `playSound('magic')` and `launchFire()`. Otherwise, I will keep the original `launchConfetti()` call if `globalStreak % 3 === 0`.
5. **Apply changes to both webapps and standalone files**: The changes will be applied to `./webapps/bit_de_parite.html` and `./standalone/webapps/bit_de_parite.html`.
6. **Pre-commit checks**: I will run the pre-commit instructions tool.
