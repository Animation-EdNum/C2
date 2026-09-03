const fs = require('fs');
const { JSDOM } = require('jsdom');
const htmlSrc = fs.readFileSync('webapps/generateur_mot_de_passe.html', 'utf-8');
const jsSrc = fs.readFileSync('assets/js/generateur_mot_de_passe.js', 'utf-8');

const dom = new JSDOM(htmlSrc, { runScripts: "dangerously", url: "http://localhost/" });
const window = dom.window;

const testableSrc = jsSrc.replace(
    '})();',
    'window.generatePedagogicalPassword = generatePedagogicalPassword;\n})();'
);

window.eval(testableSrc);

console.log("Function exposed:", typeof window.generatePedagogicalPassword === 'function');
let res = window.generatePedagogicalPassword('chat', '123', 'google', '!', ['word', 'number', 'service'], 12);
console.log(res);
