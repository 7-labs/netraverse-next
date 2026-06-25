// Real WineHQ AppDB ingestion via Proxy-Grid web2md (see ROADMAP-R2.md R2.3).
// Scoped to the Windows apps where Wine actually matters (verdict wine/vm/no-go in
// the seed or overlay). Best-effort + defensive parsing; failures are stale-guarded
// by build-dataset (overlay still carries authoritative wineRating for head apps).
import fs from 'node:fs/promises';
import path from 'node:path';
import { web2md, ingestTs, politeDelay, normName } from './grid.mjs';

const ingestDir = path.join(process.cwd(), 'scripts', 'ingest');
const cacheDir = path.join(ingestDir, 'cache');

const RATINGS = ['platinum', 'gold', 'silver', 'bronze', 'garbage'];

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

// Atomic write: stage to a .tmp sibling then rename so a crash mid-write never
// leaves a truncated cache file for build-dataset to consume.
async function writeJsonAtomic(file, value) {
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2));
  await fs.rename(tmp, file);
}

// Pull a wineRating for a single app title from its WineHQ search results page.
// Fail closed: only return a rating found on the SAME line that mentions the app
// title token. The old page-wide fallback (first rating keyword anywhere) was
// dropped because it would attribute an unrelated app's rating to this one;
// returning null is safe — head wine apps carry authoritative ratings in overlay.
async function lookupRating(title) {
  const url = `https://appdb.winehq.org/objectManager.php?sClass=application&sAction=search&sQuery=${encodeURIComponent(
    title,
  )}`;
  const md = await web2md(url);
  if (!md) return null;
  const needle = normName(title);
  const token = needle.split(' ')[0];
  if (!token) return null;
  for (const line of md.toLowerCase().split('\n')) {
    if (line.includes(token)) {
      const hit = RATINGS.find(r => line.includes(r));
      if (hit) return hit;
    }
  }
  return null;
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
  const missing = [];
  let found = 0;
  for (const [slug, title] of targets) {
    const rating = await lookupRating(title);
    await politeDelay();
    if (rating) {
      entries[slug] = { wineRating: rating, sourceUrl: 'https://appdb.winehq.org/', fetchedAt: ingestTs };
      found += 1;
    } else {
      missing.push(slug);
    }
  }

  const payload = { ok: Object.keys(entries).length > 0, sourceUrl: 'https://appdb.winehq.org/', fetchedAt: ingestTs, entries };
  await writeJsonAtomic(path.join(cacheDir, 'winehq.raw.json'), payload);
  console.log(`[winehq] looked up ${targets.size} wine-relevant apps | ratings found: ${found}`);
  if (missing.length) {
    // Coverage-gap visibility for the brittle web2md source (overlay still backstops the head).
    console.warn(`[winehq] no rating for ${missing.length} apps: ${missing.join(', ')}`);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
