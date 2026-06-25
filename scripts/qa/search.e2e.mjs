// QA for synonym search + request-capture (R7) plus the legacy redirect matrix.
// Run on OpenClaw:
//   NODE_PATH=$(npm root -g) node scripts/qa/search.e2e.mjs
//   BASE_URL=https://<preview>.pages.dev node scripts/qa/search.e2e.mjs   # also probes _redirects
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

const PORT = Number(process.env.QA_PORT || 8124);
// Email is env-driven so the assertion tracks NEXT_PUBLIC_REQUEST_EMAIL instead
// of hardcoding the default and breaking when CI overrides it.
const REQUEST_EMAIL = process.env.NEXT_PUBLIC_REQUEST_EMAIL || 'requests@netraverse.com';
const BASE_URL = process.env.BASE_URL || '';

let pass = true;
const log = (...a) => console.log(...a);

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

// --- Redirect matrix --------------------------------------------------------
// Parse public/_redirects (Cloudflare format: `source  destination  code[!]`)
// and assert every rule returns 301 to its mapped target. Cloudflare applies
// _redirects, not the local static server, so this only runs when BASE_URL
// points at a deployed preview/prod origin.
async function parseRedirects() {
  const text = await fs.readFile(path.join(repoRoot, 'public', '_redirects'), 'utf8');
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const [source, destination, code] = line.split(/\s+/);
      return { source, destination, code: (code || '').replace('!', '') };
    })
    .filter(rule => rule.source && rule.destination && rule.code === '301');
}

// Turn a rule into a concrete request path + the expected Location, resolving a
// trailing /* splat to a sample segment so wildcard rules are actually probed.
function materialize(rule) {
  const sample = 'qa-probe';
  const reqPath = rule.source.replace(/\*$/, sample);
  let expected = rule.destination.replace(':splat', sample);
  return { reqPath, expected };
}

function isAbsolute(value) {
  return /^https?:\/\//i.test(value);
}

async function probeRedirects() {
  const rules = await parseRedirects();
  // Only probe path-based legacy rules here; the apex/scheme canonicalization
  // rules have absolute-origin sources that a single BASE_URL can't represent.
  const pathRules = rules.filter(rule => rule.source.startsWith('/'));
  let ok = 0;
  const failures = [];

  for (const rule of pathRules) {
    const { reqPath, expected } = materialize(rule);
    const url = `${BASE_URL.replace(/\/$/, '')}${reqPath}`;
    let res;
    try {
      res = await fetch(url, { method: 'GET', redirect: 'manual' });
    } catch (error) {
      failures.push(`${reqPath} -> request error: ${error.message}`);
      continue;
    }
    const location = res.headers.get('location') || '';
    const status = res.status;
    // Compare path-only when the rule destination is relative.
    const locForCompare = isAbsolute(expected)
      ? location
      : location.replace(/^https?:\/\/[^/]+/i, '');
    const statusOk = status === 301;
    const targetOk = locForCompare === expected || locForCompare === `${expected}`;
    if (statusOk && targetOk) {
      ok += 1;
    } else {
      failures.push(`${reqPath} -> status=${status} location=${location} (expected 301 -> ${expected})`);
    }
  }

  log(`--- redirect matrix: ${ok}/${pathRules.length} rules pass ---`);
  failures.slice(0, 20).forEach(f => log(`  FAIL ${f}`));
  if (failures.length > 20) log(`  ... ${failures.length - 20} more`);
  return failures.length === 0;
}

// --- Search / request-capture (local static export) ------------------------
const server = spawn('python3', ['-m', 'http.server', String(PORT), '-d', 'out'], { stdio: 'ignore' });

try {
  await waitForPort(PORT);
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

  const mailtoRe = new RegExp(`mailto:${REQUEST_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);

  const checks = {
    '"cs2" -> Counter-Strike 2': /counter-strike 2/i.test(cs2),
    '"office 365" -> Microsoft 365': /microsoft 365/i.test(o365),
    [`no-match shows request fallback (${REQUEST_EMAIL})`]:
      mailtoRe.test(requestHref || '') && /request it/i.test(requestButton || ''),
  };
  for (const [k, v] of Object.entries(checks)) {
    log(`${v ? 'PASS' : 'FAIL'}  ${k}`);
    if (!v) pass = false;
  }
  await browser.close();

  if (BASE_URL) {
    const redirectsOk = await probeRedirects();
    log(`${redirectsOk ? 'PASS' : 'FAIL'}  legacy redirect matrix (BASE_URL=${BASE_URL})`);
    if (!redirectsOk) pass = false;
  } else {
    log('SKIP  legacy redirect matrix (set BASE_URL to a deployed preview/prod origin to enable)');
  }
} catch (e) {
  log('ERROR', e.message);
  pass = false;
}

server.kill();
log(pass ? 'SEARCH_E2E=PASS' : 'SEARCH_E2E=FAIL');
process.exit(pass ? 0 : 1);
