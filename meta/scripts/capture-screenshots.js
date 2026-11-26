#!/usr/bin/env node
/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * Automated Screenshot Runner for Suite EdNum documentation
 * Captures high-DPI (2x Retina) screenshots of portal and applications for README and webapp manifest.
 */

'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const rootDir = path.resolve(__dirname, '..', '..');
const outDir = path.join(rootDir, 'meta', 'screenshots');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

function startServer(port = 8125) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let pathname = req.url.split('?')[0];
      let filePath = path.join(rootDir, pathname);
      if (req.url === '/' || req.url.startsWith('/?')) filePath = path.join(rootDir, 'index.html');
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found: ' + pathname);
      }
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function prepPage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('theme', 'light');
    document.body.classList.remove('dark');
    document.documentElement.classList.remove('dark');

    // Hide footer in screenshots
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';

    // Disable CSS animations & transitions for crisp framing
    const style = document.createElement('style');
    style.id = 'disable-animations-style';
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
      .app-shell, .container, body > header, main {
        animation: none !important;
        transform: none !important;
      }
    `;
    document.head.appendChild(style);
  });
}

async function captureIndex(browser, port) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1625 },
    deviceScaleFactor: 2
  });
  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle' });
  await prepPage(page);
  await page.waitForTimeout(400);

  const outPath = path.join(outDir, 'index.png');
  await page.screenshot({ path: outPath });
  console.log('✓ Rendered meta/screenshots/index.png (2560x3250)');
  await page.close();
}

async function captureTirage(browser, port) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 927 },
    deviceScaleFactor: 2
  });

  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('theme', 'light');
    const state = {
      mode: 'names',
      allParticipants: ['Arthur', 'Camille', 'Emma', 'Lucas', 'Léa', 'Maxime', 'Noah', 'Sarah', 'Vivian'],
      availableParticipants: ['Arthur', 'Camille', 'Léa', 'Maxime', 'Noah', 'Sarah'],
      drawnParticipants: ['Lucas', 'Emma', 'Vivian'],
      absentParticipants: [],
      drawHistory: ['Lucas', 'Emma', 'Vivian']
    };
    localStorage.setItem('tirage_sort_v3', JSON.stringify(state));
  });

  await page.goto(`http://127.0.0.1:${port}/webapps/teacher/tirage.html`, { waitUntil: 'networkidle' });
  await prepPage(page);

  await page.evaluate(() => {
    const drawnNumber = document.getElementById('drawnNumber');
    if (drawnNumber) drawnNumber.textContent = 'Vivian';
    if (window.fa && typeof window.fa.createIcons === 'function') {
      window.fa.createIcons();
    }
  });

  await page.waitForTimeout(300);

  const outPath = path.join(outDir, 'tirage.png');
  await page.screenshot({ path: outPath });
  console.log('✓ Rendered meta/screenshots/tirage.png (2560x1854)');
  await page.close();
}

async function captureBareme(browser, port) {
  const page = await browser.newPage({
    viewport: { width: 1148, height: 950 },
    deviceScaleFactor: 2
  });
  await page.goto(`http://127.0.0.1:${port}/webapps/teacher/bareme.html`, { waitUntil: 'networkidle' });
  await prepPage(page);
  await page.waitForTimeout(300);

  const outPath = path.join(outDir, 'bareme.png');
  await page.screenshot({ path: outPath });
  console.log('✓ Rendered meta/screenshots/bareme.png (2296x1900)');
  await page.close();
}

async function capturePasswordGen(browser, port) {
  const page = await browser.newPage({
    viewport: { width: 1048, height: 891 },
    deviceScaleFactor: 2
  });
  await page.goto(`http://127.0.0.1:${port}/webapps/generateur_mot_de_passe.html`, { waitUntil: 'networkidle' });
  await prepPage(page);
  await page.waitForTimeout(300);

  const outPath = path.join(outDir, 'generateur_mot_de_passe.png');
  await page.screenshot({ path: outPath });
  console.log('✓ Rendered meta/screenshots/generateur_mot_de_passe.png (2096x1782)');
  await page.close();
}

