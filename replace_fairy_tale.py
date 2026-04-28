import sys
import re

filepath = 'webapps/simulateur_bluebot.html'
with open(filepath, 'r') as f:
    content = f.read()

pattern = re.compile(r"('fairy_tale': \{\s*name: 'Conte personnalisable',\s*desc: \"L'élève raconte son histoire en programmant le parcours du robot\. Mode créatif\.\",\s*icon: '🧚',\s*content: \[\],\s*baseContent: \[\s*.*?\]\s*\})", re.DOTALL)

match = pattern.search(content)
if match:
    replace = """'fairy_tale': {
                name: 'Conte personnalisable',
                desc: "L'élève raconte son histoire en programmant le parcours du robot. Mode créatif.",
                icon: '🧚',
                content: [],
                baseContent: [
                    '👸', '🐉', '🧙', '🏰', '🌲', '💎', '👑', '🦄', '⚔️', '🛡️',
                    '🗝️', '📜', '🐴', '🐸', '🧚', '🧜‍♀️', '🧞‍♂️', '🧝‍♀️', '🧛‍♂️', '🧟‍♀️',
                    '🧞‍♀️', '🪞', '🍎', '🍄', '🌼', '🌈', '⭐', '🌙', '☀️', '☁️',
                    '⚡', '🔥', '💧', '🌊', '❄️', '🌪️', '🤴', '🦹', '🦸', '🐺',
                    '🕷️', '🕸️', '🦇', '🥀', '🌹', '🏹', '🪄', '🔮', '🧪', '🩸',
                    '🦴', '☠️', '👻', '👽', '👾', '🤖', '🎃', '🎭', '🎨', '🎻',
                    '🎺', '🪘', '🥁', '⛺', '🛶', '⛵', '⚓', '🧭', '🗺️', '🏔️',
                    '🌋', '🏕️', '🛤️', '🪙', '💰', '💸', '🏺', '💍', '🦅', '🦆',
                    '🦢', '🦩', '🦚', '🦜', '🐊', '🐢', '🦎', '🐍', '🦕', '🦖',
                    '🐳', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙'
                ]
            }"""
    content = content[:match.start()] + replace + content[match.end():]
    with open(filepath, 'w') as f:
        f.write(content)
    print("Replaced fairy_tale!")
else:
    print("Not found regex!")
