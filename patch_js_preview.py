import re

with open('alpha/webapps/jeu_de_la_grue.html', 'r', encoding='utf-8') as f:
    content = f.read()

js_search = """        function addInstruction(type) {
            if (isExecuting) return;
            program.push(type);
            renderProgram();
            playSound('click');
        }

        function deleteLastInstruction() {
            if (isExecuting || program.length === 0) return;
            program.pop();
            renderProgram();
            playSound('click');
        }

        function clearProgram() {
            if (isExecuting) return;
            program = [];
            renderProgram();
        }"""

js_replace = """        function addInstruction(type) {
            if (isExecuting) return;

            // Preview logic: simulate the instruction on current state
            let valid = processInstruction(type);

            if (valid) {
                program.push(type);
                renderProgram();
                renderAll(); // update visual preview
                playSound('click');
            } else {
                playSound('error');
            }
        }

        function deleteLastInstruction() {
            if (isExecuting || program.length === 0) return;
            program.pop();
            renderProgram();
            playSound('click');

            // Recompute preview state from initial + program
            resetToInitial();
            for(let inst of program) {
                processInstruction(inst);
            }
            renderAll();
        }

        function clearProgram() {
            if (isExecuting) return;
            program = [];
            renderProgram();
            resetToInitial();
            renderAll();
        }"""
content = content.replace(js_search, js_replace)

js_search2 = """        function processInstruction(inst) {
            if (inst === 'left') {
                if (craneState.pos > 0) {
                    craneState.pos--;
                    return true;
                }
                return false;
            } else if (inst === 'right') {
                if (craneState.pos < NUM_CUPS - 1) {
                    craneState.pos++;
                    return true;
                }
                return false;
            } else if (inst === 'down') {
                if (craneState.height < MAX_STACK) {
                    craneState.height++;
                    return true;
                }
                return false;
            } else if (inst === 'up') {
                if (craneState.height > 0) {
                    craneState.height--;
                    return true;
                }
                return false;
            } else if (inst === 'action') {
                let currentStack = cups[craneState.pos];
                // Distance from top of cup
                let blocksInCup = currentStack.length;
                let requiredHeightForAction = MAX_STACK - blocksInCup; // 0 height is top, 3 height is bottom

                if (craneState.holding) {
                    // Try to drop
                    if (blocksInCup < MAX_STACK) { // Needs to be exactly above the top block
                        // In a real precise model, height would need to match. For simplicity and kids,
                        // if they are at or above the drop zone, let it drop, but to teach precision, let's enforce height match
                        if (craneState.height === requiredHeightForAction) {
                            currentStack.push(craneState.holding);
                            craneState.holding = null;
                            return true;
                        }
                    }
                    return false;
                } else {
                    // Try to grab
                    if (blocksInCup > 0) {
                        let requiredHeightForGrab = MAX_STACK - blocksInCup;
                        if (craneState.height === requiredHeightForGrab) {
                            craneState.holding = currentStack.pop();
                            return true;
                        }
                    }
                    return false;
                }
            }
            return false;
        }"""

js_replace2 = """        function processInstruction(inst) {
            if (inst === 'left') {
                if (craneState.pos > 0) {
                    craneState.pos--;
                    return true;
                }
                return false;
            } else if (inst === 'right') {
                if (craneState.pos < NUM_CUPS - 1) {
                    craneState.pos++;
                    return true;
                }
                return false;
            } else if (inst === 'down') {
                let currentStack = cups[craneState.pos];
                let blocksInCup = currentStack.length;
                let maxPossibleHeight = MAX_STACK - blocksInCup; // collision with blocks
                if (craneState.holding) maxPossibleHeight -= 1; // holding block takes space

                if (craneState.height < maxPossibleHeight) {
                    craneState.height++;
                    return true;
                }
                return false;
            } else if (inst === 'up') {
                if (craneState.height > 0) {
                    craneState.height--;
                    return true;
                }
                return false;
            } else if (inst === 'action') {
                let currentStack = cups[craneState.pos];
                let blocksInCup = currentStack.length;

                if (craneState.holding) {
                    // Try to drop
                    let requiredHeightForAction = MAX_STACK - blocksInCup - 1;
                    // Note: maxPossibleHeight above restricts going lower than this anyway.
                    // Enforce precision: must be right above the top block
                    if (craneState.height === requiredHeightForAction && blocksInCup < MAX_STACK) {
                        currentStack.push(craneState.holding);
                        craneState.holding = null;
                        return true;
                    }
                    return false;
                } else {
                    // Try to grab
                    let requiredHeightForGrab = MAX_STACK - blocksInCup;
                    if (craneState.height === requiredHeightForGrab && blocksInCup > 0) {
                        craneState.holding = currentStack.pop();
                        return true;
                    }
                    return false;
                }
            }
            return false;
        }"""
content = content.replace(js_search2, js_replace2)

with open('alpha/webapps/jeu_de_la_grue.html', 'w', encoding='utf-8') as f:
    f.write(content)
