import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { getRouteManifest } from './route-manifest.mjs';

const root = process.cwd();
const MIN_WORDS = Number(process.env.MIN_WORDS || 600);

async function readJson(file) {
  return JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
}

function toScript(source) {
  return source
    .replace(/^\s*import[\s\S]*?;\s*/gm, '')
    .replace(/\bexport\s+const\s+([A-Za-z0-9_]+)/g, 'const $1')
    .replace(/\bexport\s+function\s+([A-Za-z0-9_]+)/g, 'function $1')
    .replace(/\bexport\s+default\s+/g, '');
}

async function loadModule(file, names, globals = {}) {
  const source = await fs.readFile(path.join(root, file), 'utf8');
  const map = names.map(name => `${JSON.stringify(name)}: typeof ${name} === 'undefined' ? undefined : ${name}`).join(',');
  const script = new vm.Script(`"use strict";\n(function(){\n${toScript(source)}\nreturn {${map}};\n})()`);
  return script.runInNewContext({ console, pickSources: () => [], ...globals });
}

function mergeRecords(base, override) {
  return Object.entries({ ...base, ...override }).reduce((acc, [slug, record]) => {
    acc[slug] = { ...(base[slug] || {}), ...(record || {}), ...(override[slug] || {}) };
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
    ...record,
    alternatives: record.alternatives || [],
    whatBreaks: record.whatBreaks || [],
    citations: record.citations || [],
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
  };
}

function collect(value, out = []) {
  if (value === null || value === undefined) return out;
  if (typeof value === 'string' || typeof value === 'number') {
    out.push(String(value));
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach(item => collect(item, out));
    return out;
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      if (!['url', 'href', 'slug', 'sourceUrl', 'affiliate'].includes(key)) collect(item, out);
    });
  }
  return out;
}

