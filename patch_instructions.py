import re

with open('alpha/webapps/jeu_de_la_grue.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add CSS for instructions
css_search = """        .difficulty-bar { display: flex; justify-content: center; gap: 8px; margin-bottom: 25px; flex-wrap: wrap; }"""
css_replace = """        .instructions {
            background: var(--instructions-bg);
            border-left: 4px solid var(--accent);
            padding: 15px 20px;
            margin-bottom: 25px;
            border-radius: 0 8px 8px 0;
            color: var(--text-secondary);
            font-size: 15px;
            line-height: 1.5;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        body.dark .instructions { box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
        .instructions p { margin-bottom: 10px; }
        .instructions p:last-child { margin-bottom: 0; }
        .instructions strong { color: var(--text-main); }

        .difficulty-bar { display: flex; justify-content: center; gap: 8px; margin-bottom: 25px; flex-wrap: wrap; }"""
content = content.replace(css_search, css_replace)

# Add HTML for instructions
html_search = """        <p class="subtitle">Déplace la grue pour attraper et déplacer des objets !</p>

        <!-- DIFFICULTÉ -->"""
html_replace = """        <p class="subtitle">Déplace la grue pour attraper et déplacer des objets !</p>

        <div class="instructions">
            <p><strong>But du jeu :</strong> Observe bien la zone <em>Objectif</em>. Tu dois utiliser la grue pour déplacer les cubes dans la <em>Zone de travail</em> afin de reproduire exactement la même disposition.</p>
            <p><strong>Comment faire ?</strong> Une machine ne devine rien ! Tu dois lui donner une suite d'instructions précises à l'avance. Ajoute des flèches pour te déplacer et la pince pour attraper/lâcher, puis appuie sur <em>Exécuter</em> pour vérifier ton programme.</p>
        </div>

        <!-- DIFFICULTÉ -->"""
content = content.replace(html_search, html_replace)

with open('alpha/webapps/jeu_de_la_grue.html', 'w', encoding='utf-8') as f:
    f.write(content)
