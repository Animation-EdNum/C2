import re

with open('assets/js/bluebot/bluebot-ui.js', 'r') as f:
    js_content = f.read()

# Add delegated listener for draw program cmd click:
add_draw_listener = """
        document.getElementById('sim-program').addEventListener('click', (e) => {
            const cmdEl = e.target.closest('.program-cmd');
            if (cmdEl) removeSpecificCmd(parseInt(cmdEl.dataset.index));
        });

        document.getElementById('draw-program').addEventListener('click', (e) => {
            if (drawState && (drawState.locked || drawState.isAnimating)) return;
            const cmdEl = e.target.closest('.program-cmd');
            if (cmdEl) {
                const idx = parseInt(cmdEl.dataset.index);
                drawState.program.splice(idx, 1);
                playSound('click');
                renderDrawProgram();
            }
        });
"""

js_content = re.sub(
    r"        document\.getElementById\('sim-program'\)\.addEventListener\('click', \(e\) => \{\n            const cmdEl = e\.target\.closest\('\.program-cmd'\);\n            if \(cmdEl\) removeSpecificCmd\(parseInt\(cmdEl\.dataset\.index\)\);\n        \}\);",
    add_draw_listener,
    js_content
)

with open('assets/js/bluebot/bluebot-ui.js', 'w') as f:
    f.write(js_content)

print("Added draw-program delegated listener")
