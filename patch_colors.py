import re

with open('alpha/webapps/jeu_de_la_grue.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the initial objects use standard solid colors rather than weird HSL random gradients to look better with the standard cube css
js_search = """        function generateRandomState(numBlocks) {
            let state = [[], [], []];
            for(let i=0; i<numBlocks; i++) {
                let cupIdx;
                do {
                    cupIdx = Math.floor(Math.random() * NUM_CUPS);
                } while (state[cupIdx].length >= MAX_STACK);
                state[cupIdx].push({ id: i, color: `hsl(${Math.random()*360}, 70%, 50%)` });
            }
            return state;
        }"""

js_replace = """        function generateRandomState(numBlocks) {
            let state = [[], [], []];
            const colors = ['#3b82f6', '#ef4444', '#10b981']; // Standard blue, red, green
            for(let i=0; i<numBlocks; i++) {
                let cupIdx;
                do {
                    cupIdx = Math.floor(Math.random() * NUM_CUPS);
                } while (state[cupIdx].length >= MAX_STACK);
                state[cupIdx].push({ id: i, color: colors[i % colors.length] });
            }
            return state;
        }"""
content = content.replace(js_search, js_replace)

css_search = """        .cube {
            width: 100%;
            height: 50px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            border-radius: 8px;
            box-shadow: 0 4px 0 #1d4ed8, 0 5px 5px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            color: white;
            font-weight: bold;
            border: 1px solid rgba(255,255,255,0.2);
            transition: transform 0.2s;
        }"""
css_replace = """        .cube {
            width: 100%;
            height: 50px;
            background: var(--cube-color, linear-gradient(135deg, #3b82f6, #2563eb));
            border-radius: 8px;
            box-shadow: 0 4px 0 rgba(0,0,0,0.2), 0 5px 5px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            color: white;
            font-weight: bold;
            border: 1px solid rgba(255,255,255,0.2);
            transition: transform 0.2s;
        }"""
content = content.replace(css_search, css_replace)

js_search2 = """                    let blockEl = document.createElement('div');
                    blockEl.className = 'cube';
                    // blockEl.style.background = block.color; // Using default blue for simplicity now
                    blocksContainer.appendChild(blockEl);"""
js_replace2 = """                    let blockEl = document.createElement('div');
                    blockEl.className = 'cube';
                    blockEl.style.setProperty('--cube-color', block.color);
                    blocksContainer.appendChild(blockEl);"""
content = content.replace(js_search2, js_replace2)

with open('alpha/webapps/jeu_de_la_grue.html', 'w', encoding='utf-8') as f:
    f.write(content)
