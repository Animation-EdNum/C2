Based on the table:
1. "Recréer la grille entière à chaque mouvement" -> "Ne mettre à jour que les cellules modifiées (diff DOM)". Wait, does it recreate the grid on each move? `runProgram` calls `sleep`, then `renderRobot`, then `renderPath` ... wait, `renderPath`? `triggerRipple`?
No, the memory note says: "To optimize frequent UI updates in vanilla JavaScript that repeatedly query the DOM inside loops (e.g., calling `document.getElementById` or `querySelectorAll` in animation ticks), pre-cache the DOM element references into a global data structure (like an array or object). Avoid 'optimizations' that replace O(1) ID lookups with O(N^2) array searches (like using `Array.from(document.querySelectorAll).find()` inside a loop) as these significantly degrade performance."
Wait, the prompt says:
Problème fréquent | Solution
querySelector dans une boucle d'animation | Mettre en cache les références DOM
Manipulation DOM dans une boucle | Utiliser DocumentFragment ou batch

Let's check where DocumentFragment should be used. `buildGrid` should use DocumentFragment!
```javascript
        function buildGrid(containerId, rows, cols, obstacles = []) {
            const grid = document.getElementById(containerId);
            grid.innerHTML = ''; grid.style.position = 'relative';
            // ...
            const fragment = document.createDocumentFragment();
            for (let r = 0; r < rows; r++) {
                const row = document.createElement('div');
                // ...
                fragment.appendChild(row);
            }
            grid.appendChild(fragment);
```
Yes, this fixes "Manipulation DOM dans une boucle".

What about `querySelector dans une boucle d'animation`?
In `assets/js/bluebot/bluebot-engine.js`:
```javascript
                        function anim() {
                            if (!document.contains(overlay)) {
                                ctx.clearRect(0, 0, cvs.width, cvs.height);
                                return;
                            }
```
Wait, `document.contains(overlay)` is inside `anim()` which runs via `requestAnimationFrame`. This is a DOM check inside an animation loop. We can cache it, but overlay is passed.
Wait, let's look at `assets/js/bluebot/bluebot-engine.js` line 1047:
`const allCells = document.querySelectorAll('#${gridId} .bot-cell .mat-content');` inside something? No, that's not animation.

Let's look at "querySelector dans une boucle d'animation". In `dragonFireActive` or something?
Wait, the memory says: "To optimize frequent UI updates in vanilla JavaScript that repeatedly query the DOM inside loops (e.g., calling document.getElementById or querySelectorAll in animation ticks), pre-cache the DOM element references into a global data structure (like an array or object). Avoid 'optimizations' that replace O(1) ID lookups with O(N^2) array searches (like using Array.from(document.querySelectorAll).find() inside a loop) as these significantly degrade performance."

Wait, `triggerRipple` uses `document.getElementById(cellId)` multiple times inside cascading `setTimeout`s. Is that considered an animation tick? Maybe! But is there an `Array.from(document.querySelectorAll).find()` inside a loop somewhere? Let's check!
