import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normName } from './ingest/grid.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Slugs intentionally allowed to ship without full source metadata. Empty by
// design — every shipped record should carry sourceUrl + lastCheckedAt + confidence.
const SOURCE_METADATA_WHITELIST = new Set([]);

const PHASE1_APPS_MIN = 80;
const PHASE1_GAMES_MIN = 100;

const MANDATORY_GAMES = [
  { name: 'Apex Legends', aliases: ['apex-legends'] },
  { name: 'Fortnite', aliases: ['fortnite'] },
  { name: 'Valorant', aliases: ['valorant'] },
  { name: 'League of Legends', aliases: ['league-of-legends'] },
  { name: 'Call of Duty', aliases: ['call-of-duty', 'call-of-duty-black-ops-6', 'warzone'] },
  { name: 'PUBG', aliases: ['pubg-battlegrounds', 'pubg'] },
  { name: 'GTA V Online', aliases: ['grand-theft-auto-v', 'gta-v-online', 'gta-v', 'gta-online'] },
  { name: 'EA FC', aliases: ['ea-sports-fc', 'ea-fc', 'ea-fc-25', 'fifa'] },
  { name: 'Roblox', aliases: ['roblox'] },
  { name: 'Destiny 2', aliases: ['destiny-2'] },
  { name: 'Genshin Impact', aliases: ['genshin-impact'] },
  { name: 'Minecraft', aliases: ['minecraft', 'minecraft-java-edition', 'minecraft-bedrock-edition'] },
];

const HEAD_APPS = [
  { name: 'Microsoft Office', aliases: ['microsoft-office'] },
  { name: 'Microsoft 365', aliases: ['microsoft-365', 'office-365'] },
  { name: 'Word', aliases: ['microsoft-word', 'word'] },
  { name: 'Excel', aliases: ['microsoft-excel', 'excel'] },
  { name: 'PowerPoint', aliases: ['microsoft-powerpoint', 'powerpoint'] },
  { name: 'Outlook', aliases: ['microsoft-outlook', 'outlook'] },
  { name: 'Access', aliases: ['microsoft-access', 'access'] },
  { name: 'Visio', aliases: ['microsoft-visio', 'visio'] },
  { name: 'Project', aliases: ['microsoft-project', 'project'] },
  { name: 'OneDrive', aliases: ['onedrive', 'microsoft-onedrive'] },
  { name: 'Teams', aliases: ['microsoft-teams', 'teams'] },
  { name: 'Photoshop', aliases: ['adobe-photoshop', 'photoshop'] },
  { name: 'Illustrator', aliases: ['adobe-illustrator', 'illustrator'] },
  { name: 'Premiere Pro', aliases: ['adobe-premiere-pro', 'premiere-pro'] },
  { name: 'After Effects', aliases: ['adobe-after-effects', 'after-effects'] },
  { name: 'Lightroom', aliases: ['adobe-lightroom', 'lightroom'] },
  { name: 'AutoCAD', aliases: ['autocad', 'autodesk-autocad'] },
  { name: 'SolidWorks', aliases: ['solidworks'] },
  { name: 'Fusion 360', aliases: ['fusion-360', 'autodesk-fusion-360'] },
  { name: 'SketchUp', aliases: ['sketchup'] },
  { name: 'QuickBooks', aliases: ['quickbooks'] },
  { name: 'Quicken', aliases: ['quicken'] },
  { name: 'TurboTax', aliases: ['turbotax'] },
];

const VALID_MIGRATION_RISKS = new Set(['low', 'medium', 'high']);
const VALID_RECOMMENDED_ACTIONS = new Set(['native', 'web', 'alternative', 'vm', 'dual-boot']);
const BLOCKED_ANTI_CHEAT_VALUES = new Set(['blocked', 'publisher-blocked', 'denied', 'broken']);

async function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
  return JSON.parse(await fs.readFile(fullPath, 'utf8'));
}

