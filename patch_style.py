with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

content = content.replace(
    '<div class="program-strip" id="sim-program" style="position: relative; padding-right: 36px;">',
    '<div class="program-strip" id="sim-program" style="position: relative;">'
)

content = content.replace(
    '<button id="hideCmdToggleBtn" class="btn btn-outline" style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); padding: 6px; font-size: 0.8em; display: flex; align-items: center; justify-content: center; background-color: var(--card-bg); z-index: 10;" aria-label="Masquer/Afficher les commandes" title="Masquer les commandes">',
    '<button id="hideCmdToggleBtn" class="btn btn-outline" style="padding: 6px; font-size: 0.8em; display: flex; align-items: center; justify-content: center; background-color: var(--card-bg);" aria-label="Masquer/Afficher les commandes" title="Masquer les commandes">'
)

with open('webapps/simulateur_bluebot.html', 'w') as f:
    f.write(content)
