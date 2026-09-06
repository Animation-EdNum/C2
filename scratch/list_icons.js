const fs = require('fs');
const content = fs.readFileSync('assets/js/fa-subset.js', 'utf8');
const lines = content.split('\n');
const icons = [];
for (const line of lines) {
  const match = line.match(/^\s*"([a-z0-9-]+)":/);
  if (match) icons.push(match[1]);
}
console.log('Total icons:', icons.length);
console.log(icons.join(', '));
