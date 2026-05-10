import re

with open('webapps/simulateur_bluebot.html', 'r') as f:
    content = f.read()

# Make sure we also color the active step but we want to retain the border/shadow from active
css_to_add = """
        /* Commandes colorées (mode enfants non latéralisés) */
        body.colored-cmds .cmd-btn-forward, body.colored-cmds .program-cmd.fwd { background-color: #2980b9 !important; color: white !important; }
        body.colored-cmds .cmd-btn-forward, body.colored-cmds .program-cmd.fwd:not(.active-step) { border-color: #1a5276 !important; box-shadow: 0 4px 0 #1a5276 !important; }

        body.colored-cmds .cmd-btn-backward, body.colored-cmds .program-cmd.bwd { background-color: #8e44ad !important; color: white !important; }
        body.colored-cmds .cmd-btn-backward, body.colored-cmds .program-cmd.bwd:not(.active-step) { border-color: #5b2c6f !important; box-shadow: 0 4px 0 #5b2c6f !important; }

        body.colored-cmds .cmd-btn-left, body.colored-cmds .program-cmd.left { background-color: #f39c12 !important; color: white !important; }
        body.colored-cmds .cmd-btn-left, body.colored-cmds .program-cmd.left:not(.active-step) { border-color: #a04000 !important; box-shadow: 0 4px 0 #a04000 !important; }

        body.colored-cmds .cmd-btn-right, body.colored-cmds .program-cmd.right { background-color: #27ae60 !important; color: white !important; }
        body.colored-cmds .cmd-btn-right, body.colored-cmds .program-cmd.right:not(.active-step) { border-color: #145a32 !important; box-shadow: 0 4px 0 #145a32 !important; }

        body.colored-cmds .cmd-btn-go { background-color: #e74c3c !important; border-color: #922b21 !important; color: white !important; box-shadow: 0 4px 0 #922b21 !important; }

        body.colored-cmds .program-cmd.fwd svg, body.colored-cmds .program-cmd.bwd svg, body.colored-cmds .program-cmd.left svg, body.colored-cmds .program-cmd.right svg { color: white !important; stroke: white !important; }
"""

# Replace the previous block with the new one
old_block = """
        /* Commandes colorées (mode enfants non latéralisés) */
        body.colored-cmds .cmd-btn-forward, body.colored-cmds .program-cmd.fwd:not(.active-step) { background-color: #2980b9 !important; border-color: #1a5276 !important; color: white !important; box-shadow: 0 4px 0 #1a5276 !important; }
        body.colored-cmds .cmd-btn-backward, body.colored-cmds .program-cmd.bwd:not(.active-step) { background-color: #8e44ad !important; border-color: #5b2c6f !important; color: white !important; box-shadow: 0 4px 0 #5b2c6f !important; }
        body.colored-cmds .cmd-btn-left, body.colored-cmds .program-cmd.left:not(.active-step) { background-color: #f39c12 !important; border-color: #a04000 !important; color: white !important; box-shadow: 0 4px 0 #a04000 !important; }
        body.colored-cmds .cmd-btn-right, body.colored-cmds .program-cmd.right:not(.active-step) { background-color: #27ae60 !important; border-color: #145a32 !important; color: white !important; box-shadow: 0 4px 0 #145a32 !important; }
        body.colored-cmds .cmd-btn-go { background-color: #e74c3c !important; border-color: #922b21 !important; color: white !important; box-shadow: 0 4px 0 #922b21 !important; }

        body.colored-cmds .program-cmd.fwd svg, body.colored-cmds .program-cmd.bwd svg, body.colored-cmds .program-cmd.left svg, body.colored-cmds .program-cmd.right svg { color: white !important; stroke: white !important; }
"""

content = content.replace(old_block.strip(), css_to_add.strip())

with open('webapps/simulateur_bluebot.html', 'w') as f:
    f.write(content)
