import sys

filepath = 'assets/js/url-params.js'

with open(filepath, 'r') as f:
    content = f.read()

search_block = """
        // Add advanced options
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const param = cb.id.replace('opt-', '');
                url.searchParams.set(param, '1');
            }
        });
"""

replace_block = """
        // Add advanced options
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const param = cb.id.replace('opt-', '');
                url.searchParams.set(param, '1');

                // Special handling for lockTopology
                if (param === 'lockTopology') {
                    if (!url.searchParams.has('seed')) {
                        const randomSeed = Math.random().toString(36).substring(2, 10);
                        url.searchParams.set('seed', randomSeed);
                    }
                }
            } else {
                // If lockTopology is unchecked, make sure seed is removed
                const param = cb.id.replace('opt-', '');
                if (param === 'lockTopology') {
                    url.searchParams.delete('seed');
                }
            }
        });
"""

if search_block.strip() in content:
    with open(filepath, 'w') as f:
        f.write(content.replace(search_block.strip(), replace_block.strip()))
    print("JS updateShareUrl replaced successfully.")
else:
    print("Search block not found in JS updateShareUrl.")
