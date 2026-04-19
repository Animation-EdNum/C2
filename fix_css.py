import re

def update_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # 1. Update .bot-grid to be fluid
    # Remove flex-shrink: 0 and add aspect-ratio
    content = re.sub(
        r'(\.bot-grid\s*\{[^}]*background:\s*var\(--card-bg\);)',
        r'\1\n            width: 100%;\n            max-width: 400px;\n            aspect-ratio: 1 / 1;\n            margin: 0 auto;',
        content
    )
    # Remove flex-shrink: 0 from .bot-grid if it was added
    content = re.sub(r'\s*flex-shrink:\s*0;\n', '\n', content)

    # 2. Update .grid-row
    content = re.sub(
        r'(\.grid-row\s*\{\s*display:\s*flex;)',
        r'\1\n            flex: 1;',
        content
    )

    # 3. Update .bot-cell
    # Remove fixed width and height, add flex: 1
    content = re.sub(
        r'\.bot-cell\s*\{\s*(width:\s*\d+px;\s*height:\s*\d+px;)[^}]*\}',
        lambda m: m.group(0).replace(m.group(1), 'flex: 1;\n            height: 100%;'),
        content
    )

    # Also fix media query .bot-cell
    content = re.sub(
        r'@media\s*\(\s*max-width:\s*600px\s*\)\s*\{[\s\S]*?\.bot-cell\s*\{\s*width:\s*44px;\s*height:\s*44px;\s*\}',
        lambda m: m.group(0).replace('width: 44px;\n                height: 44px;', '/* responsive */'),
        content
    )

    # 4. Update .robot-body
    content = re.sub(
        r'\.robot-body\s*\{\s*(width:\s*\d+px;\s*height:\s*\d+px;)[^}]*\}',
        lambda m: m.group(0).replace(m.group(1), 'width: 85%;\n            height: 85%;'),
        content
    )

    # Also fix media query .robot-body
    content = re.sub(
        r'\.robot-body\s*\{\s*width:\s*44px;\s*height:\s*44px;\s*\}',
        '/* responsive */',
        content
    )

    # 5. Fix Emojis scaling
    # obstacle::after
    content = re.sub(
        r'(\.bot-cell\.obstacle::after\s*\{[^}]*)font-size:\s*32px;',
        r'\1font-size: clamp(20px, 6vw, 32px);',
        content
    )

    # Target size
    content = re.sub(
        r'(\.target-overlay\s*\{[^}]*)font-size:\s*32px;',
        r'\1font-size: clamp(20px, 6vw, 32px);',
        content
    )

    # Media query overrides for font size
    content = re.sub(
        r'\.target-overlay\s*\{\s*font-size:\s*22px;\s*\}',
        '/* responsive */',
        content
    )
    content = re.sub(
        r'\.bot-cell\.obstacle::after\s*\{\s*font-size:\s*26px;\s*\}',
        '/* responsive */',
        content
    )

    with open(filename, 'w') as f:
        f.write(content)

update_file('webapps/simulateur_bluebot.html')
update_file('standalone/webapps/simulateur_bluebot.html')
