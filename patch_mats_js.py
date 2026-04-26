import re

with open('webapps/simulateur_bluebot.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update openMatsModal and closeMatsModal
old_js = """        function openMatsModal() {
            playSound('click');
            renderMatsGrid();
            document.getElementById('mats-modal').classList.add('active');
            document.getElementById('mats-modal').setAttribute('aria-hidden', 'false');
        }

        function closeMatsModal() {
            playSound('click');
            document.getElementById('mats-modal').classList.remove('active');
            document.getElementById('mats-modal').setAttribute('aria-hidden', 'true');
        }"""

new_js = """        function openMatsModal() {
            playSound('click');
            renderMatsGrid();
            document.getElementById('mats-drawer').classList.add('active');
            document.getElementById('mats-drawer-overlay').classList.add('active');
            document.getElementById('mats-drawer-overlay').setAttribute('aria-hidden', 'false');
            document.getElementById('mats-drawer').setAttribute('aria-hidden', 'false');
        }

        function closeMatsModal() {
            playSound('click');
            document.getElementById('mats-drawer').classList.remove('active');
            document.getElementById('mats-drawer-overlay').classList.remove('active');
            document.getElementById('mats-drawer-overlay').setAttribute('aria-hidden', 'true');
            document.getElementById('mats-drawer').setAttribute('aria-hidden', 'true');
        }"""

content = content.replace(old_js, new_js)

# Event listener for mats-drawer-overlay and remove mat
old_events = """        document.getElementById('btn-open-mats').addEventListener('click', openMatsModal);
        document.getElementById('btn-close-mats').addEventListener('click', closeMatsModal);
        document.getElementById('mats-grid-container').addEventListener('click', (e) => {
            const card = e.target.closest('.skin-card');
            const btn = e.target.closest('.select-mat-btn');
            const matId = (card || btn)?.dataset.mat;
            if (matId) selectMat(matId);
        });"""

new_events = """        document.getElementById('btn-open-mats').addEventListener('click', openMatsModal);
        document.getElementById('btn-close-mats').addEventListener('click', closeMatsModal);
        document.getElementById('mats-drawer-overlay').addEventListener('click', closeMatsModal);
        document.getElementById('btn-remove-mat').addEventListener('click', () => selectMat('none'));
        document.getElementById('mats-list-container').addEventListener('click', (e) => {
            const item = e.target.closest('.skin-list-item');
            const matId = item?.dataset.mat;
            if (matId) selectMat(matId);
        });"""

content = content.replace(old_events, new_events)

with open('webapps/simulateur_bluebot.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patch JS applied")
