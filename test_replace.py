import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

search = """                // Draw start marker
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                g.setAttribute("class", "start-marker");

                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("class", "start-marker-circle");
                circle.setAttribute("cx", pt.x);
                circle.setAttribute("cy", pt.y);
                circle.setAttribute("r", "3");

                const chevron = document.createElementNS("http://www.w3.org/2000/svg", "path");
                chevron.setAttribute("class", "start-marker-chevron");
                chevron.setAttribute("d", `M ${pt.x - 1.5} ${pt.y + 1} L ${pt.x} ${pt.y - 1} L ${pt.x + 1.5} ${pt.y + 1}`);
                chevron.setAttribute("transform", `rotate(${rot} ${pt.x} ${pt.y})`);

                g.appendChild(circle);
                g.appendChild(chevron);"""

replace = """                // Draw start marker
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                g.setAttribute("class", "start-marker");

                const cw = 100 / GRID_COLS;
                const ch = 100 / GRID_ROWS;

                // Translate to center, scale to make coordinate system visually 1:1, then rotate
                g.setAttribute("transform", `translate(${pt.x}, ${pt.y}) scale(${cw}, ${ch}) rotate(${rot})`);

                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("class", "start-marker-circle");
                circle.setAttribute("cx", "0");
                circle.setAttribute("cy", "0");
                circle.setAttribute("r", "0.18");

                const chevron = document.createElementNS("http://www.w3.org/2000/svg", "path");
                chevron.setAttribute("class", "start-marker-chevron");
                chevron.setAttribute("d", "M -0.1 0.05 L 0 -0.05 L 0.1 0.05");

                g.appendChild(circle);
                g.appendChild(chevron);"""

if search in content:
    content = content.replace(search, replace)
    with open('webapps/simulateur_bluebot.html', 'w') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Search string not found!")
