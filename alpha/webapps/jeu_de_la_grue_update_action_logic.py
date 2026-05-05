with open('alpha/webapps/jeu_de_la_grue.html', 'r') as f:
    content = f.read()

# Modify button icon
content = content.replace(
    """<i data-fa="hand-holding"></i>""",
    """<i data-fa="hand-fist" style="transform: rotate(180deg); display: inline-block;" id="action-icon"></i>"""
)

# Modify renderProgram logic for the dynamic grab/drop icon

old_logic = """                let icon = '';
                if (inst === 'up') icon = 'arrow-up';
                else if (inst === 'down') icon = 'arrow-down';
                else if (inst === 'left') icon = 'arrow-left';
                else if (inst === 'right') icon = 'arrow-right';
                else if (inst === 'action') icon = 'hand-grab';

                stepEl.innerHTML = `<i data-fa="${icon}"></i>`;"""

new_logic = """                let icon = '';
                let isFlipped = false;
                if (inst === 'up') icon = 'arrow-up';
                else if (inst === 'down') icon = 'arrow-down';
                else if (inst === 'left') icon = 'arrow-left';
                else if (inst === 'right') icon = 'arrow-right';
                else if (inst === 'action') {
                    // determine if holding at this point
                    let simulatedHolding = false;
                    for(let j=0; j<=idx; j++) {
                        if (program[j] === 'action') {
                            simulatedHolding = !simulatedHolding;
                        }
                    }
                    if (simulatedHolding) {
                        icon = 'hand-fist'; // action that just grabbed
                    } else {
                        icon = 'hand'; // action that just dropped
                    }
                    isFlipped = true;
                }

                if (isFlipped) {
                    stepEl.innerHTML = `<i data-fa="${icon}" style="transform: rotate(180deg); display: inline-block;"></i>`;
                } else {
                    stepEl.innerHTML = `<i data-fa="${icon}"></i>`;
                }"""

content = content.replace(old_logic, new_logic)

# Dynamic updating of the main action button based on the *end* state of the program
dynamic_btn_update = """            fa.createIcons();
            playBtn.disabled = program.length === 0 || isExecuting || isCooldown;

            // Update the main action button based on final state
            let finalHolding = false;
            program.forEach(inst => {
                if (inst === 'action') finalHolding = !finalHolding;
            });
            let actionIcon = document.getElementById('action-icon');
            if (actionIcon) {
                if (finalHolding) {
                    actionIcon.setAttribute('data-fa', 'hand'); // next action will be drop
                } else {
                    actionIcon.setAttribute('data-fa', 'hand-fist'); // next action will be grab
                }
            }"""

content = content.replace(
    "            fa.createIcons();\n            playBtn.disabled = program.length === 0 || isExecuting || isCooldown;",
    dynamic_btn_update
)

with open('alpha/webapps/jeu_de_la_grue.html', 'w') as f:
    f.write(content)
