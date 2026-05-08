Wait!
"Problème fréquent | Solution"
"querySelector dans une boucle d'animation | Mettre en cache les références DOM"
"setInterval pour les animations | Utiliser requestAnimationFrame"
"Écouteurs d'événements multiples par cellule | Délégation d'événements sur le parent"
"Manipulation DOM dans une boucle | Utiliser DocumentFragment ou batch"
"Recalculs CSS (getBoundingClientRect en boucle) | Lire avant, écrire après (éviter le layout thrashing)"

Let's find `getBoundingClientRect` in a loop.
Is `triggerDragonFire` doing layout thrashing?
```javascript
                        const rect = overlay.getBoundingClientRect();
                        if (rect.width === 0 || rect.height === 0) return;

                        let startX = rect.left + rect.width / 2;
                        let startY = rect.top + rect.height / 2;
                        ...
                        // Inside anim() loop
                        // anim() is a loop using requestAnimationFrame
```
Wait, `getBoundingClientRect` is called *once* inside `triggerDragonFire()`, and then `anim()` loops using those cached `startX` and `startY`. It does NOT call `getBoundingClientRect` inside `anim()`.

Let's search for layout thrashing (Read after Write) or `getBoundingClientRect` in a loop.
What if the loop is `updateGridContainersAspectRatio` or something?
