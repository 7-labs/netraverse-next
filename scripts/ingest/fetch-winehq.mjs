// Real WineHQ AppDB ingestion via Proxy-Grid web2md (see ROADMAP-R2.md R2.3).
// Scoped to the Windows apps where Wine actually matters (verdict wine/vm/no-go in
// the seed or overlay). Best-effort + defensive parsing; failures are stale-guarded
// by build-dataset (overlay still carries authoritative wineRating for head apps).
import fs from 'node:fs/promises';
import path from 'node:path';
import { web2md, ingestTs } from './grid.mjs';

const ingestDir = path.join(process.cwd(), 'scripts', 'ingest');
const cacheDir = path.join(ingestDir, 'cache');

const RATINGS = ['platinum', 'gold', 'silver', 'bronze', 'garbage'];

function normName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[™®:!.,'’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

// Pull a wineRating for a single app title from its WineHQ search results page.
async function lookupRating(title) {
  const url = `https://appdb.winehq.org/objectManager.php?sClass=application&sAction=search&sQuery=${encodeURIComponent(
    title,
  )}`;
  const md = await web2md(url);
  if (!md) return null;
  const lc = md.toLowerCase();
  const needle = normName(title);
  // Find the line mentioning the app, then the nearest rating keyword.
  const lines = lc.split('\n');
  for (const line of lines) {
    if (needle && line.includes(needle.split(' ')[0])) {
      const hit = RATINGS.find(r => line.includes(r));
      if (hit) return hit;
    }
  }
  // fallback: first rating keyword anywhere on the page
  const any = RATINGS.find(r => lc.includes(r));
  return any || null;
}

async function main() {
  await fs.mkdir(cacheDir, { recursive: true });
  const seeds = (await readJson(path.join(ingestDir, 'seed-apps.json'), [])) || [];

  // Target set: seed apps that might run under Wine. The migration-critical head
  // (Photoshop, Affinity, ...) already carries authoritative wineRating + sources
  // in overlay.json, so we only scrape WineHQ for the breadth seeds here.
  const targets = new Map();
  for (const s of seeds) {
    if (['wine', 'vm', 'no-go'].includes(s.verdict)) targets.set(s.slug, s.title);
  }

  const entries = {};
  let found = 0;
  for (const [slug, title] of targets) {
    const rating = await lookupRating(title);
    if (rating) {
      entries[slug] = { wineRating: rating, sourceUrl: 'https://appdb.winehq.org/', fetchedAt: ingestTs };
      found += 1;
    }
  }

  const payload = { ok: Object.keys(entries).length > 0, sourceUrl: 'https://appdb.winehq.org/', fetchedAt: ingestTs, entries };
  await fs.writeFile(path.join(cacheDir, 'winehq.raw.json'), JSON.stringify(payload, null, 2));
  console.log(`[winehq] looked up ${targets.size} wine-relevant apps | ratings found: ${found}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
