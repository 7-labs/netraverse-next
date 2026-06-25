// Real ProtonDB ingestion via Proxy-Grid (see ROADMAP-R2.md R2.3).
// For each seed game, pulls the ProtonDB summary JSON and records the live tier.
import fs from 'node:fs/promises';
import path from 'node:path';
import { smartGet, ingestTs, politeDelay } from './grid.mjs';

const cacheDir = path.join(process.cwd(), 'scripts', 'ingest', 'cache');
const seedFile = path.join(process.cwd(), 'scripts', 'ingest', 'seed-games.json');

// Atomic write: stage to a .tmp sibling then rename so a crash mid-write never
// leaves a truncated cache file for build-dataset to consume.
async function writeJsonAtomic(file, value) {
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2));
  await fs.rename(tmp, file);
}

const VALID_TIERS = new Set(['platinum', 'gold', 'silver', 'bronze', 'borked', 'pending', 'native']);

async function main() {
  const seeds = JSON.parse(await fs.readFile(seedFile, 'utf8'));
  await fs.mkdir(cacheDir, { recursive: true });

  const results = [];
  let ok = 0;
  let miss = 0;

  for (const seed of seeds) {
    if (!seed.steamAppId) {
      // Not sold on Steam (e.g. Fortnite/Valorant/LoL/Roblox) — overlay supplies the verdict.
      results.push({
        slug: seed.slug,
        title: seed.title,
        steamAppId: '',
        protonTier: null,
        protonConfidence: 'low',
        protonTotal: 0,
        sourceUrl: 'https://www.protondb.com/',
        dataSource: 'protondb',
        fetchedAt: ingestTs,
      });
      miss += 1;
      continue;
    }
    const url = `https://www.protondb.com/api/v1/reports/summaries/${seed.steamAppId}.json`;
    const body = await smartGet(url);
    await politeDelay();
    let protonTier = null;
    let confidence = 'low';
    let total = 0;
    if (body) {
      try {
        const summary = JSON.parse(body);
        const tier = String(summary.tier || summary.trendingTier || '').toLowerCase();
        if (VALID_TIERS.has(tier)) protonTier = tier;
        if (summary.confidence) confidence = String(summary.confidence).toLowerCase();
        if (typeof summary.total === 'number') total = summary.total;
      } catch {
        /* not JSON (e.g. native game has no summary) */
      }
    }
    if (protonTier) ok += 1;
    else miss += 1;
    results.push({
      slug: seed.slug,
      title: seed.title,
      steamAppId: seed.steamAppId,
      protonTier, // may be null -> resolved later (overlay / pending)
      protonConfidence: confidence,
      protonTotal: total,
      sourceUrl: `https://www.protondb.com/app/${seed.steamAppId}`,
      dataSource: 'protondb',
      fetchedAt: ingestTs,
    });
  }

  await writeJsonAtomic(path.join(cacheDir, 'protondb.raw.json'), results);
  console.log(`[protondb] ${results.length} games | tier resolved: ${ok}, no-summary: ${miss}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
