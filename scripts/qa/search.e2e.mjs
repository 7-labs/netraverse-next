// QA for synonym search + request-capture (R7). Run on OpenClaw:
//   NODE_PATH=$(npm root -g) node scripts/qa/search.e2e.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const PORT = 8124;
const server = spawn('python3', ['-m', 'http.server', String(PORT), '-d', 'out'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
await sleep(1500);

let pass = true;
const log = (...a) => console.log(...a);

try {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || '/Applications/Chromium.app/Contents/MacOS/Chromium',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

  // synonym: "cs2" should suggest Counter-Strike 2
  await page.fill('#catalog-search', 'cs2');
  await page.waitForSelector('.suggestion-list button', { timeout: 5000 });
  const cs2 = await page.textContent('.suggestion-list');

  // synonym: "office 365" should suggest Microsoft 365
  await page.fill('#catalog-search', 'office 365');
  await page.waitForSelector('.suggestion-list button', { timeout: 5000 });
  const o365 = await page.textContent('.suggestion-list');

  // request-capture: gibberish -> structured fallback request form
  await page.fill('#catalog-search', 'zzqqxxnope');
  await page.waitForSelector('.request-capture', { timeout: 5000 });
  const requestHref = await page.getAttribute('.request-capture a', 'href');
  const requestButton = await page.textContent('.request-capture button');

  const checks = {
    '"cs2" -> Counter-Strike 2': /counter-strike 2/i.test(cs2),
    '"office 365" -> Microsoft 365': /microsoft 365/i.test(o365),
    'no-match shows request fallback': /mailto:requests@netraverse\.com/.test(requestHref || '') && /request it/i.test(requestButton || ''),
  };
  for (const [k, v] of Object.entries(checks)) {
    log(`${v ? 'PASS' : 'FAIL'}  ${k}`);
    if (!v) pass = false;
  }
  await browser.close();
} catch (e) {
  log('ERROR', e.message);
  pass = false;
}

server.kill();
log(pass ? 'SEARCH_E2E=PASS' : 'SEARCH_E2E=FAIL');
process.exit(pass ? 0 : 1);
