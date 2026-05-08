import sys

def patch_html():
    with open('webapps/binaire_studio.html', 'r') as f:
        content = f.read()

    # 2. Modify applyEditorOutput to allow cleaning up textarea value properly
    func_str = """function applyEditorOutput(e) {
            const ta = e.target;
            let val = ta.value.replace(/[^01\\n]/g, '');
            const lines = val.split('\\n');
            const wrapper = document.getElementById('grid-editor');
            const rows = wrapper.querySelectorAll('.grid-row');

            if (rows.length === 0) return;
            const size = rows.length;

            rows.forEach((row, r) => {
                const line = lines[r] || '';
                for (let c = 0; c < size; c++) {
                    const cell = row.children[c];
                    if (c < line.length) {
                        if (line[c] === '0') {
                            cell.classList.add('on');
                        } else {
                            cell.classList.remove('on');
                        }
                    } else {
                        // Keep current state if input is incomplete
                    }
                    const r_idx = parseInt(cell.dataset.r, 10);
                    const col_idx = parseInt(cell.dataset.c, 10);
                    const state = cell.classList.contains('on') ? 'Noir' : 'Blanc';
                    cell.setAttribute('aria-label', `Ligne ${r_idx + 1}, colonne ${col_idx + 1}, ${state}`);
                }
            });
        }"""

    new_func_str = """function applyEditorOutput(e) {
            const ta = e.target;
            // Ne garder que 0, 1 et retours à la ligne
            let val = ta.value.replace(/[^01\\n]/g, '');
            if (ta.value !== val) {
                const cursor = ta.selectionStart - (ta.value.length - val.length);
                ta.value = val;
                ta.setSelectionRange(cursor, cursor);
            }

            const lines = val.split('\\n');
            const wrapper = document.getElementById('grid-editor');
            const rows = wrapper.querySelectorAll('.grid-row');

            if (rows.length === 0) return;
            const size = rows.length;

            rows.forEach((row, r) => {
                const line = lines[r] || '';
                for (let c = 0; c < size; c++) {
                    const cell = row.children[c];
                    if (c < line.length) {
                        if (line[c] === '0') {
                            cell.classList.add('on');
                        } else {
                            cell.classList.remove('on');
                        }
                    } else {
                        // Si le caractère est supprimé, on remet à "blanc" (1)
                        cell.classList.remove('on');
                    }
                    const r_idx = parseInt(cell.dataset.r, 10);
                    const col_idx = parseInt(cell.dataset.c, 10);
                    const state = cell.classList.contains('on') ? 'Noir' : 'Blanc';
                    cell.setAttribute('aria-label', `Ligne ${r_idx + 1}, colonne ${col_idx + 1}, ${state}`);
                }
            });
        }"""
    content = content.replace(func_str, new_func_str)

    with open('webapps/binaire_studio.html', 'w') as f:
        f.write(content)

patch_html()