async function captureAutomate(browser, port) {
  // Standard
  {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 867 },
      deviceScaleFactor: 2
    });
    await page.goto(`http://127.0.0.1:${port}/webapps/simulateur_automate.html`, { waitUntil: 'networkidle' });
    await prepPage(page);
    await page.waitForTimeout(400);

    const outPath = path.join(outDir, 'simulateur_automate.png');
    await page.screenshot({ path: outPath });
    console.log('✓ Rendered meta/screenshots/simulateur_automate.png (2560x1734)');
    await page.close();
  }

  // Widescreen
  {
    const page = await browser.newPage({
      viewport: { width: 1456, height: 845 },
      deviceScaleFactor: 2
    });
    await page.goto(`http://127.0.0.1:${port}/webapps/simulateur_automate.html`, { waitUntil: 'networkidle' });
    await prepPage(page);
    await page.waitForTimeout(400);

    const outPath = path.join(outDir, 'simulateur_automate_widescreen.png');
    await page.screenshot({ path: outPath });
    console.log('✓ Rendered meta/screenshots/simulateur_automate_widescreen.png (2912x1690)');
    await page.close();
  }

  // Mobile
  {
    const page = await browser.newPage({
      viewport: { width: 384, height: 824 },
      deviceScaleFactor: 2,
      isMobile: true
    });
    await page.goto(`http://127.0.0.1:${port}/webapps/simulateur_automate.html`, { waitUntil: 'networkidle' });
    await prepPage(page);
    await page.waitForTimeout(400);

    const outPath = path.join(outDir, 'simulateur_automate_mobile.png');
    await page.screenshot({ path: outPath });
    console.log('✓ Rendered meta/screenshots/simulateur_automate_mobile.png (768x1648)');
    await page.close();
  }
}

async function captureBinaireStudio(browser, port) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 996 },
    deviceScaleFactor: 2
  });
  await page.goto(`http://127.0.0.1:${port}/webapps/binaire_studio.html`, { waitUntil: 'networkidle' });
  await prepPage(page);
  await page.waitForTimeout(300);

  const outPath = path.join(outDir, 'binaire_studio.png');
  await page.screenshot({ path: outPath });
  console.log('✓ Rendered meta/screenshots/binaire_studio.png (2560x1992)');
  await page.close();
}

async function captureBinaireCodage(browser, port) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1013 },
    deviceScaleFactor: 2
  });
  await page.goto(`http://127.0.0.1:${port}/webapps/binaire_codage.html`, { waitUntil: 'networkidle' });
  await prepPage(page);
  await page.waitForTimeout(300);

  const outPath = path.join(outDir, 'binaire_codage.png');
  await page.screenshot({ path: outPath });
  console.log('✓ Rendered meta/screenshots/binaire_codage.png (2560x2026)');
  await page.close();
}

async function captureBinaireMessage(browser, port) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 750 },
    deviceScaleFactor: 2
  });
  await page.goto(`http://127.0.0.1:${port}/webapps/binaire_message.html`, { waitUntil: 'networkidle' });
  await prepPage(page);
  await page.waitForTimeout(300);

  const outPath = path.join(outDir, 'binaire_message.png');
  await page.screenshot({ path: outPath });
  console.log('✓ Rendered meta/screenshots/binaire_message.png (2560x1500)');
  await page.close();
}

async function captureRoutageReseau(browser, port) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1105 },
    deviceScaleFactor: 2
  });
  await page.goto(`http://127.0.0.1:${port}/webapps/routage_reseau.html`, { waitUntil: 'networkidle' });
  await prepPage(page);
  await page.waitForTimeout(300);

  const outPath = path.join(outDir, 'routage_reseau.png');
  await page.screenshot({ path: outPath });
  console.log('✓ Rendered meta/screenshots/routage_reseau.png (2560x2210)');
  await page.close();
}

async function captureBitDeParite(browser, port) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1092 },
    deviceScaleFactor: 2
  });
  await page.goto(`http://127.0.0.1:${port}/webapps/bit_de_parite.html`, { waitUntil: 'networkidle' });
  await prepPage(page);
  await page.waitForTimeout(300);

  const outPath = path.join(outDir, 'bit_de_parite.png');
  await page.screenshot({ path: outPath });
  console.log('✓ Rendered meta/screenshots/bit_de_parite.png (2560x2184)');
  await page.close();
}

async function captureAutoApp(browser, port, urlPath, outName, setupFn) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2
  });
  await page.goto(`http://127.0.0.1:${port}/${urlPath}`, { waitUntil: 'networkidle' });
  await prepPage(page);
  if (typeof setupFn === 'function') {
    await setupFn(page);
  }
  await page.waitForTimeout(350);

  const height = await page.evaluate(() => {
    const shell = document.querySelector('.container, .app-shell, main');
    const bodyHeight = document.body.scrollHeight;
    const shellHeight = shell ? shell.getBoundingClientRect().height + 40 : 0;
    return Math.max(Math.ceil(Math.max(bodyHeight, shellHeight)), 720);
  });

  await page.setViewportSize({ width: 1280, height });
  await page.waitForTimeout(150);

  const outPath = path.join(outDir, outName);
  await page.screenshot({ path: outPath });
  console.log(`✓ Rendered meta/screenshots/${outName} (2560x${height * 2})`);
  await page.close();
}

