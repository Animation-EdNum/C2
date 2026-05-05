with open('alpha/webapps/jeu_de_la_grue.html', 'r') as f:
    content = f.read()

# Fix the fact that .up-color background color overrides the .instruction-btn.up-color
content = content.replace('.up-color { color: #fff; background-color: #2980b9; border-color: #1a5276; box-shadow: 0 5px 0 #1a5276, 0 6px 6px var(--card-shadow); }\n        .down-color { color: #fff; background-color: #8e44ad; border-color: #5b2c6f; box-shadow: 0 5px 0 #5b2c6f, 0 6px 6px var(--card-shadow); }\n        .left-color { color: #fff; background-color: #f39c12; border-color: #a04000; box-shadow: 0 5px 0 #a04000, 0 6px 6px var(--card-shadow); }\n        .right-color { color: #fff; background-color: #27ae60; border-color: #145a32; box-shadow: 0 5px 0 #145a32, 0 6px 6px var(--card-shadow); }\n        .action-color { color: #fff; background-color: #e74c3c; border-color: #922b21; box-shadow: 0 5px 0 #922b21, 0 6px 6px var(--card-shadow); }', '.prog-step.up-color { color: #fff; background-color: #2980b9; border-color: #1a5276; box-shadow: 0 5px 0 #1a5276, 0 6px 6px var(--card-shadow); }\n        .prog-step.down-color { color: #fff; background-color: #8e44ad; border-color: #5b2c6f; box-shadow: 0 5px 0 #5b2c6f, 0 6px 6px var(--card-shadow); }\n        .prog-step.left-color { color: #fff; background-color: #f39c12; border-color: #a04000; box-shadow: 0 5px 0 #a04000, 0 6px 6px var(--card-shadow); }\n        .prog-step.right-color { color: #fff; background-color: #27ae60; border-color: #145a32; box-shadow: 0 5px 0 #145a32, 0 6px 6px var(--card-shadow); }\n        .prog-step.action-color { color: #fff; background-color: #e74c3c; border-color: #922b21; box-shadow: 0 5px 0 #922b21, 0 6px 6px var(--card-shadow); }')

content = content.replace('body.dark .up-color, body.dark .down-color, body.dark .left-color, body.dark .right-color, body.dark .action-color {\n            color: #fff;\n        }', 'body.dark .prog-step.up-color, body.dark .prog-step.down-color, body.dark .prog-step.left-color, body.dark .prog-step.right-color, body.dark .prog-step.action-color {\n            color: #fff;\n        }')


with open('alpha/webapps/jeu_de_la_grue.html', 'w') as f:
    f.write(content)
