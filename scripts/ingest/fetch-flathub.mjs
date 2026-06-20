// Real Flathub ingestion via Proxy-Grid (see ROADMAP-R2.md R2.3).
// Confirms native Linux availability by checking each seed app's Flathub id.
import fs from 'node:fs/promises';
import path from 'node:path';
import { smartGet, ingestTs } from './grid.mjs';

const cacheDir = path.join(process.cwd(), 'scripts', 'ingest', 'cache');
const seedFile = path.join(process.cwd(), 'scripts', 'ingest', 'seed-apps.json');

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

  await fs.writeFile(
    path.join(cacheDir, 'flathub.raw.json'),
    JSON.stringify(results, null, 2),
  );
  console.log(`[flathub] ${results.length} apps | confirmed on Flathub: ${confirmed}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
