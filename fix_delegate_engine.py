import re

with open('assets/js/bluebot/bluebot-engine.js', 'r') as f:
    js_content = f.read()

# Replace:
#                 // Add delete listeners
#                 strip.querySelectorAll('.program-cmd').forEach(cmdEl => {
#                     cmdEl.addEventListener('click', (e) => {
#                         if (drawState.locked || drawState.isAnimating) return;
#                         const idx = parseInt(e.currentTarget.dataset.index);
#                         drawState.program.splice(idx, 1);
#                         playSound('click');
#                         renderDrawProgram();
#                     });
#                 });
# With nothing in renderDrawProgram, and delegate it to a setup initialization

# First, remove the listeners from renderDrawProgram:
to_remove = """                // Add delete listeners
                strip.querySelectorAll('.program-cmd').forEach(cmdEl => {
                    cmdEl.addEventListener('click', (e) => {
                        if (drawState.locked || drawState.isAnimating) return;
                        const idx = parseInt(e.currentTarget.dataset.index);
                        drawState.program.splice(idx, 1);
                        playSound('click');
                        renderDrawProgram();
                    });
                });"""

js_content = js_content.replace(to_remove, "")

with open('assets/js/bluebot/bluebot-engine.js', 'w') as f:
    f.write(js_content)

print("Removed inline event listeners from renderDrawProgram")
