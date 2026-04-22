import re

with open('webapps/binaire_codage.html', 'r') as f:
    content = f.read()

# Make inputs mobile friendly
# .input-row { display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }
content = content.replace('.input-row { display: flex; gap: 6px; margin-bottom: 8px; }',
                          '.input-row { display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }')

# Fix input widths
content = content.replace('input[type="text"] { flex: 1; padding: 8px; border-radius: 6px; border: 2px solid var(--input-border); font-size: 16px; font-family: monospace; outline: none; text-align: center; font-weight: bold; }',
                          'input[type="text"] { flex: 1; min-width: 0; padding: 8px; border-radius: 6px; border: 2px solid var(--input-border); font-size: 16px; font-family: monospace; outline: none; text-align: center; font-weight: bold; width: 100%; }')

with open('webapps/binaire_codage.html', 'w') as f:
    f.write(content)
