# 🔍 Audit du dépôt C2 — Résultats

Analyse complète des fichiers JS et CSS partagés, des modules automate, et des webapps.

---

## 🐛 Bugs confirmés

### 1. Déblocage botanique incomplet dans les modes non-simulateur (BUG)

Le skin `botanique` se débloque après 5 erreurs consécutives, et ceci doit fonctionner dans **n'importe quel mode**. Or la vérification `>= 5` n'existe qu'en mode Simulateur :

**Fichier** : [automate-engine.js](file:///d:/Mes%20Documents/Antigravity/Github%20Animation%20HEP-VS/C2/assets/js/automate/automate-engine.js#L835-L837)

```js
// L835-837 — handleObstacleCollision() (simulateur uniquement)
simState.consecutiveMistakes++;
if (simState.consecutiveMistakes >= 5) unlockSkin('botanique'); // ✅ Seul endroit avec la vérification
```

**Problèmes par mode** :

| Mode | Compteur incrémenté | Vérification `>= 5` ? | Peut débloquer botanique ? |
|---|---|---|---|
| Simulateur | `simState.consecutiveMistakes` (L835) | ✅ Oui (L837) | ✅ Oui |
| Décodage (Read) | `simState.consecutiveMistakes` (L1820) | ❌ Non | ❌ Non |
| Exploration | `exploreState.consecutiveMistakes` (L373) | — | N/A (exclu par design) |
| Pilotage (Challenge) | — | — | ❌ Pas de compteur |
| Dessin (Draw) | — | — | ❌ Pas de compteur |

De plus, le mode **Décodage** (L1820) incrémente `simState.consecutiveMistakes` au lieu d'un compteur propre au Read — ce qui pollue le compteur du simulateur.

> [!WARNING]
> Pour que botanique soit déblocable depuis tous les modes, il faudrait soit un compteur global partagé, soit ajouter la vérification `>= 5` dans chaque mode.

---

### 2. Code dupliqué massif dans `automate-ui.js` (QUALITÉ)

**Fichier** : [automate-ui.js](file:///d:/Mes%20Documents/Antigravity/Github%20Animation%20HEP-VS/C2/assets/js/automate/automate-ui.js#L275-L374)

Les handlers de `collectToggle` (L275-327) et `memoryToggle` (L329-374) contiennent un **bloc identique de ~40 lignes** qui reconstruit toutes les grilles :

```js
// Ce bloc apparaît 2 fois, copié-collé :
if (typeof buildGrid === 'function') {
    buildGrid('sim-grid', GRID_ROWS, GRID_COLS, simState.obstacles);
    // ... renderRobot pour sim, explore, chal, read, draw
    // ... TrailManager.clear pour chacun
}
```

> [!TIP]
> Extraire une fonction `rebuildAllGrids()` pour éliminer la duplication et réduire le risque d'oubli lors de futures modifications.

---

### 3. `showToast` appelée avec `true`/`false` au lieu de `'success'`/`'error'`

**Fichier** : [automate-engine.js](file:///d:/Mes%20Documents/Antigravity/Github%20Animation%20HEP-VS/C2/assets/js/automate/automate-engine.js#L1652)

```js
showToast(`Forme réussie !`, true);   // L1652 — utilise le boolean legacy
showToast(errorMsg, false);            // L1675 — idem
```

Le module `toast.js` gère le cas legacy (`true` → success, `false` → error), donc pas de crash. Mais c'est incohérent avec le reste du code automate qui utilise `'success'` / `'error'`.

> [!NOTE]
> Migration simple : remplacer `true` par `'success'` et `false` par `'error'` dans ces 2 appels pour uniformiser.

---

### 4. Drag-and-drop du robot dupliqué pour `sim-grid`

**Fichier** : [automate-engine.js](file:///d:/Mes%20Documents/Antigravity/Github%20Animation%20HEP-VS/C2/assets/js/automate/automate-engine.js#L2191-L2360)

Le code `draggable` pour `sim-grid` est défini **deux fois** dans `renderRobot()` :

- **L2191-2202** : un bloc générique pour `sim-grid` ET `explore-grid`
- **L2350-2360** : un second bloc spécifiquement pour `sim-grid` qui **écrase** le premier

Le second bloc remplace `ondragstart` par une version qui ne vérifie pas `exploreState.running` (car il est spécifique au sim), mais le premier bloc l'a déjà configuré. C'est du code mort redondant.

> [!WARNING]
> Le second bloc (L2350-2360) devrait être supprimé car le premier (L2191-2202) couvre déjà `sim-grid`.

---

## ⚡ Optimisations recommandées

### 5. `base.css` — Sélecteurs high-contrast dupliqués

**Fichier** : [base.css](file:///d:/Mes%20Documents/Antigravity/Github%20Animation%20HEP-VS/C2/assets/css/base.css#L131-L186)

Plusieurs règles sont définies deux fois :

| Sélecteur | Lignes |
|---|---|
| `body.high-contrast { background-color: #fff }` | L131-134 **et** L152-154 |
| `body.high-contrast [style*="background"]` | L176-179 **et** L182-186 |
| `body.high-contrast .filter-btn` | L146-149 **et** L160-165 |

> [!TIP]
> Fusionner ces déclarations pour réduire la taille du fichier et éviter la confusion.

---

### 6. `automate-engine.js` — Fonctions `randomizeWalls` dupliquées

**Fichier** : [automate-engine.js](file:///d:/Mes%20Documents/Antigravity/Github%20Animation%20HEP-VS/C2/assets/js/automate/automate-engine.js#L490-L687)

`randomizeSimWalls()` (L490-535) et `randomizeExploreWalls()` (L642-687) sont des **copier-coller** quasi-identiques. Seule la variable d'état change (`simState` vs `exploreState`).

Idem pour :
- `placeRandomSimTarget()` / `placeRandomExploreTarget()`
- `clearSimWalls()` / `clearExploreWalls()`
- `randomizeSimulatorPosition()` / `randomizeExplorePosition()`

> [!TIP]
> Factoriser en fonctions paramétrées (ex: `randomizeWalls(state, gridId)`) pour réduire ~250 lignes de duplication.

---

### 7. `toast.js` — Commentaire obsolète "lucide"

**Fichier** : [toast.js](file:///d:/Mes%20Documents/Antigravity/Github%20Animation%20HEP-VS/C2/assets/js/toast.js#L60)

```js
// Initialize lucide icon if wrapper added  ← devrait dire "FontAwesome"
if (window.fa) {
    window.fa.createIcons();
}
```

Le projet utilise FontAwesome, pas Lucide. Commentaire vestige d'une ancienne implémentation.

---

### 8. `base.css` — Commentaire de fichier trompeur

**Fichier** : [base.css](file:///d:/Mes%20Documents/Antigravity/Github%20Animation%20HEP-VS/C2/assets/css/base.css#L1-L3)

```css
/* ============================================================
   shared.css — Styles communs à toutes les pages du projet C2
```

Le fichier s'appelle `base.css` mais le commentaire dit `shared.css`.

---

## 📊 Résumé par priorité

| Priorité | # | Description | Fichier |
|---|---|---|---|
| 🟠 Important | 1 | Déblocage botanique manquant dans les modes non-simulateur | automate-engine.js |
| 🟠 Important | 4 | Drag-and-drop dupliqué pour sim-grid | automate-engine.js:2350 |
| 🟡 Qualité | 2 | Bloc rebuild grilles dupliqué (collectToggle/memoryToggle) | automate-ui.js |
| 🟡 Qualité | 3 | showToast avec boolean au lieu de string | automate-engine.js |
| 🟡 Qualité | 6 | Fonctions sim/explore dupliquées (~250 lignes) | automate-engine.js |
| 🟢 Mineur | 5 | Sélecteurs CSS high-contrast dupliqués | base.css |
| 🟢 Mineur | 7 | Commentaire "lucide" obsolète | toast.js |
| 🟢 Mineur | 8 | Commentaire "shared.css" dans base.css | base.css |
