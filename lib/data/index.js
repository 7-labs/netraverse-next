import appsGenerated from './apps.generated.json';
import gamesGenerated from './games.generated.json';
import overlay from './overlay.json';

function mergeRecords(base, override) {
  return Object.entries({ ...base, ...override }).reduce((acc, [slug, record]) => {
    acc[slug] = {
      ...(base[slug] || {}),
      ...(record || {}),
      ...(override[slug] || {}),
    };
    return acc;
  }, {});
}

function normalizeApp(record) {
  return {
    wineRating: 'na',
    nativeAvailable: false,
    webVersion: false,
    migrationRisk: 'medium',
    recommendedAction: 'alternative',
    confidence: 'medium',
    affiliate: null,
    ...record,
    alternatives: record.alternatives || [],
    whatBreaks: record.whatBreaks || [],
    citations: record.citations || [],
    lastUpdated: record.lastUpdated || record.lastCheckedAt || null,
    lastCheckedAt: record.lastCheckedAt || record.lastUpdated || null,
  };
}

function normalizeGame(record) {
  return {
    protonTier: 'pending',
    antiCheatStatus: 'unknown',
    steamDeckStatus: 'unknown',
    desktopLinuxStatus: 'unknown',
    confidence: 'low',
    warningNote: '',
    ...record,
    citations: record.citations || [],
    lastUpdated: record.lastUpdated || record.lastCheckedAt || null,
    lastCheckedAt: record.lastCheckedAt || record.lastUpdated || null,
  };
}

const appMap = Object.freeze(
  Object.fromEntries(
    Object.entries(mergeRecords(appsGenerated, overlay.apps || {})).map(([slug, record]) => [
      slug,
      normalizeApp(record),
    ]),
  ),
);

const gameMap = Object.freeze(
  Object.fromEntries(
    Object.entries(mergeRecords(gamesGenerated, overlay.games || {})).map(([slug, record]) => [
      slug,
      normalizeGame(record),
    ]),
  ),
);

export function getApps() {
  return Object.values(appMap).sort((a, b) => a.title.localeCompare(b.title));
}

export function getApp(slug) {
  return appMap[slug] || null;
}

export function getGames() {
  return Object.values(gameMap).sort((a, b) => a.title.localeCompare(b.title));
}

export function getGame(slug) {
  return gameMap[slug] || null;
}

