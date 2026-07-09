const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
    url: "http://localhost/",
    runScripts: "dangerously",
    resources: "usable"
});

const window = dom.window;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;

// Mock SKIN_CONFIG with 1000 items
const SKIN_CONFIG = {};
for (let i = 0; i < 10000; i++) {
    SKIN_CONFIG[`skin_${i}`] = { id: `skin_${i}` };
}

global.SKIN_CONFIG = SKIN_CONFIG;
global.unlockedSkins = Object.keys(SKIN_CONFIG).slice(0, 5000); // 5000 unlocked

function testOriginal() {
    let result = [];
    for (let i = 0; i < 100; i++) {
        const availableSkins = Object.keys(SKIN_CONFIG).filter(id => unlockedSkins.includes(id));
        result = availableSkins;
    }
    return result;
}

function testOptimized() {
    let result = [];
    for (let i = 0; i < 100; i++) {
        const unlockedSet = new Set(unlockedSkins);
        const availableSkins = Object.keys(SKIN_CONFIG).filter(id => unlockedSet.has(id));
        result = availableSkins;
    }
    return result;
}

const start1 = performance.now();
testOriginal();
const end1 = performance.now();
console.log(`Original: ${end1 - start1} ms`);

const start2 = performance.now();
testOptimized();
const end2 = performance.now();
console.log(`Optimized: ${end2 - start2} ms`);
