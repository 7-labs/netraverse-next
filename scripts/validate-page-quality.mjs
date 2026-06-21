import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();

async function read(file) {
  return fs.readFile(path.join(root, file), 'utf8');
}

async function readJson(file) {
  return JSON.parse(await read(file));
}

function toScript(source) {
  return source
    .replace(/^\s*import[\s\S]*?;\s*/gm, '')
    .replace(/\bexport\s+const\s+([A-Za-z0-9_]+)/g, 'const $1')
    .replace(/\bexport\s+function\s+([A-Za-z0-9_]+)/g, 'function $1')
    .replace(/\bexport\s+default\s+/g, '');
}

async function loadModule(file, names, globals = {}) {
  const source = await read(file);
  const map = names.map(name => `${JSON.stringify(name)}: typeof ${name} === 'undefined' ? undefined : ${name}`).join(',');
  const script = new vm.Script(`"use strict";\n(function(){\n${toScript(source)}\nreturn {${map}};\n})()`, { filename: file });
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

function text(...values) {
  return values.flatMap(value => collect(value)).join(' ').toLowerCase();
}

function sectionCount(...sections) {
  return sections.flat().filter(section => section?.heading).length;
}

const catalog = await loadModule('lib/catalog.js', [
  'buildAppDecisionCards', 'buildAppFaq', 'buildAppMigrationSteps', 'buildAppMethodRows', 'buildAppTestChecklist',
  'buildGameDecisionCards', 'buildGameFaq', 'buildGameTestChecklist',
  'getAntiCheatMeta', 'getAppVerdictMeta', 'getDesktopLinuxMeta', 'getGameTierMeta', 'getMigrationRiskMeta',
  'summarizeApp', 'summarizeGame',
]);
const depth = await loadModule('lib/contentDepth.js', [
  'getAppDepthSections', 'getGameDepthSections', 'getGuideDepthSections', 'getHistoryDepthSections', 'getMergeDepthSections', 'getStaticPageDepth', 'getToolDepthSections',
], catalog);
const editorial = await loadModule('lib/editorialInsights.js', ['getAppEditorialSections', 'getGameEditorialSections']);
const intent = await loadModule('lib/pageIntent.js', ['getAppIntentPanel', 'getGameIntentPanel', 'getGuideIntentPanel'], catalog);
const { GUIDE_PAGES } = await loadModule('lib/guides.js', ['GUIDE_PAGES']);
const { WIN4LIN_PAGES } = await loadModule('lib/history.js', ['WIN4LIN_PAGES']);
const { TOOL_CONFIGS } = await loadModule('lib/tools.js', ['TOOL_CONFIGS']);

const appsRaw = await readJson('lib/data/apps.generated.json');
const gamesRaw = await readJson('lib/data/games.generated.json');
const overlay = await readJson('lib/data/overlay.json');
const apps = Object.values(mergeRecords(appsRaw, overlay.apps || {})).map(normalizeApp);
const games = Object.values(mergeRecords(gamesRaw, overlay.games || {})).map(normalizeGame);

const requiredTerms = ['decision', 'test', 'fallback'];
const errors = [];

function checkPage(route, body, sections, internalLinks) {
  const missingTerms = requiredTerms.filter(term => !body.includes(term));
  if (sections < 4) errors.push(`${route} has only ${sections} content sections`);
  if (internalLinks < 3) errors.push(`${route} has only ${internalLinks} modeled internal links`);
  if (missingTerms.length) errors.push(`${route} missing semantic terms: ${missingTerms.join(', ')}`);
}

for (const app of apps) {
  const checklist = catalog.buildAppTestChecklist(app);
  const body = text(
    app,
    catalog.summarizeApp(app),
    intent.getAppIntentPanel(app, checklist),
    editorial.getAppEditorialSections(app),
    depth.getAppDepthSections(app),
    catalog.buildAppDecisionCards(app),
    catalog.buildAppMigrationSteps(app),
    checklist,
    catalog.buildAppFaq(app),
  );
  const sections = sectionCount(editorial.getAppEditorialSections(app), depth.getAppDepthSections(app)) + 7;
  const internalLinks = 3 + Math.min(3, app.alternatives.length || 0);
  checkPage(`/apps/${app.slug}`, body, sections, internalLinks);
}

for (const game of games) {
  const checklist = catalog.buildGameTestChecklist(game);
  const body = text(
    game,
    catalog.summarizeGame(game),
    intent.getGameIntentPanel(game, checklist),
    editorial.getGameEditorialSections(game),
    depth.getGameDepthSections(game),
    catalog.buildGameDecisionCards(game),
    checklist,
    catalog.buildGameFaq(game),
  );
  const sections = sectionCount(editorial.getGameEditorialSections(game), depth.getGameDepthSections(game)) + 6;
  const internalLinks = 6;
  checkPage(`/games/${game.slug}`, body, sections, internalLinks);
}

for (const guide of GUIDE_PAGES) {
  const body = text(guide, intent.getGuideIntentPanel(guide), depth.getGuideDepthSections(guide));
  const sections = sectionCount(depth.getGuideDepthSections(guide)) + guide.sections.length + 4;
  const internalLinks = guide.relatedLinks?.length || 0;
  checkPage(`/content/${guide.slug}`, body, sections, internalLinks);
}

for (const [slug, config] of Object.entries(TOOL_CONFIGS)) {
  const body = text(config, depth.getToolDepthSections(config));
  const sections = sectionCount(depth.getToolDepthSections(config)) + 5;
  const internalLinks = 5;
  checkPage(`/tools/${slug}`, body, sections, internalLinks);
}

for (const page of WIN4LIN_PAGES) {
  const body = text(page, depth.getHistoryDepthSections(page));
  const sections = sectionCount(depth.getHistoryDepthSections(page)) + page.sections.length + 2;
  const internalLinks = (page.relatedLinks?.length || 0) + 4;
  checkPage(page.path, body, sections, internalLinks);
}

checkPage('/merge', text(depth.getMergeDepthSections()), sectionCount(depth.getMergeDepthSections()) + 3, 3);

if (errors.length) {
  console.error(`[validate:quality] FAILED ${errors.length}`);
  for (const error of errors.slice(0, 80)) console.error(`- ${error}`);
  if (errors.length > 80) console.error(`... ${errors.length - 80} more`);
  process.exitCode = 1;
} else {
  console.log(`[validate:quality] PASS apps=${apps.length} games=${games.length} guides=${GUIDE_PAGES.length} tools=${Object.keys(TOOL_CONFIGS).length} win4lin=${WIN4LIN_PAGES.length}`);
}
