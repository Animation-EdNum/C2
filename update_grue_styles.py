with open('alpha/webapps/jeu_de_la_grue.html', 'r') as f:
    content = f.read()

# Add flex-wrap to .program-strip
content = content.replace('.program-strip {\n            display: flex;\n            gap: 10px;\n        }', '.program-strip {\n            display: flex;\n            flex-wrap: wrap;\n            gap: 10px;\n        }')

# Fix body.dark instructions border color and style for hover
content = content.replace('body.dark .up-color, body.dark .down-color, body.dark .left-color, body.dark .right-color, body.dark .action-color {\n            color: #fff;\n        }', 'body.dark .up-color, body.dark .down-color, body.dark .left-color, body.dark .right-color, body.dark .action-color {\n            color: #fff;\n        }\n\n        body.dark .instruction-btn.up-color { border-color: #2980b9; }\n        body.dark .instruction-btn.down-color { border-color: #8e44ad; }\n        body.dark .instruction-btn.left-color { border-color: #f39c12; }\n        body.dark .instruction-btn.right-color { border-color: #27ae60; }\n        body.dark .instruction-btn.action-color { border-color: #e74c3c; }')

with open('alpha/webapps/jeu_de_la_grue.html', 'w') as f:
    f.write(content)
