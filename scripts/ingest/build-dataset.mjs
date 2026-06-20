// Build the generated datasets + assemble the overlay (see ROADMAP-R2.md R2.3/R2.4).
// Consumes real fetch caches, derives decision-grade fields, stale-guards on failure,
// and writes lib/data/{apps,games}.generated.json + lib/data/overlay.json.
import fs from 'node:fs/promises';
import path from 'node:path';
import { ingestDate } from './grid.mjs';

const root = process.cwd();
const ingestDir = path.join(root, 'scripts', 'ingest');
const cacheDir = path.join(ingestDir, 'cache');
const dataDir = path.join(root, 'lib', 'data');

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function normName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[™®:!.,'’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/^the\s+/, '')
    .trim();
}

// ---------- games ----------
function deriveGame(row, antiByName, acSource) {
  const protonTier = row.protonTier || 'pending';
  const acHit = antiByName[normName(row.title)];
  const antiCheatStatus = acHit || 'none'; // not in the anti-cheat list => no anti-cheat
  let desktopLinuxStatus;
  if (antiCheatStatus === 'denied' || antiCheatStatus === 'broken') desktopLinuxStatus = 'broken';
  else if (['platinum', 'gold', 'native'].includes(protonTier)) desktopLinuxStatus = 'works';
  else if (['silver', 'bronze'].includes(protonTier)) desktopLinuxStatus = 'works-with-tweaks';
  else desktopLinuxStatus = 'unknown';

  let bestMethod;
  let warningNote = '';
  if (desktopLinuxStatus === 'broken') {
    bestMethod = 'Anti-cheat blocks this on desktop Linux — keep a Windows install or play it elsewhere.';
    warningNote =
      antiCheatStatus === 'denied'
        ? 'Publisher has not enabled anti-cheat for Linux / Steam Deck.'
        : 'Anti-cheat is currently broken on Linux.';
  } else if (desktopLinuxStatus === 'works') {
    bestMethod = 'Install via Steam and run native or with Proton — it runs well on Linux.';
  } else if (desktopLinuxStatus === 'works-with-tweaks') {
    bestMethod = 'Playable via Steam Proton; may need launch options or Proton-GE.';
  } else {
    bestMethod = 'Compatibility is uncertain — check recent ProtonDB reports before relying on it.';
  }

  const confidence =
    acHit && desktopLinuxStatus === 'broken'
      ? 'high'
      : row.protonConfidence === 'strong'
        ? 'high'
        : row.protonTotal > 50
          ? 'medium'
          : 'low';

  return {
    slug: row.slug,
    title: row.title,
    steamAppId: row.steamAppId,
    protonTier,
    antiCheatStatus,
    steamDeckStatus: 'unknown',
    desktopLinuxStatus,
    bestMethod,
    warningNote:
      warningNote ||
      (confidence === 'low'
        ? 'Limited ProtonDB data so far — check recent reports before relying on it.'
        : ''),
    confidence,
    sourceUrl: row.sourceUrl,
    citations: acHit
      ? [{ title: 'AreWeAntiCheatYet', url: acSource || 'https://areweanticheatyet.com/' }]
      : [{ title: 'ProtonDB', url: row.sourceUrl }],
    dataSource: 'protondb',
    lastCheckedAt: ingestDate,
  };
}

// ---------- apps ----------
const RISK_BY_VERDICT = { native: 'low', web: 'low', wine: 'medium', vm: 'high', 'no-go': 'high' };
const ACTION_BY_VERDICT = { native: 'native', web: 'web', wine: 'alternative', vm: 'vm', 'no-go': 'alternative' };

