import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

# Let's search with regex
match = re.search(r'const d = `M \$\{pt\.x\} \$\{pt\.y\}`;.*?path\.setAttribute\("d", d\);(.*?)// Draw start marker', content, re.DOTALL)
if match:
    old_block = match.group(0)

    replace_block = """const d = `M ${pt.x} ${pt.y}`;
                path.setAttribute("d", d);
                layer.appendChild(path);

                // Draw start marker"""

    content = content.replace(old_block, replace_block)
    with open('webapps/simulateur_bluebot.html', 'w') as f:
        f.write(content)
    print("Fixed!")
else:
    print("Not found.")
