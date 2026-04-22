import re

with open('js/theme.js', 'r') as f:
    content = f.read()

replacement = """        if (iconSun)  iconSun.style.display  = theme === 'dark' ? 'block' : 'none';
        if (iconMoon) iconMoon.style.display = theme === 'dark' ? 'none'  : 'block';

        const themeToggleText = document.getElementById('themeToggleText');
        if (themeToggleText) {
            themeToggleText.textContent = theme === 'dark' ? 'Mode Clair' : 'Mode Sombre';
        }"""

content = content.replace("        if (iconSun)  iconSun.style.display  = theme === 'dark' ? 'block' : 'none';\n        if (iconMoon) iconMoon.style.display = theme === 'dark' ? 'none'  : 'block';", replacement)

with open('js/theme.js', 'w') as f:
    f.write(content)
