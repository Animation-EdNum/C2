# ⚡ Mode d'emploi : Simulateur de téléchargement

Le **Simulateur de téléchargement** fait découvrir et ressentir concrètement aux élèves le **« poids » réel des données numériques** (texte, image, son, vidéo) ainsi que l'impact de la vitesse de connexion à travers l'histoire des télécommunications, du modem 56k des années 90 jusqu'à la fibre optique ultra-rapide.

- **Public cible :** Cycle 2 (7-8H) et Cycle 3 (9-10CO).
- **Alignement PER & Lehrplan 21 :** EN 22+32 · Science informatique — Représentation des données, unités de stockage (Ko, Mo, Go), réseaux et débits (*Connected 1 · 1.1 | Datenmengen verstehen* et *Décodages 7-8 · Activité 8*).
- **Accès direct :** `webapps/simulateur_telechargement.html`.

---

## 🎯 Pourquoi cet outil en classe ?

- **Rendre tangible l'immatériel :** Sur un écran moderne, ouvrir une page ou une vidéo semble souvent « magique et instantané ». Ce simulateur matérialise le flux d'octets qui circule dans les câbles et les ondes.
- **Maîtriser les ordres de grandeur :** Comprendre pourquoi un livre texte pèse quelques centaines de kilo-octets (Ko), une photo quelques méga-octets (Mo), et un film complet plusieurs centaines de Mo à plusieurs giga-octets (Go).
- **Historique des technologies :** Expérimenter le saut vertigineux de vitesse entre les premières connexions téléphoniques commutées et le très haut débit moderne.
- **Sensibilisation à la sobriété numérique :** Prendre conscience du coût en données et en énergie du streaming vidéo haute définition par rapport à des formats plus légers.

---

## 1. Deux modes d'exploration

L'application propose deux onglets complémentaires en haut de l'écran :

| Onglet | Intitulé | Ce que fait l'élève |
|---|---|---|
| 🎯 **Mode 1** | **Défi des 4 médias** | Observe les canaux anonymes (1 à 4), suit les Ko déjà téléchargés et le temps écoulé sur chaque jauge, puis devine quel média correspond à chaque téléchargement. |
| 🔬 **Mode 2** | **Laboratoire de débits** | Choisit une technologie de connexion (56k, ADSL, 4G/VDSL, Fibre) et lance le téléchargement **en temps réel** sur les 9 fichiers de référence de la Fiche 2. |

---

## 2. Le Défi des 4 médias

Les 4 médias sont mélangés aléatoirement sur les canaux 1 à 4 à chaque manche :

1. 📄 **Texte (Livre de 311 pages) :** $\sim 500\text{ Ko}$ ($\sim 0.85\text{ s}$)
2. 🖼️ **Image (Image plein écran HD) :** $\sim 1.8\text{ Mo}$ ($\sim 4.5\text{ s}$)
3. 🎵 **Audio (Morceau de musique de 4 min) :** $\sim 4\text{ Mo}$ ($\sim 8.5\text{ s}$)
4. 🎬 **Vidéo (Film de 2h, qualité standard) :** $\sim 700\text{ Mo}$ ($\sim 19\text{ s}$)

### Déroulement :
1. Cliquez sur **« Tout lancer »** (ou démarrez chaque canal individuellement).
2. Observez sur chaque jauge **les Ko déjà téléchargés** et **le temps écoulé** (la taille totale et le pourcentage restent cachés tant que vous n'avez pas émis d'hypothèse).
3. Émettez votre hypothèse en cliquant sur **📄 Texte**, **🖼️ Image**, **🎵 Audio** ou **🎬 Vidéo** : la validation et la taille complète s'affichent immédiatement.
4. En bas de page, cliquez sur les 4 cartes de référence pour inspecter les explications et analogies de chaque type de fichier.

---

## 3. Le Laboratoire de débits (temps réel)

Cet espace permet de comparer l'effet de 4 vitesses de connexion sur les **9 fichiers de référence** répartis en Ko, Mo et Go :

| Réseau | Débit binaire | Vitesse de transfert | Époque & Contexte |
|---|---|---|---|
| 📞 **Modem 56k** | 56 Kb/s | $\sim 7\text{ Ko/s}$ | Années 90 · Ligne téléphonique commutée |
| 🌐 **ADSL / 3G** | 2 Mb/s | $\sim 250\text{ Ko/s}$ | Années 2000 · Premiers accès haut débit |
| 📶 **4G / VDSL École** | 20 Mb/s | $\sim 2.5\text{ Mo/s}$ | Actuel · Connexion standard |
| ⚡ **Fibre optique / 5G** | 200 Mb/s | $\sim 25\text{ Mo/s}$ | Moderne · Très haut débit |

- **9 fichiers classés par ordre de grandeur :**
  - **Zone Ko :** Petit recueil de poèmes (50 Ko), Règles du jeu Little Town (200 Ko), Texte d'un roman complet (750 Ko).
  - **Zone Mo :** Photo de famille HD (3 Mo), Morceau de musique MP3 (4 Mo), Musique d'un concert sur CD (700 Mo).
  - **Zone Go :** Le film Jurassic Park HD (1.5 Go), Série TV complète sur DVD (4.7 Go), Films Harry Potter sur clé USB (32 Go).
- **Simulation strictement en temps réel (×1) :** Aucune accélération artificielle n'est appliquée dans le laboratoire. Chaque carte indique d'emblée le **temps estimé** puis affiche en direct la quantité téléchargée, le pourcentage et le temps restant — montrant concrètement qu'un fichier de plusieurs Go reste très long à récupérer sur un débit lent.

---

## 4. Pistes pédagogiques pour la classe

1. **Calculs interdisciplinaires (Maths & Numérique) :**
   - Rappeler la relation fondamentale : $\text{Temps} = \frac{\text{Taille du fichier}}{\text{Débit réel}}$.
   - Calculer le temps théorique d'un fichier de 50 Mo à 2 Mo/s ($50 / 2 = 25\text{ secondes}$).
2. **Tableau de conversion des unités :**
   - $1\text{ octet} = 8\text{ bits}$
   - $1\text{ Ko (kilo-octet)} \approx 1\,000\text{ octets}$
   - $1\text{ Mo (méga-octet)} \approx 1\,000\text{ Ko} \approx 1\,000\,000\text{ octets}$
   - $1\text{ Go (giga-octet)} \approx 1\,000\text{ Mo} \approx 1\,000\,000\,000\text{ octets}$
3. **Débat sur l'impact écologique du streaming :**
   - Discuter de l'intérêt d'écouter de la musique sans le flux vidéo (audio seul vs vidéo HD) pour économiser les données et l'énergie des serveurs.

---

## ⚙️ Options & Accessibilité

- **Thème sombre / clair 🌙 :** Bascule instantanée pour adapter le contraste à la projection en classe.
- **Mode TNI/TBI :** Affichage optimisé pour le grand écran tactile de la classe (sans plein écran navigateur forcé, sortie avec `Échap`).
- **Réinitialisation :** Remet à zéro et remélange les 4 canaux du Défi ainsi que les téléchargements en cours dans le Laboratoire.
