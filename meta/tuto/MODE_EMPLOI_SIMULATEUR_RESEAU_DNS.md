# 🌐 Mode d'emploi : Simulateur Réseau & DNS

Le **Simulateur Réseau & DNS** visualise et anime le voyage d'une requête web sur Internet : de l'ordinateur de l'élève jusqu'au serveur Web distant hébergeant le site, en passant par la box/routeur Wi-Fi et le serveur de noms de domaine (DNS).

- **Public cible :** Cycle 2 (7-8H) et Cycle 3 (9-11CO).
- **Alignement PER & Lehrplan 21 :** EN 22+32 · Science informatique — Architecture des réseaux, adresses IP, résolution de noms de domaine (DNS) et modèle client-serveur (*Connected 2 · Les autoroutes de l'information* et *Décodages 7-8 · Activité 8*).
- **Accès direct :** `alpha/webapps/simulateur_reseau_dns.html`.

---

## 🎯 Pourquoi cet outil en classe ?

- **Comprendre la mécanique invisible du Web :** Quand un élève tape `hepvs.ch` dans son navigateur, comment son appareil sait-il quel ordinateur dans le monde contacter ?
- **Distinguer Réseau Local (LAN) et Internet (WAN) :** Matérialiser la frontière entre la maison/classe (adresses IP privées commençant par `192.168.x.x`) et le réseau mondial public.
- **Rôle capital du serveur DNS (L'annuaire d'Internet) :** Comprendre qu'un ordinateur ne communique qu'avec des adresses IP numériques (`193.134.12.5`), et que le DNS sert d'annuaire traduisant les noms mémorisables en adresses IP.
- **Comprendre le rôle du cache local :** Découvrir comment l'ordinateur retient les adresses récemment visitées pour accélérer la navigation et économiser la bande passante.
- **Expérimenter les pannes réseau :** Simuler une rupture du service DNS pour observer qu'un site reste accessible si son adresse IP est déjà connue ou en cache.

---

## 1. Les 4 acteurs de l'infrastructure réseau

L'interface est structurée en deux zones bien distinctes délimitées par une ligne frontière pointillée :

```
[  RÉSEAU LOCAL (LAN)  ]  :  [         INTERNET (WAN)          ]
┌─────────────┐   ┌──────────────┐ : ┌─────────────┐   ┌─────────────┐
│ Ordinateur  │═══│ Box Wi-Fi /  │═══│ Serveur DNS │═══│ Serveur Web │
│   Client    │   │   Routeur    │ : │ (Annuaire)  │   │  (Site Web) │
└─────────────┘   └──────────────┘ : └─────────────┘   └─────────────┘
```

| Nœud | Rôle | Adresse IP | Fonctions interactives |
|---|---|---|---|
| 💻 **Mon Ordinateur** | Client émetteur de la requête | `192.168.1.42` (Privée LAN) | Navigateur web, barre d'URL, bouton **Cache DNS**. |
| 📶 **Box Wi-Fi / Routeur** | Passerelle Internet & NAT | LAN: `192.168.1.1`<br>WAN: `85.218.42.18` (Publique) | Achemine les paquets entre le réseau local et Internet. |
| 🗄️ **Serveur DNS** | L'annuaire du Web | `8.8.8.8` (Publique) | Résout les noms de domaine en adresses IP. Bouton **Voir l'annuaire**. |
| 🌐 **Serveur Web** | Hébergeur des pages du site | Variable selon le site (ex. `193.134.12.5`) | Écoute sur le port 443 (HTTPS) et renvoie le code HTML. |

---

## 2. Deux modes d'apprentissage

L'application propose deux onglets sous le titre :

1. 🌐 **Simulation Libre :** L'élève saisit une adresse web de son choix ou clique sur un exemple rapide (`hepvs.ch`, `wikipedia.org`, `rts.ch`, `ecole-vs.ch`), choisit sa vitesse de visualisation et observe la trajectoire du paquet de données.
2. 🎯 **Missions & Défis :** Série d'enquêtes guidées pour vérifier la compréhension :
   - *Mission 1 : La première visite* (observer les deux allers-retours : DNS puis Web).
   - *Mission 2 : L'effet magique du cache DNS* (revisiter le même site et constater l'absence de requête DNS).
   - *Mission 3 : Enquête lors d'une panne DNS* (activer la panne et analyser pourquoi un site inconnu échoue alors qu'un site en cache fonctionne).