async function captureMachineATrier(browser, port) {
  await captureAutoApp(browser, port, 'webapps/machine_a_trier.html', 'machine_a_trier.png');
}

async function captureJeuDeLaGrue(browser, port) {
  await captureAutoApp(browser, port, 'webapps/jeu_de_la_grue.html', 'jeu_de_la_grue.png');
}

async function captureDactylo(browser, port) {
  await captureAutoApp(browser, port, 'webapps/dactylo.html', 'dactylo.png', async (page) => {
    await page.evaluate(() => {
      document.getElementById('btnDismissTouchNotice')?.click();
      document.getElementById('btnToggleKeyboard')?.click();
    });
  });
}

async function captureCalculatriceBinaire(browser, port) {
  await captureAutoApp(browser, port, 'webapps/calculatrice_binaire.html', 'calculatrice_binaire.png', async (page) => {
    await page.evaluate(() => {
      if (window.CalculatriceBinaire && typeof window.CalculatriceBinaire.setDecimalValue === 'function') {
        window.CalculatriceBinaire.setDecimalValue(42);
      }
    });
  });
}

async function captureMachineAChiffrer(browser, port) {
  await captureAutoApp(browser, port, 'webapps/machine_a_chiffrer.html', 'machine_a_chiffrer.png', async (page) => {
    await page.fill('#input-clear', 'BONJOUR VALAIS !');
  });
}

async function captureSimulateurTelechargement(browser, port) {
  await captureAutoApp(browser, port, 'webapps/simulateur_telechargement.html', 'simulateur_telechargement.png');
}

async function captureRoueDeLaChance(browser, port) {
  await captureAutoApp(browser, port, 'webapps/teacher/roue_de_la_chance.html', 'roue_de_la_chance.png');
}

async function captureQrcode(browser, port) {
  await captureAutoApp(browser, port, 'webapps/teacher/qrcode.html', 'qrcode.png');
}

async function captureTimeTimer(browser, port) {
  await captureAutoApp(browser, port, 'webapps/teacher/time_timer.html', 'time_timer.png');
}

async function captureSimDyslexie(browser, port) {
  await captureAutoApp(browser, port, 'webapps/teacher/sim_dyslexie.html', 'sim_dyslexie.png', async (page) => {
    await page.click('#compGraphemes');
    await page.click('#compSilentLetters');
  });
}

async function main() {
  const onlyMissing = process.argv.includes('--missing');
  const port = 8125;
  const server = await startServer(port);
  console.log(`Screenshot server running on http://127.0.0.1:${port}`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const allTasks = [
    { name: 'index.png', fn: () => captureIndex(browser, port) },
    { name: 'tirage.png', fn: () => captureTirage(browser, port) },
    { name: 'bareme.png', fn: () => captureBareme(browser, port) },
    { name: 'generateur_mot_de_passe.png', fn: () => capturePasswordGen(browser, port) },
    { name: 'simulateur_automate.png', fn: () => captureAutomate(browser, port) },
    { name: 'binaire_studio.png', fn: () => captureBinaireStudio(browser, port) },
    { name: 'binaire_codage.png', fn: () => captureBinaireCodage(browser, port) },
    { name: 'binaire_message.png', fn: () => captureBinaireMessage(browser, port) },
    { name: 'routage_reseau.png', fn: () => captureRoutageReseau(browser, port) },
    { name: 'bit_de_parite.png', fn: () => captureBitDeParite(browser, port) },
    { name: 'machine_a_trier.png', fn: () => captureMachineATrier(browser, port) },
    { name: 'jeu_de_la_grue.png', fn: () => captureJeuDeLaGrue(browser, port) },
    { name: 'dactylo.png', fn: () => captureDactylo(browser, port) },
    { name: 'calculatrice_binaire.png', fn: () => captureCalculatriceBinaire(browser, port) },
    { name: 'machine_a_chiffrer.png', fn: () => captureMachineAChiffrer(browser, port) },
    { name: 'simulateur_telechargement.png', fn: () => captureSimulateurTelechargement(browser, port) },
    { name: 'roue_de_la_chance.png', fn: () => captureRoueDeLaChance(browser, port) },
    { name: 'qrcode.png', fn: () => captureQrcode(browser, port) },
    { name: 'time_timer.png', fn: () => captureTimeTimer(browser, port) },
    { name: 'sim_dyslexie.png', fn: () => captureSimDyslexie(browser, port) }
  ];

  let count = 0;
  for (const task of allTasks) {
    if (onlyMissing && fs.existsSync(path.join(outDir, task.name))) {
      continue;
    }
    await task.fn();
    count++;
  }

  await browser.close();
  server.close();
  console.log(`🎉 ${count} documentation screenshot(s) successfully updated in meta/screenshots/`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
