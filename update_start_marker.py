import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

search_code = """                // Draw start marker
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

replace_code = """                // Draw start marker
                const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                g.setAttribute("class", "start-marker");

                const cw = 100 / GRID_COLS;
                const ch = 100 / GRID_ROWS;

                // Create a sub-group translated to the cell center and rotated.
                // We use transform directly to ensure the circle relies on the cell's physical coordinate system.
                g.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);

                const rotatedGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                rotatedGroup.setAttribute("transform", `rotate(${rot})`);

                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("class", "start-marker-circle");
                circle.setAttribute("cx", "0");
                circle.setAttribute("cy", "0");

                // Radius in percentage of viewbox coordinates. Since the whole viewbox is 100x100 and it's stretched via preserveAspectRatio="none",
                // we want the circle to be perfectly round regardless of cell aspect ratio.
                // Wait, if preserveAspectRatio is "none", any circle will become an ellipse if the cell is not square!
                // To fix this, we should draw the circle inside an SVG that doesn't use preserveAspectRatio="none" or scale it inversely.
                // Wait, in SVG, if rx and ry are scaled differently... actually, let's change the viewbox, or inversely scale.
                // If cw is width per cell and ch is height per cell, and the whole grid aspect ratio is cols/rows...
                // Wait! The grid container HAS aspect-ratio: var(--grid-cols)/var(--grid-rows).
                // And the bot-grid has aspect-ratio: 1/1 ! Ah!
                // If the container is cols/rows, and bot-grid is 1/1, then bot-grid is squished or stretched!
"""
