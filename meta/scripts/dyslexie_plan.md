1. **Create the HTML Structure**
   - Create `alpha/webapps/teacher/sim_dyslexie.html`.
   - Add standard AGPL-3.0 header.
   - Include standard head tags: meta charset, viewport, title ("Simulateur de Dyslexie"), favicon.
   - Link to `../../assets/css/shared.css` and `../../assets/css/teacher.css`.
   - Include `<script src="../../assets/js/fa-subset.js"></script>` for icons.
2. **Implement CSS Styling**
   - Add inline styles for the layout matching the provided React app but using vanilla CSS and our standard variables.
   - Set up the grid layout (sidebar controls, main simulation view).
   - Define custom CSS for visual effects (blur, chromatic aberration if possible).
3. **Build the UI Layout**
   - Header: App title ("Simulateur de Dyslexie") and navigation tabs (Simulateur / Éditer).
   - Sidebar:
     - Sliders for "Intensité des confusions" (Severity) and "Instabilité" (Speed).
     - Buttons for "Type de trouble" (Mixte, Décalages, Mélange, Inversions).
     - Toggle for "Mode Focus" with a speed slider.
     - Toggle for "Effets visuels simulés".
     - Preset texts selection.
   - Main View:
     - Editor mode: `<textarea>` for text input.
     - Simulation mode: `<div>` to display the simulated text.
4. **Implement JavaScript Logic (Vanilla)**
   - Define preset texts and confusion characters (`CONFUSE_CHARS`).
   - State variables for settings (severity, speed, mixing style, focus mode, visual effect).
   - Tokenize the input text into words and non-words.
   - `mutateToken` function to apply character inversions, scrambling, and offsets based on severity and mixing style.
   - Set up intervals for mutations (based on speed) and focus mode progression.
   - Render the tokens dynamically into the simulation container, applying specific classes for the focus mode highlight and dimming.
5. **Testing & Integration**
   - Verify 100% offline functionality (no external CDNs).
   - Ensure the service worker manifest is updated (by running `node meta/scripts/generate-sw-manifest.js`).
   - Run existing tests.
6. **Pre-commit Checks**
   - Complete pre commit steps to ensure proper testing, verification, review, and reflection are done.
7. **Submit**
