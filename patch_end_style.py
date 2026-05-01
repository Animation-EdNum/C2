with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

content = content.replace(
    '<div class="program-strip" id="sim-end-content" style="position: relative; padding-right: 40px; background-color: var(--card-bg); border: 2px dashed var(--badge-bg); min-height: 50px;">',
    '<div class="program-strip" id="sim-end-content" style="position: relative; background-color: var(--card-bg); border: 2px dashed var(--badge-bg); min-height: 50px;">'
)

content = content.replace(
    '<button id="btn-clear-end" class="btn btn-outline" style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); padding: 6px; font-size: 0.8em; display: flex; align-items: center; justify-content: center; background-color: var(--card-bg); z-index: 10;" aria-label="Effacer" title="Effacer les éléments atteints">',
    '<button id="btn-clear-end" class="btn btn-outline" style="padding: 6px; font-size: 0.8em; display: flex; align-items: center; justify-content: center; background-color: var(--card-bg);" aria-label="Effacer" title="Effacer les éléments atteints">'
)

with open('webapps/simulateur_bluebot.html', 'w') as f:
    f.write(content)
