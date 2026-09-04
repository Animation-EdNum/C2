# 🌐 Mode d'emploi : Routage réseau

**Routage réseau** simule la circulation des données sur Internet. L'élève trace le chemin le plus rapide entre deux ordinateurs à travers un réseau de routeurs pondérés en UTI (Unités de Temps Imaginaire).

Alignement programme : Cycle 2, Décodages 7-8H · Activité 8 — *Les réseaux, Niveau 2*.

---

## Pourquoi cet outil ?

- **Infrastructure d'Internet :** Un paquet de données ne voyage pas en ligne droite — il transite de routeur en routeur.
- **Court vs rapide :** Un chemin « visuellement court » peut être très lent si les liaisons sont encombrées. Le chemin optimal est celui dont la **somme des coûts** est minimale.
- **Algorithme de Dijkstra (intuition) :** Comparer systématiquement les sommes de plusieurs itinéraires concurrents.

---

## 1. Lire le réseau

| Élément | Représentation | Rôle |
|---|---|---|
| 🟢 **A** (vert) | Cercle de départ | Ordinateur émetteur |
| 🔴 **B** (rouge) | Cercle d'arrivée | Ordinateur récepteur |
| ⚪ Nœuds numérotés | Cercles intermédiaires | Routeurs relais |
| — Lignes de liaison | Segments entre les nœuds | Câbles réseau |
| 🟠 Pastilles | Nombre sur chaque liaison | Coût de transit en UTI |

**Objectif :** Tracer le chemin complet de **A → B** dont le **total d'UTI est le plus petit**.

---

## 2. Comment jouer

1. Cliquez sur le point de départ **A**.
2. Cliquez successivement sur les routeurs voisins pour construire votre itinéraire.
3. Les arêtes sélectionnées s'illuminent et le compteur d'UTI cumulé s'actualise en direct.
4. Pour revenir en arrière, recliquez sur le nœud précédent.
5. Cliquez sur **Vérifier** :
   - ✅ Chemin optimal → confettis et série 🔥 !
   - ❌ Chemin plus rapide existant → le système affiche votre coût et vous invite à chercher mieux.

---

## 3. Niveaux de difficulté

- **🟢 Facile :** 4-5 routeurs, peu de ramifications.
- **🟡 Moyen :** 6-8 routeurs, plusieurs boucles concurrentes.
- **🔴 Difficile :** 9-12 routeurs, pièges visuels (branches directes mais coûteuses, détours économiques).

---

## 4. Options pédagogiques

| Option | Effet |
|---|---|
| **Couleurs de poids** (`&coloredWeights=1`) | Colore les pastilles d'UTI : vert = rapide, orange = moyen, rouge = lent. Aide à la prise de décision rapide. |
| **Carte fixe** (`&lockTopology=1` + `&seed=1234`) | Toute la classe résout le même réseau en même temps. |

---

## 🏫 Activité débranchée : « Les Routeurs humains »

1. Dessinez un graphe réseau au sol (craie) ou projetez-le au TBI.
2. Placez un élève sur chaque nœud (routeur).
3. Donnez un « paquet » (ballon ou enveloppe) à l'élève **A**.
4. Chaque routeur ne connaît que le coût de ses liaisons directes. Les élèves communiquent pour trouver collectivement le meilleur chemin.
5. Vérification sur l'application.
