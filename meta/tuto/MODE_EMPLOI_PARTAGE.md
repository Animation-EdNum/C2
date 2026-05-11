# Partager une activité avec ses élèves

Ce tutoriel décrit la procédure pour transmettre une activité paramétrée à une classe via un lien ou un QR Code.

---

## 1. Ouvrir le menu de partage

Depuis l'application concernée (ex. *Simulateur d'automate*) :

1. Cliquer sur l'icône **Engrenage ⚙** en haut à droite.
2. Sélectionner **« Partager l'activité »**.

![Menu Paramètres](../screenshots/share_settings.png)

---

## 2. Fenêtre de partage

Une fenêtre modale s'ouvre. Le lien généré intègre automatiquement :

- **L'onglet actif** (mode de jeu, ex. *Décodage*, *Pilotage*).
- **Le niveau de difficulté** sélectionné.

![Modale de partage basique](../screenshots/share_basic.png)

Trois boutons sont disponibles pour exporter le lien :

| Bouton | Fonction |
|---|---|
| **Tester le lien** | Ouvre le lien dans un nouvel onglet pour vérifier le rendu côté élève. |
| **Copier** | Copie le lien dans le presse-papiers. |
| **Afficher le QR Code** | Génère un QR Code (voir § 5). |

---

## 3. Profils rapides (Presets)

Pour faciliter la préparation, trois boutons de profils permettent d'appliquer automatiquement une sélection de réglages adaptés à différentes situations pédagogiques :

- **🎯 Mission :** « Mes élèves font exactement ce que j'ai préparé ». Ce profil verrouille le niveau de difficulté, force le mode de jeu actuel, empêche le retour à l'accueil et masque le menu des réglages.
- **🏋️ Entraînement :** « Je leur donne l'outil, ils explorent / refont à leur rythme ». Ce profil permet le changement de difficulté, force le mode de jeu actuel et empêche le retour à l'accueil.
- **🫶 Inclusif :** « J'ai un·e élève dys, TSA, ou non-latéralisé·e dans le groupe ». Ce profil active le thème à contraste élevé, désactive le son, active les couleurs directionnelles (si disponible), force le mode de jeu actuel et empêche le retour à l'accueil.

---

## 4. Options avancées

Un clic sur **« Options Avancées »** donne accès à des paramètres supplémentaires, regroupés en trois catégories.

![Options avancées](../screenshots/share_advanced.png)

#### A. Interface & Navigation
- **Forcer le mode actuel** : masque les autres onglets.
- **Masquer le retour à l'accueil** : empêche la sortie vers le portail.
- **Masquer le menu réglages** : désactive le changement de tapis, de skin et du son.

#### B. Verrouillage & Difficulté
- **Verrouiller le niveau actuel** : grise les boutons de difficulté.
- **Forcer le tapis actuel** : charge le tapis sélectionné.
- **Désactiver les tapis / skins** : empêche la personnalisation.

#### C. Comportement & Pédagogie
- **Commandes masquées par défaut** : la séquence est cachée au démarrage ; l'élève doit l'ouvrir manuellement.
- **Forcer le mode aveugle (Blindcoding)** : l'affichage de la séquence est impossible.
- **Masquer les boutons hasard** : empêche de passer à un autre puzzle aléatoire.

![Options cochées](../screenshots/share_checked.png)

> **Remarque :** chaque option cochée ajoute un paramètre à l'URL (ex. `&only=1&lockDiff=1`).

---

## 5. Diffusion par QR Code

Procédure :

1. Régler les options avancées.
2. Cliquer sur **« Afficher le QR Code »**.
3. Cliquer sur **« Télécharger le QR »** pour enregistrer l'image.

![Génération QR Code](../screenshots/share_qr.png)

Le QR Code peut ensuite être :
- imprimé et distribué aux élèves ;
- affiché au TBI ;
- inséré dans un document (polycopié, fiche, support numérique).

Une fois scanné, le QR Code ouvre directement l'application dans la configuration définie par l'enseignant.