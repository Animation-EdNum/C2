# 🔀 Mode d'emploi : Réseau de tri

**Réseau de tri** est une simulation interactive de *Sorting Networks* (CS Unplugged) qui illustre comment un réseau de comparateurs parallèles peut trier n'importe quelle permutation de nombres.

---

## Pourquoi cet outil ?

- **Calcul parallèle :** Découvrir qu'un ordinateur multi-processeurs peut effectuer plusieurs comparaisons en même temps.
- **Principe du comparateur :** Chaque nœud compare deux valeurs : la plus petite monte, la plus grande descend (ou inversement).
- **Déterminisme :** Un réseau bien conçu garantit un tri correct **quelle que soit** la permutation initiale.

---

## 1. Comment ça fonctionne

- **Lignes (fils) :** Les valeurs circulent de gauche à droite sur des rails parallèles.
- **Comparateurs (↕) :** Ponts verticaux entre deux lignes :
  1. Deux valeurs arrivent en même temps.
  2. Si elles ne sont pas dans l'ordre, elles **échangent leurs lignes** (swap).
  3. Elles continuent vers la droite.
- **Sortie :** Toutes les valeurs arrivent parfaitement rangées de la plus petite à la plus grande.

---

## 2. Déroulement d'un défi

1. Placez les jetons au départ des lignes (à gauche).
2. Cliquez sur **Lancer** ou avancez pas-à-pas pour observer les échanges.
3. Constatez comment le désordre se résorbe étape après étape.

### Niveaux

Les réseaux vont de **4 entrées** (introduction) à **6 ou 8 entrées** (réseaux complexes avec de nombreux comparateurs simultanés).

---

## 🏫 Activité débranchée géante (cour de récréation)

1. Tracez le réseau de tri à la craie au sol (6 lignes parallèles + ponts comparateurs).
2. Six élèves tiennent chacun un carton avec un nombre secret et se placent au départ.
3. Tout le monde avance d'un pas ensemble.
4. Quand deux élèves se croisent sur un comparateur, ils comparent leurs cartons : le plus petit monte sur la ligne du haut, le plus grand sur celle du bas.
5. À l'arrivée, les 6 élèves sont naturellement alignés dans l'ordre croissant !

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
