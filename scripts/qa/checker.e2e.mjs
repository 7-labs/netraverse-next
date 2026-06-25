// Functional QA for the homepage migration report (R4). Run on OpenClaw:
//   NODE_PATH=$(npm root -g) node scripts/qa/checker.e2e.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import net from 'node:net';

const PORT = Number(process.env.QA_PORT || 8123);
const QA_PATH = process.env.QA_PATH || '/';
const QA_TERMS = (process.env.QA_TERMS || 'Fortnite,Photoshop').split(',').map(s => s.trim());

let pass = true;
const log = (...a) => console.log(...a);

// Replace the fixed 1.5s warmup with a TCP poll: start the moment the static
// server is listening instead of guessing, which removes the main flake source.
function waitForPort(port, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.connect(port, '127.0.0.1');
      socket.once('connect', () => {
        socket.destroy();
        resolve();
      });
      socket.once('error', () => {
        socket.destroy();
        if (Date.now() > deadline) reject(new Error(`port ${port} not up in ${timeoutMs}ms`));
        else setTimeout(attempt, 150);
      });
    };
    attempt();
  });
}

const server = spawn('python3', ['-m', 'http.server', String(PORT), '-d', 'out'], { stdio: 'ignore' });

async function selectTerm(page, term) {
  await page.fill('#catalog-search', term);
  await page.waitForSelector('.suggestion-list button', { timeout: 5000 });
  await page.click('.suggestion-list button');
}

try {
  await waitForPort(PORT);
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROME_PATH || '/Applications/Chromium.app/Contents/MacOS/Chromium',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const base = `http://localhost:${PORT}`;
  log(`--- ${QA_PATH} [${QA_TERMS.join(', ')}] ---`);
  await page.goto(`${base}${QA_PATH}`, { waitUntil: 'networkidle' });

  // Empty state: the Check button is disabled until something is selected.
  const emptyDisabled = await page.isDisabled('.action-row button');

  // No-match -> structured request-capture fallback (must not produce a report).
  await page.fill('#catalog-search', 'zzqqxxnope');
  const requestCaptureShown = await page
    .waitForSelector('.request-capture', { timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  await page.fill('#catalog-search', '');

  for (const term of QA_TERMS) {
    await selectTerm(page, term);
  }

  await page.click('.action-row button'); // "Check Compatibility"
  await page.waitForSelector('.results-panel', { timeout: 5000 });
  const text = await page.textContent('.results-panel');

  // Share writes ?items=&usage= to the URL; capture it for the rehydrate test.
  const sharedUrl = page.url();
  const sharedHasItems = /[?&]items=/.test(sharedUrl) && /[?&]usage=/.test(sharedUrl);

  // Rehydrate loop: load the shared URL fresh and confirm the report is restored
  // without re-typing (chips + results panel come back from the query string).
  const rehydratePage = await browser.newPage();
  const rehydrateErrors = [];
  rehydratePage.on('pageerror', e => rehydrateErrors.push(e.message));
  await rehydratePage.goto(sharedUrl, { waitUntil: 'networkidle' });
  const rehydrateRestored = await rehydratePage
    .waitForSelector('.results-panel', { timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  const rehydrateChips = await rehydratePage.$$eval('.chip', els => els.length).catch(() => 0);

  const checks = {
    'Empty state disables Check button': emptyDisabled === true,
    'No-match shows request-capture': requestCaptureShown,
    'Migration report heading': /Readiness \d+\/100/.test(text) || /switch recommended|Not ready/i.test(text),
    'All selected items appear': QA_TERMS.every(t => new RegExp(t.split(' ')[0], 'i').test(text)),
    'Has blockers or clear verdict': /Biggest blockers/i.test(text) || /No blockers found/i.test(text),
    'Recommended setup section': /Recommended setup/i.test(text),
    'Copy + Share buttons': (await page.$('text=Copy report')) !== null && (await page.$('text=Share result')) !== null,
    'Share writes ?items=&usage= to URL': sharedHasItems,
    'Rehydrate from URL restores report': rehydrateRestored,
    'Rehydrate restores selected chips': rehydrateChips >= QA_TERMS.length,
    'No JS page errors': errors.length === 0 && rehydrateErrors.length === 0,
  };

  for (const [k, v] of Object.entries(checks)) {
    log(`${v ? 'PASS' : 'FAIL'}  ${k}`);
    if (!v) pass = false;
  }
  if (errors.length) log('  pageerrors:', errors.join(' | '));
  if (rehydrateErrors.length) log('  rehydrate pageerrors:', rehydrateErrors.join(' | '));
  await browser.close();
} catch (e) {
  log('ERROR', e.message);
  pass = false;
}

server.kill();
log(pass ? 'E2E_RESULT=PASS' : 'E2E_RESULT=FAIL');
process.exit(pass ? 0 : 1);