function words(value) {
  return String(value || '').split(/[^A-Za-z0-9’'-]+/).filter(token => /[A-Za-z0-9]/.test(token)).length;
}

function text(...values) {
  return values.flatMap(value => collect(value)).join(' ');
}

function sectionText(contentDepth, sections) {
  return contentDepth.collectSectionText(sections || []);
}

const STATIC_TEXT = {
  home: 'Can My Windows 10 PC Switch to Linux? Enter the apps and games you actually use to get a migration report showing whether this PC can move to Linux, what will break, and what to use instead. The page explains full switch, partial switch, fallback planning, app compatibility, game compatibility, anti-cheat, Microsoft Office, Fortnite, and Windows 10 migration decisions.',
  apps: 'App Compatibility Database. Native, web, Wine, VM, and fallback paths for the Windows software that usually decides whether a Linux migration succeeds. Start with blockers, read the method, test real files, then check the full setup before committing.',
  games: 'Game Compatibility Database. Browse Proton tiers and anti-cheat status before you assume your game library can follow you to Linux. Check daily titles first, treat anti-cheat as a decision layer, and test launchers, controllers, saves, mods, online play, and GPU behavior.',
  tools: 'Windows-to-Linux Compatibility Tools. Free checkers for apps, games, anti-cheat, hardware age, distro fit, old PCs, Windows 10 support deadlines, and migration planning. Pick the right checker first, then open app and game detail pages for risky items.',
  content: 'Linux Migration Guides. Practical guidance for Windows users evaluating Linux before the next forced hardware or support deadline. Read in decision order: deadline and options, ESU, Windows 11 incompatible PCs, apps, games, anti-cheat, distro choice, backups, testing, and rollback.',
  distro: 'Find the Best Linux Distribution for You. Choose hardware age, Linux familiarity, and workload to get a conservative starting recommendation. Options include Linux Mint, Zorin OS, Ubuntu LTS, Fedora Workstation, Xubuntu, Linux Lite, Nobara, Bazzite, Ubuntu Studio, and Arch Linux depending on the user profile.',
  history: 'How to use this historical page today. This page is preserved for old Netraverse and Win4Lin search intent, but the practical current question is whether your Windows apps and games move through native clients, web apps, Wine, Proton, or a Windows VM. Historical intent maps to the modern compatibility checker, app database, game database, and current Windows apps on Linux guide.',
  merge: 'Merge for SCO and UnixWare. Historical context for NeTraverse Merge and the older Unix-era approach to keeping Windows and DOS software available off Windows. The modern compatibility map connects DOS and Windows on Unix to apps, games, web workflows, Wine, Proton, anti-cheat, and VMs.',
};

async function main() {
  const catalog = await loadModule('lib/catalog.js', [
    'buildAppDecisionCards', 'buildAppFaq', 'buildAppMigrationSteps', 'buildAppMethodRows', 'buildAppTestChecklist',
    'buildGameDecisionCards', 'buildGameFaq', 'buildGameTestChecklist',
    'getAntiCheatMeta', 'getAppVerdictMeta', 'getDesktopLinuxMeta', 'getGameTierMeta', 'getMigrationRiskMeta',
    'summarizeApp', 'summarizeGame',
  ]);
  const depth = await loadModule('lib/contentDepth.js', [
    'collectSectionText', 'getAppDepthSections', 'getGameDepthSections', 'getGuideDepthSections',
    'getHistoryDepthSections', 'getMergeDepthSections', 'getStaticPageDepth', 'getToolDepthSections',
  ], catalog);
  const editorial = await loadModule('lib/editorialInsights.js', [
    'getAppEditorialSections', 'getGameEditorialSections',
  ]);
  const { GUIDE_PAGES } = await loadModule('lib/guides.js', ['GUIDE_PAGES']);
  const { WIN4LIN_PAGES } = await loadModule('lib/history.js', ['WIN4LIN_PAGES']);
  const { TOOL_CONFIGS, ALL_TOOLS } = await loadModule('lib/tools.js', ['TOOL_CONFIGS', 'ALL_TOOLS']);

  const appsRaw = await readJson('lib/data/apps.generated.json');
  const gamesRaw = await readJson('lib/data/games.generated.json');
  const overlay = await readJson('lib/data/overlay.json');
  const apps = Object.values(mergeRecords(appsRaw, overlay.apps || {})).map(normalizeApp).sort((a, b) => a.title.localeCompare(b.title));
  const games = Object.values(mergeRecords(gamesRaw, overlay.games || {})).map(normalizeGame).sort((a, b) => a.title.localeCompare(b.title));

  const results = [];
  const add = (route, body) => results.push({ route, words: words(body) });

  add('/', text(STATIC_TEXT.home, sectionText(depth, depth.getStaticPageDepth('home'))));
  add('/apps', text(STATIC_TEXT.apps, sectionText(depth, depth.getStaticPageDepth('apps')), apps));
  add('/games', text(STATIC_TEXT.games, sectionText(depth, depth.getStaticPageDepth('games')), games));
  add('/tools', text(STATIC_TEXT.tools, sectionText(depth, depth.getStaticPageDepth('tools')), ALL_TOOLS));
  add('/content', text(STATIC_TEXT.content, sectionText(depth, depth.getStaticPageDepth('content')), GUIDE_PAGES));
  add('/tools/distro-finder', text(STATIC_TEXT.distro, sectionText(depth, depth.getStaticPageDepth('distro-finder'))));

  Object.values(TOOL_CONFIGS).forEach(config => {
    add(`/tools/${config.slug}`, text(config, sectionText(depth, depth.getToolDepthSections(config))));
  });

  apps.forEach(app => {
    add(`/apps/${app.slug}`, text(
      app,
      catalog.summarizeApp(app), catalog.buildAppFaq(app), catalog.buildAppMethodRows(app),
      catalog.buildAppDecisionCards(app), catalog.buildAppMigrationSteps(app), catalog.buildAppTestChecklist(app),
      sectionText(depth, editorial.getAppEditorialSections(app)),
      sectionText(depth, depth.getAppDepthSections(app)),
    ));
  });

  games.forEach(game => {
    add(`/games/${game.slug}`, text(
      game,
      catalog.summarizeGame(game), catalog.buildGameFaq(game), catalog.buildGameDecisionCards(game),
      catalog.buildGameTestChecklist(game), sectionText(depth, editorial.getGameEditorialSections(game)),
      sectionText(depth, depth.getGameDepthSections(game)),
    ));
  });

  GUIDE_PAGES.forEach(guide => add(`/content/${guide.slug}`, text(guide, sectionText(depth, depth.getGuideDepthSections(guide)))));
  WIN4LIN_PAGES.forEach(page => add(page.path, text(STATIC_TEXT.history, page, sectionText(depth, depth.getHistoryDepthSections(page)))));
  add('/merge', text(STATIC_TEXT.merge, sectionText(depth, depth.getMergeDepthSections())));

  const { routes } = await getRouteManifest({ root });
  const seen = new Set(results.map(item => item.route));
  const missing = routes.filter(route => !seen.has(route));
  const thin = results.filter(item => item.words < MIN_WORDS).sort((a, b) => a.words - b.words);
  const min = Math.min(...results.map(item => item.words));
  const lowest = [...results].sort((a, b) => a.words - b.words).slice(0, 12);

  console.log(`[validate:words] checked=${results.length} sitemapRoutes=${routes.length} minWords=${min} threshold=${MIN_WORDS}`);
  lowest.forEach(item => console.log(`- ${item.route}: ${item.words}`));

  if (missing.length || thin.length) {
    console.error('[validate:words] FAILED');
    if (missing.length) console.error(`- missing route coverage: ${missing.slice(0, 20).join(', ')}`);
    if (thin.length) console.error(`- below ${MIN_WORDS} words: ${thin.slice(0, 30).map(item => `${item.route}=${item.words}`).join(', ')}`);
    process.exitCode = 1;
    return;
  }

  console.log('[validate:words] PASS');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
