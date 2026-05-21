const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const ROOT_ABS = path.resolve(ROOT);
console.log('ROOT:', ROOT);
console.log('ROOT_ABS:', ROOT_ABS);

const testPaths = [
  '/',
  '/index.html',
  '/assets/css/base.css',
  '/../suite-ednum-secrets/pass.txt',
  '../../../../etc/passwd',
  '/foo/../bar',
  '/assets/../index.html'
];

const SECURE_ROOT = ROOT_ABS.endsWith(path.sep) ? ROOT_ABS : ROOT_ABS + path.sep;

for (const p of testPaths) {
  let filePath = path.join(ROOT_ABS, p);

  // Ensure filePath is absolute
  filePath = path.resolve(filePath);

  const isSecure = filePath === ROOT_ABS || filePath.startsWith(SECURE_ROOT);
  console.log(`Path: ${p.padEnd(35)} -> ${filePath} (Secure: ${isSecure})`);
}
