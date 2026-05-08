import re

with open("assets/js/bluebot/bluebot-engine.js", "r") as f:
    content = f.read()

search = """            function animateOcean(timestamp) {
                if (activeSkin !== 'pirate') return;

                if (timestamp - lastRippleTime >= 2000) {
                    const row = Math.floor(Math.random() * GRID_ROWS);
                    const col = Math.floor(Math.random() * GRID_COLS);
                    triggerRipple(row, col, 0);
                    lastRippleTime = timestamp;
                }

                oceanRippleAnimFrame = requestAnimationFrame(animateOcean);
            }"""

replace = """            function animateOcean(timestamp) {
                if (activeSkin === 'pirate' && timestamp - lastRippleTime >= 2000) {
                    const row = Math.floor(Math.random() * GRID_ROWS);
                    const col = Math.floor(Math.random() * GRID_COLS);
                    triggerRipple(row, col, 0);
                    lastRippleTime = timestamp;
                }

                oceanRippleAnimFrame = requestAnimationFrame(animateOcean);
            }"""

content = content.replace(search, replace, 1)

with open("assets/js/bluebot/bluebot-engine.js", "w") as f:
    f.write(content)
