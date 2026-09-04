const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 1. Original Favicon SVG (100% transparent background, crisp at 16x16 / 32x32 in Chrome tab)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <clipPath id="screen-clip">
      <rect x="44" y="64" width="424" height="340" rx="16" />
    </clipPath>
    
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.20" />
    </filter>
  </defs>

  <rect x="28" y="48" width="456" height="416" rx="32" fill="#a52a23" />

  <rect x="44" y="64" width="424" height="340" rx="16" fill="#cc362d" />

  <polygon points="44,404 468,64 468,404" fill="#b02f26" clip-path="url(#screen-clip)" />

  <rect x="220" y="426" width="72" height="12" rx="6" fill="#da5c55" />
  
  <circle cx="410" cy="432" r="8" fill="#da5c55" />

  <g filter="url(#shadow)">
    <polygon points="256,135 232,211 151,211 216,258 191,334 256,287" fill="#ffffff" />
    <polygon points="256,135 280,211 361,211 296,258 321,334 256,287" fill="#e2e6eb" />
  </g>
</svg>`;

// 2. Installed App Icon SVG: 100% TRANSPARENT background, with reduced emblem (~74% scale) for Dock/Home Screen
const appIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Soft multi-layered drop shadow under the emblem for contrast on dark/light wallpapers -->
    <filter id="emblem-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000000" flood-opacity="0.28" />
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.18" />
    </filter>

    <clipPath id="screen-clip-app">
      <rect x="44" y="64" width="424" height="340" rx="16" />
    </clipPath>
    
    <filter id="star-shadow-app" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- 100% TRANSPARENT BACKGROUND (No white box) -->

  <!-- Reduced centered EdNum emblem (~74% scale, leaves ~16% transparent breathing room around) -->
  <g transform="translate(256, 256) scale(0.74) translate(-256, -256)" filter="url(#emblem-shadow)">
    <!-- Red tablet frame -->
    <rect x="28" y="48" width="456" height="416" rx="34" fill="#a52a23" />

    <!-- Screen -->
    <rect x="44" y="64" width="424" height="340" rx="18" fill="#cc362d" />

    <!-- Screen diagonal shadow -->
    <polygon points="44,404 468,64 468,404" fill="#b02f26" clip-path="url(#screen-clip-app)" />

    <!-- Bottom home bar & sensor -->
    <rect x="220" y="426" width="72" height="12" rx="6" fill="#da5c55" />
    <circle cx="410" cy="432" r="8" fill="#da5c55" />

    <!-- Star in the center -->
    <g filter="url(#star-shadow-app)">
      <polygon points="256,135 232,211 151,211 216,258 191,334 256,287" fill="#ffffff" />
      <polygon points="256,135 280,211 361,211 296,258 321,334 256,287" fill="#e2e6eb" />
    </g>
  </g>
</svg>`;

async function main() {
  const rootDir = path.resolve(__dirname, '..', '..');
  const assetsDir = path.join(rootDir, 'assets');

  // 1. Save original transparent favicon.svg
  fs.writeFileSync(path.join(assetsDir, 'favicon.svg'), faviconSvg, 'utf8');
  console.log('Saved assets/favicon.svg (transparent background)');

  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage();

  // 2. Render 512x512 PNG with transparent background
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;">${appIconSvg}</body></html>`);
  await page.screenshot({ path: path.join(assetsDir, 'icon-512.png'), omitBackground: true });
  console.log('Rendered assets/icon-512.png (512x512, transparent background, reduced emblem)');

  // 3. Render 192x192 PNG with transparent background
  await page.setViewportSize({ width: 192, height: 192 });
  const appIcon192 = appIconSvg.replace('width="512" height="512"', 'width="192" height="192"');
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;">${appIcon192}</body></html>`);
  await page.screenshot({ path: path.join(assetsDir, 'icon-192.png'), omitBackground: true });
  console.log('Rendered assets/icon-192.png (192x192, transparent background, reduced emblem)');

  // 4. Render apple-touch-icon.png (180x180) with transparent background
  await page.setViewportSize({ width: 180, height: 180 });
  const appIcon180 = appIconSvg.replace('width="512" height="512"', 'width="180" height="180"');
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;">${appIcon180}</body></html>`);
  await page.screenshot({ path: path.join(assetsDir, 'apple-touch-icon.png'), omitBackground: true });
  console.log('Rendered assets/apple-touch-icon.png (180x180, transparent background)');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
