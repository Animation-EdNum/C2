import re

with open('alpha/webapps/jeu_de_la_grue.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure renderAll updates crane class properly
js_search = """        function updateCraneVisuals() {
            const cupWidth = 60;
            const gap = 15;
            const baseX = craneState.pos * (cupWidth + gap);

            craneEl.style.left = `${baseX}px`;

            // Height visual mapping
            const baseArmHeight = 40;
            const dropPerLevel = 50;
            craneArmEl.style.height = `${baseArmHeight + (craneState.height * dropPerLevel)}px`;

            if (craneState.holding) {
                craneEl.classList.add('holding');
            } else {
                craneEl.classList.remove('holding');
            }
        }"""

js_replace = """        function updateCraneVisuals() {
            const cupWidth = 70; // updated CSS
            const gap = 15; // gap in flex is 15px
            // Main board has 15px padding inside, but relative position inside crane-layer matches
            const baseX = craneState.pos * (cupWidth + gap);

            craneEl.style.left = `${baseX}px`;

            // Height visual mapping
            const baseArmHeight = 40;
            const dropPerLevel = 55; // visual slot height
            craneArmEl.style.height = `${baseArmHeight + (craneState.height * dropPerLevel)}px`;

            if (craneState.holding) {
                craneEl.classList.add('holding');
            } else {
                craneEl.classList.remove('holding');
            }
        }"""

content = content.replace(js_search, js_replace)

with open('alpha/webapps/jeu_de_la_grue.html', 'w', encoding='utf-8') as f:
    f.write(content)
