Let's list the optimizations based on the instructions:
"Problème fréquent | Solution
querySelector dans une boucle d'animation | Mettre en cache les références DOM
setInterval pour les animations | Utiliser requestAnimationFrame
Écouteurs d'événements multiples par cellule | Délégation d'événements sur le parent
Manipulation DOM dans une boucle | Utiliser DocumentFragment ou batch
Recalculs CSS (getBoundingClientRect en boucle) | Lire avant, écrire après (éviter le layout thrashing)
"
For my plan:

1. **Manipulation DOM dans une boucle**: In `buildGrid` in `assets/js/bluebot/bluebot-engine.js`, the code creates rows and cells and appends them inside a loop. I will update `buildGrid` to use `document.createDocumentFragment()` instead. I will also create a global `window.cellCache = {}` and store cells in it.

2. **querySelector dans une boucle d'animation**: In `triggerRipple` (which runs repeatedly due to timeouts and `setInterval`), it calls `document.getElementById` which is slow inside loops/cascades. I will change it to use `window.cellCache[cellId] || document.getElementById(cellId)`.

3. **setInterval pour les animations**: `oceanRippleInterval = setInterval(...)` should be modified. Wait, the prompt says "Utiliser requestAnimationFrame" for animations. The ocean ripples run every 2000ms. Is it really an animation? Actually, maybe the "dragon fire" animation needs optimization. But let's check `assets/js/bluebot/bluebot-engine.js` line 1934:
```javascript
        function startOceanRipples() {
            if (oceanRippleInterval) clearInterval(oceanRippleInterval);
            oceanRippleInterval = setInterval(() => {
                if (activeSkin !== 'pirate') return;
                const row = Math.floor(Math.random() * GRID_ROWS);
                const col = Math.floor(Math.random() * GRID_COLS);
                triggerRipple(row, col, 0);
            }, 2000);
        }
```
If we want to avoid `setInterval` for animations, we should use cascading `setTimeout` or `requestAnimationFrame`. Let's change `oceanRippleInterval` to a cascading `setTimeout`.
Actually, wait, in `dragonFire` animation, there is `if (!document.contains(overlay))` inside the requestAnimationFrame loop. That's a DOM check. Let's pre-cache it or use a boolean flag that updates when the robot overlay is removed? Actually, `document.contains` isn't `querySelector`.

Wait! The user memory says:
"To optimize frequent UI updates in vanilla JavaScript that repeatedly query the DOM inside loops (e.g., calling document.getElementById or querySelectorAll in animation ticks), pre-cache the DOM element references into a global data structure (like an array or object). Avoid 'optimizations' that replace O(1) ID lookups with O(N^2) array searches (like using Array.from(document.querySelectorAll).find() inside a loop) as these significantly degrade performance."

Wait, what if there IS an `Array.from(document.querySelectorAll).find()` in an animation tick?
Let's grep for `.find(`:
```
assets/js/bluebot/bluebot-engine.js:559:                findShortestPath(simState.robotRow, simState.robotCol, simState.robotDir, targetR, targetC, simState.obstacles) === null
assets/js/bluebot/bluebot-engine.js:1037:            const match = items.slice(0, -1).find(el => el.textContent.trim() === content);
```
No `Array.from(document.querySelectorAll).find()` inside an animation tick.

What about `document.getElementById` in `runProgram`? `runProgram` uses `await sleep(SIM_SPEED)`. Inside the loop, it calls `moveRobot`, which calls `triggerRipple`, `renderRobot`, `renderPath`.
In `renderRobot`, it calls `document.getElementById(overlayId)`.
In `placeOverlay`, it calls `document.getElementById(overlayId)` and `document.getElementById(containerId)`.
This happens inside the execution loop (`runProgram`).
I should cache all of these! Or at least use a `window.domCache = {}`.

Let's use `window.domCache` for all `getElementById` inside `placeOverlay`, `renderRobot`, `triggerRipple`, etc.