---

## 3. Le cheminement d'une requête pas à pas

Lorsqu'on clique sur **« Envoyer »** (ou en mode **« Pas à pas »**) :

1. **Étape 1 — Consultation du cache local :** L'ordinateur vérifie s'il connaît déjà l'adresse IP associée au nom de domaine.
2. **Étape 2 — Requête DNS vers la Box :** Si l'adresse est inconnue, un paquet violet part vers la Box Wi-Fi avec la question : *« Quelle est l'IP de hepvs.ch ? »*.
3. **Étape 3 — Sortie sur Internet vers le DNS :** La Box relaie la requête au Serveur DNS (`8.8.8.8`).
4. **Étape 4 — Réponse DNS :** Le serveur DNS consulte son annuaire et renvoie l'IP `193.134.12.5`.
5. **Étape 5 — Mise en cache & Requête Web :** L'ordinateur enregistre l'IP dans son cache local. Un paquet bleu HTTP/HTTPS part immédiatement vers le Serveur Web hébergeant le site.
6. **Étape 6 — Réponse du Serveur Web :** Le serveur Web renvoie le paquet vert contenant les données HTML de la page.
7. **Étape 7 — Affichage de la page :** Le navigateur affiche la page web complète dans une fenêtre modale d'aperçu réaliste !

---

## 4. Outils d'investigation en direct

- **⚠️ Panne DNS (Bouton bascule ON / OFF) :**
  - Permet de simuler une panne mondiale du service DNS.
  - Si l'élève tente d'ouvrir un site non présent dans son cache local, le paquet se heurte au serveur DNS en panne et affiche une erreur réseau explicite (*« Nom de domaine introuvable »*).
- **💾 Cache DNS (Bouton sous Mon Ordinateur) :**
  - Ouvre la liste des correspondances nom ↔ IP mémorisées dans l'ordinateur de l'élève.
  - Permet de vider le cache en un clic pour forcer une nouvelle résolution complète.
- **📖 Voir l'annuaire (Bouton sous Serveur DNS) :**
  - Affiche l'intégralité de la base de données du serveur DNS avec les noms de domaine et leurs adresses IP respectives.
- **Contrôle de vitesse :** Trois boutons permettent d'adapter le défilement de l'animation au rythme des explications de l'enseignant·e : **Lente**, **Normale** ou **Rapide**.

---

## 🏫 Activité suggérée en classe (45 min)

1. **Phase de démonstration collective TBI (15 min) :** L'enseignant·e projette l'outil, tape `hepvs.ch` à vitesse lente en mode pas-à-pas et fait verbaliser chaque étape par les élèves (*« Pourquoi va-t-on d'abord au serveur violet avant d'aller au serveur vert ? »*).
2. **Défi en binômes (20 min) :** Les élèves basculent dans l'onglet **Missions & Défis** sur leur poste et résolvent les trois scénarios d'enquête.
3. **Mise en commun (10 min) :** Débat sur l'importance du DNS dans le monde : que se passe-t-il si un grand serveur DNS tombe en panne sur la planète ? Pourquoi l'annuaire DNS est-il une infrastructure critique d'Internet ?

---

## ⚙️ Options & Accessibilité

- **Sons 🔊 :** Bips et effets de transmission audios synthétisés nativement (Web Audio API).
- **Thème sombre / clair 🌙 :** Bascule instantanée pour un confort visuel optimal au tableau ou sur tablette.
- **Mode TBI :** Mise en page responsive optimisée pour les écrans tactiles interactifs de classe.
