import os
import re

files = [
    'webapps/binaire_codage.html',
    'webapps/binaire_message.html',
    'webapps/binaire_studio.html',
    'webapps/bit_de_parite.html',
    'webapps/routage_reseau.html',
    'webapps/simulateur_bluebot.html',
    'ressources/bareme.html',
    'ressources/tirage.html'
]

for filepath in files:
    if not os.path.exists(filepath): continue

    with open(filepath, 'r') as f:
        content = f.read()

    replacement = """        isMuted = !isMuted;
        document.getElementById('icon-vol-on').style.display = isMuted ? 'none' : 'block';
        document.getElementById('icon-vol-off').style.display = isMuted ? 'block' : 'none';

        const audioText = document.getElementById('audioToggleText');
        if (audioText) {
            audioText.textContent = isMuted ? 'Activer le son' : 'Couper le son';
        }"""

    # We'll just look for the typical audio button click handler in the files
    if "isMuted = !isMuted;" in content:
        # Simple replace for the display part
        old_part = """        isMuted = !isMuted;
        document.getElementById('icon-vol-on').style.display = isMuted ? 'none' : 'block';
        document.getElementById('icon-vol-off').style.display = isMuted ? 'block' : 'none';"""

        if old_part in content:
            content = content.replace(old_part, replacement)
            print(f"Updated audio toggle logic in {filepath}")

    with open(filepath, 'w') as f:
        f.write(content)
