1. **Fix skin selection in side drawer:**
   - Change the button to be a clickable item instead of a "Choisir" button inside the side drawer. The button should disappear and the item itself should be the target.
   - When active, color it in green to indicate selection.

2. **Refactor Mats Modal to Side Drawer:**
   - Convert `#mats-modal` to a Side Drawer like `#skins-drawer`.
   - Ensure the opacity option remains fixed/visible while scrolling the mat selection.
   - Update UI items to match the order: Title, Icon, Short Description, Usage Example.
   - Similar to skins, the item itself should be clickable and there should be no button "Choisir".
   - Include a "Aucun tapis" option next to the opacity setting to easily remove mats.

3. **Pre-commit Steps:**
   - Ensure tests are passing.
