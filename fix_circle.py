import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

search = """                // Draw start marker
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

replace = """                // Draw start marker
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                g.setAttribute("class", "start-marker");

                const cw = 100 / GRID_COLS;
                const ch = 100 / GRID_ROWS;

                // Scale cell to a 1:1 ratio so the circle is perfectly round.
                // A radius of 0.25 means 25% of the cell width.
                g.setAttribute("transform", `translate(${pt.x}, ${pt.y}) scale(${cw}, ${ch}) rotate(${rot})`);

                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("class", "start-marker-circle");
                circle.setAttribute("cx", "0");
                circle.setAttribute("cy", "0");
                circle.setAttribute("r", "0.25");

                const chevron = document.createElementNS("http://www.w3.org/2000/svg", "path");
                chevron.setAttribute("class", "start-marker-chevron");
                // Original chevron was ~1.5x width and 1x height. In cell ratio: ~0.15 and 0.1
                chevron.setAttribute("d", "M -0.15 0.1 L 0 -0.1 L 0.15 0.1");

                g.appendChild(circle);
                g.appendChild(chevron);"""

if search in content:
    content = content.replace(search, replace)
    with open('webapps/simulateur_bluebot.html', 'w') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Search string not found!")
