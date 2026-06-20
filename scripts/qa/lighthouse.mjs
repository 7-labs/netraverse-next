import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = Number(process.env.LH_PORT || 8125);
const MIN_SCORE = Number(process.env.LH_MIN_SCORE || 90);
const CHROME_PATH =
  process.env.CHROME_PATH || '/Applications/Chromium.app/Contents/MacOS/Chromium';
const ROUTES = (process.env.LH_PATHS ||
  '/,/apps/microsoft-office,/games/fortnite,/tools/windows-apps-on-linux-checker')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.stdio || 'inherit',
      ...options,
    });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} exited with ${code}`));
    });
  });
}

function score(report, category) {
  return Math.round((report.categories[category]?.score || 0) * 100);
}

async function main() {
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '-d', 'out'], {
    stdio: 'ignore',
  });
  await sleep(1500);

  const failures = [];
  try {
    for (const route of ROUTES) {
      const outputPath = path.join(
        os.tmpdir(),
        `netraverse-lighthouse-${route.replace(/[^a-z0-9]+/gi, '-') || 'home'}.json`,
      );
      const url = `http://127.0.0.1:${PORT}${route}`;
      await run('npx', [
        '-y',
        'lighthouse@latest',
        url,
        '--quiet',
        '--preset=desktop',
        '--only-categories=seo,accessibility',
        `--chrome-path=${CHROME_PATH}`,
        '--chrome-flags=--headless --no-sandbox',
        '--output=json',
        `--output-path=${outputPath}`,
      ]);

      const report = JSON.parse(await fs.readFile(outputPath, 'utf8'));
      const seo = score(report, 'seo');
      const accessibility = score(report, 'accessibility');
      const pass = seo >= MIN_SCORE && accessibility >= MIN_SCORE;
      console.log(
        `${pass ? 'PASS' : 'FAIL'} ${route} seo=${seo} accessibility=${accessibility}`,
      );
      if (!pass) {
        failures.push(`${route} seo=${seo} accessibility=${accessibility}`);
      }
    }
  } finally {
    server.kill();
  }

  if (failures.length) {
    console.error(`[qa:lighthouse] FAILED ${failures.join('; ')}`);
    process.exitCode = 1;
    return;
  }

  console.log('[qa:lighthouse] PASS');
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
