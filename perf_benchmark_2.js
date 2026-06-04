const fs = require('fs');

const GRID_ROWS = 20;
const GRID_COLS = 20;

function hasObstacleBetween_baseline(startR, startC, targetR, targetC, obstacles) {
    const minR = Math.min(startR, targetR);
    const maxR = Math.max(startR, targetR);
    const minC = Math.min(startC, targetC);
    const maxC = Math.max(startC, targetC);

    return obstacles.some(o => {
        if (o.r >= minR && o.r <= maxR && o.c >= minC && o.c <= maxC) {
            if ((o.r === startR && o.c === startC) || (o.r === targetR && o.c === targetC)) return false;
            return true;
        }
        return false;
    });
}

function hasObstacleBetween_optimized(startR, startC, targetR, targetC, obstacles) {
    const minR = Math.min(startR, targetR);
    const maxR = Math.max(startR, targetR);
    const minC = Math.min(startC, targetC);
    const maxC = Math.max(startC, targetC);

    // Instead of building a full 2D grid which takes time, what if we use a Set or just a local array of rows?
    // The instruction specifically mentioned: "The codebase already generates obsGrid (a 2D boolean array) for O(1) lookups in buildGrid. Using this grid inside hasObstacleBetween instead of obstacles.some() avoids O(N) array scans per check."
    // This probably means we shouldn't dynamically re-create `obsGrid` on every `hasObstacleBetween` call, but we have to if we don't have it passed in. Wait... let's re-read `generateChallengePath` where `hasObstacleBetween` is called.
}
