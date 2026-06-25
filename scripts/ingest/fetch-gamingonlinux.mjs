// Anti-cheat source of truth (see ROADMAP-R2.md R2.3).
// Primary: AreWeAntiCheatYet's structured games.json (clean, maintained, no scraping).
// Fallback: GamingOnLinux anti-cheat list via Proxy-Grid web2md (the page is JS-rendered,
// so this rarely yields rows — kept only as a backstop).
import fs from 'node:fs/promises';
import path from 'node:path';
import { smartGet, web2md, ingestTs, normName } from './grid.mjs';

const cacheDir = path.join(process.cwd(), 'scripts', 'ingest', 'cache');
const AWACY_URLS = [
  'https://raw.githubusercontent.com/AreWeAntiCheatYet/AreWeAntiCheatYet/master/games.json',
  'https://raw.githubusercontent.com/AreWeAntiCheatYet/AreWeAntiCheatYet/main/games.json',
];
const GOL = 'https://www.gamingonlinux.com/anticheat/';

// AreWeAntiCheatYet status -> our enum: none|supported|broken|denied|unknown
function mapAwacy(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'denied') return 'denied';
  if (s === 'broken') return 'broken';
  if (s === 'supported' || s === 'running') return 'supported';
  if (s === 'planned') return 'unknown';
  return 'unknown';
}

async function fromAwacy() {
  for (const url of AWACY_URLS) {
    const body = await smartGet(url);
    if (!body) continue;
    try {
      const games = JSON.parse(body);
      if (Array.isArray(games) && games.length) {
        return { games, url };
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

// Atomic write: stage to a .tmp sibling then rename so a crash mid-write never
// leaves a truncated cache file for build-dataset to consume.
async function writeJsonAtomic(file, value) {
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2));
  await fs.rename(tmp, file);
}

async function main() {
  await fs.mkdir(cacheDir, { recursive: true });
  const byName = {};
  const rows = [];
  let sourceUrl = AWACY_URLS[0];

  const awacy = await fromAwacy();
  if (awacy) {
    sourceUrl = awacy.url;
    for (const g of awacy.games) {
      const key = normName(g.name);
      if (!key) continue;
      const status = mapAwacy(g.status);
      byName[key] = status;
      rows.push({ game: g.name, status });
    }
  } else {
    // Fallback: GamingOnLinux markdown (usually empty because the table is JS-rendered).
    const md = await web2md(GOL);
    sourceUrl = GOL;
    if (md) {
      for (const line of md.split('\n')) {
        if (!line.trim().startsWith('|')) continue;
        const cells = line.split('|').map(c => c.trim()).filter(Boolean);
        if (cells.length < 2) continue;
        const game = cells[0].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim();
        if (!game || /^game$/i.test(game) || /^-+$/.test(game)) continue;
        const t = line.toLowerCase();
        const status = /den(y|ied)/.test(t)
          ? 'denied'
          : /broken|✗/.test(t)
            ? 'broken'
            : /supported|working|running|✓/.test(t)
              ? 'supported'
              : 'unknown';
        const key = normName(game);
        if (key && !byName[key]) byName[key] = status;
        rows.push({ game, status });
      }
    }
  }

  const payload = {
    sourceUrl,
    fetchedAt: ingestTs,
    parsed: rows.length,
    ok: rows.length > 0,
    byName,
    rows,
  };
  await writeJsonAtomic(path.join(cacheDir, 'gamingonlinux.anticheat.json'), payload);
  console.log(`[anti-cheat] ${rows.length} rows from ${sourceUrl.includes('githubusercontent') ? 'AreWeAntiCheatYet' : 'GamingOnLinux'} (ok=${payload.ok})`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
