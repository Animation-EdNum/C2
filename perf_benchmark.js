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

    // Build a 2D array representation of obstacles for O(1) lookups
    const obsGrid = Array(GRID_ROWS);
    for (let r = 0; r < GRID_ROWS; r++) {
        obsGrid[r] = Array(GRID_COLS).fill(false);
    }
    if (obstacles && obstacles.length > 0) {
        for (let i = 0; i < obstacles.length; i++) {
            const o = obstacles[i];
            if (o.r >= 0 && o.r < GRID_ROWS && o.c >= 0 && o.c < GRID_COLS) {
                obsGrid[o.r][o.c] = true;
            }
        }
    }

    for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
            if ((r === startR && c === startC) || (r === targetR && c === targetC)) continue;
            if (obsGrid[r][c]) return true;
        }
    }
    return false;
}

// For benchmark, let's use a larger number of obstacles
const obstacles = [];
for (let i = 0; i < 200; i++) {
    obstacles.push({ r: Math.floor(Math.random() * GRID_ROWS), c: Math.floor(Math.random() * GRID_COLS) });
}

let start = performance.now();
for (let i = 0; i < 10000; i++) {
    hasObstacleBetween_baseline(2, 2, 18, 18, obstacles);
}
let endBaseline = performance.now();

let start2 = performance.now();
for (let i = 0; i < 10000; i++) {
    hasObstacleBetween_optimized(2, 2, 18, 18, obstacles);
}
let endOptimized = performance.now();

console.log("Baseline:", endBaseline - start, "ms");
console.log("Optimized:", endOptimized - start2, "ms");
