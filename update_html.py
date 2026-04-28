import re

with open('alpha/webapps/jeu_de_la_grue.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the HTML body content from <!-- TABS --> to the end of <div class="game-area">
html_search = """        <!-- TABS -->
        <div class="tabs">
            <button class="tab-btn active" id="tab-collect">🎯 Collecte</button>
            <button class="tab-btn" id="tab-deliver">🚚 Livraison</button>
        </div>

        <!-- DIFFICULTÉ -->
        <div class="difficulty-bar">
            <button class="diff-btn" id="diff-easy">🟢 Facile</button>
            <button class="diff-btn active" id="diff-medium">🟡 Moyen</button>
            <button class="diff-btn" id="diff-hard">🔴 Difficile</button>
        </div>

        <div class="feedback" id="feedback-msg"></div>

        <!-- GAME AREA -->
        <div class="game-area">
            <div class="grid-container">
                <div class="grid" id="grid">
                    <!-- Grille générée ici -->
                </div>
            </div>

            <!-- CONTROLS -->
            <div class="controls-panel">
                <div class="dpad">
                    <button class="dpad-btn dpad-up" aria-label="Haut" onclick="moveCrane(0, -1)"><i data-lucide="arrow-up"></i></button>
                    <button class="dpad-btn dpad-left" aria-label="Gauche" onclick="moveCrane(-1, 0)"><i data-lucide="arrow-left"></i></button>
                    <button class="dpad-btn dpad-action" aria-label="Action" onclick="actionCrane()"><i data-lucide="check"></i></button>
                    <button class="dpad-btn dpad-right" aria-label="Droite" onclick="moveCrane(1, 0)"><i data-lucide="arrow-right"></i></button>
                    <button class="dpad-btn dpad-down" aria-label="Bas" onclick="moveCrane(0, 1)"><i data-lucide="arrow-down"></i></button>
                </div>

                <button class="action-btn-large" onclick="actionCrane()">
                    <i data-lucide="hand"></i>
                    <span id="action-text">Action</span>
                </button>
            </div>
        </div>"""

html_replace = """        <!-- DIFFICULTÉ -->
        <div class="difficulty-bar">
            <button class="diff-btn" id="diff-easy">🟢 Facile</button>
            <button class="diff-btn active" id="diff-medium">🟡 Moyen</button>
            <button class="diff-btn" id="diff-hard">🔴 Difficile</button>
        </div>

        <div class="feedback" id="feedback-msg"></div>

        <!-- GAME BOARDS -->
        <div class="game-boards">
            <div class="board-wrapper">
                <div class="board-title">Objectif</div>
                <div class="board target-board" id="target-board">
                    <div class="cup"></div>
                    <div class="cup"></div>
                    <div class="cup"></div>
                </div>
            </div>

            <div class="board-wrapper main-wrapper">
                <div class="board-title">Zone de travail</div>
                <div class="crane-layer" id="crane-layer">
                    <div class="crane" id="crane">
                        <div class="crane-arm" id="crane-arm"></div>
                        <div class="crane-claw" id="crane-claw"></div>
                    </div>
                </div>
                <div class="board main-board" id="main-board">
                    <div class="cup" id="cup-0"></div>
                    <div class="cup" id="cup-1"></div>
                    <div class="cup" id="cup-2"></div>
                </div>
            </div>
        </div>

        <!-- PROGRAMMING AREA -->
        <div class="program-area">
            <div class="program-strip-wrapper">
                <div class="program-strip" id="program-strip">
                    <!-- Instructions apparaitront ici -->
                </div>
            </div>

            <div class="controls-panel">
                <div class="instructions-group">
                    <button class="instruction-btn" onclick="addInstruction('up')" aria-label="Haut"><i data-lucide="arrow-up"></i></button>
                    <button class="instruction-btn" onclick="addInstruction('down')" aria-label="Bas"><i data-lucide="arrow-down"></i></button>
                    <button class="instruction-btn" onclick="addInstruction('left')" aria-label="Gauche"><i data-lucide="arrow-left"></i></button>
                    <button class="instruction-btn" onclick="addInstruction('right')" aria-label="Droite"><i data-lucide="arrow-right"></i></button>
                    <button class="instruction-btn action-color" onclick="addInstruction('action')" aria-label="Action"><i data-lucide="grip-horizontal"></i></button>
                </div>

                <div class="execution-group">
                    <button class="exec-btn del-btn" onclick="deleteLastInstruction()"><i data-lucide="delete"></i> Effacer</button>
                    <button class="exec-btn clear-btn" onclick="clearProgram()"><i data-lucide="trash-2"></i> Tout vider</button>
                    <button class="exec-btn play-btn" id="play-btn" onclick="executeProgram()"><i data-lucide="play"></i> Exécuter</button>
                </div>
            </div>
        </div>"""

content = content.replace(html_search, html_replace)

with open('alpha/webapps/jeu_de_la_grue.html', 'w', encoding='utf-8') as f:
    f.write(content)
