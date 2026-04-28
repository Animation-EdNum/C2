import re

with open('alpha/webapps/jeu_de_la_grue.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update HTML for cup structure to have background slots
html_search = """        function renderBoard(boardState, container, isTarget) {
            container.innerHTML = '';
            for(let i=0; i<NUM_CUPS; i++) {
                let cupEl = document.createElement('div');
                cupEl.className = 'cup';
                if (!isTarget) cupEl.id = `cup-${i}`;

                // Render from bottom to top, flex column-reverse handles this naturally
                for(let j=0; j<boardState[i].length; j++) {
                    let block = boardState[i][j];
                    let blockEl = document.createElement('div');
                    blockEl.className = 'cube';
                    // blockEl.style.background = block.color; // Using default blue for simplicity now
                    cupEl.appendChild(blockEl);
                }
                container.appendChild(cupEl);
            }
        }"""

html_replace = """        function renderBoard(boardState, container, isTarget) {
            container.innerHTML = '';
            for(let i=0; i<NUM_CUPS; i++) {
                let cupEl = document.createElement('div');
                cupEl.className = 'cup';
                if (!isTarget) cupEl.id = `cup-${i}`;

                // Add background slots for visual guidance
                let slotsContainer = document.createElement('div');
                slotsContainer.className = 'cup-slots';
                for(let s=0; s<MAX_STACK; s++) {
                    let slotEl = document.createElement('div');
                    slotEl.className = 'cup-slot';
                    slotsContainer.appendChild(slotEl);
                }
                cupEl.appendChild(slotsContainer);

                let blocksContainer = document.createElement('div');
                blocksContainer.className = 'cup-blocks';
                // Render from bottom to top, flex column-reverse handles this naturally
                for(let j=0; j<boardState[i].length; j++) {
                    let block = boardState[i][j];
                    let blockEl = document.createElement('div');
                    blockEl.className = 'cube';
                    // blockEl.style.background = block.color; // Using default blue for simplicity now
                    blocksContainer.appendChild(blockEl);
                }
                cupEl.appendChild(blocksContainer);

                container.appendChild(cupEl);
            }
        }"""
content = content.replace(html_search, html_replace)

# Add CSS for cup slots
css_search = """        .cup {
            width: 70px;
            height: 180px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 0 0 16px 16px;
            border: 4px solid #cbd5e1;
            border-top: none;
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            padding: 5px;
            gap: 5px;
            position: relative;
            box-shadow: inset 0 -5px 10px rgba(0,0,0,0.05);
        }"""

css_replace = """        .cup {
            width: 70px;
            height: 180px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 0 0 16px 16px;
            border: 4px solid #cbd5e1;
            border-top: none;
            position: relative;
            box-shadow: inset 0 -5px 10px rgba(0,0,0,0.05);
            overflow: hidden;
        }

        .cup-slots {
            position: absolute;
            top: 5px; left: 5px; right: 5px; bottom: 5px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .cup-slot {
            flex: 1;
            border: 2px dashed rgba(148, 163, 184, 0.4);
            border-radius: 8px;
            background: rgba(241, 245, 249, 0.3);
        }
        body.dark .cup-slot { border-color: rgba(71, 85, 105, 0.4); background: rgba(30, 41, 59, 0.3); }

        .cup-blocks {
            position: absolute;
            top: 5px; left: 5px; right: 5px; bottom: 5px;
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            gap: 5px;
        }"""
content = content.replace(css_search, css_replace)

css_search2 = """        .target-board .cup {
            width: 45px;
            height: 120px;
            border-width: 3px;
            padding: 3px;
            gap: 3px;
            border-radius: 0 0 12px 12px;
        }"""
css_replace2 = """        .target-board .cup {
            width: 45px;
            height: 120px;
            border-width: 3px;
            border-radius: 0 0 12px 12px;
        }
        .target-board .cup-slots {
            top: 3px; left: 3px; right: 3px; bottom: 3px;
            gap: 3px;
        }
        .target-board .cup-slot { border-radius: 6px; }
        .target-board .cup-blocks {
            top: 3px; left: 3px; right: 3px; bottom: 3px;
            gap: 3px;
        }"""
content = content.replace(css_search2, css_replace2)

with open('alpha/webapps/jeu_de_la_grue.html', 'w', encoding='utf-8') as f:
    f.write(content)
