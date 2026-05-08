import sys

def patch_html():
    with open('webapps/binaire_studio.html', 'r') as f:
        content = f.read()

    # 1. Add input listener to textarea
    listen_str = """document.getElementById('btn-export-editor').addEventListener('click', exportImage);"""
    new_listen_str = listen_str + """
        document.getElementById('editor-output').addEventListener('input', applyEditorOutput);"""
    content = content.replace(listen_str, new_listen_str)

    # 2. Add applyEditorOutput function
    func_str = """function updateEditorOutput() {"""
    new_func_str = """function applyEditorOutput(e) {
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
        }

        function updateEditorOutput() {"""
    content = content.replace(func_str, new_func_str)

    with open('webapps/binaire_studio.html', 'w') as f:
        f.write(content)

patch_html()
