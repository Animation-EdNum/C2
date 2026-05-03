# Plan for "Routage Réseau Extrême" Mode

1. **Add Extreme Mode Button and Configuration:**
   - Update `routage_reseau.html` to add the "Extrême" difficulty button (`<button class="diff-btn" id="diff-extreme" style="display:none">🔴 Extrême</button>`). We'll unlock it if the user completes a hard challenge or we'll follow standard procedures to just make it available. Actually, the request says "Ce mode serait le difficulté extrême débloquée uniquement après agi réussi un défi difficile". So we need to show the extreme button when `difficulty === 'hard'` and `userTime === optimalTime`. We'll just display it.
   - Add extreme networks to `networkPool` or reuse hard networks.
   - Wait, if it says "débloquée uniquement après agi réussi un défi difficile", maybe we should hide it by default and show it when `launchFire()` is called (which means hard was completed perfectly).

2. **Implement Dynamic Route Failures (Solar Flares):**
   - Introduce a new state `isDynamicMode = (difficulty === 'extreme')`.
   - The user selects `extreme` mode.
   - When in extreme mode, the network starts normally. But instead of an instant path calculation, maybe as they click or periodically, random edges/nodes fail? "Pendant que les paquets voyagent, des tempêtes solaires surviennent aléatoirement : certains routeurs ou câbles tombent en panne ou deviennent saturés. L'utilisateur doit modifier ses tables de routage en temps réel ou dévier manuellement les paquets restants..."
   - Wait, currently in `routage_reseau.html`, you just click nodes sequentially to build the path, and it instantly calculates time. There are no "paquets qui voyagent". We need to change how the game plays in "extreme" mode.
   - In extreme mode:
     - The user clicks to build a path step by step. Or maybe they plan the path and THEN hit "Go" and watch the packet travel?
     - "pendant que les paquets voyagent ... L'utilisateur doit modifier ses tables de routage en temps réel ou dévier manuellement"
     - Wait, in the current implementation, as soon as you click `dst`, it checks the path and ends.
     - So for dynamic mode, perhaps after clicking `dst`, we start a "packet travel" phase. BUT it says "dévier manuellement les paquets restants". Maybe we need a "Start" button for extreme mode, where the packet starts at `src`, and moves to the next node every X seconds. Before it reaches the next node, a solar flare might break a future router. The user can then click the current router to change the next step? This is a huge paradigm shift.

Let's read the prompt carefully:
"La mécanique : Actuellement on cherche le meilleur chemin. Dans ce mode "dynamique", pendant que les paquets voyagent, des "tempêtes solaires" surviennent aléatoirement : certains routeurs ou câbles "tombent en panne" (clignotent en rouge puis s'éteignent) ou deviennent saturés (embouteillages). L'utilisateur doit modifier ses tables de routage en temps réel ou dévier manuellement les paquets restants pour éviter les zones mortes et garantir que le message arrive à bon port."

How to implement this simply in the current architecture:
- Add a new difficulty "extreme".
- In "extreme" mode, the interaction could be: You don't build the whole path. You are the packet. You start at `src`.
- Every X seconds (e.g., 2 seconds), a random edge or node changes weight (increases, gets "saturé") or breaks (weight = Infinity, "panne"). We visually update it (flashing red).
- The user must click the next adjacent node to move the packet there. They move node by node.
- Since it's dynamic, the "time" is actually accumulating based on the weights.
- Wait, the user clicks node by node currently! `currentPath` is built one click at a time.
- So we could just have a timer that runs in `extreme` mode as soon as the challenge starts.
- Every Y seconds, a random edge or router is affected.
- But the user takes their time to click. "pendant que les paquets voyagent" implies an automated travel or real-time pressure.
- Real-time pressure: as you are deciding the next click, a router might suddenly break (clignote en rouge, puis disparait ou devient non cliquable).
- We can implement a `setInterval` in `extreme` mode. Every 3 seconds, pick a random router (not `src`, `dst`, or currently in `currentPath`) or edge, and break it (remove from `adjacency` or set weight very high) or increase its weight. Trigger a visual effect (flash red, then turn grey/red).
- The user has to reach `dst`.
- How is the score evaluated in extreme mode? If they reach `dst`, they win? Because calculating the "optimal" path is impossible if it changes dynamically.
- "Ce mode serait le difficulté extrême débloquée uniquement après avoir réussi un défi difficile"

Let's refine:
- Unlock condition: In `checkPath()`, if `difficulty === 'hard'` and `userTime === optimalTime`, unhide the `diff-extreme` button and show a toast "Mode Extrême débloqué !".
- Extreme network: Reuse the hard networks, or add new ones.
- When `difficulty === 'extreme'`:
  - `isDynamicMode = true`.
  - Start a loop: `dynamicInterval = setInterval(solarFlare, 3000)`.
  - `solarFlare()` function:
    - Pick a random router (type 'r') that is NOT in `currentPath`. Or pick a random edge.
    - Change its state. Let's say we have `brokenNodes = []` and `brokenEdges = []`.
    - Visually flash it red, then mark it as broken.
    - If a node is broken, its edges are unusable.
    - The user can only click non-broken adjacent nodes.
    - If the user is trapped (no valid clicks), they must click Undo or Reset, but wait, if it's real time, maybe they just get stuck and have to Reset.
    - Actually, the prompt says: "L'utilisateur doit modifier ses tables de routage en temps réel ou dévier manuellement les paquets restants pour éviter les zones mortes" -> Since they build the path step-by-step, they just pick a different route.
    - If they reach `dst`, they win. In extreme mode, just reaching `dst` is a success, or maybe reaching it within a certain time limit? Reaching `dst` is enough because the optimal path changes.

Let's check if the user is already building the path node by node. Yes, they click a node, it's added to `currentPath`, then they click the next.
So while they are thinking, nodes break.

Wait, "pendant que les paquets voyagent". Does the packet travel automatically?
Currently, the user clicks to form the path. There is no automated packet travel.
To make it "pendant que les paquets voyagent", we could change the mode so that:
1. The user builds a path as usual.
2. The user clicks "Envoyer".
3. The packet starts moving node by node automatically.
4. While moving, things break. If the packet's next node breaks, it stops, and the user must quickly click a new path from the current node?
This is a bit complex. Let's re-read: "Actuellement on cherche le meilleur chemin. Dans ce mode "dynamique", pendant que les paquets voyagent... L'utilisateur doit modifier ses tables de routage en temps réel ou dévier manuellement les paquets".

Actually, we could just say that in Extreme mode, you are guiding the packet step-by-step in real-time. Each click moves the packet. While you are doing this, the network changes.
Is there an "Envoyer" button? No, currently "Auto-vérification dès qu'on arrive en B". So you build the path step by step.

Let's implement the real-time changes while the user is clicking.
