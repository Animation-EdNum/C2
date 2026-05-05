import re

def check_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find all opening tags
    tags = re.findall(r'<([a-zA-Z0-9\-]+)([^>]*)>', content)
    for tag, attrs in tags:
        classes = re.findall(r'class="([^"]*)"', attrs)
        if len(classes) > 1:
            print(f"File {filepath}: Tag <{tag}> has multiple class attributes: {classes}")
            # Also fix it
            # We will fix it below.

check_file('index.html')
check_file('webapps/simulateur_bluebot.html')
check_file('alpha/webapps/jeu_de_la_grue.html')
