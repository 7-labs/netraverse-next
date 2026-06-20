// Functional QA for the homepage migration report (R4). Run on OpenClaw:
//   NODE_PATH=$(npm root -g) node scripts/qa/checker.e2e.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const PORT = 8123;
const server = spawn('python3', ['-m', 'http.server', String(PORT), '-d', 'out'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
await sleep(1500);

let pass = true;
const log = (...a) => console.log(...a);

const QA_PATH = process.env.QA_PATH || '/';
const QA_TERMS = (process.env.QA_TERMS || 'Fortnite,Photoshop').split(',').map(s => s.trim());

try {
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROME_PATH || '/Applications/Chromium.app/Contents/MacOS/Chromium',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  log(`--- ${QA_PATH} [${QA_TERMS.join(', ')}] ---`);
  await page.goto(`http://localhost:${PORT}${QA_PATH}`, { waitUntil: 'networkidle' });

  for (const term of QA_TERMS) {
    await page.fill('#catalog-search', term);
    await page.waitForSelector('.suggestion-list button', { timeout: 5000 });
    await page.click('.suggestion-list button');
  }

  await page.click('.action-row button'); // "Check Compatibility"
  await page.waitForSelector('.results-panel', { timeout: 5000 });
  const text = await page.textContent('.results-panel');

  const checks = {
    'Migration report heading': /Readiness \d+\/100/.test(text) || /switch recommended|Not ready/i.test(text),
    'All selected items appear': QA_TERMS.every(t => new RegExp(t.split(' ')[0], 'i').test(text)),
    'Has blockers or clear verdict': /Biggest blockers/i.test(text) || /No blockers found/i.test(text),
    'Recommended setup section': /Recommended setup/i.test(text),
    'Copy + Share buttons': (await page.$('text=Copy report')) !== null && (await page.$('text=Share result')) !== null,
    'No JS page errors': errors.length === 0,
  };

  for (const [k, v] of Object.entries(checks)) {
    log(`${v ? 'PASS' : 'FAIL'}  ${k}`);
    if (!v) pass = false;
  }
  if (errors.length) log('  pageerrors:', errors.join(' | '));
  await browser.close();
} catch (e) {
  log('ERROR', e.message);
  pass = false;
}

server.kill();
log(pass ? 'E2E_RESULT=PASS' : 'E2E_RESULT=FAIL');
process.exit(pass ? 0 : 1);
