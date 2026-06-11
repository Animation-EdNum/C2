const fs = require('fs');
const content = fs.readFileSync('webapps/binaire_codage.html', 'utf8');

const target = `        function buildUI() {
            // Calc Table
            let trBits = '<th>Bits</th>', trPow = '<th>Puissances</th>', trVals = '<th>Valeurs</th>';
            let togglesHtml = '';

            for (let i = 0; i < 8; i++) {
                let isHidden = (8 - i) > currentBits ? 'hidden-col' : '';

                // Calc HTML
                trBits += \`<td class="\${isHidden}"><button class="calc-bit" id="calc-bit-\${i}" >0</button></td>\`;
                trPow += \`<td class="calc-power-cell \${isHidden}">2<sup>\${7 - i}</sup></td>\`;
                trVals += \`<td class="\${isHidden}"><div class="calc-box" id="calc-box-\${i}" tabindex="0">\${powers[i]}</div></td>\`;

                // Exercise HTML (Toggles only, no kb hints)
                if (!isHidden) {
                    togglesHtml += \`
            <div class="bit-toggle-container">
                <button class="bit-toggle" id="tog-\${i}" >0</button>
                <div class="vault-bit-power">2<sup>\${7 - i}</sup></div>
            </div>\`;
                }
            }

            document.getElementById('calc-table').innerHTML = \`<tr>\${trBits}</tr><tr>\${trPow}</tr><tr>\${trVals}</tr>\`;
            document.getElementById('bit-toggles').innerHTML = togglesHtml;

            for (let i = 0; i < 8; i++) {`;

const replacement = `        function buildUI() {
            const calcTable = document.getElementById('calc-table');
            const bitToggles = document.getElementById('bit-toggles');

            const trBitsRow = document.createElement('tr');
            const trPowRow = document.createElement('tr');
            const trValsRow = document.createElement('tr');

            const thBits = document.createElement('th'); thBits.textContent = 'Bits'; trBitsRow.appendChild(thBits);
            const thPow = document.createElement('th'); thPow.textContent = 'Puissances'; trPowRow.appendChild(thPow);
            const thVals = document.createElement('th'); thVals.textContent = 'Valeurs'; trValsRow.appendChild(thVals);

            bitToggles.replaceChildren();

            for (let i = 0; i < 8; i++) {
                const isHiddenClass = (8 - i) > currentBits ? 'hidden-col' : '';

                // trBitsRow
                const tdBits = document.createElement('td');
                if (isHiddenClass) tdBits.className = isHiddenClass;
                const btnBits = document.createElement('button');
                btnBits.className = 'calc-bit';
                btnBits.id = \`calc-bit-\${i}\`;
                btnBits.textContent = '0';
                tdBits.appendChild(btnBits);
                trBitsRow.appendChild(tdBits);

                // trPowRow
                const tdPow = document.createElement('td');
                tdPow.className = \`calc-power-cell \${isHiddenClass}\`.trim();
                const textPow = document.createTextNode('2');
                const supPow = document.createElement('sup');
                supPow.textContent = String(7 - i);
                tdPow.appendChild(textPow);
                tdPow.appendChild(supPow);
                trPowRow.appendChild(tdPow);

                // trValsRow
                const tdVals = document.createElement('td');
                if (isHiddenClass) tdVals.className = isHiddenClass;
                const divVals = document.createElement('div');
                divVals.className = 'calc-box';
                divVals.id = \`calc-box-\${i}\`;
                divVals.tabIndex = 0;
                divVals.textContent = String(powers[i]);
                tdVals.appendChild(divVals);
                trValsRow.appendChild(tdVals);

                // Exercise HTML (Toggles only, no kb hints)
                if (!isHiddenClass) {
                    const toggleContainer = document.createElement('div');
                    toggleContainer.className = 'bit-toggle-container';

                    const toggleBtn = document.createElement('button');
                    toggleBtn.className = 'bit-toggle';
                    toggleBtn.id = \`tog-\${i}\`;
                    toggleBtn.textContent = '0';

                    const vaultPower = document.createElement('div');
                    vaultPower.className = 'vault-bit-power';
                    const textVault = document.createTextNode('2');
                    const supVault = document.createElement('sup');
                    supVault.textContent = String(7 - i);
                    vaultPower.appendChild(textVault);
                    vaultPower.appendChild(supVault);

                    toggleContainer.appendChild(toggleBtn);
                    toggleContainer.appendChild(vaultPower);
                    bitToggles.appendChild(toggleContainer);
                }
            }

            calcTable.replaceChildren(trBitsRow, trPowRow, trValsRow);

            for (let i = 0; i < 8; i++) {`;

const newContent = content.replace(target, replacement);
fs.writeFileSync('webapps/binaire_codage.html', newContent);
