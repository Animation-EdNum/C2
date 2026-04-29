import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

# Let's search with regex to handle whitespace issues
match = re.search(r'// Draw start marker using a nested SVG.*?(?=this\.states\[containerId\])', content, re.DOTALL)
if match:
    old_marker = match.group(0)

    replace_marker = """// Draw start marker (cell size is now 100x100 in the new viewBox)
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                g.setAttribute("class", "start-marker");

                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("class", "start-marker-circle");
                circle.setAttribute("cx", pt.x);
                circle.setAttribute("cy", pt.y);
                circle.setAttribute("r", "18"); // scaled up from 3

                const chevron = document.createElementNS("http://www.w3.org/2000/svg", "path");
                chevron.setAttribute("class", "start-marker-chevron");
                chevron.setAttribute("d", `M ${pt.x - 9} ${pt.y + 6} L ${pt.x} ${pt.y - 6} L ${pt.x + 9} ${pt.y + 6}`);
                chevron.setAttribute("transform", `rotate(${rot} ${pt.x} ${pt.y})`);

                g.appendChild(circle);
                g.appendChild(chevron);

                layer.appendChild(g);

                """

    content = content.replace(old_marker, replace_marker)
    with open('webapps/simulateur_bluebot.html', 'w') as f:
        f.write(content)
    print("Marker fixed!")
else:
    print("Not found.")
