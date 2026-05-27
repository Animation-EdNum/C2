import os

filepath = 'assets/js/automate/automate-engine.js'

with open(filepath, 'r') as f:
    content = f.read()

content = content.replace("layer.innerHTML = ''", "layer.textContent = ''")
content = content.replace("if (layer) layer.innerHTML = ''", "if (layer) layer.textContent = ''")
content = content.replace("strip.innerHTML = ''", "strip.textContent = ''")
content = content.replace("grid.innerHTML = ''", "grid.textContent = ''")
content = content.replace("cell.innerHTML.trim()", "cell.textContent.trim()")
content = content.replace("el.innerHTML = cell.textContent.trim()", "el.textContent = cell.textContent.trim()")
content = content.replace("el.innerHTML.trim()", "el.textContent.trim()")
content = content.replace("cell.innerHTML = obs", "cell.insertAdjacentHTML('beforeend', obs)")
content = content.replace("span.innerHTML = content[index]", "span.insertAdjacentHTML('beforeend', content[index])")
content = content.replace("ov.innerHTML = content", "ov.insertAdjacentHTML('beforeend', content)")
content = content.replace("document.getElementById('draw-instruction').innerHTML = instructionHTML", "document.getElementById('draw-instruction').textContent = ''; document.getElementById('draw-instruction').insertAdjacentHTML('beforeend', instructionHTML)")
content = content.replace("strip.innerHTML = '<div class=\"empty-program\">Ajoute des commandes...</div>'", "strip.textContent = ''; strip.insertAdjacentHTML('beforeend', '<div class=\"empty-program\">Ajoute des commandes...</div>')")
content = content.replace("strip.innerHTML = drawState.program.map((cmd, i) => {", "strip.textContent = ''; strip.insertAdjacentHTML('beforeend', drawState.program.map((cmd, i) => {")
content = content.replace("document.getElementById('read-instruction').innerHTML = \"Où va s'arrêter le robot ? <strong>Clique sur la case finale.</strong>\"", "document.getElementById('read-instruction').textContent = ''; document.getElementById('read-instruction').insertAdjacentHTML('beforeend', \"Où va s'arrêter le robot ? <strong>Clique sur la case finale.</strong>\")")
content = content.replace("strip.innerHTML = readState.program.map((cmd, i) => {", "strip.textContent = ''; strip.insertAdjacentHTML('beforeend', readState.program.map((cmd, i) => {")
content = content.replace("container.innerHTML = chalState.options.map((opt, i) => {", "container.textContent = ''; container.insertAdjacentHTML('beforeend', chalState.options.map((opt, i) => {")

# One case missed in patch_automate6.py
content = content.replace("el.innerHTML = cell.innerHTML.trim()", "el.textContent = cell.textContent.trim()")

with open(filepath, 'w') as f:
    f.write(content)
