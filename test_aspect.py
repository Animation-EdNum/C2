# If the container .bot-grid has exactly var(--grid-cols) / var(--grid-rows),
# then 1 grid cell has exactly square aspect ratio!
# The user's issue is likely entirely fixed by the CSS change on .bot-grid.

# But wait, wait! The previous change on start marker SVG is still there or did I revert it?
# Let's check the current state of start marker drawing code.
import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

if "const cw = 100 / GRID_COLS;" in content:
    print("Start marker fix is currently applied.")
else:
    print("Start marker fix is NOT applied.")
