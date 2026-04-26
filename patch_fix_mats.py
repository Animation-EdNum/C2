import re

with open('webapps/simulateur_bluebot.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the undefined event listener call since handleCustomMatUpload is defined below
old_upload_listener = """            // Re-bind the upload listener here since the DOM is recreated
            const uploadInput = document.getElementById('customMatUpload');
            if (uploadInput) {
                uploadInput.addEventListener('change', handleCustomMatUpload);
            }"""

new_upload_listener = """            // Re-bind the upload listener here since the DOM is recreated
            const uploadInput = document.getElementById('customMatUpload');
            if (uploadInput) {
                // Ensure we call the existing global function if defined, or define one dynamically
                uploadInput.addEventListener('change', function(e) {
                    if (typeof handleCustomMatUpload === 'function') {
                        handleCustomMatUpload(e);
                    }
                });
            }"""

content = content.replace(old_upload_listener, new_upload_listener)

with open('webapps/simulateur_bluebot.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patch Fix Mats applied")
