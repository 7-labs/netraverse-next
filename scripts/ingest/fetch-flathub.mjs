// Real Flathub ingestion via Proxy-Grid (see ROADMAP-R2.md R2.3).
// Confirms native Linux availability by checking each seed app's Flathub id.
import fs from 'node:fs/promises';
import path from 'node:path';
import { smartGet, ingestTs, politeDelay } from './grid.mjs';

const cacheDir = path.join(process.cwd(), 'scripts', 'ingest', 'cache');
const seedFile = path.join(process.cwd(), 'scripts', 'ingest', 'seed-apps.json');

// Atomic write: stage to a .tmp sibling then rename so a crash mid-write never
// leaves a truncated cache file for build-dataset to consume.
async function writeJsonAtomic(file, value) {
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2));
  await fs.rename(tmp, file);
}

async function flathubExists(appId) {
  if (!appId) return false;
  const url = `https://flathub.org/api/v2/appstream/${appId}`;
  const body = await smartGet(url);
  if (!body) return false;
  try {
    const data = JSON.parse(body);
    return Boolean(data && (data.id || data.name));
  } catch {
    return false;
  }
}

async function main() {
  const seeds = JSON.parse(await fs.readFile(seedFile, 'utf8'));
  await fs.mkdir(cacheDir, { recursive: true });

  const results = [];
  let confirmed = 0;
  for (const seed of seeds) {
    const onFlathub = await flathubExists(seed.flathubId);
    await politeDelay();
    if (onFlathub) confirmed += 1;
    const nativeAvailable = onFlathub || seed.verdict === 'native';
    results.push({
      slug: seed.slug,
      title: seed.title,
      category: seed.category,
      verdict: seed.verdict,
      difficulty: seed.difficulty,
      flathubId: seed.flathubId || '',
      nativeAvailable,
      sourceUrl: onFlathub
        ? `https://flathub.org/apps/${seed.flathubId}`
        : 'https://flathub.org/',
      dataSource: 'flathub',
      fetchedAt: ingestTs,
    });
  }

  await writeJsonAtomic(path.join(cacheDir, 'flathub.raw.json'), results);
  console.log(`[flathub] ${results.length} apps | confirmed on Flathub: ${confirmed}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