function mergeRecords(base, override) {
  const merged = {};
  const keys = new Set([...Object.keys(base || {}), ...Object.keys(override || {})]);
  for (const key of keys) {
    merged[key] = {
      ...((base || {})[key] || {}),
      ...((override || {})[key] || {}),
    };
  }
  return merged;
}

// Alias-dedup tombstones (overlay records with `redirectTo`) are not shipped pages —
// drop them so counts, collision checks, and source-metadata checks see only real records.
function stripRedirects(records) {
  return Object.fromEntries(Object.entries(records).filter(([, record]) => !record.redirectTo));
}

function findRecord(records, aliases) {
  for (const slug of aliases) {
    if (records[slug]) return { slug, record: records[slug] };
  }
  return null;
}

function isFilled(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function lastChecked(record) {
  return record.lastCheckedAt || record.lastUpdated;
}

function hasSourceMetadata(record) {
  return isFilled(record.sourceUrl) && isFilled(lastChecked(record)) && isFilled(record.confidence);
}

function hasGeneratedSeed(record) {
  return record.dataSource === 'generated-seed';
}

function sourceLooksLikeApexAuthority(sourceUrl) {
  return /gamingonlinux\.com|protondb\.com|areweanticheatyet\.com/i.test(String(sourceUrl || ''));
}

function formatList(items) {
  return items.length ? items.join(', ') : 'none';
}

async function main() {
  const errors = [];
  const warnings = [];

  const appsGenerated = await readJson('lib/data/apps.generated.json');
  const gamesGenerated = await readJson('lib/data/games.generated.json');
  const overlay = await readJson('lib/data/overlay.json');

  const apps = stripRedirects(mergeRecords(appsGenerated, overlay.apps || {}));
  const games = stripRedirects(mergeRecords(gamesGenerated, overlay.games || {}));
  const appCount = Object.keys(apps).length;
  const gameCount = Object.keys(games).length;

  if (appCount < PHASE1_APPS_MIN) {
    errors.push(`merged apps ${appCount} is below R2 phase-1 minimum ${PHASE1_APPS_MIN}`);
  }
  if (gameCount < PHASE1_GAMES_MIN) {
    errors.push(`merged games ${gameCount} is below R2 phase-1 minimum ${PHASE1_GAMES_MIN}`);
  }

  const apex = findRecord(games, ['apex-legends']);
  if (!apex) {
    errors.push('Apex Legends is missing from merged games');
  } else {
    const record = apex.record;
    const isBroken = record.desktopLinuxStatus === 'broken' || record.protonTier === 'borked';
    const isAntiCheatBlocked = BLOCKED_ANTI_CHEAT_VALUES.has(record.antiCheatStatus);
    if (!isBroken || !isAntiCheatBlocked) {
      errors.push(
        `Apex Legends regression failed: expected Broken / anti-cheat-blocked, got desktopLinuxStatus=${record.desktopLinuxStatus || 'missing'} antiCheatStatus=${record.antiCheatStatus || 'missing'} protonTier=${record.protonTier || 'missing'}`,
      );
    }
    if (!sourceLooksLikeApexAuthority(record.sourceUrl)) {
      errors.push(`Apex Legends sourceUrl is not GamingOnLinux/ProtonDB/areweanticheatyet: ${record.sourceUrl || 'missing'}`);
    }
    if (!hasSourceMetadata(record)) {
      errors.push('Apex Legends is missing sourceUrl, lastCheckedAt/lastUpdated, or confidence');
    }
  }

  const resolvedMandatoryGames = [];
  for (const game of MANDATORY_GAMES) {
    const hit = findRecord(games, game.aliases);
    if (!hit) {
      errors.push(`${game.name} is missing from merged games`);
      continue;
    }
    resolvedMandatoryGames.push({ name: game.name, ...hit });
    if (!hasSourceMetadata(hit.record)) {
      errors.push(`${game.name} (${hit.slug}) is missing sourceUrl, lastCheckedAt/lastUpdated, or confidence`);
    }
    if (hasGeneratedSeed(hit.record)) {
      errors.push(`${game.name} (${hit.slug}) still uses dataSource:"generated-seed"`);
    }
  }

  const resolvedHeadApps = [];
  for (const app of HEAD_APPS) {
    const hit = findRecord(apps, app.aliases);
    if (!hit) {
      errors.push(`${app.name} is missing from merged apps`);
      continue;
    }
    resolvedHeadApps.push({ name: app.name, ...hit });
    if (!Array.isArray(hit.record.whatBreaks) || hit.record.whatBreaks.length === 0) {
      errors.push(`${app.name} (${hit.slug}) is missing populated whatBreaks`);
    }
    if (!VALID_MIGRATION_RISKS.has(hit.record.migrationRisk)) {
      errors.push(`${app.name} (${hit.slug}) has invalid or missing migrationRisk`);
    }
    if (!VALID_RECOMMENDED_ACTIONS.has(hit.record.recommendedAction)) {
      errors.push(`${app.name} (${hit.slug}) has invalid or missing recommendedAction`);
    }
    if (!hasSourceMetadata(hit.record)) {
      errors.push(`${app.name} (${hit.slug}) is missing sourceUrl, lastCheckedAt/lastUpdated, or confidence`);
    }
    if (hasGeneratedSeed(hit.record)) {
      errors.push(`${app.name} (${hit.slug}) still uses dataSource:"generated-seed"`);
    }
  }

  const headRecords = [
    ...resolvedHeadApps.map(item => item.record),
    ...resolvedMandatoryGames.map(item => item.record),
  ];
  const sourceCoverage = headRecords.length
    ? headRecords.filter(hasSourceMetadata).length / headRecords.length
    : 0;
  if (sourceCoverage < 0.95) {
    errors.push(`head source metadata coverage ${(sourceCoverage * 100).toFixed(1)}% is below 95%`);
  }

  // Source metadata is the moat's credibility contract: EVERY shipped record must
  // carry sourceUrl + lastCheckedAt/lastUpdated + confidence (not just the head set).
  const allMissingMetadata = [];
  for (const [slug, record] of [...Object.entries(apps), ...Object.entries(games)]) {
    if (!hasSourceMetadata(record) && !SOURCE_METADATA_WHITELIST.has(slug)) {
      allMissingMetadata.push(slug);
    }
    if (record.confidence === 'low' && !isFilled(record.warningNote)) {
      warnings.push(`${slug} has confidence:"low" without warningNote`);
    }
  }
  if (allMissingMetadata.length) {
    errors.push(
      `${allMissingMetadata.length} merged records missing sourceUrl/lastCheckedAt/confidence: ${formatList(
        allMissingMetadata.slice(0, 12),
      )}`,
    );
  }

  // Normalized-name collision (within each namespace, since /apps and /games are
  // separate routes): two slugs whose titles normalize identically are near-duplicate
  // records — the alias-dedup hazard. Warn so they get reconciled before they ship.
  for (const [namespace, records] of [['app', apps], ['game', games]]) {
    const seen = new Map();
    for (const [slug, record] of Object.entries(records)) {
      const key = normName(record.title);
      if (!key) continue;
      if (seen.has(key)) {
        warnings.push(`duplicate normalized ${namespace} title "${key}": ${seen.get(key)} and ${slug}`);
      } else {
        seen.set(key, slug);
      }
    }
  }

  console.log(`[validate:r2] merged apps=${appCount} games=${gameCount}`);
  console.log(`[validate:r2] mandatory games checked=${resolvedMandatoryGames.length}/${MANDATORY_GAMES.length}`);
  console.log(`[validate:r2] head apps checked=${resolvedHeadApps.length}/${HEAD_APPS.length}`);
  console.log(`[validate:r2] head source metadata coverage=${(sourceCoverage * 100).toFixed(1)}%`);

  if (warnings.length) {
    console.warn(`[validate:r2] warnings (${warnings.length}): ${formatList(warnings.slice(0, 12))}`);
  }

  if (errors.length) {
    console.error(`[validate:r2] FAILED (${errors.length})`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log('[validate:r2] PASS');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
