# Plan

1. **Design `ScoreManager` JS Utility**
   Create an inline JavaScript script block in each webapp that tracks detailed stats.
   Stats to track: `firstTrySuccess`, `totalSuccess`, `mistakes`, `totalAttempts`. These are tracked per-app, per-mode, and per-difficulty.
   - We will inject this logic directly into each file. Since it needs to be synced to `standalone/`, we should try to keep the logic self-contained. Alternatively, create `js/scores.js` and link it in the webapps, and embed it for standalones using a script. Oh wait, `js/` directory does not have a build script. So we should create `js/scores.js` and link to it from `webapps/`, and manually copy its contents into the files in `standalone/`? Or we can just use inline code in each file to avoid creating new shared dependencies, but creating `js/scores.js` and importing it in `webapps/` is cleaner for the `webapps/` structure. Wait, `AGENTS.md` says: "The repository uses a dual-mode structure: Standard Web Use (files in webapps/ and ressources/) must link to shared resources (css/shared.css, js/theme.js)."
   - Let's create `js/scores.js` containing `ScoreManager` class or functions.
   - We also need to add common CSS for the modal to `css/shared.css`.

2. **Update `css/shared.css`**
   Add styles for `#score-details-modal`, `.modal-overlay`, `.modal-content`, `.modal-close-btn`, and the table/stats display.

3. **Update `js/scores.js`**
   Create a reusable script that handles saving/loading from `localStorage`, rendering the modal, and exposing an API like `ScoreManager.addSuccess(mode, difficulty, isFirstTry)`, `ScoreManager.addMistake(mode, difficulty)`, `ScoreManager.showModal()`, and `ScoreManager.resetScores()`.
   Also it will inject the modal HTML into the `<body>` automatically or expect a specific element. Injecting HTML dynamically via JS might be easiest to keep HTML files clean.

4. **Update each webapp** (`webapps/binaire_codage.html`, `webapps/binaire_message.html`, `webapps/bit_de_parite.html`, `webapps/routage_reseau.html`, `webapps/simulateur_bluebot.html`)
   - Include `<script src="../js/scores.js"></script>`.
   - Add the "Score Details" button in the `.action-buttons` container, pointing to `ScoreManager.showModal()`. The icon can be a Bar Chart or Info icon from Lucide (if available) or SVG.
   - Modify the logic where correct/incorrect answers are handled to call `ScoreManager.addSuccess(mode, difficulty, isFirstTry)` and `ScoreManager.addMistake(mode, difficulty)`.
   - Pass the relevant app ID to `ScoreManager.init('binaire_codage')` so it uses isolated localStorage keys per app.

5. **Update standalone versions**
   Mirror the changes into the `standalone/` versions. I will need to use a script or manually copy the HTML, CSS, and inline the new JS. Since there's no build script, I'll write a small Python script to generate the standalone versions by injecting shared CSS and JS into the `webapps/` files. Wait, `standalone/` files already exist. I'll read how they currently differ and write a Python script to do the sync, or manually edit them if it's simpler.

6. **Verify**
   Check all 5 webapps to ensure the modal opens, stats update correctly (including percentages), and scores can be reset. Then verify the `standalone` mirror is correct.
