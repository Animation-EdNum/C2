const fs = require('fs');
let content = fs.readFileSync('webapps/simulateur_bluebot.html', 'utf8');

const regex = /<<<<<<< HEAD\n\s*if \(!config\) \{\n\s*console\.warn\(\`Unknown matId: \$\{matId\}\`\);\n\s*return;\n\s*\}\n=======\n\s*const endContainer = document\.getElementById\('sim-end-container'\);\n\s*if \(endContainer\) \{\n\s*if \(config && config\.content\) \{\n\s*endContainer\.style\.display = 'block';\n\s*\} else \{\n\s*endContainer\.style\.display = 'none';\n\s*\}\n\s*\}\n\s*if \(!config\) return;\n>>>>>>> origin\/main/;

const replacement = `            const endContainer = document.getElementById('sim-end-container');
            if (endContainer) {
                if (config && config.content) {
                    endContainer.style.display = 'block';
                } else {
                    endContainer.style.display = 'none';
                }
            }
            if (!config) {
                console.warn(\`Unknown matId: \${matId}\`);
                return;
            }`;

content = content.replace(regex, replacement);
fs.writeFileSync('webapps/simulateur_bluebot.html', content);
