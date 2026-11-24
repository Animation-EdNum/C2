# ⚡ Mode d'emploi : Simulateur de téléchargement

Le **Simulateur de téléchargement** fait découvrir et ressentir concrètement aux élèves le **« poids » réel des données numériques** (texte, image, son, vidéo) ainsi que l'impact de la vitesse de connexion à travers l'histoire des télécommunications, du modem 56k des années 90 jusqu'à la fibre optique ultra-rapide.

- **Public cible :** Cycle 2 (7-8H) et Cycle 3 (9-11CO).
- **Alignement PER & Lehrplan 21 :** EN 22+32 · Science informatique — Représentation des données, unités de stockage (Ko, Mo, Go), réseaux et débits (*Connected 1 · 1.1 | Datenmengen verstehen* et *Décodages 7-8 · Activité 8*).
- **Accès direct :** `webapps/simulateur_telechargement.html`.

---

## 🎯 Pourquoi cet outil en classe ?

- **Rendre tangible l'immatériel :** Sur un écran moderne, ouvrir une page ou une vidéo semble souvent « magique et instantané ». Ce simulateur matérialise le flux d'octets qui circule dans les câbles et les ondes.
- **Maîtriser les ordres de grandeur :** Comprendre pourquoi un courriel texte pèse quelques kilo-octets (Ko), une photo quelques méga-octets (Mo), et un film complet plusieurs giga-octets (Go).
- **Historique des technologies :** Expérimenter le saut vertigineux de vitesse entre les premières connexions téléphoniques commutées et le très haut débit moderne.
- **Sensibilisation à la sobriété numérique :** Prendre conscience du coût en données et en énergie du streaming vidéo haute définition par rapport à des formats plus légers.

---

## 1. Deux modes d'exploration

L'application propose deux onglets complémentaires en haut de l'écran :

| Onglet | Intitulé | Ce que fait l'élève |
|---|---|---|
| 🎯 **Mode 1** | **Défi des 4 médias** | Compare en direct le téléchargement simultané des 4 grands formats de données (Texte, Image, Audio, Vidéo) pour observer l'écart colossal de durée. |
| 🔬 **Mode 2** | **Laboratoire de débits** | Choisit une technologie de connexion (56k, ADSL, 4G, Fibre) et lance le téléchargement sur une sélection de 9 fichiers types ou un fichier personnalisé. |

---

## 2. Les 4 technologies réseau et débits simulés

Dans les deux modes, l'élève peut basculer d'une technologie réseau à l'autre pour constater la différence de débit :

| Réseau | Débit binaire | Vitesse de transfert | Époque & Contexte |
|---|---|---|---|
| 📞 **Modem 56k** | 56 Kb/s | $\sim 7\text{ Ko/s}$ | Années 90 · Ligne téléphonique commutée (bruit de numérotation caractéristique !) |
| 🌐 **ADSL / 3G** | 2 Mb/s | $\sim 250\text{ Ko/s}$ | Années 2000 · Première démocratisation d'Internet à la maison |
| 📶 **4G / VDSL École** | 20 Mb/s | $\sim 2.5\text{ Mo/s}$ | Actuel · Connexion standard dans les salles de classe |
| ⚡ **Fibre optique / 5G** | 200 Mb/s | $\sim 25\text{ Mo/s}$ | Moderne · Très haut débit sans latence perceptible |

---

## 3. Le Défi des 4 médias

L'écran affiche 4 jauges de progression colorées représentant les familles de contenus numériques :

1. 📄 **Fichier Texte (Article) :** $\sim 50\text{ Ko}$ (Couleur bleue)
2. 🖼️ **Image HD (Photo) :** $\sim 2\text{ Mo}$ (Couleur verte)
3. 🎵 **Morceau Audio (Chanson MP3) :** $\sim 10\text{ Mo}$ (Couleur orange)
4. 🎬 **Vidéo (Court métrage HD) :** $\sim 250\text{ Mo}$ (Couleur violette)

### Déroulement :
1. Cliquez sur **« Tout lancer »** (ou lancez chaque média individuellement).
2. Observez la vitesse de remplissage des barres, le temps écoulé et le temps restant estimé.
3. **Constat saisissant :** En modem 56k, le texte arrive en 7 secondes, mais la vidéo nécessiterait près de **10 heures** de téléchargement ininterrompu ! En fibre optique, l'ensemble se télécharge en quelques secondes.

---

## 4. Le Laboratoire de débits

Cet espace d'investigation libre permet d'approfondir les calculs et les tests :

- **9 fichiers types :** Message texte (2 Ko), Photo de vacances (3.5 Mo), Album musical (60 Mo), Application mobile (120 Mo), Film HD (1.4 Go), Mise à jour système (4.2 Go), etc.
- **Fichier personnalisé :** Permet à l'élève ou à l'enseignant de saisir une taille libre en Ko, Mo ou Go et de lancer la simulation pour répondre à une question concrète (*« Combien de temps pour télécharger le jeu de 15 Go avec la 4G de mon smartphone ? »*).
- **Statistiques en direct :** Quantité de données transférées, pourcentage complété, vitesse instantanée en Mo/s et temps restant dynamique.

---

## 5. Pistes pédagogiques pour la classe

1. **Calculs interdisciplinaires (Maths & Numérique) :**
   - Rappeler la relation fondamentale : $\text{Temps} = \frac{\text{Taille du fichier}}{\text{Débit réel}}$.
   - Calculer le temps théorique d'un fichier de 50 Mo à 2 Mo/s ($50 / 2 = 25\text{ secondes}$).
2. **Tableau de conversion des unités :**
   - $1\text{ octet} = 8\text{ bits}$
   - $1\text{ Ko (kilo-octet)} \approx 1\,000\text{ octets}$
   - $1\text{ Mo (méga-octet)} \approx 1\,000\text{ Ko} \approx 1\,000\,000\text{ octets}$
   - $1\text{ Go (giga-octet)} \approx 1\,000\text{ Mo} \approx 1\,000\,000\,000\text{ octets}$
3. **Débat sur l'impact écologique du streaming :**
   - Discuter de l'intérêt d'écouter de la musique sans le flux vidéo (YouTube Music vs YouTube vidéo) pour économiser les données et l'énergie des serveurs relais.

---

## ⚙️ Options & Accessibilité

- **Sons 🔊 :** Bruitages rétro authentiques de connexion modem 56k et sons de complétion synthétisés nativement (Web Audio API).
- **Thème sombre / clair 🌙 :** Bascule instantanée pour adapter le contraste à la projection en classe.
- **Mode TBI :** Affichage optimisé pour le grand écran tactile de la classe.
