import sys

filepath = 'assets/js/url-params.js'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(urlInput.value).then(() => {
            btnCopy.innerHTML = '<i data-fa="check"></i> Copié !';
"""

replace_block = """
    btnTestLink.addEventListener('click', () => {
        window.open(urlInput.value, '_blank');
    });

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(urlInput.value).then(() => {
            btnCopy.innerHTML = '<i data-fa="check"></i> Copié !';
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("JS test link listener added successfully.")
else:
    print("Search block not found in JS test link listener.")
