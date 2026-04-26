import re

with open('webapps/simulateur_bluebot.html', 'r', encoding='utf-8') as f:
    content = f.read()

# remove old mats modal css
old_css = """        #mats-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        }

        #mats-modal.active {
            display: flex;
            animation: fadeIn 0.3s forwards;
        }

        @media (max-width: 600px) {
            #mats-modal {
                align-items: flex-end;
            }

            #mats-modal.active .skins-content {
                animation: slideUpBottomSheet 0.3s ease-out forwards;
            }

            #mats-modal .skins-content {
                width: 100%;
                max-width: none;
                border-radius: 24px 24px 0 0;
                margin: 0;
                padding-bottom: max(24px, env(safe-area-inset-bottom));
                max-height: 85vh;
            }
        }"""

content = content.replace(old_css, "")

# remove duplicate block of old mats modal css if it exists
if old_css in content:
    content = content.replace(old_css, "")

with open('webapps/simulateur_bluebot.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patch CSS removed")
