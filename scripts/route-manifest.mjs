import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

// Canonical host is owned by lib/site.js (the runtime single source). It is resolved
// from there the first time getRouteManifest() runs and cached here so withSiteUrl()
// — which both generate-sitemap.mjs and validate-launch.mjs call after the manifest —
// stays in sync with <link rel=canonical>. The literal below is only a pre-resolution
// fallback for the (unused) case where withSiteUrl is called before the manifest loads.
export let SITE_URL = 'https://www.netraverse.com';

async function readJson(filePath) {
  const contents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(contents);
}

function toExportableScript(source) {
  return source
    .replace(/^\s*import[\s\S]*?;\s*/gm, '')
    .replace(/\bexport\s+const\s+([A-Za-z0-9_]+)/g, 'const $1')
    .replace(/\bexport\s+function\s+([A-Za-z0-9_]+)/g, 'function $1')
    .replace(/\bexport\s+default\s+/g, '');
}

async function loadDataModule(root, relativePath, exportNames, globals = {}) {
  const fullPath = path.join(root, relativePath);
  const source = await fs.readFile(fullPath, 'utf8');
  const exportMap = exportNames
    .map(name => `${JSON.stringify(name)}: typeof ${name} === 'undefined' ? undefined : ${name}`)
    .join(',');
  const script = new vm.Script(
    `"use strict";\n(function () {\n${toExportableScript(source)}\nreturn {${exportMap}};\n})()`,
    { filename: fullPath },
  );

  return script.runInNewContext({
    console,
    pickSources: () => [],
    ...globals,
  });
}

function uniqueRoutes(routes) {
  return Array.from(new Set(routes)).sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });
}

export function withSiteUrl(value) {
  if (value === '/') {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${value.endsWith('/') ? value : `${value}/`}`;
}

function toDateOnly(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function recordDate(record) {
  return toDateOnly(record?.lastUpdated || record?.lastCheckedAt);
}

export async function getRouteManifest({ root = process.cwd() } = {}) {
  const dataDir = path.join(root, 'lib', 'data');
  const [{ GUIDE_PAGES }, { WIN4LIN_PAGES }, { TOOL_SLUGS, STANDALONE_TOOL_SLUGS }, { SITE_URL: siteUrl }] =
    await Promise.all([
      loadDataModule(root, 'lib/guides.js', ['GUIDE_PAGES']),
      loadDataModule(root, 'lib/history.js', ['WIN4LIN_PAGES']),
      loadDataModule(root, 'lib/tools.js', ['TOOL_SLUGS', 'STANDALONE_TOOL_SLUGS']),
      loadDataModule(root, 'lib/site.js', ['SITE_URL']),
    ]);

  // lib/site.js is the canonical-host source of truth; mirror it for withSiteUrl().
  if (siteUrl) SITE_URL = siteUrl;
  const standaloneToolSlugs = STANDALONE_TOOL_SLUGS || [];

  const appsRaw = await readJson(path.join(dataDir, 'apps.generated.json'));
  const gamesRaw = await readJson(path.join(dataDir, 'games.generated.json'));
  const overlay = await readJson(path.join(dataDir, 'overlay.json'));

  // Merge generated + overlay (overlay wins) so per-item lastmod reflects corrections.
  const mergedApps = { ...appsRaw, ...(overlay.apps || {}) };
  const mergedGames = { ...gamesRaw, ...(overlay.games || {}) };

  const allAppSlugs = Object.keys(mergedApps).sort();
  const allGameSlugs = Object.keys(mergedGames).sort();
  const guideSlugs = GUIDE_PAGES.map(guide => guide.slug).sort();
  const win4linPaths = WIN4LIN_PAGES.map(page => page.path).sort();

  // Deterministic site build date: explicit ingest ts > newest dataset date > now.
  const datasetDates = [...Object.values(mergedApps), ...Object.values(mergedGames)]
    .map(recordDate)
    .filter(Boolean)
    .sort();
  const buildDate =
    toDateOnly(process.env.NETRAVERSE_INGEST_TS) ||
    datasetDates[datasetDates.length - 1] ||
    new Date().toISOString().slice(0, 10);

  const collections = new Set(['/apps', '/games', '/content', '/merge', '/tools']);
  const metaByRoute = new Map();
  const setMeta = (route, lastmod) => {
    let priority = '0.6';
    let changefreq = 'monthly';
    if (route === '/') {
      priority = '1.0';
      changefreq = 'weekly';
    } else if (collections.has(route)) {
      priority = '0.8';
      changefreq = 'weekly';
    }
    metaByRoute.set(route, { lastmod: lastmod || buildDate, priority, changefreq });
  };

  const routes = uniqueRoutes([
    '/',
    '/apps',
    '/games',
    '/content',
    '/merge',
    '/tools',
    ...standaloneToolSlugs.map(slug => `/tools/${slug}`),
    ...TOOL_SLUGS.map(slug => `/tools/${slug}`),
    ...guideSlugs.map(slug => `/content/${slug}`),
    ...win4linPaths,
    ...allAppSlugs.map(slug => `/apps/${slug}`),
    ...allGameSlugs.map(slug => `/games/${slug}`),
  ]);

  for (const route of routes) {
    if (route.startsWith('/apps/')) {
      setMeta(route, recordDate(mergedApps[route.slice('/apps/'.length)]));
    } else if (route.startsWith('/games/')) {
      setMeta(route, recordDate(mergedGames[route.slice('/games/'.length)]));
    } else {
      setMeta(route, buildDate);
    }
  }

  return {
    routes,
    metaByRoute,
    buildDate,
    counts: {
      apps: allAppSlugs.length,
      games: allGameSlugs.length,
      guides: guideSlugs.length,
      win4lin: win4linPaths.length,
      tools: TOOL_SLUGS.length + standaloneToolSlugs.length,
    },
  };
}
