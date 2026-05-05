import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find all opening tags
    def replacer(match):
        tag = match.group(1)
        attrs = match.group(2)

        classes = re.findall(r'class="([^"]*)"', attrs)
        if len(classes) > 1:
            # Combine them
            combined_classes = []
            for c in classes:
                combined_classes.extend(c.split())
            # Deduplicate while preserving order
            unique_classes = []
            for c in combined_classes:
                if c not in unique_classes:
                    unique_classes.append(c)

            new_class_str = f'class="{" ".join(unique_classes)}"'

            # Remove all old class="..."
            new_attrs = re.sub(r'\s*class="[^"]*"', '', attrs)

            # Add the new combined class
            return f'<{tag} {new_class_str}{new_attrs}>'

        return match.group(0)

    content = re.sub(r'<([a-zA-Z0-9\-]+)([^>]*)>', replacer, content)

    with open(filepath, 'w') as f:
        f.write(content)

fix_file('index.html')
fix_file('webapps/simulateur_bluebot.html')
fix_file('alpha/webapps/jeu_de_la_grue.html')
