1. **Remove `* 90` from random direction calculation**: In `assets/js/bluebot/bluebot-engine.js`, the functions `randomizeSimulatorPosition` and `randomizeExploreWalls` incorrectly multiply the random integer by 90 when calculating `randomDir`. This causes the robot's initial direction index to be out of bounds (0, 90, 180, 270 instead of 0, 1, 2, 3), leading to movement failures until the robot is rotated (which normalizes the direction index using modulo 4).
2. **Run E2E tests**: Execute `test_bluebot.py` or the specific verify scripts if possible.
3. **Pre-commit steps**: Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
4. **Submit changes**: Commit the fix.
