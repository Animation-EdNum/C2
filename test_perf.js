const fs = require('fs');

// Mock DOM
const { JSDOM } = require('jsdom');
const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="grid"></div></body></html>`);
global.document = dom.window.document;
global.window = dom.window;

// Dummy configs
const SKIN_CONFIG = {
    testSkin: {
        name: 'test',
        obstacle: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>' // Simulate an SVG obstacle
    }
};
const activeSkin = 'testSkin';

const MAT_CONFIG = {
    testMat: {
        content: Array.from({length: 100}, (_, i) => `A${i}`)
    }
};
const activeMat = 'testMat';

const rows = 10;
const cols = 10;
const containerId = 'test';
const obstacles = [{r: 0, c: 0}, {r: 2, c: 3}, {r: 5, c: 5}, {r: 8, c: 9}, {r: 9, c: 1}]; // some obstacles

function runGridCreationOld() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    const obsGrid = Array(rows);
    for (let r = 0; r < rows; r++) {
        obsGrid[r] = Array(cols).fill(false);
    }
    if (obstacles && obstacles.length > 0) {
        for (let i = 0; i < obstacles.length; i++) {
            const o = obstacles[i];
            if (o.r >= 0 && o.r < rows && o.c >= 0 && o.c < cols) {
                obsGrid[o.r][o.c] = true;
            }
        }
    }

    for (let r = 0; r < rows; r++) {
        const row = document.createElement('div'); row.className = 'grid-row';
        row.setAttribute('role', 'row');
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'bot-cell ' + ((r + c) % 2 === 0 ? 'cell-light' : 'cell-dark');
            cell.setAttribute('role', 'gridcell');
            cell.setAttribute('tabindex', '0');
            cell.id = `${containerId}-cell-${r}-${c}`;
            const isObstacle = obsGrid[r][c];
            if (isObstacle) {
                cell.classList.add('obstacle');
                const obs = SKIN_CONFIG[activeSkin].obstacle;
                if (obs.includes('<svg') || obs.includes('<i')) {
                    cell['innerHTML'] = obs;
                } else {
                    cell.dataset.obstacle = obs;
                }
            } else if (MAT_CONFIG[activeMat] && MAT_CONFIG[activeMat].content) {
                const content = MAT_CONFIG[activeMat].content;
                const index = r * cols + c;
                if (index < content.length) {
                    const span = document.createElement('span');
                    span.className = 'mat-content';
                    span['innerHTML'] = content[index];
                    cell.appendChild(span);
                }
            }
            cell.dataset.row = r; cell.dataset.col = c;
            cell.setAttribute('aria-label', `Ligne ${r + 1}, colonne ${c + 1}, ${isObstacle ? SKIN_CONFIG[activeSkin].name + ' Obstacle' : 'Vide'}`);

            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
}

function runGridCreationNew() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    const obsGrid = Array(rows);
    for (let r = 0; r < rows; r++) {
        obsGrid[r] = Array(cols).fill(false);
    }
    if (obstacles && obstacles.length > 0) {
        for (let i = 0; i < obstacles.length; i++) {
            const o = obstacles[i];
            if (o.r >= 0 && o.r < rows && o.c >= 0 && o.c < cols) {
                obsGrid[o.r][o.c] = true;
            }
        }
    }

    let parsedObstacleNode = null;
    const obs = SKIN_CONFIG[activeSkin].obstacle;
    const isHtmlObs = obs.includes('<svg') || obs.includes('<i');
    if (isHtmlObs) {
        const temp = document.createElement('div');
        temp.innerHTML = obs;
        parsedObstacleNode = temp.firstChild; // Might be multiple nodes theoretically, but usually one SVG/i
    }

    for (let r = 0; r < rows; r++) {
        const row = document.createElement('div'); row.className = 'grid-row';
        row.setAttribute('role', 'row');
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'bot-cell ' + ((r + c) % 2 === 0 ? 'cell-light' : 'cell-dark');
            cell.setAttribute('role', 'gridcell');
            cell.setAttribute('tabindex', '0');
            cell.id = `${containerId}-cell-${r}-${c}`;
            const isObstacle = obsGrid[r][c];
            if (isObstacle) {
                cell.classList.add('obstacle');
                if (isHtmlObs) {
                    if (parsedObstacleNode) {
                        // clone Node is faster
                        // Actually, temp.childNodes could be cloned if multiple
                        cell.appendChild(parsedObstacleNode.cloneNode(true));
                    }
                } else {
                    cell.dataset.obstacle = obs;
                }
            } else if (MAT_CONFIG[activeMat] && MAT_CONFIG[activeMat].content) {
                const content = MAT_CONFIG[activeMat].content;
                const index = r * cols + c;
                if (index < content.length) {
                    const span = document.createElement('span');
                    span.className = 'mat-content';
                    // optimization: content is just text, use textContent
                    span.textContent = content[index];
                    cell.appendChild(span);
                }
            }
            cell.dataset.row = r; cell.dataset.col = c;
            cell.setAttribute('aria-label', `Ligne ${r + 1}, colonne ${c + 1}, ${isObstacle ? SKIN_CONFIG[activeSkin].name + ' Obstacle' : 'Vide'}`);

            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
}

// Warmup
for (let i = 0; i < 100; i++) {
    runGridCreationOld();
    runGridCreationNew();
}

const ITERATIONS = 1000;

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    runGridCreationOld();
}
let oldTime = performance.now() - start;

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    runGridCreationNew();
}
let newTime = performance.now() - start;

console.log(`Old Time: ${oldTime.toFixed(2)} ms`);
console.log(`New Time: ${newTime.toFixed(2)} ms`);
console.log(`Improvement: ${((oldTime - newTime) / oldTime * 100).toFixed(2)}%`);
