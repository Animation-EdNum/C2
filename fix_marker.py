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

replace = """                // Draw start marker using a nested SVG to maintain a perfect 1:1 aspect ratio
                // for the circle and chevron, avoiding stretching when the grid is not square.
                const cw = 100 / GRID_COLS;
                const ch = 100 / GRID_ROWS;

                const markerSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                markerSvg.setAttribute("class", "start-marker");
                markerSvg.setAttribute("x", pt.x - cw / 2);
                markerSvg.setAttribute("y", pt.y - ch / 2);
                markerSvg.setAttribute("width", cw);
                markerSvg.setAttribute("height", ch);
                markerSvg.setAttribute("viewBox", "-50 -50 100 100");
                markerSvg.style.overflow = "visible";

                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("class", "start-marker-circle");
                circle.setAttribute("cx", "0");
                circle.setAttribute("cy", "0");
                circle.setAttribute("r", "18");

                const chevron = document.createElementNS("http://www.w3.org/2000/svg", "path");
                chevron.setAttribute("class", "start-marker-chevron");
                chevron.setAttribute("d", "M -9 6 L 0 -6 L 9 6");
                chevron.setAttribute("stroke-width", "5"); // Override CSS stroke-width for the new local viewBox
                chevron.setAttribute("transform", `rotate(${rot})`);

                markerSvg.appendChild(circle);
                markerSvg.appendChild(chevron);"""

if search in content:
    content = content.replace(search, replace)

    # Also replace g in layer.appendChild(g) with markerSvg
    content = content.replace("layer.appendChild(g);", "layer.appendChild(markerSvg);")

    with open('webapps/simulateur_bluebot.html', 'w') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Search string not found!")
