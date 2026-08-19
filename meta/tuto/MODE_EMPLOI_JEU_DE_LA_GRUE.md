# 🏗️ Mode d'emploi : Jeu de la grue

Le **Jeu de la grue** initie les élèves à la pensée algorithmique, à la planification séquentielle et à la résolution de problèmes sous contraintes physiques. L'élève programme une grue sur rail pour réorganiser des cubes colorés et reproduire la disposition cible.

Alignement : Cycles 1 et 2 PER (pensée computationnelle & planification spatiale).

---

## Pourquoi cet outil ?

- **Pensée algorithmique :** Structurer une suite d'instructions déterministe (la grue exécute strictement les ordres reçus).
- **Planification & anticipation :** Déplacer un cube temporairement sur une colonne libre pour accéder à celui du dessous.
- **Gestion des contraintes :** Respecter l'état de la pince (vide / chargée) et la hauteur requise pour relâcher un objet sans le faire tomber.
- **Débogage guidé :** Analyser visuellement pourquoi une commande échoue (message d'arrêt explicatif).

---

## 1. Les trois niveaux de difficulté

| Niveau | Nombre de cubes | Démarche requise |
|---|---|---|
| 🟢 **Facile** | 1 cube | Trajet direct — idéal pour le Cycle 1 (4-7 ans) ou la prise en main. |
| 🟡 **Moyen** | 2 cubes | Première coordination et ordonnancement de déplacements. |
| 🔴 **Difficile** | 3 cubes | Impose des déplacements intermédiaires (stockage temporaire sur la colonne libre). |

---

## 2. Les 5 commandes de la grue

La grue répond à **5 ordres élémentaires** identifiés par couleur et raccourci clavier :

| Commande | Couleur | Raccourci | Action |
|---|---|---|---|
| ⬆️ **Haut** | Bleu | `↑` | Remonter la pince au niveau du rail |
| ⬇️ **Bas** | Violet | `↓` | Descendre la pince vers la colonne |
| ⬅️ **Gauche** | Orange | `←` | Déplacer le chariot d'une colonne vers la gauche |
| ➡️ **Droite** | Vert | `→` | Déplacer le chariot d'une colonne vers la droite |
| ✊ **Pince** | Rouge | `Espace` | Basculer l'état : attraper ou relâcher un cube |

> 💡 L'icône du bouton *Pince* s'adapte en direct : main ouverte quand elle transporte un cube, poing fermé quand elle est vide.

---

## 3. Construire et exécuter

1. **Ajouter un ordre :** Cliquez sur un bouton ou utilisez les touches du clavier.
2. **Modifier la séquence :**
   - Cliquez sur une carte dans la bande de programme pour la supprimer.
   - `Retour arrière` pour effacer le dernier ordre.
   - **« Tout vider »** pour recommencer à zéro.
3. **Exécuter :** Cliquez sur **« ▶ Exécuter »** (ou `Entrée`). La grue s'anime et surligne chaque étape exécutée.

---

## 4. Analyse des erreurs (Pédagogie de l'échec)

Si la grue tente une action interdite (heurter un cube par le côté, sortir du rail, lâcher un cube trop haut) :
- L'exécution s'arrête instantanément.
- La carte fautive devient **noire et agrandie** dans la bande.
- Un message explicatif contextuel indique la cause (ex. *« La grue doit descendre juste au-dessus de la cible pour relâcher l'objet ! »*).
- L'élève identifie son bug et ajuste son programme.

---

## 5. Gamification & Scores

- **Confettis 🎉** à chaque niveau validé.
- **Série 🔥 :** Animation renforcée toutes les 3 victoires consécutives sans erreur.
- **Statistiques :** Suivi des taux de réussite via le bouton camembert.

---

## 🏫 Scénario d'activité en classe (45 min)

1. **Phase débranchée (10 min) :** Un élève joue le robot yeux fermés, son binôme lui donne des ordres précis à voix haute (*« Avance de 2 pas, baisse la main, attrape »*).
2. **Démonstration TBI (5 min) :** Résolution guidée d'un défi en verbalisant la stratégie.
3. **Atelier binômes (25 min) :** Un *Programmeur* conçoit l'algorithme, un *Vérificateur* relit mentalement avant d'exécuter.
4. **Mise en commun (5 min) :** Partage des stratégies de stockage temporaire pour le niveau Difficile.

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*