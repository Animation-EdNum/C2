# 🏗️ Mode d'emploi : Jeu de la grue

Le **Jeu de la grue** initie les élèves à la pensée algorithmique, à la planification séquentielle et à la résolution de problèmes spatiaux. L'élève programme une grue sur rail pour réorganiser des cubes colorés et reproduire la disposition cible.

Alignement : Cycles 1 et 2 PER (1-2H DÉ>CODAGE, pensée computationnelle & planification séquentielle).

---

## Pourquoi cet outil ?

- **Pensée algorithmique :** Structurer une suite d'instructions déterministe (la grue exécute strictement les ordres programmés à l'avance).
- **Planification & anticipation :** Déplacer un cube temporairement sur une colonne libre pour accéder à celui du dessous (problème des tours de Hanoï simplifié).
- **Gestion des états :** Respecter l'état de la pince (vide / chargée) et la capacité maximale de chaque colonne (3 cubes par colonne).
- **Descente et remontée automatisées :** La grue circule toujours en hauteur sur son rail au-dessus des colonnes. Dès qu'on actionne la pince, elle descend automatiquement chercher le bloc ou le poser, puis remonte sur son rail. Cela élimine la surcharge cognitive verticale pour se concentrer sur l'ordonnancement logique des déplacements.
- **Débogage guidé :** Analyser visuellement pourquoi une commande échoue (message d'arrêt contextuel avec icône explicite).

---

## 1. Les trois niveaux de difficulté

| Niveau | Nombre de cubes | Démarche requise |
|---|---|---|
| 🟢 **Facile** | 1 cube | Trajet direct — idéal pour le Cycle 1 (1-2H) ou la prise en main rapide. |
| 🟡 **Moyen** | 2 cubes | Première coordination et ordonnancement de déplacements entre colonnes. |
| 🔴 **Difficile** | 3 cubes | Impose des déplacements intermédiaires (stockage temporaire sur la colonne libre pour libérer un cube inférieur). |

---

## 2. Les 3 commandes de la grue

La grue répond à **3 ordres élémentaires** en ligne, identifiés par couleur et raccourci clavier :

| Commande | Couleur | Raccourci | Action |
|---|---|---|---|
| ⬅️ **Gauche** | Orange | `←` | Déplacer la grue d'une colonne vers la gauche le long du rail |
| ✊ / ✋ **Pince** | Rouge | `Espace` | **Action automatique :** descend jusqu'au cube, l'attrape (ou le pose), et remonte au niveau du rail |
| ➡️ **Droite** | Vert | `→` | Déplacer la grue d'une colonne vers la droite le long du rail |

> 💡 **Indicateur d'état en direct :**
> - L'icône de la pince bascule dynamiquement : **poing fermé** ✊ pour attraper, **main ouverte** ✋ pour lâcher/poser.
> - Dans la bande de programme, chaque étape d'action affiche clairement si elle correspond à une saisie ou à une dépose.

---

## 3. Construire et exécuter

1. **Ajouter un ordre :** Cliquez sur un bouton (`⬅️`, `✊`, `➡️`) ou utilisez les touches du clavier (`←`, `Espace`, `→`).
2. **Modifier la séquence :**
   - Cliquez directement sur une commande dans la bande de programme pour la supprimer.
   - **« Effacer »** (ou `Retour arrière`) pour retirer la dernière instruction.
   - **« Tout vider »** pour réinitialiser la bande de code.
3. **Exécuter :** Cliquez sur **« ▶ Exécuter »** (ou `Entrée`).
   - La grue rejoue le programme étape par étape.
   - Le bloc de commande en cours d'exécution est surligné en direct.
   - La grue descend visuellement au fond de la colonne pour attraper ou déposer le cube, puis remonte au rail pour voyager vers la colonne suivante.

---

## 4. Analyse des erreurs (Pédagogie de l'échec)

Si la grue rencontre une situation interdite :
- **Mur !** (tentative de sortir du rail à gauche ou à droite).
- **Rien ici !** (action de saisie au-dessus d'une colonne vide).
- **Colonne pleine !** (tentative de déposer un cube dans une colonne contenant déjà 3 cubes).
- **Objet non posé !** (fin du programme alors que la grue tient encore un cube).
- **Disposition incorrecte !** (les cubes ne correspondent pas au modèle cible).

**Comportement en cas d'erreur :**
- L'exécution s'interrompt immédiatement.
- L'étape fautive devient **noire et agrandie** dans la bande de code pour repérer instantanément le bug.
- Un toast rouge contextuel avec icône explicite signale la cause exacte.
- **Correction instantanée :** Dès que l'élève clique sur une commande ou efface une étape, le délai d'attente s'annule immédiatement pour lui permettre de retester sans attendre.

---

## 5. Gamification & Scores

- **Confettis 🎉** à chaque défi validé.
- **Série 🔥 :** Célébration dynamique à chaque victoire consécutive sans erreur.
- **Statistiques :** Suivi complet des réussites et des essais par niveau de difficulté via l'icône camembert.

---

## 🏫 Scénario d'activité en classe (45 min)

1. **Phase débranchée (10 min) :** Un élève joue le robot grue les bras tendus. Son binôme lui donne des ordres précis (*« Droite, Attrape, Gauche, Pose »*).
2. **Démonstration collective TBI (5 min) :** Résolution d'un défi niveau Facile puis Moyen en verbalisant l'anticipation (*« Quel cube doit-on déplacer d'abord pour dégager le second ? »*).
3. **Atelier binômes (25 min) :** Un élève conçoit l'algorithme sur ardoise ou à l'écran, son binôme vérifie mentalement avant de lancer l'exécution.
4. **Mise en commun (5 min) :** Présentation des stratégies de stockage intermédiaire pour le niveau Difficile (analogie avec le tri et les piles informatiques).
