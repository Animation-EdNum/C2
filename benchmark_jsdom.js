const { JSDOM } = require('jsdom');

const dom = new JSDOM(`
  <html>
    <body>
      <div id="view-students">
        ${Array.from({length: 100}).map((_, i) => `<div><h2>Header ${i}</h2><div>Content</div></div>`).join('\n')}
        <div><h2>Ressources externes</h2><div>Target</div></div>
      </div>
      <div id="view-teachers">
        ${Array.from({length: 100}).map((_, i) => `<div><h2>Header ${i}</h2><div>Content</div></div>`).join('\n')}
        <div><h2>Ressources externes</h2><div>Target</div></div>
      </div>
    </body>
  </html>
`);

const document = dom.window.document;

// Warm up
for(let i=0; i<1000; i++) {
    document.querySelectorAll('#view-students h2');
}

const ITERATIONS = 10000;

// Benchmark 1: for loop (Current implementation)
const t0 = performance.now();
for(let i=0; i<ITERATIONS; i++) {
    let studentExternalContainer = null;
    const studentHeaders = document.querySelectorAll('#view-students h2');
    for (const h of studentHeaders) {
        if (h.textContent.includes('Ressources externes')) {
            studentExternalContainer = h.parentElement.nextElementSibling;
            break;
        }
    }
}
const t1 = performance.now();
console.log(`For loop (baseline): ${t1 - t0} ms`);

// Benchmark 2: Array.from().find()
const t2 = performance.now();
for(let i=0; i<ITERATIONS; i++) {
    let studentExternalContainer = null;
    const h = Array.from(document.querySelectorAll('#view-students h2')).find(h => h.textContent.includes('Ressources externes'));
    if (h) studentExternalContainer = h.parentElement.nextElementSibling;
}
const t3 = performance.now();
console.log(`Array.from().find(): ${t3 - t2} ms`);

// Benchmark 3: Array.prototype.find.call()
const t4 = performance.now();
for(let i=0; i<ITERATIONS; i++) {
    let studentExternalContainer = null;
    const h = Array.prototype.find.call(document.querySelectorAll('#view-students h2'), h => h.textContent.includes('Ressources externes'));
    if (h) studentExternalContainer = h.parentElement.nextElementSibling;
}
const t5 = performance.now();
console.log(`Array.prototype.find.call(): ${t5 - t4} ms`);

// Benchmark 4: xpath
const t6 = performance.now();
for(let i=0; i<ITERATIONS; i++) {
    let studentExternalContainer = null;
    const h = document.evaluate(".//h2[contains(text(), 'Ressources externes')]", document.getElementById('view-students'), null, dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (h) studentExternalContainer = h.parentElement.nextElementSibling;
}
const t7 = performance.now();
console.log(`XPath: ${t7 - t6} ms`);
