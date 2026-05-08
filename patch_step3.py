import re

with open("assets/js/bluebot/bluebot-engine.js", "r") as f:
    content = f.read()

search = """        // --- Effet Océan ---
        let oceanRippleInterval = null;

        function startOceanRipples() {
            if (oceanRippleInterval) clearInterval(oceanRippleInterval);
            oceanRippleInterval = setInterval(() => {
                if (activeSkin !== 'pirate') return;
                const row = Math.floor(Math.random() * GRID_ROWS);
                const col = Math.floor(Math.random() * GRID_COLS);
                triggerRipple(row, col, 0);
            }, 2000);
        }

        function stopOceanRipples() {
            if (oceanRippleInterval) {
                clearInterval(oceanRippleInterval);
                oceanRippleInterval = null;
            }
        }"""

replace = """        // --- Effet Océan ---
        let oceanRippleAnimFrame = null;
        let lastRippleTime = 0;

        function startOceanRipples() {
            if (oceanRippleAnimFrame) cancelAnimationFrame(oceanRippleAnimFrame);

            function animateOcean(timestamp) {
                if (activeSkin !== 'pirate') return;

                if (timestamp - lastRippleTime >= 2000) {
                    const row = Math.floor(Math.random() * GRID_ROWS);
                    const col = Math.floor(Math.random() * GRID_COLS);
                    triggerRipple(row, col, 0);
                    lastRippleTime = timestamp;
                }

                oceanRippleAnimFrame = requestAnimationFrame(animateOcean);
            }

            oceanRippleAnimFrame = requestAnimationFrame(animateOcean);
        }

        function stopOceanRipples() {
            if (oceanRippleAnimFrame) {
                cancelAnimationFrame(oceanRippleAnimFrame);
                oceanRippleAnimFrame = null;
            }
        }"""

content = content.replace(search, replace, 1)

with open("assets/js/bluebot/bluebot-engine.js", "w") as f:
    f.write(content)
