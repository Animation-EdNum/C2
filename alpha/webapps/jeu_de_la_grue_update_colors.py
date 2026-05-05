with open('alpha/webapps/jeu_de_la_grue.html', 'r') as f:
    content = f.read()

# CSS colors
css_to_add = """
        .up-color { color: #fff; background-color: #2980b9; border-color: #1a5276; box-shadow: 0 5px 0 #1a5276, 0 6px 6px var(--card-shadow); }
        .down-color { color: #fff; background-color: #8e44ad; border-color: #5b2c6f; box-shadow: 0 5px 0 #5b2c6f, 0 6px 6px var(--card-shadow); }
        .left-color { color: #fff; background-color: #f39c12; border-color: #a04000; box-shadow: 0 5px 0 #a04000, 0 6px 6px var(--card-shadow); }
        .right-color { color: #fff; background-color: #27ae60; border-color: #145a32; box-shadow: 0 5px 0 #145a32, 0 6px 6px var(--card-shadow); }
        .action-color { color: #fff; background-color: #e74c3c; border-color: #922b21; box-shadow: 0 5px 0 #922b21, 0 6px 6px var(--card-shadow); }

        body.dark .up-color, body.dark .down-color, body.dark .left-color, body.dark .right-color, body.dark .action-color {
            color: #fff;
        }
"""

# add it after .instruction-btn.action-color { ... }
# actually we can just replace .instruction-btn.action-color block and instruction-btn:hover etc

content = content.replace("""        .instruction-btn.action-color {
            color: var(--accent);
            border-color: var(--accent);
            box-shadow: 0 5px 0 var(--accent-dark), 0 6px 6px var(--card-shadow);
        }""", css_to_add)

content = content.replace(
    """<button class="instruction-btn" onclick="addInstruction('up')" aria-label="Haut"><i""",
    """<button class="instruction-btn up-color" onclick="addInstruction('up')" aria-label="Haut"><i"""
)
content = content.replace(
    """<button class="instruction-btn" onclick="addInstruction('down')" aria-label="Bas"><i""",
    """<button class="instruction-btn down-color" onclick="addInstruction('down')" aria-label="Bas"><i"""
)
content = content.replace(
    """<button class="instruction-btn" onclick="addInstruction('left')" aria-label="Gauche"><i""",
    """<button class="instruction-btn left-color" onclick="addInstruction('left')" aria-label="Gauche"><i"""
)
content = content.replace(
    """<button class="instruction-btn" onclick="addInstruction('right')" aria-label="Droite"><i""",
    """<button class="instruction-btn right-color" onclick="addInstruction('right')" aria-label="Droite"><i"""
)

# And in renderProgram: stepEl.className = 'prog-step';
content = content.replace(
    "stepEl.className = 'prog-step';",
    "stepEl.className = 'prog-step ' + inst + '-color';"
)

with open('alpha/webapps/jeu_de_la_grue.html', 'w') as f:
    f.write(content)
