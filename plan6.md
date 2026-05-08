Let's check the memory note about `Array.from(document.querySelectorAll).find()` again.
"Avoid 'optimizations' that replace O(1) ID lookups with O(N^2) array searches (like using Array.from(document.querySelectorAll).find() inside a loop) as these significantly degrade performance."
Wait, does it mean the code currently HAS this issue and I need to fix it?
Let's grep for `Array.from` inside `bluebot-engine.js` again.
Line 1032:
`const items = Array.from(endContent.querySelectorAll('.end-item:not(.memory-matched)'));`
`const match = items.slice(0, -1).find(el => el.textContent.trim() === content);`

Wait, where is the O(N^2) loop? Maybe in `document.querySelectorAll('#sim-cmd-pad .cmd-btn').forEach(b => {`?
No.

What about `document.getElementById` inside an animation tick?
Yes, in `triggerRipple`:
```javascript
        function triggerRipple(row, col, delay) {
            setTimeout(() => {
                const grids = ['sim-grid', 'chal-grid', 'read-grid', 'draw-grid'];
                grids.forEach(gridId => {
                    const cellId = `${gridId}-cell-${row}-${col}`;
                    const cell = document.getElementById(cellId);
```
This is a loop (`grids.forEach`) querying the DOM via `document.getElementById` inside an animation tick (`setTimeout`).

Also, `buildGrid`:
```javascript
            for (let r = 0; r < rows; r++) {
                const row = document.createElement('div'); row.className = 'grid-row';
                row.setAttribute('role', 'row');
                for (let c = 0; c < cols; c++) {
                    const cell = document.createElement('div');
                    // ...
                    row.appendChild(cell);
                }
                grid.appendChild(row); // <== Appending directly to the grid in a loop!
            }
```
This causes multiple reflows. We should use a `DocumentFragment`.

Also, about `getBoundingClientRect` in a loop:
Is `updateGridContainersAspectRatio` doing layout thrashing?
```javascript
        function updateGridContainersAspectRatio() {
            const containers = document.querySelectorAll('.bot-grid-container');
            containers.forEach(container => {
                container.style.aspectRatio = `${GRID_COLS} / ${GRID_ROWS}`;
            });

            const grids = document.querySelectorAll('.bot-grid');
            grids.forEach(grid => {
                grid.style.aspectRatio = `${GRID_COLS} / ${GRID_ROWS}`;
            });
        }
```
No `getBoundingClientRect` here.

Is there any `getBoundingClientRect` inside `renderRobot` that is called repeatedly in `runProgram`?
```javascript
        function renderRobot(containerId, overlayId, row, col, dirIndex) {
            ...
            if (overlay) {
                if (activeSkin === 'volcano') {
                    const triggerDragonFire = () => {
                        ...
                        const rect = overlay.getBoundingClientRect(); // <== Here!
                        ...
```
Wait, `triggerDragonFire` is called via `setTimeout`, not synchronously inside `runProgram`. It's fine.

But wait! "Recréer la grille entière à chaque mouvement | Ne mettre à jour que les cellules modifiées (diff DOM)"
Is the grid recreated on each movement?
Let's check `runProgram` or `moveRobot`.
In `bluebot-engine.js`:
```javascript
        async function runProgram() {
            ...
            for (let i = 0; i < program.length; i++) {
                ...
                moveRobot(cmd);
                renderRobot('sim-grid', 'sim-robot', simState.robotRow, simState.robotCol, simState.robotDir);
                ...
                // Wait, does it call buildGrid? No!
```
Wait, there is `renderPath`. What does `renderPath` do?
```javascript
        function renderPath(path, containerId, pathClass) {
            // Remove previous path
            document.querySelectorAll(`#${containerId} .${pathClass}`).forEach(el => el.classList.remove(pathClass));
            if (!path) return;
            path.forEach(node => {
                const cellId = `${containerId}-cell-${node.r}-${node.c}`;
                const cell = document.getElementById(cellId);
                if (cell) cell.classList.add(pathClass);
            });
        }
```
`renderPath` calls `document.getElementById` for each cell in the path! This is an animation tick!
And it uses `document.querySelectorAll` to remove the path.

How to fix all this?
1. Introduce a global DOM cache:
```javascript
window.domCache = {
    cells: {},
    overlays: {},
    get: function(id) {
        if (!this.cells[id] && !this.overlays[id]) {
            const el = document.getElementById(id);
            if (el) {
                if (id.includes('-cell-')) this.cells[id] = el;
                else this.overlays[id] = el;
            }
            return el;
        }
        return this.cells[id] || this.overlays[id];
    },
    clearGrid: function(containerId) {
        for (const key in this.cells) {
            if (key.startsWith(containerId)) delete this.cells[key];
        }
    }
};
```
But wait! If `buildGrid` clears the innerHTML, the cached references will become stale!
So in `buildGrid`, we must update the cache with the newly created cells!

```javascript
        window.domCache = window.domCache || {
            elements: {},
            getElement: function(id) {
                if (!this.elements[id] || !document.contains(this.elements[id])) {
                    this.elements[id] = document.getElementById(id);
                }
                return this.elements[id];
            },
            setElement: function(id, el) {
                this.elements[id] = el;
            },
            clearElements: function(prefix) {
                for (let key in this.elements) {
                    if (key.startsWith(prefix)) {
                        delete this.elements[key];
                    }
                }
            }
        };
```
In `buildGrid`:
```javascript
            // Clear existing cache for this container
            if (window.domCache) window.domCache.clearElements(containerId);

            const fragment = document.createDocumentFragment();
            for (let r = 0; r < rows; r++) {
                const row = document.createElement('div'); row.className = 'grid-row';
                row.setAttribute('role', 'row');
                for (let c = 0; c < cols; c++) {
                    const cell = document.createElement('div');
                    // ...
                    if (window.domCache) window.domCache.setElement(cell.id, cell);
                    row.appendChild(cell);
                }
                fragment.appendChild(row);
            }
            grid.appendChild(fragment);
