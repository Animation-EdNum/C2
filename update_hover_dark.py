with open('alpha/webapps/jeu_de_la_grue.html', 'r') as f:
    content = f.read()

# Make instruction hover colors more subtle and distinct for light/dark themes
content = content.replace('body.dark .instruction-btn:hover {\n            background: #475569;\n        }', 'body.dark .instruction-btn:hover {\n            background: var(--card-bg);\n        }\n\n        body.dark .instruction-btn.up-color:hover { background: rgba(41, 128, 185, 0.2); }\n        body.dark .instruction-btn.down-color:hover { background: rgba(142, 68, 173, 0.2); }\n        body.dark .instruction-btn.left-color:hover { background: rgba(243, 156, 18, 0.2); }\n        body.dark .instruction-btn.right-color:hover { background: rgba(39, 174, 96, 0.2); }\n        body.dark .instruction-btn.action-color:hover { background: rgba(231, 76, 60, 0.2); }')

content = content.replace('.instruction-btn:hover {\n            background: #fef3c7;\n            transform: translateY(-2px);\n            box-shadow: 0 7px 0 var(--card-border), 0 8px 8px var(--card-shadow);\n        }', '.instruction-btn:hover {\n            transform: translateY(-2px);\n            box-shadow: 0 7px 0 var(--card-border), 0 8px 8px var(--card-shadow);\n        }\n\n        .instruction-btn.up-color:hover { background: #ebf5fb; }\n        .instruction-btn.down-color:hover { background: #f4ecf7; }\n        .instruction-btn.left-color:hover { background: #fef5e7; }\n        .instruction-btn.right-color:hover { background: #e9f7ef; }\n        .instruction-btn.action-color:hover { background: #fdedec; }')


with open('alpha/webapps/jeu_de_la_grue.html', 'w') as f:
    f.write(content)
