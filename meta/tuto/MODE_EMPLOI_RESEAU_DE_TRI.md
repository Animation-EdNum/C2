# 🔀 Mode d'emploi : Réseau de tri

Bienvenue dans le guide d'utilisation du **Réseau de tri**, une simulation interactive inspirée des activités débranchées de *CS Unplugged* illustrant le fonctionnement d'un réseau de comparateurs parallèles (Sorting Networks).

---

## 🌟 Enjeux Pédagogiques (Utilité en classe)

- **Calcul parallèle :** Découvrir qu'un ordinateur doté de plusieurs processeurs peut effectuer plusieurs comparaisons simultanément.
- **Principe du comparateur :** Chaque nœud du réseau compare deux valeurs entrantes : la plus petite valeur est dirigée vers le haut, la plus grande vers le bas (ou inversement).
- **Déterminisme d'un réseau :** Comprendre qu'un réseau bien conçu garantit que n'importe quelle permutation initiale de nombres ressortira parfaitement triée en sortie.

---

## 1. Fonctionnement du Réseau

- **Lignes de transport (Fils) :** Les valeurs avancent de gauche à droite sur des rails parallèles.
- **Comparateurs (Ponts verticaux avec icône ↕) :** Lorsque deux valeurs arrivent en même temps sur un comparateur :
  1. Elles sont comparées.
  2. Si elles ne sont pas dans le bon ordre, elles **échangent leurs lignes** (swap).
  3. Elles continuent ensuite leur progression vers la droite.
- **Sortie :** Toutes les valeurs atteignent les bacs d'arrivée parfaitement rangées de la plus petite à la plus grande.

---

## 2. Déroulement d'un Défi

1. L'élève place les jetons ou valeurs au départ des lignes à gauche.
2. Il clique sur **Lancer** ou avance pas-à-pas en suivant les échanges aux comparateurs.
3. L'élève observe comment des permutations désordonnées se remettent en ordre étape après étape.
4. **Niveaux de difficulté :** Du réseau à 4 entrées jusqu'au réseau complexe à 6 ou 8 entrées.

---

## 🏫 Activité débranchée géante dans la cour de récréation

Tracez à la craie au sol le schéma du réseau de tri :
1. Six élèves tiennent chacun un carton avec un nombre secret et se placent au départ des 6 lignes.
2. Les élèves avancent ensemble d'un pas.
3. Quand deux élèves se croisent sur un comparateur (une ligne tracée entre deux rails), ils comparent leurs cartons : le plus petit part sur la ligne du haut, le plus grand sur celle du bas.
4. À l'arrivée, les 6 élèves se retrouvent naturellement alignés dans l'ordre croissant !

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