```
In `triggerRipple`, `renderPath`, etc.:
Replace `document.getElementById(cellId)` with `(window.domCache ? window.domCache.getElement(cellId) : document.getElementById(cellId))`.

Wait, what about "Écouteurs d'événements multiples par cellule | Délégation d'événements sur le parent"?
Does `buildGrid` attach event listeners?
No! `buildGrid` does not attach any event listeners to cells!

Let's verify if `assets/js/bluebot/bluebot-engine.js` attaches listeners to each cell.
Search for `.addEventListener` or `.onclick`.
```javascript
// In renderRobot:
overlay.onclick = (e) => { ... } // attached to the overlay, not the cell! There is only one overlay per robot.
```
Wait, check `assets/js/bluebot/bluebot-ui.js` line 548:
```javascript
        document.getElementById('read-grid').addEventListener('click', (e) => {
            const cell = e.target.closest('.bot-cell');
            if (!cell || readState.isAnimating || readState.locked) return;
            // ...
        });
```
This IS event delegation! It's already there!
But what about `sim-grid`, `explore-grid`, `chal-grid`?
They have drag/drop events.
```javascript
        document.getElementById('sim-grid').addEventListener('drop', (e) => { ... })
        document.getElementById('explore-grid').addEventListener('drop', (e) => { ... })
```
This is also event delegation!

Is there any listener inside `buildGrid`?
```javascript
            for (let r = 0; r < rows; r++) {
...
                for (let c = 0; c < cols; c++) {
                    const cell = document.createElement('div');
...
```
No. So the user is just reminding me to check for these traps, and fix them if they exist!

Let's double check "setInterval pour les animations | Utiliser requestAnimationFrame"
`oceanRippleInterval = setInterval(...)` should be changed. The ocean ripple doesn't strictly need `requestAnimationFrame` since it's just triggering a timeout-based ripple every 2s, but the table says "Utiliser requestAnimationFrame". Or maybe it refers to something else? Let's check `assets/js/bluebot/bluebot-engine.js` `setInterval`.
I will change `oceanRippleInterval` to use a cascading `requestAnimationFrame` loop or standard `setTimeout` loop.
Wait, "setInterval pour les animations" could refer to the dragon fire? No, dragon fire uses `requestAnimationFrame`.
I will change `oceanRippleInterval` to use cascading `setTimeout`, and inside `triggerRipple` we have:
`setTimeout(() => { ... }, delay)`
This could be kept, but wait. `oceanRippleInterval` uses `setInterval`!
```javascript
        let oceanRippleTimeout = null;

        function startOceanRipples() {
            if (oceanRippleTimeout) clearTimeout(oceanRippleTimeout);
            const loop = () => {
                if (activeSkin !== 'pirate') return;
                const row = Math.floor(Math.random() * GRID_ROWS);
                const col = Math.floor(Math.random() * GRID_COLS);
                triggerRipple(row, col, 0);
                oceanRippleTimeout = setTimeout(loop, 2000);
            };
            oceanRippleTimeout = setTimeout(loop, 2000);
        }

        function stopOceanRipples() {
            if (oceanRippleTimeout) {
                clearTimeout(oceanRippleTimeout);
                oceanRippleTimeout = null;
            }
        }
```
This fixes the `setInterval` issue.

What about `Recalculs CSS (getBoundingClientRect en boucle) | Lire avant, écrire après (éviter le layout thrashing)`?
Where is layout thrashing occurring?
Maybe in `updateGridContainersAspectRatio`?
```javascript
        function updateGridContainersAspectRatio() {
            const containers = document.querySelectorAll('.bot-grid-container');
            containers.forEach(container => {
                container.style.aspectRatio = `${GRID_COLS} / ${GRID_ROWS}`;
            });

            const grids = document.querySelectorAll('.bot-grid');
            grids.forEach(grid => {
                grid.style.aspectRatio = `${GRID_COLS} / ${GRID_ROWS}`;
            });
        }
```
Is `aspectRatio` causing layout thrashing? Setting `style.aspectRatio` is a write. But there is no read (`getBoundingClientRect` or `offsetWidth`) before it.

What about `assets/js/bluebot/bluebot-engine.js` `placeOverlay`?
```javascript
        function placeOverlay(containerId, overlayId, row, col, content, extraClass, ariaLabel = '') {
            let ov = document.getElementById(overlayId); // <== READ
            const isNew = !ov;
            if (isNew) {
                ov = document.createElement('div'); ov.id = overlayId; ov.className = extraClass || ''; // <== WRITE
            }
            if (content.startsWith('<')) {
                ov.innerHTML = content;
            } else {
                ov.innerText = content;
            }
            ov.style.width = (100 / GRID_COLS) + '%';
            ov.style.height = (100 / GRID_ROWS) + '%';
            ov.style.transform = `translate(${col * 100}%, ${row * 100}%)`; // <== WRITE
            ov.setAttribute('role', 'img');
            if (ariaLabel) ov.setAttribute('aria-label', ariaLabel);
            if (isNew) document.getElementById(containerId).appendChild(ov); // <== WRITE
        }
```
If we use `window.domCache`, we avoid the DOM read for `document.getElementById`.

Wait! The user instruction explicitly says:
`querySelector dans une boucle d'animation` -> `Mettre en cache les références DOM`
`Manipulation DOM dans une boucle` -> `Utiliser DocumentFragment ou batch`
I will implement `DocumentFragment` in `buildGrid`.
I will cache `document.getElementById(cellId)` in `triggerRipple` and `renderPath`.
