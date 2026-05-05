with open('alpha/webapps/jeu_de_la_grue.html', 'r') as f:
    content = f.read()

# Change the base instruction color text
content = content.replace('.instruction-btn {\n            width: 65px;\n            height: 65px;\n            border-radius: var(--radius-xl);\n            border: 2px solid var(--card-border);\n            background: white;\n            color: var(--text-main);\n            display: flex;', '.instruction-btn {\n            width: 65px;\n            height: 65px;\n            border-radius: var(--radius-xl);\n            border: 2px solid var(--card-border);\n            background: white;\n            color: inherit;\n            display: flex;')

# Assign proper colors to icons in instruction button based on class, for both normal and hover (to fix light and unreadable yellow issue on hover)
content = content.replace('.instruction-btn.up-color:hover { background: #ebf5fb; }\n        .instruction-btn.down-color:hover { background: #f4ecf7; }\n        .instruction-btn.left-color:hover { background: #fef5e7; }\n        .instruction-btn.right-color:hover { background: #e9f7ef; }\n        .instruction-btn.action-color:hover { background: #fdedec; }', '.instruction-btn.up-color:hover { background: #ebf5fb; }\n        .instruction-btn.down-color:hover { background: #f4ecf7; }\n        .instruction-btn.left-color:hover { background: #fef5e7; }\n        .instruction-btn.right-color:hover { background: #e9f7ef; }\n        .instruction-btn.action-color:hover { background: #fdedec; }\n\n        .instruction-btn.up-color { color: #2980b9; }\n        .instruction-btn.down-color { color: #8e44ad; }\n        .instruction-btn.left-color { color: #f39c12; }\n        .instruction-btn.right-color { color: #27ae60; }\n        .instruction-btn.action-color { color: #e74c3c; }\n')

# Adjust program strip min-height to not constraint multiline
content = content.replace('min-height: 90px;', 'min-height: 90px;\n            height: auto;')

with open('alpha/webapps/jeu_de_la_grue.html', 'w') as f:
    f.write(content)
