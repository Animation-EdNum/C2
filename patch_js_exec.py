import re

with open('alpha/webapps/jeu_de_la_grue.html', 'r', encoding='utf-8') as f:
    content = f.read()

js_search = """        async function executeProgram() {
            if (isExecuting || program.length === 0) return;
            isExecuting = true;
            playBtn.disabled = true;
            resetToInitial(); // Reset before run

            feedbackMsg.textContent = 'Exécution...';
            feedbackMsg.className = 'feedback';

            for(let i=0; i<program.length; i++) {
                document.querySelectorAll('.prog-step').forEach(el => el.classList.remove('active'));
                let currentStepEl = document.getElementById(`prog-step-${i}`);
                if(currentStepEl) currentStepEl.classList.add('active');

                let inst = program[i];
                let success = processInstruction(inst);

                renderAll();

                if (!success) {
                    playSound('error');
                    showFeedback('Erreur : Mouvement impossible !', 'error');
                    isExecuting = false;
                    playBtn.disabled = false;
                    document.querySelectorAll('.prog-step').forEach(el => el.classList.remove('active'));
                    return;
                }

                playSound('click');
                await delay(600);
            }

            document.querySelectorAll('.prog-step').forEach(el => el.classList.remove('active'));
            checkWin();
        }"""

js_replace = """        async function executeProgram() {
            if (isExecuting || program.length === 0) return;
            isExecuting = true;
            playBtn.disabled = true;

            // Re-render from initial state before animation
            resetToInitial();
            renderAll();
            await delay(500); // brief pause before action

            feedbackMsg.textContent = 'Exécution...';
            feedbackMsg.className = 'feedback';

            for(let i=0; i<program.length; i++) {
                document.querySelectorAll('.prog-step').forEach(el => el.classList.remove('active'));
                let currentStepEl = document.getElementById(`prog-step-${i}`);
                if(currentStepEl) currentStepEl.classList.add('active');

                let inst = program[i];
                // we know it's valid because we checked during preview mode
                processInstruction(inst);

                renderAll();
                playSound('click');
                await delay(600);
            }

            document.querySelectorAll('.prog-step').forEach(el => el.classList.remove('active'));
            checkWin();
        }"""

content = content.replace(js_search, js_replace)

with open('alpha/webapps/jeu_de_la_grue.html', 'w', encoding='utf-8') as f:
    f.write(content)
