# User Preferences & Testing Guidelines

## Aesthetics & Design Philosophy
- **Style Visuel :** Forte préférence pour le design "Glassmorphism" (fonds semi-transparents, effets de flou), apportant une esthétique "Premium", moderne et similaire aux systèmes d'exploitation récents.
- **Micro-Animations :** L'interface doit sembler "vivante". Privilégier les effets de survol, les transitions élastiques (spring animations), et les feedbacks interactifs ludiques (confettis en cas de succès, tremblements en cas d'erreur).
- **Typographie :** Utilisation stricte de polices sans-serif modernes (ex: **Outfit** pour les titres, **Inter** pour le corps du texte).
- **Formatage du texte (UI) :** Toujours utiliser le vrai caractère de points de suspension typographiques (`…`) dans les textes HTML destinés aux utilisateurs, plutôt que trois points consécutifs (`...`). Veiller cependant à conserver la syntaxe correcte (`...`) pour l'opérateur "spread" en JavaScript.

## Code Style & Communication
- **Code :** Toujours utiliser des accolades `{}` pour les structures de contrôle (if, else), même pour les instructions sur une seule ligne ou les conditions imbriquées, afin de maximiser la lisibilité. Pas de code trop verbeux mais des commentaires clairs.
- **Communication avec l'Agent :**
  - **Concision :** Les réponses doivent être brèves avec des résumés actionnables. Préférer le Markdown clair (style GitHub).
  - **Exécution Proactive :** L'agent est censé exécuter directement les commandes et modifications dès que la tâche est claire, sans attendre systématiquement de validation intermédiaire.

## E2E Testing Guidelines (Playwright & Local)
### Exécution Locale des Tests E2E
Pour exécuter la suite de tests E2E localement, les étapes suivantes doivent être respectées scrupuleusement :
1. Installer les dépendances : `pip install -r meta/e2e_tests/requirements.txt && playwright install`
2. Lancer un serveur HTTP local (en arrière-plan) : `python -m http.server 8000 &`
3. Attendre l'initialisation du serveur (ex: `sleep 5`) pour éviter les "race conditions" de connexion.
4. Exécuter la suite : `pytest meta/e2e_tests/`
5. Nettoyer proprement le processus : `kill $(lsof -t -i :8000) 2>/dev/null || true`

### Vérification Visuelle Frontend (Screenshots)
Toute modification affectant l'UI côté utilisateur DOIT être vérifiée visuellement via les outils Playwright intégrés (`frontend_verification_instructions` et `frontend_verification_complete`).
- **Prérequis :** Le serveur de dev local doit être actif avant de lancer un script Playwright. Construire les URI avec `os.path.abspath('path/to/file.html'); page.goto(f'file://{filepath}')` si aucun serveur n'est utilisé.
- **Attentes Implicites :** Après avoir navigué, il faut **attendre** explicitement (ex: `time.sleep(4)` ou attente réseau) pour permettre aux assets clients (icônes FontAwesome, styles CSS partagés, polices locales) et aux animations d'entrée de se charger complètement.
- **Animations au Rendu :** Lors de la génération de captures d'écran automatisées avec Playwright, injecter ce CSS pour forcer un affichage complet sans transition : `* { animation: none !important; transition: none !important; opacity: 1 !important; }`.
- **Paramétrages Viewport :**
  - **Mobile :** Pour simuler du mobile et tester le tactile (ex: swipes), définir `has_touch=True` et un viewport fixe (ex: `viewport={'width': 375, 'height': 812}`). Ne JAMAIS utiliser `full_page=True` pour les captures mobiles, cela génère des images d'une longueur irréaliste.
  - **Elements Fixes :** Éviter `full_page=True` si des éléments utilisent `position: fixed` car cela les positionne mal en bas de la page étendue.
  - **Screenshots Globaux :** Utiliser `device_scale_factor=1` (mode clair) pour éviter des images trop lourdes.
- **Interactions Avancées Playwright :**
  - **Dimensions :** Avant de vérifier la bounding box d'un élément (ex: avec `.bounding_box()`) subissant une transition CSS, toujours attendre la fin de cette transition.
  - **Visibilité :** Toujours scroller l'élément dans la vue (`element.scroll_into_view_if_needed()`) avant d'en prendre un screenshot.
  - **Jeux & Randomisation :** Pour tester les systèmes de gamification sans subir l'aléatoire, injecter directement les états souhaités via `localStorage` en utilisant `page.evaluate()`.
  - **Assertions de Classes :** Utiliser des expressions régulières pour vérifier des classes spécifiques dans des listes longues : `expect(element).to_have_class(re.compile(r'class_name'))`.
  - **Vérification Sécurité (XSS) :** Pour vérifier que les protections XSS fonctionnent, injecter manuellement la payload malveillante dans les variables d'état (via `page.evaluate()`), déclencher le rendu, et certifier que le payload est affiché sans s'exécuter.
  - **"In Use" State :** Lors de la création de captures pour la documentation, Playwright doit simuler une vraie interaction utilisateur (remplir un champ, cliquer) plutôt que de capturer l'application entièrement vide.

## Cleanup & Git
- Avant le commit final, tous les scripts Python temporaires utilisés pour Playwright ou les tests doivent être totalement effacés du disque et de l'index (`git rm --cached`).
- Si des commandes Git réagissent mal (erreurs de révisions), forcer `git fetch --unshallow` pour récupérer l'historique complet.