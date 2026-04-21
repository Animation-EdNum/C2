const fs = require('fs');
let html = fs.readFileSync('webapps/bit_de_parite.html', 'utf8');

// I need to track if they solved it on the first try.
// Since globalStreak goes down to 0 if there's an error, globalStreak increments by 1 on success.
// However, the task says: "quand l'élève parvient à résoudre du premier coup en mode difficile. Lance un coup de feu quand cette récompense est automatiquement débloquée et appliquée"
// First try implies no errors were made on the current grid before verifying correctly.
// Let's see if there's a variable tracking tries for the current grid.
// There is none. I can add `let currentGridTries = 0;` or similar, or just know that `hasError` evaluates to true only during `checkTrainAnswer`.
// If `isTrainLocked` is false, and `hasError` evaluates to false, and they didn't have any error previously... wait, how is an error tracked?
// Ah! An error occurs if `hasError` is true during `checkTrainAnswer()`.
// When they fail, it shows "Il y a des erreurs en rouge." but they can fix them and check again!
// So I should track `trainFailures = 0` in `initTrainMode()`. Then increment it in the `else` block of `hasError`.
// Then in `if (!hasError)`, check if `trainFailures === 0` and `gridSize === 6` (which means mode difficile).
