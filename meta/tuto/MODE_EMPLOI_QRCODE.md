# 📱 Mode d'emploi : Créateur de QR codes

Le **Créateur de QR codes** est un utilitaire pensé pour la classe permettant de générer instantanément des QR codes fiables, sans publicité, sans redirection vers des serveurs tiers et utilisables immédiatement sur tablette, TBI ou support papier.

100% hors-ligne · Aucune collecte de données · Sauvegarde locale automatique (`localStorage`) · Conforme LPD / RGPD.

---

## Pourquoi cet outil ?

- **Supprimer l'obstacle de l'URL :** Les élèves du primaire (particulièrement en 1H-4H) perdent un temps précieux à taper de longues adresses web dans la barre du navigateur et font fréquemment des fautes de frappe.
- **Zéro dépendance & Zéro publicité :** Les générateurs gratuits en ligne intègrent souvent des bannières intrusives, des traceurs commerciaux ou des redirections qui expirent au bout de quelques semaines. Ici, le QR code contient directement la cible finale de manière pérenne.
- **Pensé pour l'impression scolaire :** Création d'affiches individuelles prêtes pour le tableau ou de planches multi-QR codes avec repères de découpe pour équiper les cahiers ou les ateliers.

---

## 1. Les 4 modes de génération

L'application dispose de 4 onglets en haut du panneau de configuration :

| Mode | Usage pédagogique type | Exemple de contenu |
|---|---|---|
| 🔗 **Lien web (URL)** | Accès direct à un exercice, une vidéo éducative, un Genially, Scratch ou un padlet. | `https://ednum.org` |
| 📝 **Texte libre** | Indice pour une chasse au trésor, énigme mathématique, autocorrection masquée. | *« Bravo ! La réponse au problème est 42 cm. »* |
| 📶 **Réseau Wi-Fi** | Connexion automatique des tablettes de classe sans dicter le mot de passe. | SSID : `Wifi_Ecole`, Clé : `MonMotDePasse` |
| 📑 **Planche multiple (Batch)** | Impression en une seule page de 4, 6 ou 12 QR codes pour équiper des ateliers ou postes. | `Atelier 1 \| https://ednum.org`<br>`Atelier 2 \| https://scratch.mit.edu` |

---

## 2. Personnalisation & Lisibilité

### Titre et sous-titre de consigne
- **Titre affiché :** Donnez un nom clair à la ressource (ex. *« Défi Géométrie 6H »*). Il s'imprime au-dessus du QR code.
- **Afficher l'URL / le texte en clair :** Recommandé pour permettre à un élève sur ordinateur portable de taper l'adresse s'il ne dispose pas de caméra.

### Couleur & Contraste
- Sélectionnez une couleur sobre pour vos thèmes de classe (noir classique, bleu marine, sarcelle HEP, violet, bordeaux).
- *Conseil d'accessibilité :* Conservez toujours un contraste très marqué avec le fond blanc pour garantir un décodage instantané par les appareils photo de tablettes, même avec une luminosité faible.

### Niveau de correction d'erreurs (ECC)
- L'outil propose 4 niveaux de redondance (L, M, Q, H).
- Le niveau **M (15%)** ou **Q (25%)** est sélectionné par défaut : le QR code reste scannable même si la feuille est froissée, annotée ou si un coin est légèrement abîmé dans un cartable.

---

## 3. Formats d'exportation pour la classe

L'application propose 4 manières d'exploiter le code généré :

1. 📋 **Copier l'image (Presse-papier) :**
   - Un clic copie l'image PNG haute résolution directement dans votre presse-papier.
   - Collez-la immédiatement (`Ctrl+V` ou `Cmd+V`) dans vos documents Word, Pages, LibreOffice ou Canva.
2. 💾 **Télécharger PNG :**
   - Télécharge l'image HD avec un nom de fichier propre reprenant votre titre.
3. 🖨️ **Imprimer A4 (Mise en page classe) :**
   - Génère une mise en page d'impression soignée (sans menus, sans boutons parasites).
   - En mode **Planche (Batch)**, les QR codes s'organisent automatiquement en grille régulière avec **lignes de découpe en pointillés** pour faciliter le découpage au massicot.
4. 📺 **Mode Projection TBI (Plein écran) :**
   - Cliquez sur l'icône **Tableau (TBI)** dans la barre d'outils supérieure droite.
   - Le QR code s'affiche en taille géante et centré au milieu de l'écran, idéal pour que les élèves le scannent depuis le fond de la classe avec leur iPad.

---

## 4. Idées d'activités en classe (1H à 8H)

- **Ateliers tournants autonomes :** Collez un QR code sur chaque table d'atelier renvoyant vers l'application Suite EdNum dédiée (*Machine à trier*, *Codage binaire*, *Labyrinthe*).
- **Cahier de devoirs / Lien famille :** Collez un QR code dans le journal de classe pour partager aux parents l'enregistrement audio d'une poésie ou le formulaire de sortie scolaire.
- **Escape Game & Parcours d'énigmes :** Dissimulez des QR codes en mode « Texte libre » dans l'école : les élèves scannent le code pour révéler la consigne suivante.
- **Fiches autocorrectives :** Placez un mini QR code au dos d'une fiche d'exercices : l'élève vérifie son raisonnement en autonomie une fois son travail terminé.

---

## 🔒 Confidentialité & Zéro publicité

- Le générateur fonctionne de manière **100% autonome et locale** dans le navigateur grâce au moteur embarqué `QRious`.
- Les mots de passe Wi-Fi et les textes saisis ne transitent par **aucun serveur externe**.
- Fonctionne parfaitement **hors-ligne** (sans connexion Internet active).