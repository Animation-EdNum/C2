# 🤖 Mode d'emploi : Simulateur d'automate

Le **Simulateur d'automate** est une application web interactive pour enseigner la robotique et la pensée algorithmique. L'élève programme un automate (type Blue-Bot / Bee-Bot) à travers 5 modes de difficulté progressive.

Cycles 1 et 2 PER, Décodages 3-4H à 7-8H.

---

## Pourquoi cet outil ?

- **Pensée algorithmique :** Décomposer un trajet en une suite d'instructions simples et ordonnées.
- **Décentration cognitive :** Distinguer gauche/droite *du robot* (pas les siennes).
- **Repérage spatial :** Évaluer des distances, anticiper des trajectoires, travailler les angles droits.
- **Mémoire de travail :** Planifier une séquence complète avant son exécution (Blindcoding).
- **Essai-erreur :** Analyser les bugs, comprendre l'écart de trajectoire, corriger pas-à-pas.

---

## Fonctionnalités transversales

Ces options sont activables dans les modes Exploration et Simulateur :

- **🎒 Collecte :** L'automate ramasse des objets sur le tapis (formes, trésors, personnages). Compteur et série 🔥.
- **🃏 Chasse aux paires :** La grille devient un jeu de mémoire géant. L'automate retourne les cartes pour former des paires.
- **🔤 Mode Épeler :** Sur les tapis alphabétiques, l'automate se déplace pour épeler des mots lettre par lettre.
- **💡 Bulle d'onboarding :** Première visite → une infobulle animée guide l'élève vers le bouton « Avancer » (désactivable : `?noNudges=1`).

---

## 1. Mode Exploration (Déplacement direct)

Le robot réagit instantanément à chaque appui — pas besoin d'anticiper une séquence.

- Panneau directionnel : **Avancer ⬆**, **Reculer ⬇**, **Pivoter ↺ / ↻**.
- **📍 Positionner le robot :** Bouton « Position aléatoire » ou clic direct sur la grille.
- **Trésors & Obstacles :** Ajoutez des cibles et des briques à contourner.
- *Idéal pour la découverte en Cycle 1 (4-7 ans) ou l'expérimentation libre au TBI.*

---

## 2. Mode Simulateur (Programmation par blocs)

Reproduit la programmation par touches d'un Blue-Bot physique.

- Construisez la séquence en cliquant sur les boutons d'ordres → ils s'ajoutent dans la **bande de programme**.
- Cliquez sur une carte dans la bande pour la supprimer.
- **GO** (vert) → exécution pas-à-pas.
- **X** (bleu) → effacer toute la séquence.
- **Œil barré** → masquer les commandes pour un défi de mémorisation.

---

## 3. Mode Pilotage (QCM algorithmique)

La cible est fixée, plusieurs programmes sont proposés. L'élève identifie la seule séquence correcte.

| Niveau | Description |
|---|---|
| 🟢 Facile | Trajets courts, aucun obstacle. |
| 🟡 Moyen | Trajets longs, obstacles simples. |
| 🔴 Difficile | Grilles encombrées, détours précis. |
| 🔥 Extrême | Débloqué après progression ; labyrinthes complexes. |

---

## 4. Mode Décodage (Prédiction de trajectoire)

Le programme est donné, l'élève devine **où finira le robot** :

1. Observez l'orientation initiale et la séquence.
2. Déplacez mentalement le robot case par case.
3. Cliquez sur la case d'arrivée présumée.
4. L'automate exécute le programme pour valider.

> Renforce puissamment la décentration spatiale et l'anticipation.

---

## 5. Mode Dessin (Création géométrique)

L'automate laisse une trace colorée sur chaque case parcourue.

- **Défis :** Reproduire des formes en pointillés (carrés, rectangles, chiffres).
- *Lien interdisciplinaire :* Angles droits, polygones, périmètre.

---

## Raccourcis clavier

### Programmation (Simulateur & Dessin)

| Touche | Action |
|---|---|
| ⬆ ⬇ ⬅ ➡ | Ajouter la commande correspondante |
| `Backspace` | Effacer la dernière instruction |
| `Entrée` | Exécuter (GO) |

### Navigation grille (après `Tab`)

| Touche | Action |
|---|---|
| Flèches | Déplacer le curseur néon |
| `Entrée` / `Espace` | Téléporter le robot |
| `R` | Pivoter l'automate de 90° |
| `O` | Poser/retirer un obstacle |
| `T` | Placer la cible |

---

## Personnalisation (⚙)

- **Tapis 🗺 :** Dizaines de thèmes (Ville, Espace, Forêt, Formes…), opacité réglable, dimensions de 4×4 à 10×10. Import de tapis personnalisé depuis votre appareil.
- **Skins 🎨 :** Bee-Bot, Licorne, Cyber-Bot, Volcan…
- **Vitesse ⏱ :** Normale ou accélérée (2×).
- **Commandes colorées 🧒 :** Couleur distincte par direction (élèves non latéralisés).
- **Thèmes 🌙 :** Clair, sombre, contraste élevé (WCAG AA).
- **Son 🔊 :** Effets Web Audio synthétisés.

---

## Partage & différenciation

Le menu **Partager l'activité** génère un lien ou QR Code sur mesure :
- Verrouiller niveau ou mode (`&only=1&lockDiff=1`).
- Imposer un tapis (`&forceMat=city&rows=6&cols=6`).
- Partager une grille personnalisée avec obstacles et trésors.
- Activer le Blindcoding (`&blindcode=1`).

→ [Guide complet de partage](MODE_EMPLOI_PARTAGE.md)

---

*Conçu par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0. 100% hors-ligne.*