function deriveApp(row, wineBySlug) {
  const verdict = row.verdict || 'no-go';
  const wineRating = wineBySlug[row.slug]?.wineRating || 'na';
  const onFlathub = Boolean(row.flathubId) && row.nativeAvailable;
  let bestMethod;
  if (verdict === 'native') bestMethod = `Install the native Linux build of ${row.title} (Flathub or your package manager).`;
  else if (verdict === 'web') bestMethod = `Use ${row.title} in the browser on Linux.`;
  else if (verdict === 'wine') bestMethod = `Run ${row.title} through Wine/Bottles, or switch to a Linux alternative.`;
  else if (verdict === 'vm') bestMethod = `Run ${row.title} in a Windows virtual machine, or switch to a Linux alternative.`;
  else bestMethod = `There is no clean Linux path for ${row.title} — use an alternative.`;

  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    verdict,
    wineRating,
    nativeAvailable: row.nativeAvailable,
    webVersion: verdict === 'web',
    bestMethod,
    whatBreaks: [],
    alternatives: [],
    migrationRisk: RISK_BY_VERDICT[verdict] || 'high',
    recommendedAction: ACTION_BY_VERDICT[verdict] || 'alternative',
    difficulty: row.difficulty || 5,
    notes: '',
    confidence: onFlathub ? 'high' : 'medium',
    sourceUrl: row.sourceUrl,
    citations: onFlathub ? [{ title: 'Flathub', url: row.sourceUrl }] : [],
    dataSource: 'flathub',
    lastCheckedAt: ingestDate,
    affiliate: null,
  };
}

async function main() {
  await fs.mkdir(dataDir, { recursive: true });

  const protondbRaw = (await readJson(path.join(cacheDir, 'protondb.raw.json'), [])) || [];
  const gol = (await readJson(path.join(cacheDir, 'gamingonlinux.anticheat.json'), { byName: {} })) || { byName: {} };
  const flathubRaw = (await readJson(path.join(cacheDir, 'flathub.raw.json'), [])) || [];
  const winehq = (await readJson(path.join(cacheDir, 'winehq.raw.json'), { entries: {} })) || { entries: {} };

  const existingApps = (await readJson(path.join(dataDir, 'apps.generated.json'), {})) || {};
  const existingGames = (await readJson(path.join(dataDir, 'games.generated.json'), {})) || {};

  // GAMES — stale-guard: empty protondb cache keeps last-good.
  const nextGames =
    protondbRaw.length > 0
      ? Object.fromEntries(protondbRaw.map(r => [r.slug, deriveGame(r, gol.byName || {}, gol.sourceUrl)]))
      : existingGames;

  // APPS — stale-guard: empty flathub cache keeps last-good.
  const nextApps =
    flathubRaw.length > 0
      ? Object.fromEntries(flathubRaw.map(r => [r.slug, deriveApp(r, winehq.entries || {})]))
      : existingApps;

  // OVERLAY — assemble from agent partials, merged over any existing overlay (partials win).
  const overlayGamesPartial = (await readJson(path.join(ingestDir, 'overlay-games.partial.json'), {})) || {};
  const overlayAppsPartial = (await readJson(path.join(ingestDir, 'overlay-apps.partial.json'), {})) || {};
  const existingOverlay = (await readJson(path.join(dataDir, 'overlay.json'), { apps: {}, games: {} })) || {
    apps: {},
    games: {},
  };
  const overlay = {
    apps: { ...(existingOverlay.apps || {}), ...overlayAppsPartial },
    games: { ...(existingOverlay.games || {}), ...overlayGamesPartial },
  };

  await fs.writeFile(path.join(dataDir, 'games.generated.json'), JSON.stringify(nextGames, null, 2));
  await fs.writeFile(path.join(dataDir, 'apps.generated.json'), JSON.stringify(nextApps, null, 2));
  await fs.writeFile(path.join(dataDir, 'overlay.json'), JSON.stringify(overlay, null, 2));

  const mergedApps = { ...nextApps, ...overlay.apps };
  const mergedGames = { ...nextGames, ...overlay.games };
  console.log(
    `[build] generated apps=${Object.keys(nextApps).length} games=${Object.keys(nextGames).length} | ` +
      `overlay apps=${Object.keys(overlay.apps).length} games=${Object.keys(overlay.games).length} | ` +
      `MERGED apps=${Object.keys(mergedApps).length} games=${Object.keys(mergedGames).length}`,
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
