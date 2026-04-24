1. **Define MAT_CONFIG and Mat State**: Add a `MAT_CONFIG` dictionary to store mat configurations (e.g., 'none', 'alphabet'). Create an `activeMat` variable loaded from `localStorage` (defaulting to 'none').
2. **Add "Tapis" Modal UI**: Create a new modal for mats (`#mats-modal`) similar to the skins modal, with a grid container (`#mats-grid-container`) to render available mats. Add a button in the top action buttons to open this modal (e.g., `#btn-open-mats`).
3. **Add Mat Rendering Logic**:
   - Write a `renderMatsGrid()` function to display mats in the modal and allow selection.
   - Write a `selectMat(matId)` function to save the choice to `localStorage`, close the modal, and trigger a re-render of the grids.
   - Modify the `buildGrid` function: if an `activeMat` with `content` is selected, iterate over the characters in `content` and set `cell.innerText` or an inner span to display the letter/number. Ensure cells without obstacles or content don't show "undefined".
4. **Style Mat Content**: Add CSS to properly center and style the letters/numbers inside `.bot-cell`. The text should be semi-transparent or styled appropriately so it doesn't obstruct the robot or path but is clearly visible (e.g., `font-size: 2rem; font-weight: bold; color: rgba(0,0,0,0.5)`).
5. **Pre-commit**: Run pre-commit instructions.
6. **Submit**: Submit the changes.
