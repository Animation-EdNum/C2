1. **HTML Additions:**
   - Add `<button class="diff-btn" id="diff-extreme" style="display:none">🔥 Extrême</button>`
   - Add extreme networks to `networkPool` (maybe one or two very large ones or just use `hard` ones but more complex).

2. **Unlock Logic:**
   - In `checkPath()` inside the `if (difficulty === 'hard' && mistakesInCurrentNetwork === 0)` block, check if `diff-extreme` is hidden. If so, `document.getElementById('diff-extreme').style.display = 'inline-block'`, and call `showToast("Mode Extrême débloqué !", "success", 4000)`. Wait, we need to make sure `showToast` is available. Let's include `<script src="../js/toast.js"></script>` at the end of body.

3. **Solar Flare Logic (Dynamic mode):**
   - Add `let solarInterval = null;`
   - In `newChallenge()`, `clearInterval(solarInterval);`.
   - Add `brokenNodes = []`, `brokenEdges = []`.
   - If `difficulty === 'extreme'`, set `solarInterval = setInterval(triggerSolarFlare, 4000);` (every 4s).
   - In `triggerSolarFlare()`:
     - Randomly pick to break/saturate an edge or a node.
     - Don't break `src`, `dst`, or nodes already in `currentPath`.
     - Don't break nodes/edges if it makes the network disconnected (maybe too hard to check, just allow it and the user has to Reset). Actually, part of the stress is getting stuck! But maybe prefer saturating (increasing weight) over breaking?
     - "certains routeurs ou câbles tombent en panne (clignotent en rouge puis s'éteignent) ou deviennent saturés (embouteillages)"
     - Let's do: 50% chance to break a router, 50% chance to saturate an edge.
     - Saturated edge: Find a random edge not connected to `currentPath` (or maybe connected? just not currently traversed). Increase its weight by +5. Flash it orange/red.
     - Broken router: Find a random router not in `currentPath`. Add it to `brokenNodes`. Flash it red, then give it a CSS class `node-broken` (which hides it or turns it grey/unclickable).
     - Call `render()`.
     - Add CSS for `.node-broken` and `.edge-saturated`.

4. **Scoring in Extreme Mode:**
   - Since weights and nodes change dynamically, `getFastestPath` is tricky. But the user just needs to survive and reach `dst`.
   - In `checkPath()` for `extreme` mode, if they reach `dst`, they win immediately (since there's no static "optimal time" anymore). "✅ Vous avez survécu à la tempête ! Temps : ..."

Let's refine the Solar Flare mechanics.