function latestDate(records) {
  const timestamps = records
    .map(record => record.lastCheckedAt || record.lastUpdated)
    .map(value => {
      const date = value ? new Date(value) : null;
      return date && !Number.isNaN(date.getTime()) ? date.getTime() : null;
    })
    .filter(value => value !== null);

  if (!timestamps.length) {
    return null;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

export function getDatasetStats() {
  const apps = getApps();
  const games = getGames();

  return {
    appCount: apps.length,
    gameCount: games.length,
    recordCount: apps.length + games.length,
    lastCheckedAt: latestDate([...apps, ...games]),
  };
}

export function getRelatedApps(category, currentSlug) {
  return getApps()
    .filter(app => app.slug !== currentSlug && app.category === category)
    .slice(0, 6);
}

export function getRelatedGames(game, limit = 6) {
  return getGames()
    .filter(item => item.slug !== game.slug)
    .map(item => {
      let score = 0;
      if (item.antiCheatStatus === game.antiCheatStatus) score += 4;
      if (item.desktopLinuxStatus === game.desktopLinuxStatus) score += 3;
      if (item.protonTier === game.protonTier) score += 2;
      if (item.steamDeckStatus === game.steamDeckStatus) score += 1;
      return { ...item, relatedScore: score };
    })
    .filter(item => item.relatedScore > 0)
    .sort((a, b) => b.relatedScore - a.relatedScore || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map(({ relatedScore, ...item }) => item);
}

// Hand-tuned aliases for the irregular cases the generic logic can't derive (R7 search).
const EXTRA_ALIASES = {
  'microsoft-365': ['office 365', 'o365', 'm365'],
  'microsoft-office': ['ms office', 'office suite', 'office'],
  'microsoft-word': ['ms word', 'office word', 'docx'],
  'microsoft-excel': ['ms excel', 'office excel', 'xlsx'],
  'microsoft-powerpoint': ['ms powerpoint', 'powerpoint', 'ppt', 'pptx'],
  'microsoft-outlook': ['ms outlook', 'outlook desktop', 'pst'],
  'microsoft-access': ['ms access', 'access database'],
  'microsoft-visio': ['ms visio', 'visio diagrams'],
  'microsoft-project': ['ms project', 'project professional'],
  'microsoft-onedrive': ['one drive', 'onedrive sync'],
  'microsoft-teams': ['ms teams', 'teams'],
  'counter-strike-2': ['csgo', 'cs go', 'counter strike', 'cs2'],
  'apex-legends': ['apex'],
  fortnite: ['fn'],
  valorant: ['val'],
  'grand-theft-auto-v': ['gta', 'gta v', 'gta5', 'gta online'],
  'grand-theft-auto-iv': ['gta iv', 'gta4'],
  'call-of-duty': ['cod', 'warzone', 'modern warfare'],
  'ea-sports-fc': ['fifa', 'ea fc'],
  'pubg-battlegrounds': ['pubg', 'playerunknown'],
  'league-of-legends': ['lol', 'league'],
  'destiny-2': ['d2'],
  minecraft: ['mc', 'minecraft java', 'minecraft bedrock'],
  'genshin-impact': ['genshin'],
  roblox: ['rblx'],
  'vs-code': ['vscode', 'vs code'],
  'visual-studio-code': ['vscode', 'vs code'],
  'adobe-photoshop': ['photoshop cc'],
  'adobe-illustrator': ['illustrator cc', 'ai files'],
  'adobe-premiere-pro': ['premiere', 'premiere cc'],
  'adobe-after-effects': ['after effects cc', 'ae'],
  'adobe-lightroom': ['lightroom classic', 'lr'],
  quickbooks: ['quick books', 'quickbooks desktop'],
  turbotax: ['turbo tax'],
  autocad: ['auto cad', 'autodesk autocad'],
  'rainbow-six-siege': ['r6', 'siege'],
};

const STOP_WORDS = new Set(['of', 'the', 'and', 'for', 'a', 'an']);

function buildSearchText(record) {
  const title = (record.title || '').toLowerCase();
  const stripped = title.replace(/^(microsoft|adobe|autodesk|google)\s+/, '');
  const slugWords = (record.slug || '').replace(/-/g, ' ');
  const words = title.split(/[^a-z0-9]+/).filter(w => w && !STOP_WORDS.has(w));
  const acronym = words.length > 1 ? words.map(w => w[0]).join('') : '';
  const extras = (EXTRA_ALIASES[record.slug] || []).join(' ');
  return [title, stripped, slugWords, acronym, extras].filter(Boolean).join(' ');
}

export function getDatasetOptions() {
  const apps = getApps().map(app => ({
    kind: 'app',
    slug: app.slug,
    title: app.title,
    href: `/apps/${app.slug}`,
    badge: app.verdict,
    // fields the migration-report engine needs:
    verdict: app.verdict,
    whatBreaks: app.whatBreaks,
    alternatives: app.alternatives,
    difficulty: app.difficulty,
    bestMethod: app.bestMethod,
    searchText: buildSearchText(app),
  }));
  const games = getGames().map(game => ({
    kind: 'game',
    slug: game.slug,
    title: game.title,
    href: `/games/${game.slug}`,
    badge: game.protonTier,
    protonTier: game.protonTier,
    antiCheatStatus: game.antiCheatStatus,
    desktopLinuxStatus: game.desktopLinuxStatus,
    bestMethod: game.bestMethod,
    searchText: buildSearchText(game),
  }));

  return [...apps, ...games].sort((a, b) => a.title.localeCompare(b.title));
}
