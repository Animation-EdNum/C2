# 🔗 Tutoriel : Partager l'activité (Mode Enseignant)

La Suite EdNum propose une fonctionnalité avancée permettant aux enseignant·e·s de préparer un exercice spécifique et de le distribuer facilement aux élèves. 

Ce système génère un lien (ou un QR Code) qui contient la configuration exacte que vous souhaitez imposer : niveau de difficulté, tapis, options bloquées, etc. L'élève n'aura plus qu'à cliquer sur le lien pour arriver directement dans l'activité préparée.

---

## 1. Accéder au menu de partage

Pour partager une activité, commencez par ouvrir l'application souhaitée (par exemple, le *Simulateur d'automate*).

1. Cliquez sur l'icône **Engrenage (⚙)** située en haut à droite de l'écran pour ouvrir le menu des options.
2. Dans le menu déroulant, cliquez sur **« Partager l'activité »**.

![Menu Paramètres](../screenshots/share_settings.png)

---

## 2. L'interface de partage (Options de base)

Une fenêtre (modale) s'ouvre au centre de l'écran. 

![Modale de partage basique](../screenshots/share_basic.png)

Par défaut, le lien généré (affiché dans la barre de texte) enregistre :
- L'onglet (le mode de jeu) sur lequel vous vous trouvez (ex: *Décodage* ou *Pilotage*).
- Le niveau de difficulté actuellement sélectionné.

Vous disposez de plusieurs boutons :
- **Tester le lien** : Ouvre un nouvel onglet avec le lien généré pour vérifier le résultat.
- **Copier** : Copie le lien dans votre presse-papiers pour l'envoyer par email ou via votre plateforme scolaire.
- **Afficher le QR Code** : Génère un QR Code que les élèves pourront flasher avec leur tablette (voir section 4).

---

## 3. Options Avancées (Créer un cadre restrictif)

Le véritable pouvoir du partage réside dans les options avancées. En cliquant sur **« Options Avancées »**, vous dévoilez un panneau de contrôle complet permettant de brider l'interface de l'élève.

![Options avancées](../screenshots/share_advanced.png)

Les options sont classées par catégories :

**A. Interface & Navigation**
Ces options permettent d'épuré l'écran de l'élève pour qu'il se concentre uniquement sur la tâche :
- *Forcer le mode actuel* : Cache tous les autres onglets de l'application.
- *Masquer le retour à l'accueil* : Désactive le bouton pour revenir au portail principal.
- *Masquer le menu réglages* : Empêche l'élève de changer de tapis, de skin, ou d'activer le son.

**B. Verrouillage & Difficulté**
Ces options empêchent l'élève de changer la difficulté de l'exercice :
- *Verrouiller le niveau actuel* : Les boutons de difficulté sont grisés, l'élève ne peut pas baisser la difficulté s'il bloque.
- *Forcer le tapis actuel* : Charge obligatoirement le tapis que vous avez choisi.
- *Désactiver les tapis / skins* : Empêche l'élève de perdre du temps à personnaliser le robot.

**C. Comportement & Pédagogie**
Ces options changent les règles du jeu :
- *Commandes masquées par défaut* : L'œil est fermé d'entrée de jeu, l'élève doit le rouvrir s'il veut s'aider.
- *Forcer le mode aveugle* : Empêche l'élève d'afficher la séquence de commandes (défi de mémorisation pur).
- *Masquer les boutons hasard* : L'élève ne peut pas changer de puzzle s'il n'y arrive pas.

![Options cochées](../screenshots/share_checked.png)

*Exemple : En cochant "Forcer le mode actuel" et "Verrouiller le niveau actuel", le lien généré s'allonge pour intégrer ces paramètres de configuration (ex: `&only=1&lockDiff=1`).*

---

## 4. Distribuer l'activité par QR Code

Si vos élèves utilisent des tablettes (iPad, Android), la méthode la plus rapide est le QR Code.

1. Configurez vos options avancées.
2. Cliquez sur **« Afficher le QR Code »**.
3. Le QR Code apparaît à l'écran.
4. Cliquez sur **« Télécharger le QR »** pour enregistrer l'image sur votre ordinateur.

![Génération QR Code](../screenshots/share_qr.png)

Vous pouvez imprimer ce QR code, l'afficher au tableau blanc interactif (TBI), ou l'insérer dans un document de cours. Dès que l'élève le scannera avec l'appareil photo de sa tablette, l'application s'ouvrira directement dans le mode et la configuration que vous avez préparés !
