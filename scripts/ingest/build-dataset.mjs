// Build the generated datasets + assemble the overlay (see ROADMAP-R2.md R2.3/R2.4).
// Consumes real fetch caches, derives decision-grade fields, stale-guards on failure,
// and writes lib/data/{apps,games}.generated.json + lib/data/overlay.json.
import fs from 'node:fs/promises';
import path from 'node:path';
import { ingestDate, normName } from './grid.mjs';

const root = process.cwd();
const ingestDir = path.join(root, 'scripts', 'ingest');
const cacheDir = path.join(ingestDir, 'cache');
const dataDir = path.join(root, 'lib', 'data');

// Keep at least this fraction of the last-good record count, else treat the fetch
// as degraded and keep last-good rather than overwriting the moat with a thin set.
const STALE_FLOOR = 0.9;

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

// Atomic write: stage to a .tmp sibling then rename so a crash mid-write never
// leaves a truncated JSON that the static build would import.
async function writeJsonAtomic(file, value) {
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2));
  await fs.rename(tmp, file);
}

// Date-only (YYYY-MM-DD) so generated + overlay share one date field/precision.
function toDateOnly(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

// A field counts as "resolved" only when the new fetch produced a real value —
// not null/empty and not a placeholder tier/status. Used so a degraded fetch
// never downgrades an already-good field back to pending/unknown.
const PLACEHOLDERS = new Set(['', 'pending', 'unknown', 'na', 'none', 'low']);
function isResolved(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return !PLACEHOLDERS.has(value.toLowerCase());
  return true;
}

// Merge a freshly-derived record over its last-good counterpart: keep the prior
// value for any field the new fetch did not resolve. Records new to this run pass
// through unchanged.
function mergeOverLastGood(next, prev) {
  if (!prev) return next;
  const merged = { ...prev, ...next };
  for (const key of Object.keys(next)) {
    if (!isResolved(next[key]) && isResolved(prev[key])) merged[key] = prev[key];
  }
  return merged;
}

// Apply the floor guard + per-field merge across a freshly-built map vs last-good.
function reconcile(label, nextMap, prevMap) {
  const nextCount = Object.keys(nextMap).length;
  const prevCount = Object.keys(prevMap).length;
  if (prevCount > 0 && nextCount < prevCount * STALE_FLOOR) {
    console.warn(
      `[build] NO-GO: ${label} fetch yielded ${nextCount} records (< ${Math.ceil(
        prevCount * STALE_FLOOR,
      )} = ${Math.round(STALE_FLOOR * 100)}% of last-good ${prevCount}); keeping last-good.`,
    );
    return prevMap;
  }
  const out = {};
  for (const [slug, record] of Object.entries(nextMap)) {
    out[slug] = mergeOverLastGood(record, prevMap[slug]);
  }
  return out;
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

  // GAMES — stale-guard: empty protondb cache keeps last-good; a partial/degraded
  // fetch is caught by reconcile() (floor guard + per-field merge-over-last-good).
  const builtGames =
    protondbRaw.length > 0
      ? Object.fromEntries(protondbRaw.map(r => [r.slug, deriveGame(r, gol.byName || {}, gol.sourceUrl)]))
      : existingGames;
  const nextGames =
    protondbRaw.length > 0 ? reconcile('games', builtGames, existingGames) : existingGames;

  // APPS — stale-guard: empty flathub cache keeps last-good; partial fetch reconciled.
  const builtApps =
    flathubRaw.length > 0
      ? Object.fromEntries(flathubRaw.map(r => [r.slug, deriveApp(r, winehq.entries || {})]))
      : existingApps;
  const nextApps =
    flathubRaw.length > 0 ? reconcile('apps', builtApps, existingApps) : existingApps;

  // OVERLAY — assemble from agent partials, merged over any existing overlay (partials win).
  const overlayGamesPartial = (await readJson(path.join(ingestDir, 'overlay-games.partial.json'), {})) || {};
  const overlayAppsPartial = (await readJson(path.join(ingestDir, 'overlay-apps.partial.json'), {})) || {};
  const existingOverlay = (await readJson(path.join(dataDir, 'overlay.json'), { apps: {}, games: {} })) || {
    apps: {},
    games: {},
  };
  // Normalize every overlay record to a single date-only `lastCheckedAt` so the
  // generated + overlay halves share one date field/precision on disk (legacy
  // overlay records carried an ISO `lastUpdated` instead).
  const normalizeOverlayDates = map =>
    Object.fromEntries(
      Object.entries(map).map(([slug, record]) => {
        const lastCheckedAt = toDateOnly(record.lastCheckedAt || record.lastUpdated);
        const next = { ...record };
        if (lastCheckedAt) next.lastCheckedAt = lastCheckedAt;
        delete next.lastUpdated;
        return [slug, next];
      }),
    );
  const overlay = {
    apps: normalizeOverlayDates({ ...(existingOverlay.apps || {}), ...overlayAppsPartial }),
    games: normalizeOverlayDates({ ...(existingOverlay.games || {}), ...overlayGamesPartial }),
  };

  await writeJsonAtomic(path.join(dataDir, 'games.generated.json'), nextGames);
  await writeJsonAtomic(path.join(dataDir, 'apps.generated.json'), nextApps);
  await writeJsonAtomic(path.join(dataDir, 'overlay.json'), overlay);

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
