# 🌐 Mode d'emploi : Routage réseau

Bienvenue dans le guide d'utilisation de **Routage réseau - Temps et UTI**, une simulation visuelle et interactive permettant d'explorer comment les données circulent sur Internet et comment les routeurs déterminent le chemin optimal à travers un réseau maillé.

Cette activité correspond au programme du Cycle 2 (Décodages 7-8H · Activité 8 — *Les réseaux, Niveau 2*).

---

## 🌟 Enjeux Pédagogiques (Utilité en classe)

- **Infrastructure d'Internet :** Comprendre qu'un paquet de données ne voyage pas en ligne droite, mais transite d'ordinateur en routeur jusqu'au destinataire.
- **Chemin le plus court vs le plus rapide :** Prendre conscience qu'un chemin "visuellement court" (avec peu de nœuds) peut être beaucoup plus lent qu'un chemin faisant des détours si les liaisons sont encombrées ou lentes.
- **Pondération d'un graphe & Algorithme du plus court chemin :** S'initier intuitivement aux principes de l'algorithme de Dijkstra en calculant et comparant la somme des coûts de chaque route (exprimée en UTI — Unités de Temps Imaginaire).
- **Stratégie d'optimisation :** Évaluer systématiquement plusieurs chemins alternatifs avant de valider.

---

## 1. Découvrir l'interface & Règles du jeu

Sur l'écran, un réseau de routeurs interconnectés relie l'ordinateur émetteur **A** (vert) à l'ordinateur récepteur **B** (rouge) :

- **Nœuds (Cercles numérotés) :** Les routeurs qui relaient les paquets.
- **Arêtes (Lignes de liaison) :** Les câbles ou connexions réseau reliant les routeurs.
- **Coûts (Pastilles orange) :** Les temps de transit en **UTI** associés à chaque liaison.
- **Objectif :** Tracer le chemin complet de **A vers B** dont la **somme totale des UTI est minimale**.

---

## 2. Comment tracer et valider un chemin

1. Cliquez sur le point de départ **A**.
2. Cliquez successivement sur les routeurs voisins pour construire votre itinéraire jusqu'à **B**.
3. Les arêtes sélectionnées s'illuminent et le compteur d'UTI cumulé s'actualise en temps réel.
4. Pour corriger ou revenir en arrière, recliquez sur le nœud précédent.
5. Cliquez sur **Vérifier** :
   - Si votre chemin est le plus rapide absolu : félicitations, feux d'artifice et série de victoires 🔥 !
   - Si un chemin plus rapide existait : le système indique le coût de votre chemin et vous invite à chercher une alternative plus avantageuse.

---

## 3. Les 3 Niveaux de Difficulté

- **🟢 Facile :** Réseau simple de 4 à 5 routeurs avec peu de ramifications.
- **🟡 Moyen :** Réseau de 6 à 8 routeurs avec plusieurs boucles concurrentes.
- **🔴 Difficile :** Graphe dense de 9 à 12 routeurs comportant des pièges visuels (des branches directes mais très coûteuses, et des détours à faible coût).

---

## 4. Options Visuelles & Pédagogiques

Dans le menu des options (icône ⚙) :
- **Couleurs de poids (`coloredWeights`) :** Colore dynamiquement les pastilles d'UTI (vert pour les temps courts, orange pour les moyens, rouge pour les liaisons lentes). Idéal pour les élèves en difficulté de lecture des nombres ou pour une prise de décision rapide.
- **Carte réseau fixe (`lockTopology`) :** Permet à l'enseignant de fixer une graine aléatoire (`&seed=1234`) afin que chaque élève de la classe ait exactement le même réseau à résoudre au même moment.

---

## 🏫 Défi collaboratif en classe : « Les Routeurs humains »

1. Dessinez au sol ou projetez un graphe réseau avec des coûts en UTI.
2. Placez des élèves sur chaque nœud (routeur).
3. Donnez un "paquet" (ballon ou enveloppe) à l'élève **A**.
4. Chaque routeur ne connaît que le coût des liaisons vers ses voisins directs. Les élèves doivent communiquer pour trouver collectivement le meilleur trajet jusqu'à **B** avant de vérifier leur solution sur l'application.

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
